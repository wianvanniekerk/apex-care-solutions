import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import JobsScheduled from '../pages/JobsScheduled';
import ServicePackages from '../pages/ServicePackages';
import ClientManagement from '../pages/ClientManagement';
import CallDesk from '../pages/CallDesk';
import Technicians from '../pages/Technicians';
import CallIssueCreate  from '../pages/CallIssueCreate';
import TechnicianDetails from '../pages/TechnicianDetails';
import { LoginPage } from '../pages/Login';
import Nav from './Nav';

const AppRouter = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="" element={<LoginPage />}/>
          <Route path="home" element={<Home />} />
          <Route path="jobs-scheduled" element={<JobsScheduled />} />
          <Route path="service-packages" element={<ServicePackages />} />
          <Route path="client-management" element={<ClientManagement />} />
          <Route path="call-desk" element={<CallDesk />} />
          <Route path="call-desk/call-issue-create" element={<CallIssueCreate />} />
          <Route path="technicians" element={<Technicians />} />
          <Route path="technicians/technician-details/:id" element={<TechnicianDetails />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
