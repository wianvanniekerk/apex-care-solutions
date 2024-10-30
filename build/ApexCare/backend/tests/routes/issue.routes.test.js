const request = require('supertest');
const express = require('express');
const ManageJobs = require('../../controller/ManageJobs');
const { sendSMS } = require('../../services/VonageAPI');
const issueRoutes = require('../../routes/api/issue.routes');

jest.mock('../../controller/ManageJobs');
jest.mock('../../services/VonageAPI');

describe('Jobs Routes', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        
        app = express();
        app.use(express.json());
        app.use('/', issueRoutes);

        ManageJobs.mockClear();
    });

    describe('GET /clients/:id', () => {
        it('should return client details for valid ID', async () => {
            const mockClient = {
                ClientID: 1,
                Name: 'John Doe',
                Email: 'john@example.com'
            };

            ManageJobs.prototype.getClientDetails.mockResolvedValueOnce(mockClient);

            const response = await request(app)
                .get('/clients/1')
                .expect(200);

            expect(response.body).toEqual(mockClient);
            expect(ManageJobs.prototype.getClientDetails).toHaveBeenCalledWith('1');
        });

        it('should handle errors when fetching client details', async () => {
            ManageJobs.prototype.getClientDetails.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/clients/1')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /technicians/:id', () => {
        it('should return technician details for valid ID', async () => {
            const mockTechnician = {
                TechnicianID: 1,
                Name: 'Jane Smith',
                Expertise: 'Server Expert'
            };

            ManageJobs.prototype.getTechnicianDetails.mockResolvedValueOnce(mockTechnician);

            const response = await request(app)
                .get('/technicians/1')
                .expect(200);

            expect(response.body).toEqual(mockTechnician);
            expect(ManageJobs.prototype.getTechnicianDetails).toHaveBeenCalledWith('1');
        });

        it('should handle errors when fetching technician details', async () => {
            ManageJobs.prototype.getTechnicianDetails.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/technicians/1')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /serviceAgreements/:id', () => {
        it('should return service agreements for valid client ID', async () => {
            const mockAgreements = {
                Period: '12 months',
                Equipment: 'Server',
                Renew: true
            };

            ManageJobs.prototype.getServiceAgreements.mockResolvedValueOnce(mockAgreements);

            const response = await request(app)
                .get('/serviceAgreements/1')
                .expect(200);

            expect(response.body).toEqual(mockAgreements);
            expect(ManageJobs.prototype.getServiceAgreements).toHaveBeenCalledWith('1');
        });

        it('should handle errors when fetching service agreements', async () => {
            ManageJobs.prototype.getServiceAgreements.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .get('/serviceAgreements/1')
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /add-job', () => {
        const validJobData = {
            TechnicianID: 1,
            ClientID: 1,
            Title: 'Fix Server',
            Description: 'Repair broken Server unit',
            Address: '123 Main St',
            Status: 'Pending',
            Priority: 'High'
        };

        it('should create a new job with valid data', async () => {
            const mockNewJob = {
                jobId: 1,
                ...validJobData
            };

            ManageJobs.prototype.createJob.mockResolvedValueOnce(mockNewJob);
            sendSMS.mockResolvedValueOnce({ success: true });

            const response = await request(app)
                .post('/add-job')
                .send(validJobData)
                .expect(200);

            expect(response.body.message).toBe('Job added successfully: Fix Server');
            expect(response.body.job).toEqual(mockNewJob);
            expect(sendSMS).not.toHaveBeenCalled();
        });

        it('should validate required fields', async () => {
            const invalidData = {
                TechnicianID: 1,
                ClientID: 1
            };

            const response = await request(app)
                .post('/add-job')
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toBe('All fields are required');
            expect(ManageJobs.prototype.createJob).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            ManageJobs.prototype.createJob.mockRejectedValueOnce(
                new Error('Database error')
            );

            const response = await request(app)
                .post('/add-job')
                .send(validJobData)
                .expect(500);

            expect(response.body.error).toBe('Database error');
        });
    });
});