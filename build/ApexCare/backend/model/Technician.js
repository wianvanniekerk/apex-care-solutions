class Technician {
  constructor(name, technicianID, expertise, area, phone = null) {
    this.name = name;
    this.technicianID = technicianID;
    this.expertise = expertise;
    this.area = area;
    this.phone = phone;
  }

  toJSON() {
    return {
      TechnicianID: this.technicianID,
      Name: this.name,
      Expertise: this.expertise,
      Area: this.area,
      Phone: this.phone
    };
  }
}

module.exports = Technician;