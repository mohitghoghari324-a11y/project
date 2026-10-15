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

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '20px 24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Task Manager Workspace</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Manage, prioritize, and track your active workflows.</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
          >
            Logout
          </button>
        </div>

        {/* Task Form */}
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#f8fafc' }}>
            {editingId ? 'Edit Existing Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'transparent', padding: 0, border: 'none', margin: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <input
                type="text"
                name="title"
                placeholder="Task title..."
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ background: '#1e293b', color: '#fff' }}>{opt}</option>
                ))}
              </select>
            </div>
            
            <textarea
              name="description"
              placeholder="Add details about the task (optional)..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                {loading ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ background: '#334155', color: '#cbd5e1', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filter Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Tasks Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Filter by:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Tasks</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ background: '#1e293b', color: '#fff' }}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '40px', textAlign: 'center', borderRadius: '16px', color: '#94a3b8', fontStyle: 'italic' }}>
              No tasks found. Get started by creating one above!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                style={{ background: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ 
                    padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content',
                    background: task.status === 'Completed' ? 'rgba(34, 197, 94, 0.15)' : task.status === 'In Progress' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    color: task.status === 'Completed' ? '#4ade80' : task.status === 'In Progress' ? '#facc15' : '#cbd5e1'
                  }}>
                    {task.status}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>{task.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditClick(task)}
                    style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
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