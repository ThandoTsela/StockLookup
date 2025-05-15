import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  },
}));

// Mock API calls
vi.mock('../lib/api', () => ({
  getStockPrice: () =>
    Promise.resolve({
      symbol: 'AAPL',
      price: 150.00,
      change: 2.50,
      changePercent: '+1.67%',
    }),
}));

describe('App Integration Tests', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    );
  });

  it('allows users to sign up', async () => {
    const signupLink = screen.getByText('Sign Up');
    fireEvent.click(signupLink);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Stock Lookup')).toBeInTheDocument();
    });
  });

  it('allows users to log in', async () => {
    const loginLink = screen.getByText('Log In');
    fireEvent.click(loginLink);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Stock Lookup')).toBeInTheDocument();
    });
  });

  it('allows authenticated users to look up stock prices', async () => {
    // Simulate logged in state
    const loginLink = screen.getByText('Log In');
    fireEvent.click(loginLink);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Stock Lookup')).toBeInTheDocument();
    });

    const symbolInput = screen.getByPlaceholderText(/enter stock symbol/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(symbolInput, 'AAPL');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('$150.00')).toBeInTheDocument();
    });
  });
});