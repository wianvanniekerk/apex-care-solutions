
class ChatRequest extends ManageRequest {
  constructor(name, email, equipment, description) {
    super(name, email, "WhatsApp", equipment, description);
  }

  readFile() {
    
  }
}