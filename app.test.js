const request = require('supertest');
const app = require('./app');

jest.mock('./db', () => ({
    all: jest.fn()
}));
function mockDbResults(mockMovies) {
    const db = require('./db');
    db.all.mockImplementation((query, params, callback) => {
        callback(null, mockMovies);
    });
}
describe('Integration Tests', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return correct prize range', async () => {

        mockDbResults([
            { year: 2000, producers: 'Producer 1', winner: 'yes' },
            { year: 2002, producers: 'Producer 1', winner: 'yes' },
            { year: 2005, producers: 'Producer 2', winner: 'yes' },
            { year: 2008, producers: 'Producer 2', winner: 'yes' }
        ]);

        const response = await request(app).get('/prize-range');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('min');
        expect(response.body).toHaveProperty('max');
        expect(response.body.min.length).toBeGreaterThan(0);
        expect(response.body.min[0]).toHaveProperty('interval', 2);
        expect(response.body.max.length).toBeGreaterThan(0);
        expect(response.body.max[0]).toHaveProperty('interval', 3);
    });

    it('should return empty min and max', async () => {

        mockDbResults([
            { year: 2000, producers: 'Producer 1', winner: 'yes' },
            { year: 2002, producers: 'Producer 2', winner: 'yes' },
            { year: 2005, producers: 'Producer 3', winner: 'yes' },
            { year: 2008, producers: 'Producer 4', winner: 'yes' }
        ]);

        const response = await request(app).get('/prize-range');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('min');
        expect(response.body).toHaveProperty('max');
        console.log(response.body)
        expect(response.body.min.length).toBe(0);
        expect(response.body.max.length).toBe(0);
    });
});
