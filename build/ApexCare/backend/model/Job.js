class Job {
    constructor(technician, client, title, description, address, status, priority) {
        this.technician = technician;
        this.client = client;
        this.title = title;
        this.description = description;
        this.address = address;
        this.status = status;
        this.priority = priority;
    }

    toString() {
        return `Job: ${this.title}\nTechnician: ${this.technician}\nClient: ${this.client}\nDescription: ${this.description}\nStatus: ${this.status}\nPriority: ${this.priority}`;
    }

    toJSON() {
        return {
            technician: this.technician,
            client: this.client,
            title: this.title,
            description: this.description,
            address: this.address,
            status: this.status,
            priority: this.priority
        };
    }
}

module.exports = Job;