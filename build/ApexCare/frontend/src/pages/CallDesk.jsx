import React from 'react';
import { useNavigate } from 'react-router-dom';
import phoneIcon from "../assets/phone.png";
import plusIcon from "../assets/plus.png";

const CallDesk = () => {
  const navigate = useNavigate();

  return (
    <div className="call-desk-container">
      <h1 className="call-desk-title">Welcome to the Call Desk</h1>
      
      <div className="call-desk-card">
        <div className="call-desk-header">
          <img className="call-desk-icon" alt="Phone" src={phoneIcon} />
          <h2 className="call-desk-subtitle">Call Desk Management</h2>
        </div>
        
        <p className="call-desk-description">
          Manage incoming calls, create new issues, and track ongoing problems efficiently.
        </p>
        
        <button
          className="add-issue-button"
          onClick={() => navigate('/call-desk/call-issue-create')}
        >
        <img className="call-desk-icon" alt="Plus" src={plusIcon} />
          Add New Issue
        </button>
      </div>
    </div>
  );
};

export default CallDesk;