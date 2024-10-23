const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { sendSMS } = require('./API');
const app = express();

app.use(cors());
app.use(bodyParser.json());

//Employee Login

const employeeFile = "./model/employee.json";

app.post("/login", (req, res) => {
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

//Database
const dbConfig = {
    user: 'wianvanniekerk_SQLLogin_1',
    password: 'bcfhki81fg',
    server: 'ApexCare.mssql.somee.com', // Server address
    database: 'ApexCare',
    options: {
      encrypt: true, // For Azure SQL Database
      enableArithAbort: true,
      trustServerCertificate: true // Trust the self-signed certificate
    }
};

sql.connect(dbConfig, (err) => {
    if(err){
        console.error('Error connecting to SQL Server: ', err);
    }else{
        console.log('Connected to SQL Server');
    }
});

app.get('/', (req, res) => {
    return res.json("From Backend Side");
  });

app.get('/clients', async (req,res)=>{
    try{
        const result = await sql.query("SELECT ClientID, Name, Email, Phone, Address, IsKeyClient FROM Client WHERE ClientID = '2'");  //client ID needs to be handled
        return res.json(result.recordset);
    }
    catch (err){
        return res.json(err);
    }
});

app.get('/getclients', async (req,res)=>{
  try{
      const result = await sql.query("SELECT ClientID, Name, Email, Phone, Address, IsKeyClient FROM Client"); 
      return res.json(result.recordset);
  }
  catch (err){
      return res.json(err);
  }
});

app.get('/clientIsKeyClient', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT IsKeyClient FROM Client");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/Client/:id', async (req, res) => {
  const ClientID = req.params.id;

  try {
    const result = await sql.query`SELECT * FROM Client WHERE ClientID = ${ClientID}`;
    return res.json(result.recordset[0]);
  } catch (err) {
    return res.json(err);
  }
});

app.delete('/Client/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`DELETE FROM Client WHERE ClientID = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting client' });
  }
});


app.get('/technicians', async (req,res)=>{
    try{
        const result = await sql.query("SELECT TechnicianID,Name, Expertise, Phone, Area FROM Technician WHERE TechnicianID = '2'"); //technician ID needs to be handled
        return res.json(result.recordset);
    }
    catch (err){
        return res.json(err);
    }
});

app.get('/technician/:id', async (req, res) => {
    const TechnicianID = req.params.id;
  
    try {
      const result = await sql.query`SELECT * FROM Technician WHERE TechnicianID = ${TechnicianID}`;
      return res.json(result.recordset[0]);
    } catch (err) {
      return res.json(err);
    }
  });

app.get('/Alltechnicians', async (req,res)=>{
    try{
        const result = await sql.query("SELECT TechnicianID,Name, Expertise, Phone, Area FROM Technician"); 
        return res.json(result.recordset);
    }
    catch (err){
        return res.json(err);
    }
});

app.get('/TechAreas', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Area, Expertise FROM Technician");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});



app.get('/serviceAgreements', async (req,res) => {
    try{
        const result = await sql.query("SELECT Period, Equipment, Renew, ServiceCost, Description FROM ServiceAgreement WHERE ClientID = '2' AND Status = 'Active' OR Status = 'Pending'");
        return res.json(result.recordset);
    }catch (err){
        return res.json(err);
    }
});

app.get('/getService', async(req,res) => {
  try{
    const result = await sql.query("SELECT * FROM ServiceAgreement ");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/ServiceStatus', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Status FROM ServiceAgreement");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/ServiceRenew', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Renew FROM ServiceAgreement");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/service/:id', async (req, res) => {
  const AgreementID = req.params.id;

  try {
    const result = await sql.query`SELECT * FROM ServiceAgreement WHERE AgreementID = ${AgreementID}`;
    return res.json(result.recordset[0]);
  } catch (err) {
    return res.json(err);
  }
});

app.get('/getJobs', async(req,res) => {
  try{
    const result = await sql.query("SELECT j.JobID, j.Title, j.Description, j.Address, j.Status, j.Priority, t.Name FROM Job j INNER JOIN Technician t ON j.TechnicianID = t.TechnicianID ");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/JobStatus', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Status FROM Job");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/JobPriority', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Priority FROM Job");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

app.get('/job/:id', async (req, res) => {
  const JobID = req.params.id;

  try {
    const result = await sql.query`SELECT j.JobID, j.Title, j.Description, j.Address, j.Status, j.Priority, t.Name FROM Job j INNER JOIN Technician t ON j.TechnicianID = t.TechnicianID WHERE JobID = ${JobID}`;
    return res.json(result.recordset[0]);
  } catch (err) {
    return res.json(err);
  }
});

app.delete('/job/:id', async (req, res) => {
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

app.post('/add-job', async (req, res) => {
    const { TechnicianID, ClientID, Title, Description, Address, Status, Priority } = req.body;
    const smsText = `New job: \nTitle: ${Title}\nDescription: ${Description}\nAddress: ${Address}\nPriority: ${Priority}`

    if (!TechnicianID || !ClientID || !Title || !Description || !Address || !Status || !Priority) {
        return res.status(400).json({ error: "All fields are required" });
      }


    try {
      const result = await sql.query`
        INSERT INTO Job (TechnicianID, ClientID, Title, Description, Address, Status, Priority)
        VALUES (${TechnicianID}, ${ClientID}, ${Title}, ${Description}, ${Address}, ${Status}, ${Priority})
      `;
      //comment this out if you want to test with the db and not send sms's the whole time and exceed our limit of sms's on the free version of Vonage
      //await sendSMS(smsText);   //send sms
      res.json({ message: `Job added successfully ${Title}`, job: result });
    } catch (err) {
      res.json(err);
    }
});
  

app.listen(8081, () => {
    console.log("listening");
});