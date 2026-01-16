import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Signup from '../../pages/Signup';

// Mock fetch
global.fetch = vi.fn();

describe('Signup Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const mockSetToken = vi.fn();

  const renderSignup = () => {
    return render(
      <BrowserRouter>
        <Signup setToken={mockSetToken} />
      </BrowserRouter>
    );
  };

  it('should render signup form', () => {
    renderSignup();

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mobile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    renderSignup();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    renderSignup();

    const mockResponse = {
      ok: true,
      json: async () => ({
        status: 200,
        message: 'Registration successful!',
        data: 'mock-token'
      })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(mobileInput, '1234567890');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/taskTrac/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('Test User')
        })
      );
    });
  });

  it('should display error message on signup failure', async () => {
    const user = userEvent.setup();
    renderSignup();

    const mockResponse = {
      ok: false,
      json: async () => ({
        message: 'User already exists!'
      })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(mobileInput, '1234567890');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });
});

