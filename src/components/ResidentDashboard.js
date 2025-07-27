import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext'; // Added import

const ResidentDashboard = () => {
  const { token } = useAuth(); // Use token from context state
  const [visits, setVisits] = useState([]);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitTime: '',
    visitDuration: '',
    carDetails: '',
    visitId: uuidv4(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const qrRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchVisits();
  }, [token]);

  const fetchVisits = async () => {
    setIsLoading(true);
    setError(null);
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/visit/my-visits`, {
        headers: { 'x-auth-token': token }
      });
      setVisits(res.data);
    } catch (err) {
      setError('Failed to fetch visits.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/visit`, formData, {
        headers: { 'x-auth-token': token }
      });
      console.log('received data: ', res.data)
      const url = res.data.url;
      setQrUrl(url);
      
      fetchVisits();
    } catch (err) {
      setError('Failed to create visit. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (qrUrl && qrRef.current) {
      qrRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [qrUrl, qrRef]);

  return (
    <div>
      <h2>Resident Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="visitorName"
          type="text"
          value={formData.visitorName}
          onChange={handleChange}
          placeholder="Visitor Name"
          required
        />
        <input
          name="visitTime"
          type="datetime-local"
          value={formData.visitTime}
          onChange={handleChange}
          required
        />
        <input
          name="visitDuration"
          type="text"
          value={formData.visitDuration}
          onChange={handleChange}
          placeholder="Visit Duration (e.g., 2 hours)"
          required
        />
        <input
          name="carDetails"
          type="text"
          value={formData.carDetails}
          onChange={handleChange}
          placeholder="Car Details"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Visit'}
        </button>
      </form>
      <ul>
        {visits.map((visit) => (
          <li key={visit.visitId || visit._id}>
            {visit.visitorName} - {visit.visitTime}
          </li>
        ))}
      </ul>
      {qrUrl && (
        <div ref={qrRef}>
          <h3>QR Code for Visit</h3>
          <QRCodeCanvas value={qrUrl} size={256} />
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;
