import React, {useEffect, useState} from "react";
import { Typography, TextField } from '@mui/material';
import Card from "../components/Card";
import FilterCheck from "../components/checkbox";
import apexcare2 from "../assets/apexcare-2.png";
import task from "../assets/tasks.png"
import SpinnerImage from '../assets/faviconn.png';
import { useNavigate } from "react-router-dom";
import "../styles.css";
import axios from "axios";

const Jobs = () => {
const [jobs, setJobs] = useState([]);
const [filteredJobs, setFilteredJobs] = useState([]);
const [filters, setFilters] = useState({Status:[], Priority:[], Title:"" });
const [jobStatus, setJobStatus] = useState([]);
const [jobPriority, setJobPriority] = useState([]);
const [loading, setLoading] = useState({jobs: false});
const navigate = useNavigate();

const handleCardClick = (id) => {
  navigate(`./job-details/${id}`);
};

const handleEditClick = (id) => {
  navigate(`./job-edit/${id}`);
};

const fetchJobs = async () => {
  try {
    const response = await axios.get("http://localhost:8081/getJobs");
    setJobs(response.data);
    setFilteredJobs(response.data);
  } catch (error) {
    console.error("Error fetching jobs: ", error);
  }
};

useEffect(() => {
  setLoading({ jobs: true});
  fetch("http://localhost:8081/getJobs")
    .then((res) => res.json())
    .then((jobs) => {setJobs(jobs); setFilteredJobs(jobs);})
    .catch((err) => console.log(err))
    .finally(() => setLoading({ jobs: false }));
}, []);

useEffect(() => {
  fetch("http://localhost:8081/JobStatus")
    .then((res) => res.json())
    .then((jobStatus) => setJobStatus(jobStatus))
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  fetch("http://localhost:8081/JobPriority")
    .then((res) => res.json())
    .then((jobPriority) => setJobPriority(jobPriority))
    .catch((err) => console.log(err));
}, []);

useEffect(() => {
  applyFilters();
}, [filters]);

const handleFilterChange = (event) => {
  const {name, value, checked} = event.target;
  setFilters((prevFilters) => {
    let newFilters = { ...prevFilters};
    if(name === "Status" || name === "Priority" ){
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
  let filteredList = jobs;
  if(filters.Status.length > 0){
    filteredList = filteredList.filter((jobs) => filters.Status.includes(jobs.Status));
  }

  if(filters.Priority.length > 0){
    filteredList = filteredList.filter((jobs) => filters.Priority.includes(jobs.Priority));
  }

  if (filters.Title) {
    filteredList = filteredList.filter((jobs) => jobs.Title.toLowerCase().includes(filters.Title.toLowerCase()));
  }

  setFilteredJobs(filteredList);
}

const remove = async(id) => {
    try{
      await axios.delete(`http://localhost:8081/job/${id}`);
      fetchJobs();
    }catch(error){
      console.log(error);
      alert("Error deleting Job");
    }
};

  return (
    <div className="Jobs">
      
      <header className="header">
                <div className="logoBox">
                    <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2}/></a>
                    <Typography variant="h4" className="Title">Jobs Scheduled</Typography>
                </div>
            </header>

            <section id="main">
      <section className="middle">
        
        <div className="filter">
          <div id="filterHead"><h2>Filters</h2></div>
          <div>
          <h3 >Status</h3>
          {jobStatus.map((d,i) => (
          <FilterCheck
            key={i}
            name="Status"
            value={d.Status}
            onChange={handleFilterChange}
            label={d.Status}
          />
        ))}
          
          <h3 >Priority</h3>
          {jobPriority.map((d,i) => (
          <FilterCheck
            key={i}
            name="Priority"
            value={d.Priority}
            onChange={handleFilterChange}
            label={d.Priority}
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

        {loading.jobs ? (
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
              ) : (filteredJobs.map((d, i) => (
            <Card
              key={i}
              name={d.Title}
              first={d.Name}
              second={d.Status}
              img={task}
              priority={d.Priority}
              buttons={true}
              onClick={() => handleCardClick(d.JobID)}
              remove={() => remove(d.JobID)}
              edit ={handleEditClick}
            />
          )))}
        </div>
        </section>
        
      </section>
      </section>
    </div>
  );
};

export default Jobs;