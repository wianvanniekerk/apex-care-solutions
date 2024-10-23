const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/getJobs', async(req,res) => {
    try{
      const result = await sql.query("SELECT j.JobID, j.Title, j.Description, j.Address, j.Status, j.Priority, t.Name FROM Job j INNER JOIN Technician t ON j.TechnicianID = t.TechnicianID ORDER BY j.JobID DESC");
      return res.json(result.recordset);
    }catch(err){
      return res.json(err);
    }
});
  
router.get('/JobStatus', async(req,res) => {
    try{
      const result = await sql.query("SELECT DISTINCT Status FROM Job");
      return res.json(result.recordset);
    }catch(err){
      return res.json(err);
    }
});
  
router.get('/JobPriority', async(req,res) => {
    try{
      const result = await sql.query("SELECT DISTINCT Priority FROM Job");
      return res.json(result.recordset);
    }catch(err){
      return res.json(err);
    }
});
  
router.get('/job/:id', async (req, res) => {
    const JobID = req.params.id;
  
    try {
      const result = await sql.query`SELECT j.JobID, j.Title, j.Description, j.Address, j.Status, j.Priority, t.Name FROM Job j INNER JOIN Technician t ON j.TechnicianID = t.TechnicianID WHERE JobID = ${JobID}`;
      return res.json(result.recordset[0]);
    } catch (err) {
      return res.json(err);
    }
});
  
router.delete('/job/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await sql.query`DELETE FROM Job WHERE JobID = ${id}`;
      if (result.rowsAffected[0] > 0) {
        res.json({ message: 'Job deleted successfully' });
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error deleting job' });
    }
});

module.exports = router;