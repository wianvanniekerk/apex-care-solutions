import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import apexcare2 from "../assets/apexcare-2.png";
import clientImg from "../assets/client.png";
import SpinnerImage from "../assets/faviconn.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

const EditClient = () => {
  const { id } = useParams();
  const [clients, setclients] = useState(null);
  const [loading, setLoading] = useState({
    client: false,
    updateClient: false,
  });
  const [issueData, setIssueData] = useState({
    Name: "",
    Phone: "",
    Address: "",
    isKeyClient: 'yes',
    ClientType: 'no',
    Email: "",
  });
  const [error, setError] = useState({
    client: null
  });

  const navigate = useNavigate();

//get client details for specific client
  useEffect(() => {
    const fetchclientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/client/${id}`);
        setclients(response.data);
      } catch (error) {
        console.log("Error fetching client details: ", error);
      }
    };
    fetchclientDetails();
  }, [id]);


  if (!clients) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <img src={SpinnerImage} alt="Loading..." className="spinner-icon" />
      </div>
    );
  }


  const handleChange = (e) => {
    const { name, value } = e.target;

    setIssueData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setIssueData((prevIssueData) => ({
      ...prevIssueData,
      [name]: value,
    }));
  };
  

  const validatePhoneNumber = (phone) => {
    return phone.startsWith('+') && phone.length === 12;
};

  const updateClient = async () => {
    setLoading((prev) => ({ ...prev, updateclient: true }));
//use existing job details if fields are not set
    issueData.Address = issueData.Address || clients.Address; 
    issueData.Name = issueData.Name || clients.Name; 
    issueData.Phone = issueData.Phone || clients.Phone; 
    issueData.Email = issueData.Email || clients.Email;

    //check phone number valid
   if (!validatePhoneNumber(issueData.Phone)) {
        setError('Invalid phone number. It should start with + and be 12 characters long.');
        setLoading(false);
        return;
    }
    
    //set database values for isKeyClient and ClientType 
    const submissionData = { ...issueData, 
        isKeyClient: issueData.isKeyClient === 'yes' ? 1 : 0, 
        ClientType: issueData.ClientType === 'yes' ? 'Business' : 'Regular', };

    try {
      const response = await axios.put(
        `http://localhost:8081/update-client/${id}`,
        {
          ...submissionData,
        }
      );
      console.log("client updated successfully:", response.data);
      alert("client updated successfully!");
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error updating client");
    } finally {
      setLoading((prev) => ({ ...prev, updateClient: false }));
    }
  };

  const handleButtonClick = () => {
    navigate("/client-management");
  };

  return (
    <div className="call-issue-create">
      <header className="header">
        <div className="logoBox">
          <a href="/home">
            <img className="apexcare" alt="ApexCare" src={apexcare2} />
          </a>
          <Typography variant="h4" className="Title">
            Call Desk/Issue Log
          </Typography>
        </div>
      </header>
      <section id="main">
        <section className="middle">
          <Card className="box">
            <CardContent className="content">
              {Object.entries(error).map(
                ([key, value]) =>
                  value && (
                    <Alert severity="error" key={key} sx={{ mb: 2 }}>
                      {value}
                    </Alert>
                  )
              )}

              <div className="left">
                <img alt="client" src={clientImg} />
              </div>

              <div className="mainInfo">
                {loading.client ? (
                  <CircularProgress />
                ) : (
                  clients && (
                    <>
                      <input
                        name="Name"
                        type="text"
                        placeholder={clients.Name}
                        value={issueData.Name}
                        onChange={handleChange}
                        className="input-field"
                      />
                      
                      <input
                        name="Email"
                        type="text"
                        placeholder={clients.Email}
                        value={issueData.Email}
                        onChange={handleChange}
                        className="input-field"
                      />
                      <input
                        name="Phone"
                        type="text"
                        placeholder={clients.Phone}
                        value={issueData.Phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                      <textarea
                        name="Address"
                        type="text"
                        placeholder={clients.Address}
                        value={issueData.Address}
                        onChange={handleChange}
                        className="input-field"
                      />
                      <div className="add-client-field">
                        <label htmlFor="isKeyClient">Is Key Client?</label>
                        <div>
                          <input
                            type="radio"
                            id="isKeyClientYes"
                            name="isKeyClient"
                            value="yes"
                            checked={issueData.isKeyClient === "yes"}
                            onChange={handleInputChange}
                            className="keyClient"
                          />
                          <label htmlFor="isKeyClientYes">Yes</label>

                          <input
                            type="radio"
                            id="isKeyClientNo"
                            name="isKeyClient"
                            value="no"
                            checked={issueData.isKeyClient === "no"}
                            onChange={handleInputChange}
                            className="keyClient"
                          />
                          <label htmlFor="isKeyClientNo">No</label>
                        </div>
                      </div>
                      <div className="add-client-field">
                        <label htmlFor="isBusinessClient">Is Business Client?</label>
                        <div>
                          <input
                            type="radio"
                            id="isBusinessClientYes"
                            name="ClientType"
                            value="yes"
                            checked={issueData.ClientType === "yes"}
                            onChange={handleInputChange}
                            className="ClientType"
                          />
                          <label htmlFor="isBusinessClientYes">Yes</label>

                          <input
                            type="radio"
                            id="isBusinessClientNo"
                            name="ClientType"
                            value="no"
                            checked={issueData.ClientType === "no"}
                            onChange={handleInputChange}
                            className="ClientType"
                          />
                          <label htmlFor="isBusinessClientNo">No</label>
                        </div>
                      </div>
                    </>
                  )
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={updateClient}
                  disabled={loading.updateClient}
                >
                  {loading.updateClient ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Update Client"
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

export default EditClient;
