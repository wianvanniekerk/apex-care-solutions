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
        const areasResult = await sql.query`
            SELECT DISTINCT Area
            FROM Technician
            WHERE Area IS NOT NULL
            ORDER BY Area
        `;

        const expertiseResult = await sql.query`
            SELECT DISTINCT Expertise
            FROM Technician
            WHERE Expertise IS NOT NULL
            ORDER BY Expertise
        `;

        return {
            areas: areasResult.recordset.map(row => row.Area),
            expertise: expertiseResult.recordset.map(row => row.Expertise)
        };
    } catch (error) {
        throw new Error('Error fetching technician areas: ' + error.message);
    }
  }

  async addNewTechnician(name, email, contact, expertise, area) {
    try {
        const result = await sql.query`
            INSERT INTO Technician (Name, Email, Phone, Expertise, Area)
            VALUES (${name}, ${email}, ${contact}, ${expertise}, ${area})
        `;
        return result.rowsAffected[0] > 0;
    } catch (error) {
        throw error;
    }
  }
}

module.exports = ManageTechnicians;