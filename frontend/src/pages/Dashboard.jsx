
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  deleteTask,
  updateTask,
} from "../services/taskService";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load tasks"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Task deletion failed"
      );
    }
  };

  const handleEditClick = (task) => {
    setEditingTask({
      _id: task._id,
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateTask(editingTask._id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate || undefined,
      });

      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Task update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" ||
      (task.priority || "Medium") === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-green-500/10 text-green-400 border-green-500/30";
    }

    if (status === "In Progress") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (priority === "Low") {
      return "bg-green-500/10 text-green-400 border-green-500/30";
    }

    return "bg-orange-500/10 text-orange-400 border-orange-500/30";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 sm:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-500">
              TaskFlow
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your work and stay productive.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mt-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-gray-400">Total Tasks</p>
            <h2 className="text-4xl font-bold mt-3">{tasks.length}</h2>
          </div>

          <div className="bg-slate-900 border border-green-900/50 rounded-2xl p-6">
            <p className="text-gray-400">Completed</p>
            <h2 className="text-4xl font-bold text-green-400 mt-3">
              {completedTasks}
            </h2>
          </div>

          <div className="bg-slate-900 border border-yellow-900/50 rounded-2xl p-6">
            <p className="text-gray-400">Pending</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              {pendingTasks}
            </h2>
          </div>

          <div className="bg-slate-900 border border-blue-900/50 rounded-2xl p-6">
            <p className="text-gray-400">In Progress</p>
            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {inProgressTasks}
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Overall Progress</h2>
            <span className="text-blue-400 font-bold">
              {completionRate}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="text-gray-500 text-sm mt-3">
            {completedTasks} out of {tasks.length} tasks completed
          </p>
        </div>

        <TaskForm onTaskCreated={fetchTasks} />

        {editingTask && (
          <div className="mt-10 bg-slate-900 border border-blue-500/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Edit Task</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    title: e.target.value,
                  })
                }
                required
                placeholder="Task title"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
              />

              <textarea
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
                placeholder="Task description"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
              />

              <select
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    priority: e.target.value,
                  })
                }
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <select
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    status: e.target.value,
                  })
                }
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    dueDate: e.target.value,
                  })
                }
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-white"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700 p-4 text-white"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <p className="text-gray-400 text-sm mb-5">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>

          {filteredTasks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <h3 className="text-xl font-semibold">
                No matching tasks
              </h3>
              <p className="text-gray-400 mt-2">
                Try another search or create a new task.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition"
                >
                  <h3 className="text-xl font-semibold break-words">
                    {task.title}
                  </h3>

                  <p className="text-gray-400 mt-3 min-h-12 break-words">
                    {task.description || "No description added"}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${getStatusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${getPriorityStyle(task.priority || "Medium")}`}
                    >
                      {task.priority || "Medium"} Priority
                    </span>
                  </div>

                  {task.dueDate && (
                    <p className="text-sm text-gray-500 mt-4">
                      Due date: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

