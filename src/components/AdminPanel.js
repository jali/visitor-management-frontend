import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

const AdminPanel = () => {
  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', apartment: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/residents`);
      setResidents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/residents/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/residents`, formData);
      }
      setFormData({ name: '', email: '', password: '', apartment: '' });
      fetchResidents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (resident) => {
    setFormData({ name: resident.name, email: resident.email, password: '', apartment: resident.apartment });
    setEditingId(resident.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/residents/${id}`);
      fetchResidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Admin Panel - Manage Residents</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" required={!editingId} />
        <input name="apartment" value={formData.apartment} onChange={handleChange} placeholder="Apartment" required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Resident</button>
      </form>
      <ul>
        {residents.map((resident) => (
          <li key={resident.id}>
            {resident.name} - {resident.email} - {resident.apartment}
            <button onClick={() => handleEdit(resident)}>Edit</button>
            <button onClick={() => handleDelete(resident.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
