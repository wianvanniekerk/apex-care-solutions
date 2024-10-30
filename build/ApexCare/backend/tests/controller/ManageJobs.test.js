const ManageJobs = require('../../controller/ManageJobs');
const sql = require('mssql');

jest.mock('mssql', () => ({
    query: jest.fn()
}));

describe('ManageJobs', () => {
    let jobManager;

    beforeEach(() => {
        jobManager = new ManageJobs();
        jest.clearAllMocks();
    });

    describe('getTechnicianDetails', () => {
        it('should return technician details for valid ID', async () => {
            const mockTechnician = {
                TechnicianID: 1,
                Name: 'John Smith',
                Expertise: 'Network Specialist',
                Phone: '1234567890',
                Area: 'North'
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockTechnician]
            });

            const technician = await jobManager.getTechnicianDetails(1);
            
            expect(technician).toEqual(mockTechnician);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when fetching technician details', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(jobManager.getTechnicianDetails(1))
                .rejects
                .toThrow('Error fetching technician details');
        });
    });

    describe('getClientDetails', () => {
        it('should return client details for valid ID', async () => {
            const mockClient = {
                ClientID: 1,
                Name: 'Jane Doe',
                Email: 'jane@example.com',
                Phone: '1234567890',
                Address: '123 Street',
                IsKeyClient: 1
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockClient]
            });

            const client = await jobManager.getClientDetails(1);
            
            expect(client).toEqual(mockClient);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when fetching client details', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(jobManager.getClientDetails(1))
                .rejects
                .toThrow('Error fetching client details');
        });
    });

    describe('getServiceAgreements', () => {
        it('should return service agreements for valid client ID', async () => {
            const mockAgreement = {
                Period: '12 months',
                Equipment: 'Network Specialist',
                Renew: true,
                ServiceCost: 1000,
                Description: 'Annual maintenance'
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockAgreement]
            });

            const agreement = await jobManager.getServiceAgreements(1);
            
            expect(agreement).toEqual(mockAgreement);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when fetching service agreements', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(jobManager.getServiceAgreements(1))
                .rejects
                .toThrow('Error fetching service agreements');
        });
    });

    describe('createJob', () => {
        it('should create a new job successfully', async () => {
            const jobData = {
                technician: 1,
                client: 1,
                title: 'Server Repair',
                description: 'Fix Server unit',
                address: '123 Street',
                status: 'Pending',
                priority: 'High'
            };

            const mockJobId = { JobID: 1 };

            sql.query.mockResolvedValueOnce({
                recordset: [mockJobId]
            });

            const result = await jobManager.createJob(jobData);
            
            expect(result.jobId).toBe(1);
            expect(result.technician).toBe(jobData.technician);
            expect(result.client).toBe(jobData.client);
            expect(result.title).toBe(jobData.title);
            expect(result.description).toBe(jobData.description);
            expect(result.address).toBe(jobData.address);
            expect(result.status).toBe(jobData.status);
            expect(result.priority).toBe(jobData.priority);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when creating a job', async () => {
            const jobData = {
                technician: 1,
                client: 1,
                title: 'Server Repair',
                description: 'Fix Server unit',
                address: '123 Street',
                status: 'Pending',
                priority: 'High'
            };

            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(jobManager.createJob(jobData))
                .rejects
                .toThrow('Error creating job');
        });
    });
});