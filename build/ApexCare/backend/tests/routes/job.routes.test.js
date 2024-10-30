const request = require('supertest');
const express = require('express');
const sql = require('mssql');
const jobRoutes = require('../../routes/api/job.routes');

jest.mock('mssql', () => ({
    query: jest.fn()
}));

describe('Job Query Routes', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());
        app.use('/', jobRoutes);
    });

    describe('GET /getJobs', () => {
        it('should return all jobs with technician details', async () => {
            const mockJobs = [
                {
                    JobID: 1,
                    Title: 'Fix Server',
                    Description: 'Repair Server unit',
                    Address: '123 Main St',
                    Status: 'Pending',
                    Priority: 'High',
                    Name: 'John Smith'
                }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockJobs
            });

            const response = await request(app)
                .get('/getJobs')
                .expect(200);

            expect(response.body).toEqual(mockJobs);
            expect(sql.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT j.JobID, j.Title')
            );
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/getJobs')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /JobStatus', () => {
        it('should return distinct job statuses', async () => {
            const mockStatuses = [
                { Status: 'Pending' },
                { Status: 'In Progress' },
                { Status: 'Completed' }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockStatuses
            });

            const response = await request(app)
                .get('/JobStatus')
                .expect(200);

            expect(response.body).toEqual(mockStatuses);
            expect(sql.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT DISTINCT Status')
            );
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/JobStatus')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /JobPriority', () => {
        it('should return distinct job priorities', async () => {
            const mockPriorities = [
                { Priority: 'High' },
                { Priority: 'Medium' },
                { Priority: 'Low' }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockPriorities
            });

            const response = await request(app)
                .get('/JobPriority')
                .expect(200);

            expect(response.body).toEqual(mockPriorities);
            expect(sql.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT DISTINCT Priority')
            );
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/JobPriority')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /job/:id', () => {
        it('should return job details for valid ID', async () => {
            const mockJob = {
                JobID: 1,
                Title: 'Fix Server',
                Description: 'Repair Server unit',
                Address: '123 Main St',
                Status: 'Pending',
                Priority: 'High',
                Name: 'John Smith'
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockJob]
            });

            const response = await request(app)
                .get('/job/1')
                .expect(200);

            expect(response.body).toEqual(mockJob);
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/job/1')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('DELETE /job/:id', () => {
        it('should delete existing job', async () => {
            sql.query.mockResolvedValueOnce({
                rowsAffected: [1]
            });

            const response = await request(app)
                .delete('/job/1')
                .expect(200);

            expect(response.body).toEqual({ message: 'Job deleted successfully' });
        });

        it('should return 404 for non-existent job', async () => {
            sql.query.mockResolvedValueOnce({
                rowsAffected: [0]
            });

            const response = await request(app)
                .delete('/job/999')
                .expect(404);

            expect(response.body).toEqual({ message: 'Job not found' });
        });

        it('should handle database errors', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .delete('/job/1')
                .expect(500);

            expect(response.body).toEqual({ error: 'Error deleting job' });
        });
    });
});