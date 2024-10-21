const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sendSMS } = require('./API');
const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.get('/serviceAgreements', async (req,res) => {
    try{
        const result = await sql.query("SELECT Period, Equipment, Renew, ServiceCost, Description FROM ServiceAgreement WHERE ClientID = '2' AND Status = 'Active' OR Status = 'Pending'");
        return res.json(result.recordset);
    }catch (err){
        return res.json(err);
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