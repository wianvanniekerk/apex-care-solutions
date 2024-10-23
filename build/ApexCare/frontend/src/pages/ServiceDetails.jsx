import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import service from "../assets/service.png";
import apexcare2 from "../assets/apexcare-2.png";
import axios from "axios";
import "../styles.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const [Services, setServices] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/service/${id}`);
        setServices(response.data);
      } catch (error) {
        console.log("Error fetching Service details: ", error);
      }
    };
    fetchServiceDetails();
  }, [id]);

  if (!Services) {
    return <Typography>Loading ...</Typography>;
  }

  const handleButtonClick = () => {
    navigate("/service-packages");
  };


  return (
    <div className="ServiceDetails">
      <header className="header">
        <div className="logoBox">
          <img className="apexcare" alt="ApexCare" src={apexcare2} />
          <Typography variant="h4" className="Title">
            Service Details
          </Typography>
        </div>
      </header>

      <section id="main">
        <section className="middle">
          <Card className="box">
            <CardContent className="content">
              <img className="ServiceImg" alt="Service" src={service} />
              <div className="mainInfo">
                <h2>{Services.Equipment}</h2>
                <p>R{Services.ServiceCost}</p>
                <p>{Services.Description}</p>
                <p>Status: {Services.Status}</p>
                <p>Period: {Services.Period}</p>
                <p>Renew: {Services.Renew}</p>
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

export default ServiceDetails;