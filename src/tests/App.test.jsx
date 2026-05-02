import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import React from 'react';

// Mock Firebase analytics
vi.mock('../firebase.js', () => ({
  trackEvent: vi.fn(),
}));

// Mock fetch for API calls
global.fetch = vi.fn();

describe('Chunav Gyaan App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default fetch mock implementation
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('renders home page by default', async () => {
    render(<App />);
    
    // Wait for lazy loaded content
    await waitFor(() => {
      expect(screen.getByText(/India's Election Guide/i)).toBeInTheDocument();
    });
    
    // Check main title
    expect(screen.getAllByText(/Chunav Gyaan/i).length).toBeGreaterThan(0);
  });

  it('navigates to Timeline tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/India's Election Guide/i)).toBeInTheDocument();
    });

    // Click Timeline tab
    const timelineTab = screen.getByRole('button', { name: /Go to 📅 Timeline page/i });
    await user.click(timelineTab);

    // Verify timeline content loads
    await waitFor(() => {
      expect(screen.getByText(/Indian Election Timeline/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully on Home page news section', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Down'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Visit eci.gov.in for latest news/i)).toBeInTheDocument();
    });
  });
});
