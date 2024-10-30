const request = require('supertest');
const express = require('express');
const fs = require('fs');
const authRoutes = require('../../routes/api/auth.routes');

jest.mock('fs');

describe('Authentication Routes', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        
        app = express();
        app.use(express.json());
        app.use('/', authRoutes);
    });

    describe('POST /login', () => {
        const mockEmployees = [
            {
                username: 'john.doe',
                password: 'password123'
            },
            {
                username: 'jane.smith',
                password: 'secret456'
            }
        ];

        beforeEach(() => {
            fs.readFile.mockReset();
        });

        it('should successfully authenticate with valid credentials', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, JSON.stringify(mockEmployees));
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe',
                    password: 'password123'
                })
                .expect(200);

            expect(response.body.message).toBe('Login Successful');
            expect(fs.readFile).toHaveBeenCalledWith(
                expect.stringContaining('employee.json'),
                'utf8',
                expect.any(Function)
            );
        });

        it('should reject invalid credentials', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, JSON.stringify(mockEmployees));
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.error).toBe('Invalid username or password');
        });

        it('should handle missing credentials', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, JSON.stringify(mockEmployees));
            });

            const response = await request(app)
                .post('/login')
                .send({})
                .expect(401);

            expect(response.body.error).toBe('Invalid username or password');
        });

        it('should handle partial credentials', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, JSON.stringify(mockEmployees));
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe'
                })
                .expect(401);

            expect(response.body.error).toBe('Invalid username or password');
        });

        it('should handle file system errors', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(new Error('File system error'), null);
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe',
                    password: 'password123'
                })
                .expect(500);

            expect(response.body).toEqual({ error: 'Error reading employee file' });
        });

        it('should handle malformed JSON in employee file', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, '{invalid json data');
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe',
                    password: 'password123'
                })
                .expect(500);

            expect(response.body).toEqual({ error: 'Error reading employee file' });
        });

        it('should handle empty employee file', async () => {
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, '[]');
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'john.doe',
                    password: 'password123'
                })
                .expect(401);

            expect(response.body.error).toBe('Invalid username or password');
        });
    });
});