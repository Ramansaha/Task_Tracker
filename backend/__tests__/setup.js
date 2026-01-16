// Jest setup file for backend tests
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootEnvPath = join(__dirname, '../../.env');
const backendEnvPath = join(__dirname, '../.env');

if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.AUTHTOKEN_SECRETKEY = process.env.AUTHTOKEN_SECRETKEY || 'test-secret-key-min-32-characters-long-for-jwt';

