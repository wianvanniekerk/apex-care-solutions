const request = require('supertest');
const express = require('express');
const sql = require('mssql');
const serviceRoutes = require('../../routes/api/service.routes');

jest.mock('mssql', () => ({
    query: jest.fn()
}));

describe('Service Agreement Routes', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        
        app = express();
        app.use(express.json());
        app.use('/', serviceRoutes);
    });

    describe('GET /getService', () => {
        it('should return all service agreements', async () => {
            const mockServices = [
                {
                    AgreementID: 1,
                    ClientID: 1,
                    Period: '12 months',
                    Equipment: 'System Hardware',
                    Status: 'Active',
                    Renew: true,
                    ServiceCost: 1000,
                    Description: 'Annual maintenance'
                }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockServices
            });

            const response = await request(app)
                .get('/getService')
                .expect(200);

            expect(response.body).toEqual(mockServices);
            expect(sql.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM ServiceAgreement')
            );
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/getService')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /ServiceStatus', () => {
        it('should return distinct service statuses', async () => {
            const mockStatuses = [
                { Status: 'Active' },
                { Status: 'Pending' },
                { Status: 'Expired' }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockStatuses
            });

            const response = await request(app)
                .get('/ServiceStatus')
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
                .get('/ServiceStatus')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /ServiceRenew', () => {
        it('should return distinct renew values', async () => {
            const mockRenewValues = [
                { Renew: true },
                { Renew: false }
            ];

            sql.query.mockResolvedValueOnce({
                recordset: mockRenewValues
            });

            const response = await request(app)
                .get('/ServiceRenew')
                .expect(200);

            expect(response.body).toEqual(mockRenewValues);
            expect(sql.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT DISTINCT Renew')
            );
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/ServiceRenew')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });

    describe('GET /service/:id', () => {
        it('should return service agreement details for valid ID', async () => {
            const mockService = {
                AgreementID: 1,
                ClientID: 1,
                Period: '12 months',
                Equipment: 'System Hardware',
                Status: 'Active',
                Renew: true,
                ServiceCost: 1000,
                Description: 'Annual maintenance'
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockService]
            });

            const response = await request(app)
                .get('/service/1')
                .expect(200);

            expect(response.body).toEqual(mockService);
        });

        it('should handle non-existent service agreement', async () => {
            sql.query.mockResolvedValueOnce({
                recordset: []
            });

            const response = await request(app)
                .get('/service/999')
                .expect(200);

            expect(response.body).toBe('');
        });

        it('should handle database errors', async () => {
            const mockError = {
                name: 'Error',
                message: 'Database error'
            };
            
            sql.query.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .get('/service/1')
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Error');
            expect(response.body).toHaveProperty('message', 'Database error');
        });
    });
});