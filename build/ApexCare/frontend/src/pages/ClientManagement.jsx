import React, {useEffect, useState} from "react";
import { Typography, TextField } from '@mui/material';
import Card from "../components/Card";
import FilterCheck from "../components/checkbox";
import apexcare2 from "../assets/apexcare-2.png";
import clientImg from "../assets/client.png"
import { useNavigate } from "react-router-dom";
import "../styles.css";
import axios from "axios";

const ClientManagement = () => {
const [clients, setclients] = useState([]);
const [filteredclients, setFilteredclients] = useState([]);
const [filters, setFilters] = useState({IsKeyClient:[], Area:[], Title:"" });
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./Client-details/${id}`);
};

const handleEditClick = (id) => {
  navigate(`./Client-edit/${id}`);
};

const fetchclients = async () => {
  try {
    const response = await axios.get("http://localhost:8081/getclients");
    setclients(response.data);
    setFilteredclients(response.data);
  } catch (error) {
    console.error("Error fetching clients: ", error);
  }
};

useEffect(() => {
  fetch("http://localhost:8081/getclients")
    .then((res) => res.json())
    .then((clients) => {setclients(clients); setFilteredclients(clients);})
    .catch((err) => console.log(err));
}, []);




useEffect(() => {
  applyFilters();
}, [filters]);

const handleFilterChange = (event) => {
  const {name, value, checked} = event.target;
  setFilters((prevFilters) => {
    let newFilters = { ...prevFilters};
    if(name === "IsKeyClient"  ){
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
  let filteredList = clients;
  if(filters.IsKeyClient.length > 0){
    filteredList = filteredList.filter((clients) => filters.IsKeyClient.includes(String(clients.IsKeyClient)));
  }

  if (filters.Name) {
    filteredList = filteredList.filter((clients) => clients.Title.toLowerCase().includes(filters.Title.toLowerCase()));
  }

  setFilteredclients(filteredList);
}

const remove = async(id) => {
    try{
      await axios.delete(`http://localhost:8081/Client/${id}`);
      fetchclients();
    }catch(error){
      console.log(error);
      alert(`Error deleting Client ID = ${id}`);
    }
};

  return (
    <div className="clients">
      
      <header className="header">
                <div className="logoBox">
                    <img className="apexcare" alt="ApexCare" src={apexcare2}/>
                    <Typography variant="h4" className="Title">Client Managament</Typography>
                </div>
            </header>

            <section id="main">
      <section className="middle">
        
        <div className="filter">
          <div id="filterHead"><h2>Filters</h2></div>
          <div>
          <h3 >IsKeyClient</h3>
          <FilterCheck
            name="IsKeyClient"
            value="true"
            onChange={handleFilterChange}
            label="true"
          />
          <FilterCheck
            name="IsKeyClient"
            value="false"
            onChange={handleFilterChange}
            label="false"
          />
          
          </div>
        </div>
        

      <section id="mainContent">
        <div className="searchBar" >
            <TextField 
            className="text" 
            variant="outlined" 
            placeholder="Search" 
            name="Title"
            value={filters.Title}
            onChange={handleFilterChange}/> 
          </div>

        <div className="cards">

        {filteredclients.map((d, i) => (
            <Card
              key={i}
              name={d.Name}
              first={d.Address}
              second={d.IsKeyClient}
              img={clientImg}
              //buttons={true}
              onClick={() => handleCardClick(d.ClientID)}
              //remove={() => remove(d.ClientID)}
              //edit ={handleEditClick}
            />
          ))}
        </div>
        </section>
        
      </section>
      </section>
    </div>
  );
};

export default ClientManagement;