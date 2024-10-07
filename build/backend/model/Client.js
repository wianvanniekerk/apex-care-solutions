
class Client {
  constructor(name, email, password, address, keyClient) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.keyClient = keyClient;
    this.equipment = [];
    this.servicePackages = [];
    this.serviceHistories = [];
  }

  toString() {
  
  }
}