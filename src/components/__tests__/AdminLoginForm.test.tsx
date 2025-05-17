import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginForm from '../AdminLoginForm';

// Mock fetch
global.fetch = jest.fn();

describe('AdminLoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('renders the form correctly', () => {
    render(<AdminLoginForm />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<AdminLoginForm />);
    
    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(<AdminLoginForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Check if fetch was called with the correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
        }),
      });
    });
  });

  it('handles API errors', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });
    
    render(<AdminLoginForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
