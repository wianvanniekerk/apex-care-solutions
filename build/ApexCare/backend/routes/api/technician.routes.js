const express = require('express');
const router = express.Router();
const ManageTechnicians = require('../../controller/ManageTechnicians');

const technicianManager = new ManageTechnicians();

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

router.get('/Alltechnicians', async (req, res) => {
  try {
    const technicians = await technicianManager.getAllTechnicians();
    return res.json(technicians.map(tech => tech.toJSON()));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/TechAreas', async (req, res) => {
  try {
    const areas = await technicianManager.getTechnicianAreas();
    return res.json(areas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;