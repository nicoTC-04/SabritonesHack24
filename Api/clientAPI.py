from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)


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

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    query = sql.SQL("""
        SELECT name, region, teacher, timezone
        FROM my_schema.Users
        WHERE username = %s AND password = %s
    """)
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({
            'name': user[0],
            'region': user[1],
            'teacher': user[2],
            'timezone': user[3]
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
    query = sql.SQL("""
        SELECT c.course_id, c.name, c.level, c.pathToPic, t.user_id, t.rating
        FROM my_schema.Courses c
        LEFT JOIN my_schema.Teachers t ON c.teacher_id = t.user_id
    """)
    cursor.execute(query)
    courses = cursor.fetchall()

    # Get appointments for each course
    for course in courses:
        course_id = course['course_id']
        cursor.execute(sql.SQL("""
            SELECT id FROM my_schema.Appointments WHERE teacher_id = %s
        """), (course['user_id'],))
        appointments = cursor.fetchall()
        course['appointments'] = [appt['id'] for appt in appointments]

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
        SELECT * FROM my_schema.Classes
        WHERE student_id = %s
    """)
    cursor.execute(query, (user_id,))
    classes = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(classes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)