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
      const result = await sql.query`SELECT j.JobID, j.ClientID, j.TechnicianID , j.Title, j.Description, j.Address, j.Status, j.Priority, j.Equipment, t.Name FROM Job j INNER JOIN Technician t ON j.TechnicianID = t.TechnicianID WHERE JobID = ${JobID}`;
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


router.put('/update-job/:id', async (req, res) => {
  const { id } = req.params;
  const { TechnicianID, ClientID, Title, Description, Address, Status, Priority, Equipment } = req.body;

  // Log the received request body for debugging
  console.log("Request body:", req.body);

  // Validate all required fields
  if (!TechnicianID || !ClientID || !Title || !Description || !Address || !Status || !Priority || !Equipment) {
    const missingFields = [];
    if (!TechnicianID) missingFields.push("TechnicianID");
    if (!ClientID) missingFields.push("ClientID");
    if (!Title) missingFields.push("Title");
    if (!Description) missingFields.push("Description");
    if (!Address) missingFields.push("Address");
    if (!Status) missingFields.push("Status");
    if (!Priority) missingFields.push("Priority");
    if (!Equipment) missingFields.push("Equipment");
    
    console.error("Missing required fields:", missingFields.join(", "));
    
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    const result = await sql.query`
      UPDATE Job
      SET TechnicianID = ${TechnicianID},
          ClientID = ${ClientID},
          Title = ${Title},
          Description = ${Description},
          Address = ${Address},
          Status = ${Status},
          Priority = ${Priority},
          Equipment = ${Equipment}
      WHERE JobID = ${id}`;

    console.log("SQL Query Result:", result);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Job updated successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (err) {
    console.error("Error during SQL query:", err);
    res.status(500).json({ error: 'Error updating job', details: err.message });
  }
});




module.exports = router;