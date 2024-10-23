import React from "react";
import { Box, Grid2 } from '@mui/material';
import blue from "../assets/blueBookmark.png";
import yellow from "../assets/yellowBookmark.png";
import red from "../assets/redBookmark.png";
import bronze from "../assets/bronze.png";
import silver from "../assets/silver.png";
import gold from "../assets/gold.png";
import "../styles.css";

const Card = ({ name, first, second, img, priority, level, buttons, onClick, remove, edit }) => {

  function Getpriority(){
    if(priority === "High"){
      return red;
    }
    else if(priority === "Medium"){
      return yellow;
    }else if((priority === "Low")||(priority === "low")){
      return blue;
    }
  }

  function Getlevel(){
    if(level === "Gold"){
      return gold;
    }
    else if(level === "Silver"){
      return silver;
    }
    else{
      return bronze;
    }
  }

  function GetButtonsTrue(){
    if(buttons === true){
      return "block";
    }else return "none"
  }

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the card itself
    const confirmRemove = window.confirm("Are you sure you want to remove this?");
    if (confirmRemove) {
      remove();
    }
  };

  return (
    <div className="cardContainer">
    <Box 
      className="blueCard" 
      sx={{ backgroundColor: '#e8f6ff', padding: 2, marginBottom: 2 }} 
      onClick={onClick}
    >
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 item>
          <img src={img} alt="img" />
        </Grid2>
        <Grid2 item>
          <h3>{name}</h3>
          <p>{first}</p>
          <p>{second}</p>
        </Grid2>
        <Grid2 item id="level" sx={{marginLeft:'auto' ,backgroundImage:`url(${Getlevel()})`}}>
        </Grid2>
        <Grid2 item  id="bookmark" sx={{ backgroundImage: `url(${Getpriority()})`, width: 80, height: 80, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}>
        </Grid2>
      </Grid2>
    </Box>
    <div id="cardButtons">
    <div id="edit" style={{display: GetButtonsTrue()}} onClick={edit}></div>
    <div id="remove" style={{display: GetButtonsTrue()}} onClick={handleRemove}></div>
    </div>
    </div>
  );
};

export default Card;
