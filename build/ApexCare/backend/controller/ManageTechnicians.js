const sql = require('mssql');
const Technician = require('../model/Technician');

class ManageTechnicians {
  async getTechnicianDetails(technicianId) {
    try {
      const result = await sql.query`
        SELECT TechnicianID, Name, Expertise, Phone, Area 
        FROM Technician 
        WHERE TechnicianID = ${technicianId}
      `;
      
      if (result.recordset[0]) {
        const tech = result.recordset[0];
        return new Technician(
          tech.Name,
          tech.TechnicianID,
          tech.Expertise,
          tech.Area,
          tech.Phone
        );
      }
      return null;
    } catch (error) {
      throw new Error('Error fetching technician details: ' + error.message);
    }
  }

  async getAllTechnicians() {
    try {
      const result = await sql.query`
        SELECT TechnicianID, Name, Expertise, Phone, Area 
        FROM Technician
      `;
      
      return result.recordset.map(tech => new Technician(
        tech.Name,
        tech.TechnicianID,
        tech.Expertise,
        tech.Area,
        tech.Phone
      ));
    } catch (error) {
      throw new Error('Error fetching all technicians: ' + error.message);
    }
  }

  async getTechnicianAreas() {
    try {
      const result = await sql.query`
        SELECT DISTINCT Area, Expertise 
        FROM Technician
      `;
      return result.recordset;
    } catch (error) {
      throw new Error('Error fetching technician areas: ' + error.message);
    }
  }
}

module.exports = ManageTechnicians;