import { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTodos() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error('Could not load tasks');
      setTodos(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTodos(); }, []);

  async function addTodo(event) {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const todo = await response.json();
      if (!response.ok) throw new Error(todo.message || 'Could not add task');
      setTodos(current => [todo, ...current]);
      setText('');
      setError('');
    } catch (err) { setError(err.message); }
  }

  async function toggleTodo(todo) {
    try {
      const response = await fetch(`${API}/${todo._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || 'Could not update task');
      setTodos(current => current.map(item => item._id === updated._id ? updated : item));
    } catch (err) { setError(err.message); }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete task');
      setTodos(current => current.filter(todo => todo._id !== id));
    } catch (err) { setError(err.message); }
  }

  const remaining = todos.filter(todo => !todo.completed).length;

  return (
    <main className="page">
      <section className="todo-card">
        <div className="heading">
          <span className="eyebrow">A LITTLE PROGRESS EVERY DAY</span>
          <h1>My Todo List<span>.</span></h1>
          <p>Write it down. Get it done.</p>
        </div>

        <form className="add-form" onSubmit={addTodo}>
          <input
            value={text}
            onChange={event => setText(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
          />
          <button type="submit" aria-label="Add task"><Plus size={20} /></button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="list-heading">
          <strong>Tasks</strong>
          <span>{remaining} remaining</span>
        </div>

        {loading ? <p className="empty">Loading...</p> :
          todos.length === 0 ? <p className="empty">No tasks yet. Add your first task above!</p> :
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo._id} className={todo.completed ? 'done' : ''}>
                <button className="complete" onClick={() => toggleTodo(todo)} aria-label="Toggle task">
                  {todo.completed && <Check size={15} />}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button className="delete" onClick={() => deleteTodo(todo._id)} aria-label="Delete task">
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
        }

        <footer>Simple tasks. Clear mind.</footer>
      </section>
    </main>
  );
}
