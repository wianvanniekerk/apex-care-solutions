import React from "react";
import {  Checkbox, FormControlLabel } from '@mui/material';
import "../styles.css";

const FilterCheck = ({name, value, onChange, label }) => {
    return(
        <FormControlLabel control={<Checkbox name={name} value={value} onChange={onChange}/>} label={label}/>
    );
};

export default FilterCheck;