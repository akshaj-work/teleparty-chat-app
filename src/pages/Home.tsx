import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { telepartyClient } from '../utils/telepartyClient';

export default function Home() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(telepartyClient.isReady());

  // Track socket readiness
  useEffect(() => {
    const interval = setInterval(() => {
      setIsReady(telepartyClient.isReady());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      setError('Please enter your nickname');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const roomId = await telepartyClient.createChatRoom(nickname);
      navigate(
        `/room/${roomId}?nickname=${encodeURIComponent(nickname)}`,
        { state: { alreadyJoined: true } }
      );

    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to create room: ${message}`);
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      setError('Please enter your nickname');
      return;
    }
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      await telepartyClient.joinChatRoom(
        nickname,
        roomId.trim()
      );
      navigate(
        `/room/${roomId.trim()}?nickname=${encodeURIComponent(nickname)}`
      );
    } catch (err) {
      setError(
        'Failed to join room. Please check the room ID and try again.'
      );
      setIsJoining(false);
    }
  };

  const disabled = !isReady || isCreating || isJoining;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Teleparty Chat
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Watch TV in sync with friends
        </p>

        {!isReady && (
          <p className="text-center text-sm text-gray-500 mb-4">
            Connecting to server…
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Nickname
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter your nickname"
            />
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={disabled}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {isCreating ? 'Creating…' : 'Create New Room'}
          </button>

          <div className="text-center text-gray-500">OR</div>

          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <button
            onClick={handleJoinRoom}
            disabled={disabled}
            className="w-full bg-gray-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {isJoining ? 'Joining…' : 'Join Existing Room'}
          </button>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
