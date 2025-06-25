import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ContactPage from '../page'; // Adjust path
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

// Mock Button component (as it's imported and used)
jest.mock('@/components/Button', () => {
  return ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  );
});

describe('ContactPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fetch as jest.Mock).mockClear();
    // Set a default successful mock response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Form submitted successfully!' }),
    });
  });

  test('renders all form fields and submit button', () => {
    render(<ContactPage />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('allows user input into fields', () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('John Doe');

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('john@example.com');

    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Test Subject' } });
    expect(screen.getByLabelText(/Subject/i)).toHaveValue('Test Subject');

    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello World' } });
    expect(screen.getByLabelText(/Message/i)).toHaveValue('Hello World');
  });

  test('submits form data correctly and displays success message', async () => {
    render(<ContactPage />);

    const testData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Successful Submission',
      message: 'This is a test message.',
    };

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: testData.name } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: testData.email } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: testData.subject } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: testData.message } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    await waitFor(() => {
      expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument();
    });

    // Check if form is cleared
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('');
    expect(screen.getByLabelText(/Subject/i)).toHaveValue('');
    expect(screen.getByLabelText(/Message/i)).toHaveValue('');
  });

  test('displays error message if API returns an error', async () => {
    // Override default mock for this test
    (fetch as jest.Mock).mockReset(); // Clear previous mock setup
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Submission failed due to server error.' }),
    });

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Bad Input' } });
    // ... fill other fields ...

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Submission failed due to server error./i)).toBeInTheDocument();
    });
     // Form should not be cleared on error
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Bad Input');
  });

  test('displays generic error message if fetch fails', async () => {
    (fetch as jest.Mock).mockReset();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ContactPage />);
    // ... fill fields ...
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Net Fail' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to send message. Please try again later./i)).toBeInTheDocument();
    });
  });

  test('submit button is disabled during submission', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({ message: 'Success!' }) }), 100))
    );

    render(<ContactPage />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Sub' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Msg' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    act(() => {
      fireEvent.click(submitButton);
    });

    // Expect button to be disabled and show "Sending..."
    // Need to use findByRole because the text content changes
    expect(await screen.findByRole('button', { name: /Sending.../i })).toBeDisabled();

    // Wait for the submission to complete
    await waitFor(() => expect(screen.getByRole('button', { name: /Send Message/i })).not.toBeDisabled());
  });
});
