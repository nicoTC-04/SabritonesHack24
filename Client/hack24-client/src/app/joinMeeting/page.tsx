'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const HomePage: React.FC = () => {
  const [meetCode, setMeetCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  const handleJoinMeet = () => {
    if (!username.trim()) {
      toast.error('Please enter a username before joining a meeting.');
      return;
    }
    if (!meetCode.trim()) {
      toast.error('Please enter a meeting code.');
      return;
    }

    fetch(`${apiUrl}/api/users/${meetCode}`).then((response) => {
      if (!response.ok) {
        toast.error('Meeting code not found. Please try again.');
        return;
      }
      return response.json();
    }).then((users: string[]) => {
      if (users.includes(username)) {
        toast.error(`User ${username} is already in this meeting.`);
        return;
      }
      // Open the meeting page in a new tab
      const url = `/meet/${meetCode}?username=${encodeURIComponent(username)}`;
      window.open(url, '_blank');
    });
  };

  const handleCreateMeet = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username before creating a meeting.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/create-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      const generatedCode = data.meeting_id;
      // Open the new meeting page in a new tab
      const url = `/meet/${generatedCode}?username=${encodeURIComponent(username)}`;
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to create meeting. Please try again.');
    }
  };

  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold mb-8">Welcome to MeetLH ???? MeetSabritones</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter your username (required)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter meeting code"
            value={meetCode}
            onChange={(e) => setMeetCode(e.target.value)}
          className="input-field"
          />
          <button onClick={handleJoinMeet} className="button">
            Join
          </button>
        </div>
        <button onClick={handleCreateMeet} className="submit-button">
          Create New Meeting
        </button>
      </div>
    </div>
  );
};

export default HomePage;
