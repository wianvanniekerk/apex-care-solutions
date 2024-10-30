const ManageTechnicians = require('../../controller/ManageTechnicians');
const sql = require('mssql');

jest.mock('mssql', () => ({
    query: jest.fn()
}));

describe('ManageTechnicians', () => {
    let technicianManager;

    beforeEach(() => {
        technicianManager = new ManageTechnicians();
        jest.clearAllMocks();
    });

    describe('getAllTechnicians', () => {
        it('should return all technicians', async () => {
            const mockTechnicians = [{
                TechnicianID: 1,
                Name: 'John Smith',
                Expertise: 'Network Specialist',
                Phone: '1234567890',
                Area: 'North Side'
            }];

            sql.query.mockResolvedValueOnce({
                recordset: mockTechnicians
            });

            const technicians = await technicianManager.getAllTechnicians();
            
            expect(technicians).toHaveLength(1);
            expect(technicians[0].name).toBe('John Smith');
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when fetching technicians', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(technicianManager.getAllTechnicians())
                .rejects
                .toThrow('Error fetching all technicians');
        });
    });

    describe('addNewTechnician', () => {
        it('should add a new technician successfully', async () => {
            sql.query.mockResolvedValueOnce({
                rowsAffected: [1]
            });

            const result = await technicianManager.addNewTechnician(
                'John Smith',
                'john@example.com',
                '1234567890',
                'Network Specialist',
                'North Side'
            );

            expect(result).toBe(true);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should throw error for database failures', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(technicianManager.addNewTechnician(
                'John Smith',
                'john@example.com',
                '1234567890',
                'Network Specialist',
                'North Side'
            )).rejects.toThrow();
        });
    });

    describe('getTechnicianDetails', () => {
        it('should return technician details for valid ID', async () => {
            const mockTechnician = {
                TechnicianID: 1,
                Name: 'John Smith',
                Expertise: 'Network Specialist',
                Phone: '1234567890',
                Area: 'North Side'
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockTechnician]
            });

            const technician = await technicianManager.getTechnicianDetails(1);
            
            expect(technician.name).toBe('John Smith');
            expect(technician.expertise).toBe('Network Specialist');
            expect(technician.area).toBe('North Side');
        });

        it('should return null for non-existent technician', async () => {
            sql.query.mockResolvedValueOnce({
                recordset: []
            });

            const technician = await technicianManager.getTechnicianDetails(999);
            expect(technician).toBeNull();
        });
    });

    describe('getTechnicianAreas', () => {
        it('should return areas and expertise lists', async () => {
            const mockAreas = [
                { Area: 'Downtown' },
                { Area: 'North Side' }
            ];
            
            const mockExpertise = [
                { Expertise: 'Software Installation' },
                { Expertise: 'Network Specialist' }
            ];

            sql.query
                .mockResolvedValueOnce({ recordset: mockAreas })
                .mockResolvedValueOnce({ recordset: mockExpertise });

            const result = await technicianManager.getTechnicianAreas();
            
            expect(result.areas).toEqual(['Downtown', 'North Side']);
            expect(result.expertise).toEqual(['Software Installation', 'Network Specialist']);
            expect(sql.query).toHaveBeenCalledTimes(2);
        });

        it('should handle errors when fetching areas and expertise', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(technicianManager.getTechnicianAreas())
                .rejects
                .toThrow('Error fetching technician areas');
        });
    });
});