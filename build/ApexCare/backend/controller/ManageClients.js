const sql = require('mssql');
const Client = require('../model/Client');

class ManageClients {
  async getClientDetails(clientId) {
    try {
      const result = await sql.query`
        SELECT ClientID, Name, Email, Phone, Address, IsKeyClient 
        FROM Client 
        WHERE ClientID = ${clientId}
      `;
      
      if (result.recordset[0]) {
        const client = result.recordset[0];
        return new Client(
          client.ClientID,
          client.Name,
          client.Email,
          client.Phone,
          client.Address,
          client.IsKeyClient
        );
      }
      return null;
    } catch (error) {
      throw new Error('Error fetching client details: ' + error.message);
    }
  }

  async getAllClients() {
    try {
      const result = await sql.query`
        SELECT ClientID, Name, Email, Phone, Address, IsKeyClient 
        FROM Client
      `;

      return result.recordset.map(client => new Client(
        client.ClientID,
        client.Name,
        client.Email,
        client.Phone,
        client.Address,
        client.IsKeyClient
      ));
    } catch (error) {
      throw new Error('Error fetching all clients: ' + error.message);
    }
  }

  async getKeyClientStatuses() {
    try {
      const result = await sql.query`
        SELECT DISTINCT IsKeyClient 
        FROM Client
      `;
      return result.recordset;
    } catch (error) {
      throw new Error('Error fetching key client statuses: ' + error.message);
    }
  }

  async removeClient(clientId) {
    try {
      const result = await sql.query`
        DELETE FROM Client 
        WHERE ClientID = ${clientId}
      `;
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error('Error removing client: ' + error.message);
    }
  }

  async addNewClient(name, email, address, contact, isKeyClient, password) {
    try {
        const existingClient = await sql.query`
            SELECT ClientID FROM Client 
            WHERE Email = ${email}
        `;
        
        if (existingClient.recordset.length > 0) {
            throw new Error('A client with this email already exists');
        }

        const result = await sql.query`
            INSERT INTO Client (Name, Email, Phone, Address, IsKeyClient, Password)
            VALUES (${name}, ${email}, ${contact}, ${address}, ${isKeyClient}, ${password})
        `;
        return result.rowsAffected[0] > 0;
    } catch (error) {
        throw error;
    }
}
}

module.exports = ManageClients;