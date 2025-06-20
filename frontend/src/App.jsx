import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000';
const PROJECT = 'Share Mosaic';

function App() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 0, averageLikes: 0 });
  const [form, setForm] = useState({ title: '', content: '', author: '', mood: 'Neutral' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [streak, setStreak] = useState(0);
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchNotes = async (p = 1) => {
    try {
      const res = await axios.get(`${API}/notes?page=${p}&limit=8`);
      setNotes(res.data.notes);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching notes:', error.response?.data || error.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/notes/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  const fetchStreak = async () => {
    try {
      if (!form.author) return;
      const res = await axios.get(`${API}/notes/streak?author=${form.author}`);
      setStreak(res.data.streak);
    } catch (error) {
      console.error('Error fetching streak:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNotes();
  }, []);

  useEffect(() => {
    if (form.author) fetchStreak();
  }, [form.author]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/notes`, form);
      setForm({ title: '', content: '', author: '', mood: 'Neutral' });
      fetchNotes(page);
      fetchStats();
      fetchStreak();
    } catch (error) {
      console.error('Error creating note:', error.response?.data || error.message);
    }
  };

  const updateLike = async (id, type) => {
    try {
      await axios.patch(`${API}/notes/${id}/${type}`);
      fetchNotes(page);
      fetchStats();
    } catch (error) {
      console.error(`Error updating like (${type}):`, error.response?.data || error.message);
    }
  };

  const handleDelete = async id => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API}/notes/${id}`);
      fetchNotes(page);
      fetchStats();
      fetchStreak();
    } catch (error) {
      console.error('Error deleting note:', error.response?.data || error.message);
    }
  };

  let filteredNotes = notes
    .filter(n =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.author?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(n => (filterMood ? n.mood === filterMood : true));

  if (sortBy === 'likes') {
    filteredNotes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  return (
    <>
      <h1>{PROJECT}</h1>
      <p className="tagline">{PROJECT} — "{stats.totalNotes} reflections and counting."</p>

      {streak > 0 && (
        <div className="streak">
          🔥 You’ve written reflections {streak} day(s) in a row!
        </div>
      )}

      <div className="stats">
        <div><strong>{stats.totalNotes}</strong><br />Reflections</div>
        <div><strong>{stats.averageLikes}</strong><br />Avg. Likes</div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <input name="author" placeholder="Your Name" value={form.author} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea
          name="content"
          placeholder="What did you learn today?"
          value={form.content}
          rows={6}
          onChange={handleChange}
          maxLength={1000}
          required
        />
        <button type="submit">Share Reflection</button>
      </form>

      <div className="filters">
        <input
          placeholder="Search by title or author"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Newest First</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      <div className="grid">
        {Array.isArray(filteredNotes) && filteredNotes.map(n => (
          <div key={n._id} className={`card ${n.mood ? n.mood.toLowerCase() : 'neutral'}`}>
            <h3>{n.title}</h3>
            <small>by {n.author || 'Unknown'} • {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Unknown date'}</small>
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
          <button key={i} onClick={() => fetchNotes(i + 1)} disabled={i + 1 === page}>
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default App;

