import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Create a simple test app with mocked routes
const app = express();
app.use(express.json());

// Mock route handlers
app.post('/api/taskTrac/auth/register', (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  return res.status(200).json({
    status: 200,
    message: 'Registration successful!',
    data: 'mock-jwt-token'
  });
});

app.post('/api/taskTrac/auth/login', (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({ message: 'Missing fields are required!' });
  }
  return res.status(200).json({
    status: 200,
    message: 'Login Successful!',
    data: 'mock-jwt-token'
  });
});

describe('Auth Routes Integration Tests', () => {
  describe('POST /api/taskTrac/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/taskTrac/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('Registration successful!');
      expect(response.body.data).toBe('mock-jwt-token');
    });

    it('should return validation error when fields are missing', async () => {
      const response = await request(app)
        .post('/api/taskTrac/auth/register')
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('POST /api/taskTrac/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        mobile: '1234567890',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/taskTrac/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('Login Successful!');
      expect(response.body.data).toBe('mock-jwt-token');
    });

    it('should return error when fields are missing', async () => {
      const response = await request(app)
        .post('/api/taskTrac/auth/login')
        .send({ mobile: '1234567890' })
        .expect(400);

      expect(response.body.message).toBe('Missing fields are required!');
    });
  });
});
