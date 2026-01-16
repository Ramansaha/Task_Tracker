# Testing Documentation

This document describes the testing setup and strategy for the Task Tracker application.

## Overview

The application uses a comprehensive testing strategy with:
- **Backend**: Jest + Supertest for unit and integration tests
- **Frontend**: Vitest + React Testing Library for component and page tests
- **CI/CD**: Automated testing with scoped execution based on changed files

## Test Structure

```
Task_Tracker/
├── backend/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.test.js
│   │   │   │   └── task.test.js
│   │   │   └── helper/
│   │   │       ├── apiResponse.test.js
│   │   │       ├── mongo.test.js
│   │   │       └── postgres.test.js
│   │   ├── integration/
│   │   │   ├── auth.routes.test.js
│   │   │   └── task.routes.test.js
│   │   └── setup.js
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   └── __tests__/
│   │       ├── components/
│   │       │   ├── AddTaskModal.test.jsx
│   │       │   └── ConfirmationModal.test.jsx
│   │       ├── pages/
│   │       │   ├── Dashboard.test.jsx
│   │       │   ├── Login.test.jsx
│   │       │   └── Signup.test.jsx
│   │       └── setup.js
│   └── vitest.config.js (in vite.config.js)
└── scripts/
    └── get-affected-tests.js
```

## Running Tests

### Backend Tests

```bash
# Run all tests
cd backend
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only affected tests (based on git changes)
npm run test:affected
```

### Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run only affected tests (based on git changes)
npm run test:affected
```

## Scoped Test Execution

The application includes intelligent test scoping that only runs tests for changed modules:

### How It Works

1. **Change Detection**: The `scripts/get-affected-tests.js` script analyzes git changes
2. **Module Mapping**: Changed files are mapped to their corresponding test files
3. **Selective Execution**: Only relevant tests are executed

### Module Mapping

- `backend/controllers/auth/*` → `backend/__tests__/unit/controllers/auth.test.js` + integration tests
- `backend/controllers/task/*` → `backend/__tests__/unit/controllers/task.test.js` + integration tests
- `backend/helper/*` → `backend/__tests__/unit/helper/*.test.js`
- `backend/routes/*` → `backend/__tests__/integration/*.routes.test.js`
- `frontend/src/components/*` → `frontend/src/__tests__/components/*.test.jsx`
- `frontend/src/pages/*` → `frontend/src/__tests__/pages/*.test.jsx`

### Usage

```bash
# Backend affected tests
node scripts/get-affected-tests.js backend

# Frontend affected tests
node scripts/get-affected-tests.js frontend
```

## CI/CD Integration

The CI pipeline includes separate jobs for different types of checks:

### Jobs

1. **Detect Changes**: Identifies which modules have changed
2. **Lint: Frontend**: Lints frontend code (only if frontend changed)
3. **Lint: Backend**: Lints backend code (only if backend changed)
4. **Build: Frontend**: Builds frontend (only if frontend changed)
5. **Test: Backend Unit**: Runs backend unit tests (only if backend changed)
6. **Test: Backend Integration**: Runs backend integration tests (only if backend changed)
7. **Test: Frontend**: Runs frontend tests (only if frontend changed)
8. **Coverage Report**: Aggregates coverage reports

### Features

- **Path-based filtering**: Jobs only run when relevant files change
- **Scoped test execution**: Only affected tests run
- **Clear job names**: Each job shows its purpose in PR checks
- **Skip option**: Use `[skip tests]` in commit message to skip tests
- **Parallel execution**: Jobs run in parallel for faster CI

### PR Check Names

- `Lint: Frontend` - Frontend linting
- `Lint: Backend` - Backend linting
- `Build: Frontend` - Frontend build
- `Test: Backend Unit` - Backend unit tests
- `Test: Backend Integration` - Backend integration tests
- `Test: Frontend` - Frontend tests
- `Coverage Report` - Coverage summary

## Test Coverage

### Backend Coverage

- **Controllers**: Auth and Task controllers
- **Helpers**: MongoDB, PostgreSQL, and API response helpers
- **Routes**: Integration tests for all API endpoints

### Frontend Coverage

- **Components**: AddTaskModal, ConfirmationModal
- **Pages**: Dashboard, Login, Signup

## Writing New Tests

### Backend Unit Test Example

```javascript
import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import * as controller from '../../../controllers/task/task.js';

describe('Task Controller', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = { body: {}, params: {} };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it('should create task successfully', async () => {
    // Test implementation
  });
});
```

### Frontend Component Test Example

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Mock database calls, API calls, etc.
3. **Clear Test Names**: Use descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Coverage Goals**: Aim for >80% coverage on critical paths
6. **Fast Tests**: Keep unit tests fast (<100ms each)
7. **Integration Tests**: Test real workflows end-to-end

## Troubleshooting

### Tests Not Running

- Check that test files match the pattern: `*.test.js` or `*.test.jsx`
- Verify Jest/Vitest configuration
- Ensure dependencies are installed

### Scoped Tests Not Working

- Verify git is initialized
- Check that changed files match module mapping
- Run `node scripts/get-affected-tests.js [backend|frontend]` manually

### CI Failures

- Check job logs in GitHub Actions
- Verify environment variables are set
- Ensure test database connections are configured

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

