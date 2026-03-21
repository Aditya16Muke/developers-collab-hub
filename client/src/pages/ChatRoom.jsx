import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { fetchMessages } from '../api/messages';
import { fetchProject } from '../api/projects';

let socket;

const ChatRoom = () => {
  const { projectId }             = useParams();
  const { user }                  = useAuth();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [project, setProject]     = useState(null);
  const [connected, setConnected] = useState(false);
  const bottomRef                 = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [msgRes, projRes] = await Promise.all([
          fetchMessages(projectId),
          fetchProject(projectId),
        ]);
        setMessages(msgRes.data);
        setProject(projRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    init();

    socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token: user.token } });
    socket.on('connect', () => { setConnected(true); socket.emit('join_room', projectId); });
    socket.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
    socket.on('disconnect', () => setConnected(false));

    return () => { socket.emit('leave_room', projectId); socket.disconnect(); };
  }, [projectId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    socket.emit('send_message', { projectId, content: input.trim() });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link to={`/projects/${projectId}`} className="text-gray-400 hover:text-gray-600">←</Link>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 text-sm">{project?.title || 'Project Chat'}</h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-xs text-gray-400">{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet. Say hello!</div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user._id;
          return (
            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-xs text-gray-400 mb-1 px-1">{msg.sender?.name}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-300 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button onClick={sendMessage} disabled={!input.trim() || !connected}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;