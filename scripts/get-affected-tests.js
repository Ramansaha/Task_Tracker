#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Module to test file mapping
const moduleMapping = {
  'backend/controllers/auth': ['backend/__tests__/unit/controllers/auth.test.js', 'backend/__tests__/integration/auth.routes.test.js'],
  'backend/controllers/task': ['backend/__tests__/unit/controllers/task.test.js', 'backend/__tests__/integration/task.routes.test.js'],
  'backend/helper/mongo': ['backend/__tests__/unit/helper/mongo.test.js'],
  'backend/helper/postgres': ['backend/__tests__/unit/helper/postgres.test.js'],
  'backend/helper/apiResponse': ['backend/__tests__/unit/helper/apiResponse.test.js'],
  'backend/routes/auth': ['backend/__tests__/integration/auth.routes.test.js'],
  'backend/routes/task': ['backend/__tests__/integration/task.routes.test.js'],
  'frontend/src/components/AddTaskModal': ['frontend/src/__tests__/components/AddTaskModal.test.jsx'],
  'frontend/src/components/ConfirmationModal': ['frontend/src/__tests__/components/ConfirmationModal.test.jsx'],
  'frontend/src/pages/Dashboard': ['frontend/src/__tests__/pages/Dashboard.test.jsx'],
  'frontend/src/pages/Login': ['frontend/src/__tests__/pages/Login.test.jsx'],
  'frontend/src/pages/Signup': ['frontend/src/__tests__/pages/Signup.test.jsx'],
};

// Get changed files from git
function getChangedFiles() {
  try {
    // Check if we're in a CI environment (GitHub Actions)
    const isCI = process.env.CI === 'true';
    const baseRef = process.env.GITHUB_BASE_REF || 'main';
    const headRef = process.env.GITHUB_HEAD_REF || 'HEAD';
    
    let command;
    if (isCI && process.env.GITHUB_EVENT_NAME === 'pull_request') {
      // In PR, compare with base branch
      command = `git diff --name-only origin/${baseRef}...${headRef}`;
    } else {
      // For local or push events, compare with HEAD
      command = 'git diff --name-only HEAD~1 HEAD';
    }
    
    const output = execSync(command, { 
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    // If git command fails, return empty array (run all tests)
    console.warn('Could not determine changed files, running all tests');
    return [];
  }
}

// Map changed files to test files
function getAffectedTests(changedFiles) {
  const testFiles = new Set();
  const modules = new Set();
  
  changedFiles.forEach(file => {
    // Check each module mapping
    for (const [module, tests] of Object.entries(moduleMapping)) {
      if (file.includes(module)) {
        modules.add(module);
        tests.forEach(test => testFiles.add(test));
      }
    }
    
    // Also check for direct test file changes
    if (file.includes('__tests__') || file.includes('.test.')) {
      testFiles.add(file);
    }
  });
  
  return { testFiles: Array.from(testFiles), modules: Array.from(modules) };
}

// Main execution
function main() {
  const target = process.argv[2]; // 'backend' or 'frontend'
  
  if (!target || !['backend', 'frontend'].includes(target)) {
    console.error('Usage: node get-affected-tests.js [backend|frontend]');
    process.exit(1);
  }
  
  const changedFiles = getChangedFiles();
  
  // If no changed files or changed files don't match target, run all tests
  if (changedFiles.length === 0) {
    console.log('all');
    return;
  }
  
  const { testFiles, modules } = getAffectedTests(changedFiles);
  
  // Filter by target
  const filteredTests = testFiles.filter(test => {
    if (target === 'backend') {
      return test.startsWith('backend/');
    } else {
      return test.startsWith('frontend/');
    }
  });
  
  // If no affected tests for this target, run all
  if (filteredTests.length === 0) {
    console.log('all');
    return;
  }
  
  // Output test paths (one per line for Jest/Vitest)
  filteredTests.forEach(test => console.log(test));
}

main();

