
class EmailRequest extends ManageRequest {
  constructor(name, email, equipment, description) {
    super(name, email, "Email", equipment, description);
  }

  readFile() {
    
  }
}