const sql = require('mssql');
const Job = require('../model/Job');

class ManageJobs {
    constructor() {
        this.jobs = null;
    }

    //get Technician details for specific technician
    async getTechnicianDetails(technicianId) {
        try {
            const result = await sql.query`
                SELECT TechnicianID, Name, Expertise, Phone, Area 
                FROM Technician 
                WHERE TechnicianID = ${technicianId}
            `;
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error fetching technician details: ' + error.message);
        }
    }

    //get Client details for specific client
    async getClientDetails(clientId) {
        try {
            const result = await sql.query`
                SELECT ClientID, Name, Email, Phone, Address, IsKeyClient, ClientType 
                FROM Client 
                WHERE ClientID = ${clientId}
            `;
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error fetching client details: ' + error.message);
        }
    }

    //get ServiceAgreements for specific Client
    async getServiceAgreements(clientId) {
        try {
            const result = await sql.query`
                SELECT Period, Equipment, Renew, ServiceCost, Description 
                FROM ServiceAgreement 
                WHERE ClientID = ${clientId}
                AND Status = 'Active' 
                OR Status = 'Pending'
            `;
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error fetching service agreements: ' + error.message);
        }
    }

    //add new Job
    async createJob(jobData) {
        try {
            const { technician, client, title, description, address, status, priority, equipment } = jobData;
            const job = new Job(technician, client, title, description, address, status, priority, equipment);
            
            const result = await sql.query`
                INSERT INTO Job (TechnicianID, ClientID, Title, Description, Address, Status, Priority, Equipment)
                OUTPUT INSERTED.JobID
                VALUES (${technician}, ${client}, ${title}, ${description}, ${address}, ${status}, ${priority}, ${equipment})
            `;
            
            return { ...job.toJSON(), jobId: result.recordset[0].JobID };
        } catch (error) {
            throw new Error('Error creating job: ' + error.message);
        }
    }

   
}

module.exports = ManageJobs;