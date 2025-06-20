import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000';
const PROJECT = 'Growth Mosaic';

function App() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 0, averageLikes: 0 });
  const [form, setForm] = useState({ title: '', content: '', author: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchNotes = async (p = 1) => {
    try {
      const res = await axios.get(`${API}/notes?page=${p}&limit=8`);
      setNotes(res.data.notes);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/notes/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNotes();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/notes`, form);
      setForm({ title: '', content: '', author: '' });
      fetchNotes(page);
      fetchStats();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateLike = async (id, type) => {
    try {
      await axios.patch(`${API}/notes/${id}/${type}`);
      fetchNotes(page);
      fetchStats();
    } catch (error) {
      console.error(`Error updating like (${type}):`, error);
    }
  };

  const handleDelete = async id => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API}/notes/${id}`);
      fetchNotes(page);
      fetchStats();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <>
      <h1>{PROJECT}</h1>
      <p className="tagline">{PROJECT} — "{stats.totalNotes} reflections and counting."</p>

      <div className="stats">
        <div><strong>{stats.totalNotes}</strong><br/>Reflections</div>
        <div><strong>{stats.averageLikes}</strong><br/>Avg. Likes</div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <input name="author" placeholder="Your Name" value={form.author} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="What did you learn today?" value={form.content}
          rows={6} onChange={handleChange} maxLength={1000} required />
        <button type="submit">Share Reflection</button>
      </form>

      <div className="grid">
        {notes.map(n => (
          <div key={n._id} className="card">
            <h3>{n.title}</h3>
            <small>by {n.author} • {new Date(n.createdAt).toLocaleDateString()}</small>
            <p>{n.content}</p>
            <div className="actions">
              <button onClick={() => updateLike(n._id, 'like')}>👍 {n.likes}</button>
              <button onClick={() => updateLike(n._id, 'unlike')}>👎</button>
              <button onClick={() => handleDelete(n._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {[...Array(pages)].map((_, i) => (
          <button key={i} onClick={() => fetchNotes(i + 1)} disabled={i + 1 === page}>{i + 1}</button>
        ))}
      </div>
    </>
  );
}

export default App;
