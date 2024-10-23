const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('../backend/config/db.config');
const authRoutes = require('../backend/routes/api/auth.routes');
const clientRoutes = require('../backend/routes/api/client.routes');
const technicianRoutes = require('../backend/routes/api/technician.routes');
const serviceRoutes = require('../backend/routes/api/service.routes');
const jobRoutes = require('../backend/routes/api/job.routes');
const issueRoutes = require('../backend/routes/api/issue.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

sql.connect(dbConfig, (err) => {
  if(err){
      console.error('Error connecting to SQL Server: ', err);
  }else{
      console.log('Connected to SQL Server');
  }
});

app.use('/', authRoutes);
app.use('/', clientRoutes);
app.use('/', technicianRoutes);
app.use('/', serviceRoutes);
app.use('/', jobRoutes);
app.use('/', issueRoutes);
  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An Error Occured');
});

app.listen(8081, () => {
    console.log("listening");
});