const express = require('express');
const router = express.Router();
const ManageTechnicians = require('../../controller/ManageTechnicians');

const technicianManager = new ManageTechnicians();

//get technician based on TechnicianID
router.get('/technician/:id', async (req, res) => {
  try {
    const technician = await technicianManager.getTechnicianDetails(req.params.id);
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    return res.json(technician.toJSON());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Get all technicians
router.get('/Alltechnicians', async (req, res) => {
  try {
    const technicians = await technicianManager.getAllTechnicians();
    return res.json(technicians.map(tech => tech.toJSON()));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//get all distinct technician areas
router.get('/TechAreas', async (req, res) => {
  try {
      const result = await technicianManager.getTechnicianAreas();
      return res.json(result);
  } catch (err) {
      return res.status(500).json({ error: err.message });
  }
});

//add new technician
router.post('/technicians/add-technician', async (req, res) => {  
  try {
      const { name, email, contact, expertise, area } = req.body;
 
      if (!name || !contact || !expertise || !area) {
          const missingFields = [];
          if (!name) missingFields.push('Name');
          if (!email) missingFields.push('Email');
          if (!contact) missingFields.push('Contact');
          if (!expertise) missingFields.push('Expertise');
          if (!area) missingFields.push('Area');
          
          return res.status(400).json({
              error: `Missing required fields: ${missingFields.join(', ')}`
          });
      }

      if (name.length < 2) {
          return res.status(400).json({
              error: 'Name must be at least 2 characters long'
          });
      }
//email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({
              error: 'Please enter a valid email address'
          });
      }
//phone validation
      if (contact.length < 10) {
          return res.status(400).json({
              error: 'Contact number must be at least 10 digits'
          });
      }

      const inserted = await technicianManager.addNewTechnician(
          name,
          email,
          contact,
          expertise,
          area
      );

      if (inserted) {
          return res.status(201).json({ 
              message: 'Technician added successfully' 
          });
      } else {
          return res.status(500).json({ 
              error: 'Failed to add technician' 
          });
      }

  } catch (err) {
    console.error(err);
      if (err.number === 2627) {
          return res.status(400).json({
              error: 'This technician already exists in the system'
          });
      }

      return res.status(500).json({
          error: 'Error adding technician: ' + err.message
      });
  }
});

module.exports = router;