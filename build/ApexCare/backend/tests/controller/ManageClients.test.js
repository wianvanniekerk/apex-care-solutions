const ManageClients = require('../../controller/ManageClients');
const sql = require('mssql');

jest.mock('mssql', () => ({
    query: jest.fn()
}));

describe('ManageClients', () => {
    let clientManager;

    beforeEach(() => {
        clientManager = new ManageClients();
        jest.clearAllMocks();
    });

    describe('getAllClients', () => {
        it('should return all clients', async () => {
            const mockClients = [{
                ClientID: 1,
                Name: 'John Doe',
                Email: 'john@example.com',
                Phone: '1234567890',
                Address: '123 Street',
                IsKeyClient: 1
            }];

            sql.query.mockResolvedValueOnce({
                recordset: mockClients
            });

            const clients = await clientManager.getAllClients();
            
            expect(clients).toHaveLength(1);
            expect(clients[0].name).toBe('John Doe');
            expect(sql.query).toHaveBeenCalled();
        });

        it('should handle errors when fetching clients', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(clientManager.getAllClients())
                .rejects
                .toThrow('Error fetching all clients');
        });
    });

    describe('addNewClient', () => {
        it('should add a new client successfully', async () => {
            sql.query.mockResolvedValueOnce({
                recordset: [],
                rowsAffected: [1]
            });

            const result = await clientManager.addNewClient(
                'John Doe',
                'john@example.com',
                '123 Street',
                '1234567890',
                1,
                'password123'
            );

            expect(result).toBe(true);
            expect(sql.query).toHaveBeenCalled();
        });

        it('should throw error for database failures', async () => {
            sql.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(clientManager.addNewClient(
                'John Doe',
                'john@example.com',
                '123 Street',
                '1234567890',
                1,
                'password123'
            )).rejects.toThrow('Error adding new client');
        });
    });

    describe('removeClient', () => {
        it('should remove client successfully', async () => {
            sql.query.mockResolvedValueOnce({
                rowsAffected: [1]
            });

            const result = await clientManager.removeClient(1);
            expect(result).toBe(true);
        });

        it('should return false when client not found', async () => {
            sql.query.mockResolvedValueOnce({
                rowsAffected: [0]
            });

            const result = await clientManager.removeClient(999);
            expect(result).toBe(false);
        });
    });

    describe('getClientDetails', () => {
        it('should return client details for valid ID', async () => {
            const mockClient = {
                ClientID: 1,
                Name: 'John Doe',
                Email: 'john@example.com',
                Phone: '1234567890',
                Address: '123 Street',
                IsKeyClient: 1
            };

            sql.query.mockResolvedValueOnce({
                recordset: [mockClient]
            });

            const client = await clientManager.getClientDetails(1);
            
            expect(client.name).toBe('John Doe');
            expect(client.email).toBe('john@example.com');
        });

        it('should return null for non-existent client', async () => {
            sql.query.mockResolvedValueOnce({
                recordset: []
            });

            const client = await clientManager.getClientDetails(999);
            expect(client).toBeNull();
        });
    });
});