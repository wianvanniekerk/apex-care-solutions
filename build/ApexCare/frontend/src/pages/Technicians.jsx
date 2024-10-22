import React, {useEffect, useState} from "react";
import { Typography, TextField } from '@mui/material';
import TechnicianCard from "../components/TechnicianCard";
import FilterCheck from "../components/checkbox";
import apexcare2 from "../assets/apexcare-2.png";
import technician from "../assets/apexcare-2-1.png";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Technicians = () => {
const [technicians, setTechnician] = useState([]);
const [filteredTechnicians, setFilteredTechnicians] = useState([]);
const [filters, setFilters] = useState({Area:[], rating:"", Expertise:[]});
const [technicianAreas, setTechnicianAreas] = useState([]);
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./technician-details/${id}`);
};

useEffect(() => {
  fetch("http://localhost:8081/Alltechnicians")
    .then((res) => res.json())
    .then((technicians) => {setTechnician(technicians); setFilteredTechnicians(technicians);})
    .catch((err) => console.log(err));
}, []);



useEffect(() => {
  fetch("http://localhost:8081/TechAreas")
    .then((res) => res.json())
    .then((technicianAreas) => setTechnicianAreas(technicianAreas))
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  applyFilters();
}, [filters]);

const handleFilterChange = (event) => {
  const {name, value, checked} = event.target;
  setFilters((prevFilters) => {
    let newFilters = { ...prevFilters};
    if(name === "Area" || name === "Expertise"){
      if (checked) {
        newFilters[name] = [...newFilters[name], value];
      }else{
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    }else{
      newFilters[name] = value;
    }
    return newFilters;
  });
};

const applyFilters = () => {
  let filteredList = technicians;
  if(filters.Area.length > 0){
    filteredList = filteredList.filter((technician) => filters.Area.includes(technician.Area));
  }

  if(filters.rating){
    filteredList = filteredList.filter((technician) => technician.rating >= filters.rating);
  }

  if(filters.Expertise.length > 0){
    filteredList = filteredList.filter((technician) => filters.Expertise.includes(technician.Expertise));
  }

  setFilteredTechnicians(filteredList);
}

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
          {technicianAreas.map((d,i) => (
          <FilterCheck
            key={i}
            name="Area"
            value={d.Area}
            onChange={handleFilterChange}
            label={d.Area}
          />
        ))}
          
          <h3 >Expertise</h3>
          {technicianAreas.map((d,i) => (
          <FilterCheck
            key={i}
            name="Expertise"
            value={d.Expertise}
            onChange={handleFilterChange}
            label={d.Expertise}
          />
        ))}
          </div>
        </div>
        

      <section id="mainContent">
        <div className="searchBar" >
            <TextField className="text" variant="outlined" placeholder="Search"> 
            </TextField>
          </div>

        <div className="cards">

        {filteredTechnicians.map((d, i) => (
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
        
      </section>
      
    </div>
  );
};

export default Technicians;