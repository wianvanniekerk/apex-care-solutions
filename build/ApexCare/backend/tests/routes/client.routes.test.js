const request = require('supertest');
const express = require('express');
const ManageClients = require('../../controller/ManageClients');
const clientRoutes = require('../../routes/api/client.routes');

jest.mock('../../controller/ManageClients');

describe('Client Routes', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        
        app = express();
        app.use(express.json());
        app.use('/', clientRoutes);
    });

    describe('GET /getclients', () => {
        it('should return all clients', async () => {
            const mockClients = [
                { id: 1, name: 'John Doe', email: 'john@example.com', isKeyClient: 1 },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', isKeyClient: 0 }
            ];

            ManageClients.prototype.getAllClients.mockResolvedValue(
                mockClients.map(client => ({
                    toJSON: () => client
                }))
            );

            const response = await request(app)
                .get('/getclients')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe('John Doe');
            expect(response.body[0].isKeyClient).toBe(1);
            expect(response.body[1].isKeyClient).toBe(0);
        });

        it('should handle errors', async () => {
            ManageClients.prototype.getAllClients.mockRejectedValue(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/getclients')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /Client/:id', () => {
        it('should return client details for valid ID', async () => {
            const mockClient = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                isKeyClient: 1,
                toJSON: () => ({
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    isKeyClient: 1
                })
            };

            ManageClients.prototype.getClientDetails.mockResolvedValue(mockClient);

            const response = await request(app)
                .get('/Client/1')
                .expect(200);

            expect(response.body.name).toBe('John Doe');
            expect(response.body.isKeyClient).toBe(1);
        });

        it('should return 404 for non-existent client', async () => {
            ManageClients.prototype.getClientDetails.mockResolvedValue(null);

            const response = await request(app)
                .get('/Client/999')
                .expect(404);

            expect(response.body.error).toBe('Client not found');
        });
    });

    describe('DELETE /Client/:id', () => {
        it('should delete existing client', async () => {
            ManageClients.prototype.removeClient.mockResolvedValue(true);

            const response = await request(app)
                .delete('/Client/1')
                .expect(200);

            expect(response.body.message).toBe('Client deleted successfully');
        });

        it('should return 404 for non-existent client', async () => {
            ManageClients.prototype.removeClient.mockResolvedValue(false);

            const response = await request(app)
                .delete('/Client/999')
                .expect(404);

            expect(response.body.message).toBe('Client not found');
        });
    });

    describe('POST /client-management/add-client', () => {
        it('should add a new client with valid data', async () => {
            const validClient = {
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Street',
                contact: '1234567890',
                isKeyClient: 1,
                password: 'password123'
            };

            ManageClients.prototype.addNewClient.mockResolvedValue(true);

            const response = await request(app)
                .post('/client-management/add-client')
                .send(validClient)
                .expect(201);

            expect(response.body.message).toBe('Client added successfully');
        });

        it('should validate missing required fields', async () => {
            const invalidClient = {
                name: 'John Doe',
            };

            const response = await request(app)
                .post('/client-management/add-client')
                .send(invalidClient)
                .expect(400);

            expect(response.body.error).toContain('Missing required fields');
        });

        it('should validate name length', async () => {
            const invalidClient = {
                name: 'J',
                email: 'john@example.com',
                address: '123 Street',
                contact: '1234567890',
                isKeyClient: 1,
                password: 'password123'
            };

            const response = await request(app)
                .post('/client-management/add-client')
                .send(invalidClient)
                .expect(400);

            expect(response.body.error).toBe('Name must be at least 2 characters long');
        });

        it('should validate email format', async () => {
            const invalidClient = {
                name: 'John Doe',
                email: 'invalid-email',
                address: '123 Street',
                contact: '1234567890',
                isKeyClient: 1,
                password: 'password123'
            };

            const response = await request(app)
                .post('/client-management/add-client')
                .send(invalidClient)
                .expect(400);

            expect(response.body.error).toBe('Please enter a valid email address');
        });

        it('should validate contact number length', async () => {
            const invalidClient = {
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Street',
                contact: '123',
                isKeyClient: 1,
                password: 'password123'
            };

            const response = await request(app)
                .post('/client-management/add-client')
                .send(invalidClient)
                .expect(400);

            expect(response.body.error).toBe('Contact number must be at least 10 digits');
        });

        it('should handle duplicate email error', async () => {
            const validClient = {
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Street',
                contact: '1234567890',
                isKeyClient: 1,
                password: 'password123'
            };

            ManageClients.prototype.addNewClient.mockRejectedValue(
                new Error('email already exists')
            );

            const response = await request(app)
                .post('/client-management/add-client')
                .send(validClient)
                .expect(400);

            expect(response.body.error).toBe('A client with this email already exists');
        });

        it('should handle general server errors', async () => {
            const validClient = {
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Street',
                contact: '1234567890',
                isKeyClient: 1,
                password: 'password123'
            };

            ManageClients.prototype.addNewClient.mockRejectedValue(
                new Error('Database error')
            );

            const response = await request(app)
                .post('/client-management/add-client')
                .send(validClient)
                .expect(500);

            expect(response.body.error).toBe('Unable to add client. Please try again.');
        });
    });
});