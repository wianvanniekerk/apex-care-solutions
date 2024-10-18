
class AppRequest extends ManageRequest {
  constructor(name, email, equipment, description) {
    super(name, email, "App", equipment, description);
  }

  getInfo() {
    
  }
}