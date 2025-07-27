import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const VisitDetails = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [visit, setVisit] = useState(null);
    const [error, setError] = useState('');

  useEffect(() => {
    fetchVisit();
  }, [id, token]);

  const fetchVisit = async () => {
    if (!token) {
      setError('No authentication token found. Please log in again.');
      return;
    }
    try {
        console.log('Fetching visit details with token:', token); // Debug log
        const res = await axios.get(`${API_BASE_URL}/visit/${id}`, { // Changed to /visit/:id
            headers: { 'x-auth-token': token }
        });
        setVisit(res.data);
    } catch (err) {
        const errorMessage = err.response?.data?.info || err.message || 'Failed to fetch visit details';
        setError(errorMessage);
        console.error(err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!visit) return <p>Loading...</p>;

  return (
    <div>
      <h2>Visit Details</h2>
      <p>Visitor Name: {visit.visitorName}</p>
      <p>Contact: {visit.visitorContact}</p>
      <p>Date: {visit.visitDate}</p>
      <p>Purpose: {visit.purpose}</p>
      <p>Resident: {visit.residentName}</p> {/* Assume backend provides this */}
    </div>
  );
};

export default VisitDetails;
