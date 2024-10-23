const express = require('express');
const fs = require('fs');
const router = express.Router();

const employeeFile = "./model/employee.json";

router.post("/login", (req, res) => {
    const {username, password} = req.body;
  
    fs.readFile(employeeFile, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({error: 'Error reading employee file'});
      }
      const employees = JSON.parse(data);
      const employee = employees.find(e => e.username === username && e.password === password);
  
      if(employee){
          res.json({message: 'Login Successful'});
      }else{
          res.status(401).json({error: 'Invalid username or password'});
      }
    });
});

module.exports = router;