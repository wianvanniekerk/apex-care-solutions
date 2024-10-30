const express = require('express');
const router = express.Router();
const ManageClients = require('../../controller/ManageClients');

const clientManager = new ManageClients();

router.get('/getclients', async (req, res) => {
  try {
    const clients = await clientManager.getAllClients();
    return res.json(clients.map(client => client.toJSON()));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/clientIsKeyClient', async (req, res) => {
  try {
    const statuses = await clientManager.getKeyClientStatuses();
    return res.json(statuses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/Client/:id', async (req, res) => {
  try {
    const client = await clientManager.getClientDetails(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json(client.toJSON());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/Client/:id', async (req, res) => {
  try {
    const deleted = await clientManager.removeClient(req.params.id);
    if (deleted) {
      return res.json({ message: 'Client deleted successfully' });
    }
    return res.status(404).json({ message: 'Client not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/client-management/add-client', async (req, res) => {  
  try {
      const { name, email, address, contact, isKeyClient, password } = req.body;
    
      if (!name || !email || !address || !contact) {
          return res.status(400).json({ 
              error: 'All fields are required',
              receivedData: req.body 
          });
      }

      const inserted = await clientManager.addNewClient(
          name, 
          email, 
          address, 
          contact, 
          isKeyClient,
          password
      );

      if (inserted) {
          return res.status(201).json({ message: 'Client added successfully' });
      } else {
          return res.status(500).json({ error: 'Failed to add client' });
      }
  } catch (err) {
      return res.status(500).json({ 
          error: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
  }
});

module.exports = router;