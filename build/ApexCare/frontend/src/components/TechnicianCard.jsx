import React from "react";
import { Box, Grid2 } from '@mui/material';
import "../styles.css";

const TechnicianCard = ({ name, expertise, img, onClick }) => {
  return (
    <Box 
      className="TechCard" 
      sx={{ backgroundColor: '#e8f6ff', padding: 2, marginBottom: 2 }} 
      onClick={onClick}
    >
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 item>
          <img src={img} alt="Technician" style={{ height: '111px', width: '129px' }} />
        </Grid2>
        <Grid2 item>
          <h3>{name}</h3>
          <p>{expertise}</p>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default TechnicianCard;
