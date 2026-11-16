import { useState } from "react";
import { createTask } from "../services/taskService";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTask({
        title,
        description,
        priority,
        status: "Pending",
        dueDate: dueDate || undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      onTaskCreated();
    } catch (err) {
  console.log("TASK ERROR:", err.response?.data || err.message);

  setError(
    err.response?.data?.message || err.message || "Task creation failed"
  );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Create New Task
      </h2>

      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;