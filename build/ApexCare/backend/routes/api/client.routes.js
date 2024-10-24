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

module.exports = router;