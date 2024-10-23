import React, {useEffect, useState} from "react";
import { Typography, TextField } from '@mui/material';
import Card from "../components/Card";
import FilterCheck from "../components/checkbox";
import apexcare2 from "../assets/apexcare-2.png";
import service from "../assets/service.png"
import { useNavigate } from "react-router-dom";
import "../styles.css";

const ServicePackages = () => {
  const [Service, setService] = useState([]);
const [filteredService, setFilteredService] = useState([]);
const [filters, setFilters] = useState({Status:[], Renew:[], Title:"" });
const [ServiceStatus, setServiceStatus] = useState([]);
const [serviceRenew, setserviceRenew] = useState([]);
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./service-details/${id}`);
};

const handleEditClick = (id) => {
  navigate(`./service-edit/${id}`);
};


useEffect(() => {
  fetch("http://localhost:8081/getService")
    .then((res) => res.json())
    .then((Service) => {setService(Service); setFilteredService(Service);})
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  fetch("http://localhost:8081/ServiceStatus")
    .then((res) => res.json())
    .then((ServiceStatus) => setServiceStatus(ServiceStatus))
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  fetch("http://localhost:8081/ServiceRenew")
    .then((res) => res.json())
    .then((serviceRenew) => setserviceRenew(serviceRenew))
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  applyFilters();
}, [filters]);

const handleFilterChange = (event) => {
  const {name, value, checked} = event.target;
  setFilters((prevFilters) => {
    let newFilters = { ...prevFilters};
    if(name === "Status" || name === "Renew" ){
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
  let filteredList = Service;
  if(filters.Status.length > 0){
    filteredList = filteredList.filter((Service) => filters.Status.includes(Service.Status));
  }

  if(filters.Renew.length > 0){
    filteredList = filteredList.filter((Service) => filters.Renew.includes(Service.Renew));
  }

  if (filters.Title) {
    filteredList = filteredList.filter((Service) => Service.Title.toLowerCase().includes(filters.Title.toLowerCase()));
  }

  setFilteredService(filteredList);
}


  return (
    <div className="Service">
      
      <header className="header">
                <div className="logoBox">
                    <img className="apexcare" alt="ApexCare" src={apexcare2}/>
                    <Typography variant="h4" className="Title">Service Scheduled</Typography>
                </div>
            </header>

            <section id="main">
      <section className="middle">
        
        <div className="filter">
          <div id="filterHead"><h2>Filters</h2></div>
          <div>
          <h3 >Status</h3>
          {ServiceStatus.map((d,i) => (
          <FilterCheck
            key={i}
            name="Status"
            value={d.Status}
            onChange={handleFilterChange}
            label={d.Status}
          />
        ))}
          
          <h3 >Renew</h3>
          {serviceRenew.map((d,i) => (
          <FilterCheck
            key={i}
            name="Renew"
            value={d.Renew}
            onChange={handleFilterChange}
            label={d.Renew}
          />
        ))}
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

        {filteredService.map((d, i) => (
            <Card
              key={i}
              name={d.Equipment}
              first={d.ServiceCost}
              second={d.Status}
              img={service}
              onClick={() => handleCardClick(d.AgreementID)}
            />
          ))}
        </div>
        </section>
        
      </section>
      </section>
    </div>
  );
};

export default ServicePackages;
