# Simple MERN Todo

A minimal Todo app: add tasks, mark them complete, and delete them. Tasks are stored in MongoDB.

## Requirements
- Node.js 20+
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Start the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## 2. Start the frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

Set `MONGO_URI` in `backend/.env` to your MongoDB connection string.
