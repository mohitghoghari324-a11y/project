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
    let base = { display: 'inline-block', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' };
    if (status === 'Completed') return { ...base, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' };
    if (status === 'In Progress') return { ...base, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' };
    return { ...base, backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.2)' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px 30px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Task Manager Workspace</h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Manage, prioritize, and track your active workflows.</p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '10px 18px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            Logout
          </button>
        </div>

        {/* Task Form */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
            {editingId ? 'Edit Existing Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
              <input
                type="text"
                name="title"
                placeholder="Task title..."
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
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
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '14px', resize: 'none' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)' }}
              >
                {loading ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ padding: '12px 24px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Tasks Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Filter by:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a', color: '#fff', outline: 'none', fontSize: '14px' }}
            >
              <option value="All">All Tasks</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px', textAlign: 'center', borderRadius: '20px', color: '#94a3b8', fontSize: '14px' }}>
              No tasks found. Get started by creating one above!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '22px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={getBadgeStyle(task.status)}>{task.status}</span>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{task.title}</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '20px', paddingTop: '15px' }}>
                  <button onClick={() => handleEditClick(task)} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteClick(task.id)} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
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