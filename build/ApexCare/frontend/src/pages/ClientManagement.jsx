import React, {useEffect, useState} from "react";
import { Typography, TextField } from '@mui/material';
import Card from "../components/Card";
import FilterCheck from "../components/checkbox";
import apexcare2 from "../assets/apexcare-2.png";
import clientImg from "../assets/client.png"
import plusIcon from "../assets/plus.png"
import SpinnerImage from '../assets/faviconn.png';
import { useNavigate } from "react-router-dom";
import "../styles.css";
import axios from "axios";

const ClientManagement = () => {
const [clients, setclients] = useState([]);
const [filteredclients, setFilteredclients] = useState([]);
const [filters, setFilters] = useState({IsKeyClient:[], Area:[], searchTerm:"" , ClientType:[]});
const [loading, setLoading] = useState({clients: false});
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./Client-details/${id}`);
};

const handleEditClick = (id) => {
  navigate(`./client-edit/${id}`);
};

//for async await
const fetchclients = async () => {
  try {
    const response = await axios.get("http://localhost:8081/getclients");
    setclients(response.data);
    setFilteredclients(response.data);
  } catch (error) {
    console.error("Error fetching clients: ", error);
  }
};

//get all clients
useEffect(() => {
  setLoading({ clients: true});
  fetch("http://localhost:8081/getclients")
    .then((res) => res.json())
    .then((clients) => {setclients(clients); setFilteredclients(clients);})
    .catch((err) => console.log(err))
    .finally(() => setLoading({ clients: false })); 
}, []);


useEffect(() => {
  applyFilters();
}, [filters]);

//When filters are applied, handle the filters
const handleFilterChange = (event) => {
  const {name, value, checked} = event.target;
  setFilters((prevFilters) => {
    let newFilters = { ...prevFilters};
    if(name === "IsKeyClient" || name === "ClientType" ){
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

//Apply the filters and update the output
const applyFilters = () => {
  let filteredList = clients;
  if(filters.IsKeyClient.length > 0){
    filteredList = filteredList.filter((clients) => filters.IsKeyClient.includes(String(clients.IsKeyClient)));
  }

  if(filters.ClientType.length>0){
    filteredList = filteredList.filter((clients)=> filters.ClientType.includes(clients.ClientType));
  }

  if (filters.Name) {
    filteredList = filteredList.filter((clients) => clients.Title.toLowerCase().includes(filters.Title.toLowerCase()));
  }

  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredList = filteredList.filter((client) => 
      client.Name.toLowerCase().includes(searchTerm) ||
      client.Address.toLowerCase().includes(searchTerm) ||
      (client.Email && client.Email.toLowerCase().includes(searchTerm)) ||
      (client.Phone && client.Phone.toLowerCase().includes(searchTerm))
    );
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
                    <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2}/></a>
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
          <div>
          <h3 >Client Type</h3>
          <FilterCheck
            name="ClientType"
            value="Business"
            onChange={handleFilterChange}
            label="Business"
          />
          <FilterCheck
            name="ClientType"
            value="Regular"
            onChange={handleFilterChange}
            label="Regular"
          />
          
          </div>
        </div>
        

      <section id="mainContent">
        <button
          className="add-client-button"
          onClick={() => navigate('/client-management/add-client')}
        >
        <img className="add-client-icon" alt="Plus" src={plusIcon} />
          Add New Client
        </button>
        <div className="searchBar" >
            <TextField 
            className="text"
            variant="outlined" 
            placeholder="Search" 
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          /> 
          </div>

        <div className="cards">

        {loading.clients ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '50vh',
                      width: '50vw'
                    }}>
                    <img src={SpinnerImage} alt="Loading..." className="spinner-icon" />
                  </div>
              ) : (filteredclients.map((d, i) => (
            <Card
              key={i}
              name={d.Name}
              first={d.Address}
              second={d.IsKeyClient}
              img={clientImg}
              buttons={true}
              onClick={() => handleCardClick(d.ClientID)}
              remove={() => remove(d.ClientID)}
              edit ={() => handleEditClick(d.ClientID)}
            />
          )))}
        </div>
        </section>
        
      </section>
      </section>
    </div>
  );
};

export default ClientManagement;