const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

let token;

describe('Sweets API', () => {
  beforeAll(async () => {
    // create a user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'SweetsUser', email: 'sweets@example.com', password: 'pass' });
    token = res.body.token;
  });

  afterAll(async () => {
    // Clean DB; globalTeardown will close connections and stop the in-memory server
    await mongoose.connection.dropDatabase();
  });

  it('should create a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Chocolate', category: 'Candy', price: 1.5, quantity: 10 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Chocolate');
  });

  it('should list sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should search sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Choc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.find(s => s.name === 'Chocolate')).toBeDefined();
  });

  it('should update a sweet', async () => {
    const sweet = await Sweet.findOne({ name: 'Chocolate' });
    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 2.0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(2);
  });

  it('should purchase a sweet and decrease quantity', async () => {
    const sweet = await Sweet.findOne({ name: 'Chocolate' });
    const prev = sweet.quantity;
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(prev - 1);
  });

  it('should not allow delete for non-admin', async () => {
    const sweet = await Sweet.findOne({ name: 'Chocolate' });
    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});
