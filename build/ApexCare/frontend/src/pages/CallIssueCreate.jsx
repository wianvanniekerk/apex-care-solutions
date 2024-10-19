import React, { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import apexcare2 from "../assets/apexcare-2.png";
import task from "../assets/tasks.png";
import axios from "axios";
import "../styles.css";


const CallIssueCreate = () => {
  const [clients, setClients] = useState([]);
  const [service, setService] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [issueData, setIssueData] = useState({
    Title: "",
    Description: "",
    Address: "",
    Status: "Active",
    Priority: "",
  });

  useEffect(() => {
    fetch("http://localhost:8081/clients")
      .then((res) => res.json())
      .then((clients) => setClients(clients))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/technicians")
      .then((res) => res.json())
      .then((technician) => setTechnician(technician))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      setIssueData((prevState) => ({
        ...prevState,
        Address: clients[0]?.Address || "",
      }));
    }
  }, [clients]);

  useEffect(() => {
    fetch("http://localhost:8081/serviceAgreements")
      .then((res) => res.json())
      .then((service) => setService(service))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const assignTechnician = async () => {
    const selectedTechnician = technician[0]?.TechnicianID || "";
    const selectedClient = clients[0]?.ClientID || "";
    
    try {
      const response = await axios.post("http://localhost:8081/add-job", {
        ...issueData,
        TechnicianID: selectedTechnician,
        ClientID: selectedClient,
      });
      console.log("Job created successfully:", response.data);
      alert("Job created successfully!");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  return (
    <div className="call-issue-create">
      <header className="header">
        <div className="logoBox">
          <img className="apexcare" alt="ApexCare" src={apexcare2} />
          <Typography variant="h4" className="Title">
            Call Desk/Issue Log
          </Typography>
        </div>
      </header>
      <section id="main">
        <section className="middle">
          <Card className="box">
            <CardContent className="content">
              <div className="left">
                <img alt="task" src={task} />
                {clients.map((d, i) => (
                  <>
                    <Typography variant="body1">{d.Name}</Typography>
                    <Typography variant="body1">{d.IsKeyClient}</Typography>
                    <Typography variant="body1">{d.Email}</Typography>
                    <Typography variant="body1">{d.Phone}</Typography>
                    <textarea
                      name="Address"
                      type="text"
                      placeholder="Address"
                      value={issueData.Address}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </>
                ))}
              </div>
              <div className="mainInfo">
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
                  type="text"
                  placeholder="Client Equipment:"
                  //value= {issueData.Equipment}
                  // onChange={handleChange}
                  className="input-field"
                />
                {service.map((d, i) => (
                  <div key={i} className="input-field-Big">
                    <Typography variant="h6">Service Agreement</Typography>
                    <Typography variant="body1">
                      <strong>Period:</strong> {d.Period}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Equipment:</strong> {d.Equipment}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Renew:</strong> {d.Renew}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Service Cost:</strong> ${d.ServiceCost}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Description:</strong> {d.Description}
                    </Typography>
                  </div>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={assignTechnician}
                >
                  Assign Technician
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button variant="outlined" color="secondary" className="back">
            Back
          </Button>
        </section>
      </section>
    </div>
  );
};

export default CallIssueCreate;
