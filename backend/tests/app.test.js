// tests/app.test.js
const request = require('supertest');
const app = require('../app');
require('./setup');

describe('App', () => {
  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const response = await request(app).get('/health').expect(200)
        // .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Endpoint not found');
    });

    test('should return 404 for non-existent POST routes', async () => {
      const response = await request(app)
        .post('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Endpoint not found');
    });
  });

  describe('Middleware', () => {
    test('should handle JSON requests', async () => {
      const response = await request(app)
        .post('/api/barang')
        .send({ namaBarang: 'Test JSON', jumlah: 1 })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test('should handle URL-encoded requests', async () => {
      const response = await request(app)
        .post('/api/barang')
        .type('form')
        .send('namaBarang=Test URL&jumlah=1')
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });
});