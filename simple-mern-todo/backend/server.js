import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const Todo = mongoose.model('Todo', new mongoose.Schema({
  text: { type: String, required: true, trim: true }
  , completed: { type: Boolean, default: false }
}, { timestamps: true }));

app.get('/api/todos', async (_req, res) => {
  try {
    res.json(await Todo.find().sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ message: 'Could not fetch todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Task is required' });
    const todo = await Todo.create({ text });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: 'Could not create todo' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: Boolean(req.body.completed) },
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch {
    res.status(400).json({ message: 'Could not update todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch {
    res.status(400).json({ message: 'Could not delete todo' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/simpletodo');
app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));
