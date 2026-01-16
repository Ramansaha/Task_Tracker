import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = mockLocalStorage;

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('should render dashboard with task list', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', completed: false },
      { id: '2', title: 'Task 2', completed: true }
    ];
    const mockPagination = {
      currentPage: 1,
      pageSize: 10,
      totalItems: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tasks: mockTasks,
        pagination: mockPagination
      })
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument();
    });
  });

  it('should redirect to login when no token', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    renderDashboard();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display loading state', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderDashboard();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display no tasks message when empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tasks: [],
        pagination: null
      })
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
  });
});

