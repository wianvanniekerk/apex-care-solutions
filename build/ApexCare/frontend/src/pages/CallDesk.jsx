import React from 'react';
import { 
  Typography
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import phoneIcon from "../assets/phone.png";
import plusIcon from "../assets/plus.png";
import apexcare2 from "../assets/apexcare-2.png";

const CallDesk = () => {
  const navigate = useNavigate();

  return (    
    <div className="call-desk-container">

      <header className="header">
        <div className="logoBox">
          <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2}/></a>
          <Typography variant="h4" className="Title">Call Desk</Typography>
        </div>
      </header>
      
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