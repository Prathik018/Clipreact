import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskColumn from "./components/TaskColumn";
import "./App.css";

const API = "/_/backend";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTask() {
    if (!title.trim()) return;
    try {
      setError(null);
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create task");
      }
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    try {
      setError(null);
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update task");
      }
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      setError(null);
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const dragItem = useRef(null);

  function handleDragStart(e, task) {
    dragItem.current = task;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function handleDrop(e, status) {
    e.preventDefault();
    const task = dragItem.current;
    if (!task || task.status === status) return;
    dragItem.current = null;
    await updateStatus(task.id, status);
  }

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="app">
      <Header />
      <TaskInput title={title} onChange={setTitle} onAdd={addTask} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading notes...</p>
      ) : (
        <div className="columns">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
          />
        </div>
      )}
      <footer className="footer">
        Developed by <a href="https://x.com/Prathik__Pai" target="_blank" rel="noopener noreferrer">Prathik Pai</a>
      </footer>
    </div>
  );
}

export default App;
