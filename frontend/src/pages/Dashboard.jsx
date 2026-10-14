import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do' });
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, formData);
      } else {
        await API.post('/tasks', formData);
      }
      resetForm();
      loadTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setFormData({ title: task.title, description: task.description, status: task.status });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'To Do' });
  };

  const filteredTasks = tasks.filter((task) => filter === 'All' || task.status === filter);

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/15 text-slate-300 border border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 px-4 py-8 text-slate-100 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Task Manager Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Manage, prioritize, and track your active workflows.</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Task Form */}
        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {editingId ? 'Edit Existing Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Task title..."
                value={formData.title}
                onChange={handleChange}
                required
                className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            
            <textarea
              name="description"
              placeholder="Add details about the task (optional)..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
            
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Controls / Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
          <h3 className="text-xl font-bold text-white">Tasks Overview</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Filter by:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Tasks</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full bg-white/[0.03] border border-white/10 p-12 text-center rounded-2xl text-slate-400 text-sm">
              No tasks found. Get started by creating one above!
            </div>
          ) : (
            filteredTasks.hash ? null : filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100">{task.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task.id)}
                    className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}