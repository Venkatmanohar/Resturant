'use client';
import { useEffect, useState } from 'react';

const CATS = ['Starters', 'Mains', 'Sides & Extras', 'Desserts'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [business, setBusiness] = useState(null);
  const [menu, setMenu] = useState([]);
  const [saved, setSaved] = useState(false);

  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Starters', heat: 0 });

  useEffect(() => {
    fetch('/api/admin-check').then((r) => setAuthed(r.ok));
  }, []);

  useEffect(() => {
    if (authed) {
      fetch('/api/business').then((r) => r.json()).then(setBusiness);
      fetch('/api/menu').then((r) => r.json()).then(setMenu);
    }
  }, [authed]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginErr('Wrong password. Try again.');
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setAuthed(false);
  }

  async function saveBusiness() {
    const res = await fetch('/api/business', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(business),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }

  async function addItem() {
    if (!newItem.name || !newItem.price) {
      alert('Dish name and price are required.');
      return;
    }
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, price: parseInt(newItem.price, 10), heat: parseInt(newItem.heat, 10) }),
    });
    const created = await res.json();
    setMenu((m) => [...m, created]);
    setNewItem({ name: '', description: '', price: '', category: 'Starters', heat: 0 });
  }

  async function removeItem(id) {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    setMenu((m) => m.filter((i) => i.id !== id));
  }

  if (authed === null) {
    return <div className="admin-wrap">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="admin-wrap">
        <div className="login-box">
          <h1 style={{ color: 'var(--maroon)', marginBottom: 24 }}>Admin Login</h1>
          <div className="panel">
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
              </div>
              <button className="btn btn-save" type="submit" style={{ width: '100%' }}>Log In</button>
              {loginErr && <div className="err">{loginErr}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <div className="logo">Mirapakaya <span>Kitchen</span></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge">ADMIN</span>
          <button className="btn btn-del" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {business && (
        <div className="panel">
          <h2>Business Info</h2>
          <div className="sub">Saves live — changes appear on your site immediately</div>
          <div className="field">
            <label>Business Name</label>
            <input value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Phone / WhatsApp (with country code)</label>
            <input value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Delivery Area</label>
            <input value={business.area} onChange={(e) => setBusiness({ ...business, area: e.target.value })} />
          </div>
          <div className="field">
            <label>Hours</label>
            <input value={business.hours} onChange={(e) => setBusiness({ ...business, hours: e.target.value })} />
          </div>
          <div className="field">
            <label>Hero Tagline</label>
            <textarea rows={2} value={business.tagline} onChange={(e) => setBusiness({ ...business, tagline: e.target.value })} />
          </div>
          <button className="btn btn-save" onClick={saveBusiness}>Save Business Info</button>
          {saved && <span style={{ marginLeft: 12, color: 'var(--leaf)', fontWeight: 700, fontSize: '0.85rem' }}>Saved ✓</span>}
        </div>
      )}

      <div className="panel">
        <h2>Menu Items</h2>
        <div className="sub">Add or remove dishes. Heat: 0 = none, 1 = mild, 2 = medium, 3 = fiery</div>

        <div className="form-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Dish name</label>
            <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Description</label>
            <input value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Price (₹)</label>
            <input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn btn-add" onClick={addItem}>+ Add</button>
        </div>

        <table>
          <thead>
            <tr><th>Dish</th><th>Category</th><th>Heat</th><th>Price</th><th></th></tr>
          </thead>
          <tbody>
            {menu.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No dishes yet.</td></tr>
            )}
            {menu.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong><br /><span style={{ opacity: 0.6, fontSize: '0.82rem' }}>{item.description}</span></td>
                <td>{item.category}</td>
                <td>{'🌶️'.repeat(item.heat) || '—'}</td>
                <td>₹{item.price}</td>
                <td><button className="btn btn-del" onClick={() => removeItem(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
