from flask import Flask, jsonify, request # general flask imports
from flask_socketio import SocketIO, emit, join_room, leave_room # socketio imports for webrtc
from flask_cors import CORS # cors
from server.webrtc import setup_webrtc # webrtc setup
from datetime import datetime # for timestamping the uploaded files
from google.cloud import speech # google cloud speech-to-text
from google.oauth2 import service_account # for authenticating with google cloud
import google.generativeai as genai
import uuid # for generating unique meeting IDs
import sys # for system-level operations
import os # for file operations
import io # for file operations
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv # for loading environment variables
import subprocess # for running shell commands
import threading # for running background tasks

from server.utils.Debugger import Debugger
from server.utils.RateLimiter import RateLimiter

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'grabaciones'))

api_key = os.getenv('GENAI_API_KEY')
model_name = 'gemini-1.5-flash'

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname='artemis',
        user='myuser',
        password='mypassword',
        host='216.238.66.189',
        port='5432'
    )
    return conn

# In-memory storage for each session
session_storage = {}

# Central RateLimiter
rate_limiter = RateLimiter(max_users_per_meeting=7, rate_limit_time_window=5)

# Setup routes and sockets
@app.route('/api/create-meeting', methods=['POST'])
def create_meeting():
    meeting_id = str(uuid.uuid4())
    data = request.get_json()
    username = data.get('username', '')

    if not username:
        return jsonify({'error': 'Username cannot be empty'}), 400

    if meeting_id in session_storage:
        return jsonify({'error': 'Meeting ID already exists, please try again'}), 400

    session_storage[meeting_id] = {
        'host': username,
        'users': {},  # {username: sid}
    }

    Debugger.log_message('INFO', f'User {username} created a new meeting with ID: {meeting_id}')
    print(f"Meeting created: {meeting_id}")
    print(f"Current session storage: {session_storage}")

    return jsonify({'meeting_id': meeting_id})

@app.route('/api/session/<meeting_id>', methods=['GET'])
def get_session(meeting_id):
    Debugger.log_message('DEBUG', f'{session_storage}')
    if meeting_id not in session_storage:
        return jsonify({'error': 'Meeting ID not found'}), 404
    return jsonify(session_storage[meeting_id])

@app.route('/api/users/<meeting_id>', methods=['GET'])
def get_users(meeting_id):
    Debugger.log_message('DEBUG', f'{session_storage}')
    if meeting_id not in session_storage:
        return jsonify({'error': 'Meeting ID not found'}), 404
    if len(session_storage[meeting_id]['users']) > 7:
        return jsonify({'error': 'Meeting is full'}), 404

    return jsonify(list(session_storage[meeting_id]['users'].keys()))


@socketio.on('join')
def handle_join(data):
    meeting_id = data.get('meeting_id')
    username = data.get('username')

    if not meeting_id or meeting_id not in session_storage:
        Debugger.log_message('ERROR', f'Meeting ID {meeting_id} not found')
        emit('error', {'message': 'Meeting ID not found'}, to=request.sid)
        return

    # Proceed with the join process
    session = session_storage[meeting_id]
    session['users'][username] = request.sid

    # Emit user_joined event
    emit('user_joined', {'username': username, 'meeting_id': meeting_id}, room=meeting_id)


@socketio.on('disconnect')
def handle_disconnect():
    to_delete = []
    for meeting_id, session in session_storage.items():
        if request.sid in session['users'].values():
            username = [username for username, sid in session['users'].items() if sid == request.sid][0]
            del session['users'][username]
            if len(session['users']) == 0:
                to_delete.append(meeting_id)
            Debugger.log_message('INFO', f'User {request.sid} left the meeting', meeting_id)

            # Update rate limiter meta data
            rate_limiter.updateMeetingCount(meeting_id, "leave")

            emit('user_left', {'meeting_id': meeting_id, 'username': username}, room=meeting_id)

    # for meeting_id in to_delete:
    #     del session_storage[meeting_id]







def summarize_text(transcript):
    text = transcript

    if not text:
        return jsonify({'error':'Text is required'})

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)

        # Set the prompt for summarization
        prompt = f"Eres un asistente que esta escuchando una clase de una materia entre un maestro y su estudiante. Quiero que resumas por puntos lo que se menciona en la clase. Lo quiero similar a este formato:\n\n## Resumen de la clase de ...:\n\n**Tema principal:** ...\n**Puntos tratados:**...\n\n**Nota:**\n. Lo que sigue ya es el texto de la clase:{text}"

        # Generate the summary
        summary = model.generate_content(prompt)

        return summary.text
    except Exception as e:
        return "Error: " + str(e)


def transcribe_audio(file_path):
    # Path to your service account key file
    credentials_path = os.path.join(os.path.dirname(__file__), 'hack24palestra-8ae7da29e71c.json')

    # Load the credentials
    credentials = service_account.Credentials.from_service_account_file(credentials_path)

    # Initialize the Google Cloud Speech client with the explicit credentials
    client = speech.SpeechClient(credentials=credentials)

    # Load the audio file
    with io.open(file_path, "rb") as audio_file:
        content = audio_file.read()

    # Configure the audio settings
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=16000,  # Adjust to your audio's sample rate if needed
        language_code="es-ES",  # Set to Spanish
    )

    # Perform the transcription
    response = client.recognize(config=config, audio=audio)

    # Extract the transcribed text
    transcription = ""
    for result in response.results:
        transcription += result.alternatives[0].transcript

    return transcription


def convert_webm_to_mp3(input_file, output_file, timestamp):
    try:
        # Normalize the file paths to use forward slashes and ensure drive letters are properly formatted
        input_file = os.path.normpath(input_file).replace("\\", "/")
        output_file = os.path.normpath(output_file).replace("\\", "/")

        # Convert the .webm file to .mp3 using GStreamer
        pipeline = f'gst-launch-1.0 filesrc location="{input_file}" ! decodebin ! audioconvert ! lamemp3enc ! filesink location="{output_file}"'
        subprocess.run(pipeline, shell=True, check=True)

        Debugger.log_message('INFO', f'File converted to mp3 successfully: {output_file}')

        # Transcribe the audio file using Google Cloud Speech-to-Text
        transcription = transcribe_audio(output_file)
        Debugger.log_message('INFO', f'Transcription: {transcription}')

        os.remove(output_file)

        # Save transcription to a .txt file
        summary = summarize_text(transcription)
        with open(os.path.join(UPLOAD_FOLDER, f"summary_{timestamp}.txt"), 'w') as f:
            f.write(summary)

        Debugger.log_message('INFO', f'Summary: {summary}')

    except subprocess.CalledProcessError as e:
        Debugger.log_message('ERROR', f"Failed to convert file: {str(e)}")
    except Exception as e:
        Debugger.log_message('ERROR', f"Unexpected error during conversion: {str(e)}")



# Route to handle file upload
@app.route('/api/upload-video', methods=['POST'])
def upload_file():
    if 'video' not in request.files:  # Match the formData key ('video') in your frontend
        return 'No file part', 400

    file = request.files['video']

    if file.filename == '':
        return 'No selected file', 400

    if file and file.mimetype.startswith('video/'):  # Check if the uploaded file is a video
        # Generate a unique filename based on the current date and time
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_extension = 'webm'  # Save the uploaded file as .webm
        file_name = f"recording_{timestamp}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, file_name)

        try:
            # Save the uploaded file
            file.save(file_path)

            # Ensure the paths are correctly formatted for GStreamer
            input_file = os.path.normpath(file_path).replace("\\", "/")
            output_mp3_file = os.path.normpath(os.path.join(UPLOAD_FOLDER, f"recording_{timestamp}.mp3")).replace("\\", "/")

            # Start the MP3 conversion in a background thread
            threading.Thread(target=convert_webm_to_mp3, args=(input_file, output_mp3_file, timestamp)).start()

            # Return immediately after the file is uploaded
            return 'File uploaded successfully.', 200

        except Exception as e:
            return f"Failed to upload file: {str(e)}", 500

    return 'Invalid file type. Only video files are allowed.', 400






"""
/////////
ENDPOINTS NORMALES
/////////
"""
# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    query = sql.SQL("""
        SELECT id, name, region, teacher, timezone
        FROM my_schema.Users
        WHERE username = %s AND password = %s
    """)
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({
            'id': user[0],
            'name': user[1],
            'region': user[2],
            'teacher': user[3],
            'timezone': user[4]
        })
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Register endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    region = data['region']
    timezone = data['timezone']
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = sql.SQL("""
            INSERT INTO my_schema.Users (username, name, region, timezone, password)
            VALUES (%s, %s, %s, %s, %s)
        """)
        cursor.execute(query, (username, name, region, timezone, password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except psycopg2.Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# Get Courses endpoint
@app.route('/getCourses', methods=['GET'])
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # Query to get course details along with teacher's info and category_id
    query = sql.SQL("""
        SELECT
            c.course_id,
            c.name AS course_name,
            c.level,
            c.pathToPic,
            c.description AS course_description,
            c.category_id AS category_id,  -- Include category_id
            t.user_id AS teacher_id,
            t.rating AS teacher_rating,
            u.name AS teacher_name
        FROM my_schema.Courses c
        LEFT JOIN my_schema.Teachers t ON c.teacher_id = t.user_id
        LEFT JOIN my_schema.Users u ON t.user_id = u.id
    """)
    cursor.execute(query)
    courses = cursor.fetchall()

    # Get appointments for each course
    for course in courses:
        course_id = course['course_id']

        # Query to get all appointments for the teacher of the current course
        cursor.execute(sql.SQL("""
            SELECT
                a.id AS appointment_id,
                a.status,
                a.timestamp AS appointment_timestamp
            FROM my_schema.Appointments a
            WHERE a.teacher_id = %s
        """), (course['teacher_id'],))
        appointments = cursor.fetchall()
        course['appointments'] = appointments

    cursor.close()
    conn.close()

    return jsonify(courses)
# Get Categories endpoint
@app.route('/getCategories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = sql.SQL("SELECT * FROM my_schema.Categories")
    cursor.execute(query)
    categories = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(categories)

# Make Appointment endpoint
@app.route('/makeAppointment', methods=['POST'])
def make_appointment():
    data = request.json
    student_id = data['student_id']
    course_id = data['course_id']

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Create appointment
        cursor.execute(sql.SQL("""
            INSERT INTO my_schema.Appointments (teacher_id, status, timestamp)
            VALUES ((SELECT teacher_id FROM my_schema.Courses WHERE course_id = %s), 'Reserved', NOW())
        """), (course_id,))
        conn.commit()
        appointment_id = cursor.fetchone()[0]

        # Create class entry
        cursor.execute(sql.SQL("""
            INSERT INTO my_schema.Classes (course_id, student_id, timestamp)
            VALUES (%s, %s, NOW())
        """), (course_id, student_id))
        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except psycopg2.Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# Get Classes endpoint
@app.route('/getClasses', methods=['GET'])
def get_classes():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = sql.SQL("""
        SELECT 
            c.id AS class_id, 
            c.course_id, 
            crs.name AS course_name,
            crs.level,
            crs.pathToPic,
            crs.description AS course_description,
            c.student_id, 
            TO_CHAR(c.timestamp, 'YYYY-MM-DD HH24:MI:SS') AS timestamp,
            -- Convert duration (assuming it is stored as an interval)
            CASE
                WHEN EXTRACT(HOUR FROM c.duration) > 0 THEN
                    EXTRACT(HOUR FROM c.duration)::text || ' hour(s)'
                WHEN EXTRACT(MINUTE FROM c.duration) > 0 THEN
                    EXTRACT(MINUTE FROM c.duration)::text || ' minute(s)'
                ELSE
                    EXTRACT(SECOND FROM c.duration)::text || ' second(s)'
            END AS duration,
            c.path_video, 
            c.summary,
            c.meeting_id
        FROM my_schema.Classes c
        JOIN my_schema.Courses crs ON c.course_id = crs.course_id
        WHERE c.student_id = %s
    """)



    cursor.execute(query, (user_id,))
    classes = cursor.fetchall()
    
    Debugger.log_message('DEBUG', f'Classes: {classes}')
    
    cursor.close()
    conn.close()

    return jsonify(classes)






setup_webrtc(app, socketio, session_storage, Debugger.log_message)

if __name__ == '__main__':
    if os.getenv('TESTING', True):
        socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
    else:
        socketio.run(app, host="0.0.0.0", port=5000, debug=True)




# # Start the Flask-SocketIO server
# if __name__ == '__main__':
#     # Run the server on 0.0.0.0 to allow access from other machines on the network
#     socketio.run(app, host='0.0.0.0', port=5000, debug=True)
