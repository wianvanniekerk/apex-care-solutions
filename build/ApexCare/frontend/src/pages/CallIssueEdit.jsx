import React, { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent,FormControl,InputLabel, Select, MenuItem, Box, CircularProgress, Alert} from "@mui/material";
import apexcare2 from "../assets/apexcare-2.png";
import task from "../assets/tasks.png";
import SpinnerImage from '../assets/faviconn.png';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const CallIssueUpdate = () => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [client, setClient] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [status, setStatus] = useState(null);
  const { id } = useParams();
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState({
    lists: false,
    client: false,
    technician: false,
    updateJob: false
  });
  const [error, setError] = useState({
    lists: null,
    client: null,
    technician: null,
    service: null
  });
  const [issueData, setIssueData] = useState({
    Title: "",
    Description: "",
    Address: "",
    Status: "Active",
    Priority: "",
    Equipment: "",
  });
  
  const navigate = useNavigate();

//get All Clients and All Technicians to be displayed
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(prev => ({ ...prev, lists: true }));
      setError(prev => ({ ...prev, lists: null }));
      
      try {
        const [clientsResponse, techniciansResponse] = await Promise.all([
          axios.get("http://localhost:8081/getclients"),
          axios.get("http://localhost:8081/Alltechnicians")
        ]);
        
        setAllClients(clientsResponse.data);
        setAllTechnicians(techniciansResponse.data);
      } catch (error) {
        console.error("Error fetching lists:", error);
        setError(prev => ({ 
          ...prev, 
          lists: "Failed to load clients and technicians" 
        }));
      } finally {
        setLoading(prev => ({ ...prev, lists: false }));
      }
    };

    fetchLists();
  }, []);

  //get job details for specific job
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/job/${id}`);
        setJobs(response.data);

        setSelectedClientId(response.data.ClientID);
        setSelectedTechnicianId(response.data.TechnicianID);
        setSelectedStatus(response.data.Status);
      } catch (error) {
        console.log("Error fetching job details: ", error);
      }
    };
    fetchJobDetails();
  }, [id]);


  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!selectedClientId) {
        setClient(null);
        return;
      }

      setLoading(prev => ({ 
        ...prev, 
        client: true, 
        service: true 
      }));
      setError(prev => ({ 
        ...prev, 
        client: null, 
        service: null 
      }));

      //Get client details and service agreements for specific client
      try {
        const [clientResponse, serviceResponse] = await Promise.all([
          axios.get(`http://localhost:8081/clients/${selectedClientId}`),
          axios.get(`http://localhost:8081/serviceAgreements/${selectedClientId}`)
        ]);

        setClient(clientResponse.data);
        
        setIssueData(prevState => ({
          ...prevState,
          Address: clientResponse.data?.Address || "",
        }));
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError(prev => ({
          ...prev,
          client: "Failed to load client details",
          service: "Failed to load service agreements"
        }));
      } finally {
        setLoading(prev => ({ 
          ...prev, 
          client: false, 
          service: false 
        }));
      }
    };

    fetchClientDetails();
  }, [selectedClientId]);

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      if (!selectedTechnicianId) {
        setTechnician(null);
        return;
      }

      if (!selectedStatus) {
        setStatus(null);
        return;
      }

      setLoading(prev => ({ ...prev, technician: true }));
      setError(prev => ({ ...prev, technician: null }));

      //get Job's assigned technician
      try {
        const response = await axios.get(`http://localhost:8081/technicians/${selectedTechnicianId}`);
        setTechnician(response.data);
      } catch (error) {
        console.error("Error fetching technician details:", error);
        setError(prev => ({ 
          ...prev, 
          technician: "Failed to load technician details" 
        }));
      } finally {
        setLoading(prev => ({ ...prev, technician: false }));
      }
    };

    fetchTechnicianDetails();
  }, [selectedTechnicianId]);

  if (!jobs) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw'
        }}
      >
        <img src={SpinnerImage} alt="Loading..." className="spinner-icon" />
      </div>
    );
  }

  const validatePriority = (Priority) => {
    return ((Priority === "Low") || (Priority === "Medium") || (Priority === "High"));
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setIssueData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

  const handleTechnicianChange = (event) => {
    setSelectedTechnicianId(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const assignTechnician = async () => {
    setLoading(prev => ({ ...prev, updateJob: true}));
  
    // Use existing job details if priority is not set
    const priorityToCheck = issueData.Priority || jobs.Priority;
  
    // Add priority validation
    if (!validatePriority(priorityToCheck)) {
      alert("Priority must be Low, Medium, or High: " + priorityToCheck);
      setLoading(prev => ({...prev, updateJob: false}));
      return;
    }
  
    if (!selectedClientId || !selectedTechnicianId || !selectedStatus) {
      alert("Please select client, technician, and status!");
      setLoading(prev => ({ ...prev, updateJob: false}));
      return;
    }
  
    // Use existing job details if fields are not set
    const submissionData = {
      ...issueData,
      Address: issueData.Address || jobs.Address,
      Title: issueData.Title || jobs.Title,
      Description: issueData.Description || jobs.Description,
      Equipment: issueData.Equipment || jobs.Equipment,
      Priority: issueData.Priority || jobs.Priority,
      TechnicianID: selectedTechnicianId,
      ClientID: selectedClientId,
      Status: selectedStatus,
    };
  
    console.log("Submission Data:", submissionData); // Log the data being submitted

  //update Job/Issue
    try {
      const response = await axios.put(`http://localhost:8081/update-job/${id}`, submissionData);
  
      console.log("Job updated successfully:", response.data);
      alert("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error); 
      alert("Error updating job: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(prev => ({ ...prev, updateJob: false }));
    }
  };
  

  const handleButtonClick = () => {
    navigate("/jobs-scheduled");
  };

  return (
    <div className="call-issue-create">
      <header className="header">
        <div className="logoBox">
          <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2} /></a>
          <Typography variant="h4" className="Title">
            Call Desk/Issue Log
          </Typography>
        </div>
      </header>
      <section id="main">
        <section className="middle">
          <Card className="box">
            <CardContent className="content">
              {Object.entries(error).map(([key, value]) => 
                value && (
                  <Alert severity="error" key={key} sx={{ mb: 2 }}>
                    {value}
                  </Alert>
                )
              )}

              <div className="left">
                <img alt="task" src={task} />
                {loading.client ? (
                  <CircularProgress />
                ) : client && (
                  <>
                    <Typography variant="body1">{client.Name}</Typography>
                    <Typography variant="body1">{client.IsKeyClient ? 'Key Client' : 'Regular Client'}</Typography>
                    <Typography variant="body1">{client.Email}</Typography>
                    <Typography variant="body1">{client.Phone}</Typography>
                    <textarea
                      name="Address"
                      type="text"
                      placeholder="jobs.Address"
                      value={issueData.Address}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </>
                )}
              </div>

              <div className="mainInfo">
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Client</InputLabel>
                    <Select
                      value={selectedClientId}
                      onChange={handleClientChange}
                      label="Select Client"
                      placeholder={jobs.Name}
                      disabled={loading.lists}
                    >
                      {allClients.map((client) => (
                        <MenuItem key={client.ClientID} value={client.ClientID}>
                          {client.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Select Technician</InputLabel>
                    <Select
                      value={selectedTechnicianId}
                      onChange={handleTechnicianChange}
                      label="Select Technician"
                      disabled={loading.lists}
                    >
                      {allTechnicians.map((tech) => (
                        <MenuItem key={tech.TechnicianID} value={tech.TechnicianID}>
                          {tech.Name} - {tech.Expertise}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Select Status</InputLabel>
                    <Select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      label="Select Status"
                      disabled={loading.lists}>
                      <MenuItem value="Active">Active</MenuItem> 
                      <MenuItem value="In Progress">In Progress</MenuItem> 
                      <MenuItem value="Cancelled">Cancelled</MenuItem> 
                      <MenuItem value="Complete">Complete</MenuItem>

                    </Select>
                  </FormControl>
                </Box>

                <div className="topInfo">
                  <input
                    name="Title"
                    type="text"
                    placeholder={jobs.Title}
                    value={issueData.Title}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    name="Priority"
                    type="text"
                    placeholder={jobs.Priority}
                    value={issueData.Priority}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <textarea
                  name="Description"
                  type="text"
                  placeholder={jobs.Description}
                  value={issueData.Description}
                  onChange={handleChange}
                  className="input-field-Big"
                />
                <input
                  name="Equipment"
                  type="text"
                  placeholder={jobs.Equipment}
                  value={issueData.Equipment}
                  onChange={handleChange}
                  className="input-field"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={assignTechnician}
                  disabled={loading.updateJob || loading.technician}
                >
                  {loading.client || loading.technician || loading.updateJob ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Update Job'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outlined"
            color="secondary"
            className="back"
            onClick={handleButtonClick}
          >
            Back
          </Button>
        </section>
      </section>
    </div>
  );
};

export default CallIssueUpdate;