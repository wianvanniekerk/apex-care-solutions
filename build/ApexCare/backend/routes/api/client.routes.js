const express = require("express");
const router = express.Router();
const sql = require('mssql');
const ManageClients = require("../../controller/ManageClients");

const clientManager = new ManageClients();

router.get("/getclients", async (req, res) => {
  try {
    const clients = await clientManager.getAllClients();
    return res.json(clients.map((client) => client.toJSON()));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/clientIsKeyClient", async (req, res) => {
  try {
    const statuses = await clientManager.getKeyClientStatuses();
    return res.json(statuses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/Client/:id", async (req, res) => {
  try {
    const client = await clientManager.getClientDetails(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json(client.toJSON());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/Client/:id", async (req, res) => {
  try {
    const deleted = await clientManager.removeClient(req.params.id);
    if (deleted) {
      return res.json({ message: "Client deleted successfully" });
    }
    return res.status(404).json({ message: "Client not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/update-client/:id", async (req, res) => {
  const { id } = req.params;
  const { Name, Address, Email, Phone, isKeyClient, ClientType } = req.body;

  if (
    !Name ||
    !Email ||
    !Address ||
    isKeyClient == null ||
    !Phone ||
    !ClientType
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Request Body:", req.body);

  try {
    const result = await sql.query`
                UPDATE Client SET Name = ${Name}, Email = ${Email}, Address = ${Address}, isKeyClient = ${isKeyClient}, Phone = ${Phone}, ClientType = ${ClientType}  WHERE ClientID = ${id}`;

    console.log("SQL Query Result:", result);
    
    if (result.rowsAffected[0] > 0) {
      res.json({ message: "Client updated successfully" });
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (err) {
    console.error("Error during SQL query:", err);
    res.status(500).json({ error: 'Error updating Client', details: err.message });
  }
});

router.post("/client-management/add-client", async (req, res) => {
  try {
    const { name, email, address, contact, isKeyClient, clientType, password } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!address) missingFields.push("Address");
    if (!contact) missingFields.push("Contact");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        error: "Name must be at least 2 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    const inserted = await clientManager.addNewClient(
      name,
      email,
      address,
      contact,
      isKeyClient,
      clientType,
      password
    );

    if (inserted) {
      return res.status(201).json({
        message: "Client added successfully",
      });
    }
  } catch (err) {
    console.error("Error during client creation:", err.message);
    if (err.message.includes("email already exists")) {
      return res.status(400).json({
        error: "A client with this email already exists",
      });
    }

    return res.status(500).json({
      error: "Unable to add client. Please try again.",
    });
  }
});

module.exports = router;
