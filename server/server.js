const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

const connectDB          = require('./config/db');
const authRoutes         = require('./routes/authRoutes');
const userRoutes         = require('./routes/userRoutes');
const projectRoutes      = require('./routes/projectRoutes');
const joinRequestRoutes  = require('./routes/joinRequestRoutes');
const messageRoutes      = require('./routes/messageRoutes');
const { errorHandler }   = require('./middleware/errorMiddleware');
const socketHandler      = require('./socket/socketHandler');

// Connect to MongoDB
connectDB();

const app        = express();
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin:  process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/messages',      messageRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Global error handler — MUST be last
app.use(errorHandler);

// ── Socket.io ───────────────────────────────────────────────
socketHandler(io);

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});