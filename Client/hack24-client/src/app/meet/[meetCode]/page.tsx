'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { io, Socket } from 'socket.io-client';
import RTCHandler from '../../../services/rtcHandler';
import toast, { Toaster } from 'react-hot-toast';

import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDotCircle, FaStopCircle } from 'react-icons/fa';

import './page.css';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://216.238.66.189:5000';

const MeetingPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Use useParams to get the URL parameters
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const rtcHandler = useRef<RTCHandler | null>(null);
  const [peers, setPeers] = useState<{ [key: string]: { stream: MediaStream } }>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // For recording
  const [recording, setRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const errorHandler = (error: Error) => {
    console.error('Error occurred:', error);
    router.push('/');
    toast.error(error.message);
  };

  const [initialized, setInitialized] = useState(false);

  // Extract parameters
  useEffect(() => {
    console.log('Extracting parameters...');
    const meeting_id = params.meetCode as string; // Assuming your route is like /meet/[meetingCode]
    const query = new URLSearchParams(window.location.search);
    const username = query.get('username');

    console.log(`Extracted meeting_id: ${meeting_id}, username: ${username}`);

    if (meeting_id && username) {
      setMeetingId(meeting_id);
      setUsername(username);
    }
  }, [params]);

  const initializeMeeting = async () => {
    if (!username || !meetingId) {  // Check if meetingId is null or undefined
      console.log('Username or meeting ID is missing');
      toast.error('Please enter a username and valid meeting ID before joining a meeting.');
      router.push('/');
      return;
    }

    console.log(`Initializing meeting with ID: ${meetingId}, username: ${username}`);

    const newSocket = io(apiUrl);
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log(`Socket connected: ${newSocket.id}`);
      console.log(`Emitting join event for meeting ID: ${meetingId}, username: ${username}`);
      newSocket.emit('join', { meeting_id: meetingId, username });
    });

    newSocket.on('user_joined', (data) => {
      console.log('Received user_joined event:', data);
    });

    newSocket.on('error', (error) => {
      console.error('Received error event:', error);
      toast.error(error.message);
    });

    console.log('Initializing RTCHandler...');
    rtcHandler.current = new RTCHandler(meetingId, username, newSocket, setPeers, errorHandler);
    rtcHandler.current.initialize();
  };

  useEffect(() => {
    console.log('Running useEffect for meetingId and username...');
    if (meetingId && username) {
      console.log('Meeting ID and username are set. Initializing meeting...');
      initializeMeeting();
      setInitialized(true);
    }

    return () => {
      console.log('Cleaning up on component unmount...');
      if (rtcHandler.current) {
        console.log('Cleaning up RTCHandler...');
        rtcHandler.current.cleanup();
      }
      if (socketRef.current) {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
      }
    };
  }, [meetingId, username]);

  if (!initialized) {
    console.log('Not initialized yet, rendering loading message...');
    return <p>Loading...</p>;
  }

  const toggleMute = () => {
    setIsMuted((prevState) => {
      const newMutedState = !prevState;
      console.log(`Toggling mute, new state: ${newMutedState}`);
      if (rtcHandler.current && rtcHandler.current.localStream) {
        rtcHandler.current.localStream.getAudioTracks().forEach((track) => {
          track.enabled = !newMutedState;
        });
      }
      return newMutedState;
    });
  };

  const toggleVideo = () => {
    setIsVideoOff((prevState) => {
      const newVideoState = !prevState;
      console.log(`Toggling video, new state: ${newVideoState}`);
      if (rtcHandler.current && rtcHandler.current.localStream) {
        rtcHandler.current.localStream.getVideoTracks().forEach((track) => {
          track.enabled = !newVideoState;
        });
      }
      return newVideoState;
    });
  };

  // Draw all video streams onto canvas side-by-side continuously
  const drawStreamsOnCanvas = () => {
    console.log('Drawing streams on canvas...');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const streams = [
      { stream: rtcHandler.current!.localStream, peerName: 'You' },
      ...Object.entries(peers).map(([peerUsername, peer]) => ({
        stream: peer.stream,
        peerName: peerUsername,
      })),
    ];

    const videoWidth = canvas.width / streams.length;
    const videoHeight = canvas.height;

    streams.forEach((streamObj, index) => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = streamObj.stream;
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;

      videoElement.onloadedmetadata = () => {
        videoElement.play();
        const drawFrame = () => {
          if (!videoElement.paused && !videoElement.ended) {
            ctx.clearRect(index * videoWidth, 0, videoWidth, videoHeight);
            ctx.drawImage(videoElement, index * videoWidth, 0, videoWidth, videoHeight);
            requestAnimationFrame(drawFrame);
          }
        };
        drawFrame();
      };
    });
  };

  const startRecording = () => {
    console.log('Starting recording...');
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    drawStreamsOnCanvas();
  
    // Capture video stream from canvas
    const canvasStream = canvas.captureStream();
    // Capture audio stream from the local stream
    const audioStream = rtcHandler.current!.localStream;
  
    // Combine both video and audio streams
    const combinedStream = new MediaStream([...canvasStream.getTracks(), ...audioStream.getAudioTracks()]);
  
    mediaRecorder.current = new MediaRecorder(combinedStream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
  
    mediaRecorder.current.onstop = async () => {
      console.log('Recording stopped. Uploading video...');
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'meeting_recording.webm');
      formData.append('meeting_id', meetingId as string); // Add the meeting ID to the form data
  
      try {
        const response = await fetch(`${apiUrl}/api/upload-video`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload video. Please try again.');
        }
        toast.success('Video recording uploaded successfully!');
      } catch (error) {
        console.error('Error uploading video:', error);
        toast.error((error as Error).message);
      }
    };
  
    mediaRecorder.current.start();
    setRecording(true);
  };
  
  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      recordedChunks.current = []; // Clear recorded chunks after upload
    }
  };
  


  if (!username || !rtcHandler.current) {
    console.log('Username or RTCHandler is not available, returning null...');
    return null;
  }

  const VideoElement: React.FC<{ stream: MediaStream; muted: boolean; peerName: string; isVideoOff: boolean }> = ({ stream, muted, peerName, isVideoOff }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      console.log(`Setting video stream for ${peerName}...`);
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    return (
      <div className={`video-container ${isVideoOff ? 'video-off' : ''}`} >
        <video ref={videoRef} autoPlay playsInline muted={muted} className="video-element" />
        <p className="video-username">{peerName}</p>
      </div>
    );
  };


  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <main className="main">
        <div className="video-grid">
          {rtcHandler.current?.localStream ? (
            <VideoElement stream={rtcHandler.current.localStream} muted={true} peerName="You" isVideoOff={isVideoOff} />
          ) : (
            <p>Waiting for your stream...</p>
          )}
          {Object.entries(peers).length > 0 ? (
            Object.entries(peers).map(([peerUsername, peer]) => (
              <VideoElement key={peerUsername} stream={peer.stream} muted={false} peerName={peerUsername} isVideoOff={false} />
            ))
          ) : (
            <p>No other participants yet...</p>
          )}
        </div>
      </main>
      <footer className="footer">
        <div className="footerIcons">
          <button onClick={toggleMute} className="iconButton">
            {isMuted ? <FaMicrophoneSlash style={{ width: 'auto', height: '3.6rem' }} className="icon" />
            : 
            <FaMicrophone style={{ width: 'auto', height: '3rem', marginLeft:'0.2rem' }} className="icon" />}
          </button>
          <button onClick={toggleVideo} className="iconButton">
            {isVideoOff ? <FaVideoSlash style={{ width: 'auto', height: '3.2rem' }} className="icon" /> 
                        : <FaVideo style={{ width: 'auto', height: '3rem' }} className="icon" />}
          </button>
          {recording ? (
            <button onClick={stopRecording} className="iconButton">
              <FaStopCircle style={{ width: 'auto', height: '3rem', color: 'red' }} className="icon" />
            </button>
          ) : (
            <button onClick={startRecording} className="iconButton">
              <FaDotCircle style={{ width: 'auto', height: '3rem' }} className="icon" />
            </button>
          )}
        </div>
        
        <button className="bg-red" onClick={() => router.push('/')}>Abandonar</button>
      </footer>
      {/* Canvas for video recording */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={1280} height={720} />
    </div>
  );
};

export default MeetingPage;
