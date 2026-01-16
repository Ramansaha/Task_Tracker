import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';

// Mock fetch
global.fetch = vi.fn();

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const mockSetToken = vi.fn();

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login setToken={mockSetToken} />
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/mobile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    renderLogin();

    const mockResponse = {
      ok: true,
      json: async () => ({
        status: 200,
        message: 'Login Successful!',
        data: 'mock-token'
      })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(mobileInput, '1234567890');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/taskTrac/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  it('should display error message on login failure', async () => {
    const user = userEvent.setup();
    renderLogin();

    const mockResponse = {
      ok: false,
      json: async () => ({
        message: 'Invalid credentials'
      })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(mobileInput, '1234567890');
    await user.type(passwordInput, 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

