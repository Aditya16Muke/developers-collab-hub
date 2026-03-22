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

## Architecture
[brief description of how data flows]

## What I learned
[3-4 honest sentences about challenges you solved — this is gold in interviews]
```

**On your resume, write it as:**

> *Developer Collaboration Hub* — Full-stack app (React, Node.js, MongoDB) where developers post project ideas and find collaborators. Features JWT auth, real-time Socket.io chat, and REST API. Deployed on Vercel and Render.

---

## Final Production Checklist
```
□ Both frontend and backend deployed and reachable via public URL
□ Environment variables set correctly on both platforms
□ CORS allows only your Vercel domain
□ MongoDB Atlas cluster is not paused (check monthly if on free tier)
□ All routes tested with valid and invalid tokens
□ 404 page exists for unknown routes
□ Loading states shown while API calls are in progress
□ Error messages shown when API calls fail
□ Mobile responsive (test on phone before showing anyone)
□ README complete with live link and local setup instructions
□ GitHub repo public (recruiters need to see the code)
