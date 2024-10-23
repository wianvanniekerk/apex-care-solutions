import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ClientImg from "../assets/client.png";
import apexcare2 from "../assets/apexcare-2.png";
import axios from "axios";
import "../styles.css";

const ClientDetails = () => {
  const { id } = useParams();
  const [Clients, setClient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchClientDetails = async() => {
        try{
          const response = await axios.get(`http://localhost:8081/Client/${id}`);
          setClient(response.data);
        }catch(error){
          console.log("Error fetching Client details: ", error);
        }
      };
      fetchClientDetails();
    }, [id]);

    if(!Clients){
      return <Typography>Loading ...</Typography>;
    }

    const handleButtonClick = () => {
         navigate("/client-management");
    };

    const IsKeyClient=()=>{
        if(Clients.IsKeyClient == true){
            return "Is Key Client"
        }else return ""
    }

  return (
    <div className="ClientDetails">

      <header className="header">
        <div className="logoBox">
          <img className="apexcare" alt="ApexCare" src={apexcare2} />
          <Typography variant="h4" className="Title">
            Client Details
          </Typography>
        </div>
      </header>

      <section id="main">
      <section className="middle">
      <Card className="box">
      <CardContent className="content">
        

       
        <img className="techImg" alt="Client" src={ClientImg} />
        <div className="mainInfo">
        
        <h2>{Clients.Name}</h2>
        <p>{Clients.Email}</p>
        <p>{Clients.Address}</p>
        <p>{Clients.Phone}</p>
        <p>{IsKeyClient()}</p>
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

export default ClientDetails;