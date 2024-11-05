class Client {
  constructor(clientID, name, email, phone, address, isKeyClient, clientType, password = null) {
    this.clientID = clientID;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.isKeyClient = isKeyClient;
    this.clientType = clientType;
    this.password = password;
  }

  toJSON() {
    return {
      ClientID: this.clientID,
      Name: this.name,
      Email: this.email,
      Phone: this.phone,
      Address: this.address,
      IsKeyClient: this.isKeyClient,
      ClientType: this.clientType
    };
  }
}

module.exports = Client;