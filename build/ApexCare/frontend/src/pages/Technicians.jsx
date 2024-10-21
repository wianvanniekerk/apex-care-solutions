import React, {useEffect, useState} from "react";
import { Typography, TextField, Checkbox, FormControlLabel } from '@mui/material';
import TechnicianCard from "../components/TechnicianCard";
import apexcare2 from "../assets/apexcare-2.png";
import technician from "../assets/apexcare-2-1.png";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Technicians = () => {
const [technicians, setTechnician] = useState([]);
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./technician-details/${id}`);
};

useEffect(() => {
  fetch("http://localhost:8081/Alltechnicians")
    .then((res) => res.json())
    .then((technicians) => setTechnician(technicians))
    .catch((err) => console.log(err));
}, []);

  return (
    <div className="technicians">
      
<header className="header">
        <div className="logoBox">
          <img className="apexcare" alt="ApexCare" src={apexcare2} />
          <Typography variant="h4" className="Title">
            Technicians
          </Typography>
        </div>
      </header>

      <section className="middle">

        <div className="filter">
          <div id="filterHead"><h2>Filters</h2></div>
          <div>
          <h3 >Area</h3>
          <FormControlLabel control={<Checkbox />} label="Pretoria East" />
          <FormControlLabel control={<Checkbox />} label="Johannesburg" />
          <h3 >Rating</h3>
          <FormControlLabel control={<Checkbox />} label="3+" />
          <FormControlLabel control={<Checkbox />} label="All" />
          <h3 >Expertise</h3>
          <FormControlLabel control={<Checkbox />} label="Microwaves" />
          <FormControlLabel control={<Checkbox />} label="Fridges" />
          <FormControlLabel control={<Checkbox />} label="All" />
          </div>
        </div>


        <div className="cards">



          <div className="searchBar" >
            <TextField className="text" variant="outlined" placeholder="Search"> 
            </TextField>
          </div>

          {technicians.map((d, i) => (
            <TechnicianCard
              key={i}
              name={d.Name}
              expertise={d.Expertise}
              img={technician}
              onClick={() => handleCardClick(d.TechnicianID)}
            />
          ))}


        </div>
      </section>
    </div>
  );
};

export default Technicians;