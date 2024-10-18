const express = require('express');
const path = require('path');
const clientRoutes = require('./routes/api/clientRoutes');
const complaintRoutes = require('./routes/api/complaintRoutes');
const issueRoutes = require('./routes/api/issueRoutes');
const jobRoutes = require('./routes/api/jobRoutes');
const technicianRoutes = require('./routes/api/technicianRoutes');

const indexRoutes = require('./routes/pages/indexRoutes');

const app = express();

app.set('views', path.join(__dirname, '..', '..', 'build', 'frontend', 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Page Routes
app.use('/', indexRoutes);

// API Routes
app.use('/api', clientRoutes);
app.use('/api', complaintRoutes);
app.use('/api', issueRoutes);
app.use('/api', jobRoutes);
app.use('/api', technicianRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An Error Occured');
});

module.exports = app;