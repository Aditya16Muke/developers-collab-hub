## Live Demo
Frontend : https://devcollabhub.vercel.app
Backend  : https://developers-collab-hub.onrender.com

# Developer Collaboration Hub

A full-stack platform where developers find collaborators for their side projects.

**Live demo:** https://devcollab.vercel.app

## Features
- JWT authentication with bcrypt password hashing
- Create and browse open-source project ideas
- Request to join projects; owner accepts/rejects
- Real-time team chat powered by Socket.io
- Skill-based developer profiles

## Tech Stack
**Frontend:** React, Tailwind CSS, Socket.io client, React Router, Axios  
**Backend:** Node.js, Express.js, Socket.io, JWT  
**Database:** MongoDB Atlas with Mongoose  
**Deployment:** Vercel (frontend), Render (backend)

## Running Locally
```bash
# Backend
cd server && npm install
cp .env.example .env   # fill in your values
npm run dev

# Frontend
cd client && npm install
cp .env.example .env
npm run dev
```


