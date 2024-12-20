import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import technicianImg from "../assets/apexcare-2-1.png";
import apexcare2 from "../assets/apexcare-2.png";
import Rating from "../components/stars";
import SpinnerImage from '../assets/faviconn.png';
import axios from "axios";
import "../styles.css";

const TechnicianDetails = () => {
  const { id } = useParams();
  const [technicians, setTechnician] = useState(null);
    const navigate = useNavigate();

    //get technician details based on technicianID
    useEffect(() => {
      const fetchTechnicianDetails = async() => {
        try{
          const response = await axios.get(`http://localhost:8081/technician/${id}`);
          setTechnician(response.data);
        }catch(error){
          console.log("Error fetching technician details: ", error);
        }
      };
      fetchTechnicianDetails();
    }, [id]);

    if(!technicians){
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

    const handleButtonClick = () => {
         navigate("/technicians");
    };

  return (
    <div className="technicianDetails">

      <header className="header">
        <div className="logoBox">
          <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2} /></a>
          <Typography variant="h4" className="Title">
            Technician Details
          </Typography>
        </div>
      </header>

      <section id="main">
      <section className="middle">
      <Card className="box">
      <CardContent className="content">
        

       
        <img className="techImg" alt="Technician" src={technicianImg} />
        <div className="mainInfo">
        
        <h2>{technicians.Name}</h2>
        <p>{technicians.Expertise}</p>
        <p>{technicians.Area}</p>
        <p>{technicians.Phone}</p>
        <p>{technicians.Email}</p>
        <p>Customer satisfaction rating</p>
        <div className="stars">
          <Rating/>
        </div>
        </div>
        
        </CardContent>
        </Card>

        <Button variant="outlined" color="secondary" className="back" onClick={handleButtonClick}>
            Back
          </Button>
      </section>
      </section>
    </div>
  );
};

export default TechnicianDetails;