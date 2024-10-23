import React from "react";
import { Grid2, Box, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import apexcare2 from "../assets/apexcare-2.png";
import "../styles.css";

const Home = () => {
  return (
    <div className="home-page">
       <header className="header">
                <div className="logoBox">
                    <a href="/home"><img className="apexcare" alt="ApexCare" src={apexcare2}/></a>
                    <Typography variant="h4" className="Title">Home Page</Typography>
                </div>
            </header>
            <section id="main">
            <section className="middle">
      <Grid2 container spacing={8}>
        <Grid2 >
          <Box className="barBox">
          <p className="p">Customer Satisfaction Rates per Month</p>
          <BarChart series={[
              {data: [35, 44, 24, 34, 32, 16, 12, 17, 22, 35, 28]}
            ]} height={290} width={500} xAxis={[
              {data: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Dec'], scaleType: 'band'},
            ]} barsize = {30}
            margin={{top: 10, bottom: 30, left: 40, right: 10}}/>
            
            <div className=".textHeader">Month</div>
          </Box>
        </Grid2>
          <Box className="barBox">
          <p className="p">Customer Satisfaction Rates per Month</p>
          <BarChart series={[
              {data: [15, 24, 34, 14, 22, 36, 22, 17, 12, 25, 18]}
            ]} height={290} width={500} xAxis={[
              {data: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Dec'], scaleType: 'band'},
            ]} barsize = {30}
            margin={{top: 10, bottom: 30, left: 40, right: 10}}/>
            <div className=".textHeader">Month</div>
          </Box>
        
      <Grid2>
      <p className="p">DataSet</p>
        <PieChart series={[
          {data: [
            {id: 0, value: 10, label: 'Series A'},
            {id: 1, value: 20, label: 'Series B'},
            {id: 2, value: 15, label: 'Series C'},
          ],},
        ]} width={400} height={200} />
      </Grid2>
      <Grid2>
      <p className="p">DataSet</p>
        <PieChart series={[
          {data: [
            {id: 0, value: 10, label: 'Series A'},
            {id: 1, value: 20, label: 'Series B'},
            {id: 2, value: 15, label: 'Series C'},
          ],},
        ]} width={400} height={200} />
      </Grid2>
      </Grid2>
      </section>
    </section>
    </div>
    
  );
  
};

export default Home;
