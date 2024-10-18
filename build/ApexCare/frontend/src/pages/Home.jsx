import React from "react";
import  Nav  from "../components/Nav";
import { Grid2, Box } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';

const Home = () => {
  return (
    <div className="home-page">
       <header className="header">
                <div className="logoBox">
                    <img className="apexcare" alt="ApexCare" src={apexcare2}/>
                    <Typography variant="h4" className="Title">Home Page</Typography>
                </div>
            </header>
            <section id="main">
            <Nav/>
            <section className="middle">
      <Grid2 container spacing={2}>
        <Grid2 item xs={6}>
          <Box>
            <BarChart data={/* data for bar chart */1} />
            <p className="p">Customer Satisfaction Rates per Month</p>
            <div className=".textHeader">Month</div>
          </Box>
        </Grid2>
        <Grid2 item xs={6}>
          <Box>
            <BarChart data={/* data for bar chart */2} />
            <p className="p">Customer Satisfaction Rates per Month</p>
            <div className=".textHeader">Month</div>
          </Box>
        </Grid2>
      </Grid2>
      <Grid2 container justifyContent="center">
        <PieChart data={/* data for pie chart */3} />
      </Grid2>
      </section>
    </section>
    </div>
    
  );
  
};

export default Home;
