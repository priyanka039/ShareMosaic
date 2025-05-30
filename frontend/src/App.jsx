import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ content: '', author: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(API_URL);
    setNotes(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitNote = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, form);
    setForm({ content: '', author: '' });
    fetchNotes();
  };

  const likeNote = async (id) => {
    await axios.patch(`${API_URL}/${id}/like`);
    fetchNotes();
  };

  const unlikeNote = async (id) => {
    await axios.patch(`${API_URL}/${id}/unlike`);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' , alignItems: 'center'}}>
      <h1>Mini Twitter 🐤</h1>
      <form onSubmit={submitNote}>
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <textarea name="content" placeholder="Write your note..." value={form.content} onChange={handleChange} required />
        <button type="submit">Post</button>
      </form>
      <hr />
      {notes.map(note => (
        <div key={note._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <p>{note.content}</p>
          <small>by {note.author}</small><br />
          <small>{new Date(note.createdAt).toLocaleString()}</small><br />
          <button onClick={() => likeNote(note._id)}>👍 {note.likes ?? 0}</button>
          <button onClick={() => unlikeNote(note._id)}>👎</button>
          <button onClick={() => deleteNote(note._id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
};

export default App;
























