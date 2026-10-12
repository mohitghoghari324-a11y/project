import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/tasks/${editingId}`, { title, description, status });
      setEditingId(null);
    } else {
      await API.post('/tasks', { title, description, status });
    }
    setTitle('');
    setDescription('');
    setStatus('To Do');
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const getStatusBadgeStyle = (st) => {
    let base = { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' };
    if (st === 'Completed') return { ...base, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' };
    if (st === 'In Progress') return { ...base, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '30px 20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 30px', borderRadius: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Task Manager Workspace ⚡</h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Organize and track your daily tasks</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}>Logout</button>
        </div>

        {/* Add/Edit Task Form */}
        <form onSubmit={handleSubmitTask} style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '30px', borderRadius: '20px', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>{editingId ? '✏️ Update Task' : '➕ Create New Task'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }} />
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <textarea placeholder="Task Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none', boxSizing: 'border-box', height: '80px', fontSize: '15px', marginBottom: '20px', resize: 'vertical' }} />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.4)' }}>{editingId ? 'Update Task' : 'Add Task'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }} style={{ padding: '12px 24px', background: 'rgba(255, 255, 255, 0.1)', color: '#cbd5e1', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>Cancel</button>}
          </div>
        </form>

        {/* Filter Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 5px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Tasks Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Filter:</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a', color: '#fff', outline: 'none', fontSize: '14px' }}>
              <option value="All">All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ gridColumn: '1/-1', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px', textAlign: 'center', borderRadius: '20px', color: '#94a3b8' }}>
              No tasks found. Create one above!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={getStatusBadgeStyle(task.status)}>
                      {task.status}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>{task.description || 'No description provided.'}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '15px' }}>
                  <button onClick={() => handleEdit(task)} style={{ flex: 1, padding: '8px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ flex: 1, padding: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}