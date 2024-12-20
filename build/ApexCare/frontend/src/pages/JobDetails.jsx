import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import task from "../assets/tasks.png";
import apexcare2 from "../assets/apexcare-2.png";
import Rating from "../components/stars";
import red from "../assets/redBookmark.png";
import yellow from "../assets/yellowBookmark.png";
import blue from "../assets/blueBookmark.png";
import SpinnerImage from '../assets/faviconn.png';
import axios from "axios";
import "../styles.css";

const JobDetails = () => {
  const { id } = useParams();
  const [jobs, setJobs] = useState(null);
  const navigate = useNavigate();

  //get job details for specific job
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/job/${id}`);
        setJobs(response.data);
      } catch (error) {
        console.log("Error fetching job details: ", error);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!jobs) {
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
    navigate("/jobs-scheduled");
  };

  //check priority of job
  const getPriorityBookmark = (priority) => {
    switch (priority) {
      case "High":
        return red;
      case "Medium":
        return yellow;
      default:
        return blue;
    }
  };

  return (
    <div className="jobDetails">
      <header className="header">
        <div className="logoBox">
          <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2} /></a>
          <Typography variant="h4" className="Title">
            Job Details
          </Typography>
        </div>
      </header>

      <section id="main">
        <section className="middle">
          <Card className="box">
            <CardContent className="content">
              <img className="jobImg" alt="Job" src={task} />
              <div className="mainInfo">
                <h2>{jobs.Title}</h2>
                <p>{jobs.Description}</p>
                <p>{jobs.Address}</p>
                <p>{jobs.Status}</p>
                <p>{jobs.Name}</p>
                <p>{jobs.Equipment}</p>
                <p>Customer satisfaction rating</p>
                <div className="stars">
                  <Rating />
                </div>
              </div>

              <img
                className="bookmark"
                alt="Priority"
                src={getPriorityBookmark(jobs.Priority)}
                style={{ width: 220, height: 220, marginLeft: "auto" }}
              />
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

export default JobDetails;
