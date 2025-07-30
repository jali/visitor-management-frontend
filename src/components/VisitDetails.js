import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const VisitDetails = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [error, setError] = useState('');
  const [isInvalidTime, setIsInvalidTime] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      try {
        console.log('Fetching visit details with token:', token);
        const res = await api.get(`/visit/${id}`);
        const data = res.data;
        setVisit(data);

        if(data) {
          // Check if visit time + duration exceeds current time
          const visitEndTime = new Date(data.visitTime);
          const duration = Number(data.visitDuration);
          visitEndTime.setUTCHours(visitEndTime.getUTCHours() + duration);
          const currentTime = new Date();
          setIsInvalidTime(visitEndTime < currentTime);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.info || err.message || 'Failed to fetch visit details';
        setError(errorMessage);
        console.error(err);
      }
    };

    fetchVisit();
  }, [id, token]);

  if (error) return <div className="visit-details-container"><p className="visit-details-error">{error}</p></div>;
  if (!visit) return <div className="visit-details-container"><p className="visit-details-loading">Loading...</p></div>;

  return (
    <div className="visit-details-container">
      {isInvalidTime && <p className="visit-details-error">Invalid Access: Expired Invitation!<br/> انتهت صلاحية الزيارة. يرجى التواصل مع الساكن للحصول على دعوة جديدة</p>}
      <div className={`visit-details-card ${isInvalidTime ? 'invalid-time' : ''}`}>
        <h2>Visit Details</h2>
        <p className={`visit-details-item ${isInvalidTime && (visit.visitTime || visit.visitDuration) ? 'invalid-field' : ''}`}>
          <span className="visit-details-label">Visit ID:</span> {visit.visitId}
        </p>
        <p className="visit-details-item">
          <span className="visit-details-label">Visitor Name:</span> {visit.visitorName}
        </p>
        <p className={`visit-details-item ${isInvalidTime && visit.visitTime ? 'invalid-field' : ''}`}>
          <span className="visit-details-label">Visit Time:</span> {new Date(visit.visitTime).toLocaleString()}
        </p>
        <p className={`visit-details-item ${isInvalidTime && visit.visitDuration ? 'invalid-field' : ''}`}>
          <span className="visit-details-label">Visit Duration:</span> {visit.visitDuration} hours
        </p>
        <p className="visit-details-item">
          <span className="visit-details-label">Flat Number:</span> {visit.flatNumber}
        </p>
        <p className="visit-details-item">
          <span className="visit-details-label">Building Number:</span> {visit.buildingNumber}
        </p>
        <p className="visit-details-item">
          <span className="visit-details-label">Car Details:</span> {visit.carDetails || 'N/A'}
        </p>
        <p className="visit-details-item">
          <span className="visit-details-label">Resident:</span> {visit.residentId.name}
        </p>
      </div>
    </div>
  );
};

export default VisitDetails;
