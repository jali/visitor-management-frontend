import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const ResidentDashboard = () => {
  const { token } = useAuth(); // Use token from context state
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const res = await api.post('/visit', formData);
      const url = res.data.url;
      setQrUrl(url);
      setFormData({
        visitorName: '',
        visitTime: '',
        visitDuration: '',
        carDetails: '',
        visitId: uuidv4(),
      });
    } catch (err) {
      setError('Failed to create visit. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {qrUrl && (
        <div className="dashboard-qr-container">
          <h3>QR Code for Visit</h3>
          <QRCodeCanvas value={qrUrl} size={256} />
        </div>
      )}
      <div className="dashboard-form">
        <h2>Resident Dashboard</h2>
        {error && <p className="dashboard-error">{error}</p>}
        {isLoading && <p>Loading...</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="visitorName"
            type="text"
            value={formData.visitorName}
            onChange={handleChange}
            placeholder="Visitor Name"
            required
            className="dashboard-input"
          />
          <input
            name="visitTime"
            type="datetime-local"
            value={formData.visitTime}
            onChange={handleChange}
            required
            className="dashboard-input"
          />
          <input
            name="visitDuration"
            type="text"
            value={formData.visitDuration}
            onChange={handleChange}
            placeholder="Visit Duration (e.g., 2 hours)"
            required
            className="dashboard-input"
          />
          <input
            name="carDetails"
            type="text"
            value={formData.carDetails}
            onChange={handleChange}
            placeholder="Car Details"
            className="dashboard-input"
          />
          <button type="submit" disabled={isLoading} className="dashboard-button">
            {isLoading ? 'Creating...' : 'Create Visit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResidentDashboard;
