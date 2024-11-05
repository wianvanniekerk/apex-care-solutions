import React, { useEffect, useState } from "react";
import { 
  Typography, 
  Button, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import apexcare2 from "../assets/apexcare-2.png";
import task from "../assets/tasks.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const CallIssueCreate = () => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [client, setClient] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState({
    lists: false,
    client: false,
    technician: false,
    service: false
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

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(prev => ({ ...prev, lists: true }));
      setError(prev => ({ ...prev, lists: null }));
      
      //get All Clients and All Technicians to be displayed
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

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!selectedClientId) {
        setClient(null);
        setService(null);
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
        setService(serviceResponse.data);
        
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

      setLoading(prev => ({ ...prev, technician: true }));
      setError(prev => ({ ...prev, technician: null }));
//add new Job/Issue
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

  //check Priority equals either Low Medium or High
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

  const assignTechnician = async () => {
    
    // Add priority validation
    if (!validatePriority(issueData.Priority)) {
      alert("Priority must be Low, Medium, or High");
      return;
    }
    
    if (!selectedClientId || !selectedTechnicianId) {
      alert("Please select both client and technician!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/add-job", {
        ...issueData,
        TechnicianID: selectedTechnicianId,
        ClientID: selectedClientId,
      });
      console.log("Job created successfully:", response.data);
      alert("Job created successfully!");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  const handleButtonClick = () => {
    navigate("/call-desk");
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
                      placeholder="Address"
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
                </Box>

                <div className="topInfo">
                  <input
                    name="Title"
                    type="text"
                    placeholder="Call Title"
                    value={issueData.Title}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    name="Priority"
                    type="text"
                    placeholder="Priority"
                    value={issueData.Priority}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <textarea
                  name="Description"
                  type="text"
                  placeholder="Description"
                  value={issueData.Description}
                  onChange={handleChange}
                  className="input-field-Big"
                />
                <input
                  name="Equipment"
                  type="text"
                  placeholder="Client Equipment:"
                  value={issueData.Equipment}
                  onChange={handleChange}
                  className="input-field"
                />
                
                {loading.service ? (
                  <CircularProgress />
                ) : service && (
                  <div className="input-field-Big">
                    <Typography variant="h6">Service Agreement</Typography>
                    <Typography variant="body1">
                      <strong>Period:</strong> {service.Period}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Equipment:</strong> {service.Equipment}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Renew:</strong> {service.Renew}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Service Cost:</strong> ${service.ServiceCost}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Description:</strong> {service.Description}
                    </Typography>
                  </div>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={assignTechnician}
                  disabled={!selectedClientId || !selectedTechnicianId || loading.client || loading.technician}
                >
                  {loading.client || loading.technician ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Assign Technician'
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

export default CallIssueCreate;