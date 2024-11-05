const sql = require('mssql');
const Client = require('../model/Client');

class ManageClients {
    async addNewClient(name, email, address, contact, isKeyClient, ClientType, password) {
        try {
            const result = await sql.query`
                INSERT INTO Client (Name, Email, Phone, Address, IsKeyClient, ClientType, Password)
                VALUES (${name}, ${email}, ${contact}, ${address}, ${isKeyClient}, ${ClientType}, ${password})
            `;
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error adding new client:", error.message);
            throw new Error('Error adding new client: ' + error.message);
        }
    }

    async getAllClients() {
        try {
            const result = await sql.query`
                SELECT ClientID, Name, Email, Phone, Address, IsKeyClient, ClientType
                FROM Client
            `;
            return result.recordset.map(client => new Client(
                client.ClientID,
                client.Name,
                client.Email,
                client.Phone,
                client.Address,
                client.IsKeyClient,
                client.ClientType
            ));
        } catch (error) {
            throw new Error('Error fetching all clients: ' + error.message);
        }
    }

    async getClientDetails(clientId) {
        try {
            const result = await sql.query`
                SELECT ClientID, Name, Email, Phone, Address, IsKeyClient, ClientType
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
                    client.IsKeyClient,
                    client.ClientType
                );
            }
            return null;
        } catch (error) {
            throw new Error('Error fetching client details: ' + error.message);
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
}

module.exports = ManageClients;