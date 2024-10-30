const request = require('supertest');
const express = require('express');
const ManageTechnicians = require('../../controller/ManageTechnicians');
const technicianRoutes = require('../../routes/api/technician.routes');

jest.mock('../../controller/ManageTechnicians');

describe('Technician Routes', () => {
    let app;
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();

        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        app = express();
        app.use(express.json());
        app.use('/', technicianRoutes);

        ManageTechnicians.mockClear();
    });

    describe('GET /technician/:id', () => {
        it('should return technician details for valid ID', async () => {
            const mockTechnician = {
                toJSON: () => ({
                    id: 1,
                    name: 'John Smith',
                    email: 'john@example.com',
                    contact: '1234567890',
                    expertise: 'Network Specialist',
                    area: 'North'
                })
            };

            ManageTechnicians.prototype.getTechnicianDetails.mockResolvedValueOnce(mockTechnician);

            const response = await request(app)
                .get('/technician/1')
                .expect(200);

            expect(response.body.name).toBe('John Smith');
            expect(ManageTechnicians.prototype.getTechnicianDetails).toHaveBeenCalledWith('1');
        });

        it('should return 404 for non-existent technician', async () => {
            ManageTechnicians.prototype.getTechnicianDetails.mockResolvedValueOnce(null);

            const response = await request(app)
                .get('/technician/999')
                .expect(404);

            expect(response.body.error).toBe('Technician not found');
        });

        it('should handle errors', async () => {
            ManageTechnicians.prototype.getTechnicianDetails.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/technician/1')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /Alltechnicians', () => {
        it('should return all technicians', async () => {
            const mockTechnicians = [
                {
                    toJSON: () => ({
                        id: 1,
                        name: 'John Smith',
                        expertise: 'Network Specialist'
                    })
                },
                {
                    toJSON: () => ({
                        id: 2,
                        name: 'Jane Doe',
                        expertise: 'Plumbing'
                    })
                }
            ];

            ManageTechnicians.prototype.getAllTechnicians.mockResolvedValueOnce(mockTechnicians);

            const response = await request(app)
                .get('/Alltechnicians')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe('John Smith');
            expect(response.body[1].name).toBe('Jane Doe');
        });

        it('should handle errors', async () => {
            ManageTechnicians.prototype.getAllTechnicians.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/Alltechnicians')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /TechAreas', () => {
        it('should return technician areas and expertise', async () => {
            const mockAreas = {
                areas: ['North Side', 'Downtown'],
                expertise: ['Network Specialist', 'Software Installation']
            };

            ManageTechnicians.prototype.getTechnicianAreas.mockResolvedValueOnce(mockAreas);

            const response = await request(app)
                .get('/TechAreas')
                .expect(200);

            expect(response.body.areas).toEqual(['North Side', 'Downtown']);
            expect(response.body.expertise).toEqual(['Network Specialist', 'Software Installation']);
        });

        it('should handle errors', async () => {
            ManageTechnicians.prototype.getTechnicianAreas.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/TechAreas')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /technicians/add-technician', () => {
        const validTechnician = {
            name: 'John Smith',
            email: 'john@example.com',
            contact: '1234567890',
            expertise: 'HVAC',
            area: 'North'
        };

        it('should add a new technician with valid data', async () => {
            ManageTechnicians.prototype.addNewTechnician.mockResolvedValueOnce(true);

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(validTechnician)
                .expect(201);

            expect(response.body.message).toBe('Technician added successfully');
        });

        it('should validate missing required fields', async () => {
            const invalidData = {
                name: 'John Smith'
                // missing other required fields
            };

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toContain('Missing required fields');
        });

        it('should validate name length', async () => {
            const invalidData = {
                ...validTechnician,
                name: 'J'
            };

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toBe('Name must be at least 2 characters long');
        });

        it('should validate email format', async () => {
            const invalidData = {
                ...validTechnician,
                email: 'invalid-email'
            };

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toBe('Please enter a valid email address');
        });

        it('should validate contact number length', async () => {
            const invalidData = {
                ...validTechnician,
                contact: '123'
            };

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toBe('Contact number must be at least 10 digits');
        });

        it('should handle duplicate technician error', async () => {
            const error = new Error('Duplicate entry');
            error.number = 2627;
            
            ManageTechnicians.prototype.addNewTechnician.mockRejectedValueOnce(error);

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(validTechnician)
                .expect(400);

            expect(response.body.error).toBe('This technician already exists in the system');
        });

        it('should handle general errors', async () => {
            ManageTechnicians.prototype.addNewTechnician.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(validTechnician)
                .expect(500);

            expect(response.body.error).toContain('Error adding technician');
        });

        it('should handle insertion failure', async () => {
            ManageTechnicians.prototype.addNewTechnician.mockResolvedValueOnce(false);

            const response = await request(app)
                .post('/technicians/add-technician')
                .send(validTechnician)
                .expect(500);

            expect(response.body.error).toBe('Failed to add technician');
        });
    });
});