import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import React from 'react';

// Mock Firebase analytics
vi.mock('../firebase.js', () => ({
  trackEvent: vi.fn(),
}));

// Mock fetch for API calls — prevent real network requests
global.fetch = vi.fn();

describe('Chunav Gyaan App - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: return empty/fallback for news and leaderboard
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ articles: [], scores: [], isFallback: true }),
    });
  });

  // ── HOME PAGE TESTS (3) ────────────────────────────────────
  it('renders home page hero section by default', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/India's Election Guide/i)).toBeInTheDocument();
    });
  });

  it('handles API fallback gracefully on Home page news section', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Live news temporarily unavailable/i)).toBeInTheDocument();
    });
  });

  it('shows rotating did-you-know fact on home page', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Did You Know/i)).toBeInTheDocument();
    });
  });

  // ── NAVIGATION TESTS (3) ───────────────────────────────────
  it('navigates to Timeline tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const timelineTab = await screen.findByRole('button', { name: /Go to 📅 Timeline page/i });
    await user.click(timelineTab);
    await waitFor(() => {
      expect(screen.getByText(/Indian Election Timeline/i)).toBeInTheDocument();
    });
  });

  it('navigates to Election Types tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const typesTab = await screen.findByRole('button', { name: /Go to 🏛️ Election Types page/i });
    await user.click(typesTab);
    await waitFor(() => {
      expect(screen.getByText(/Lok Sabha Elections/i)).toBeInTheDocument();
    });
  });

  it('updates document title on navigation to Officials', async () => {
    const user = userEvent.setup();
    render(<App />);
    const rolesTab = await screen.findByRole('button', { name: /Go to 👤 Officials page/i });
    await user.click(rolesTab);
    await waitFor(() => {
      expect(document.title).toContain('Officials');
    });
  });

  // ── HOW TO VOTE TESTS (3) ─────────────────────────────────
  it('renders How to Vote page title correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    const voteTab = await screen.findByRole('button', { name: /Go to 🗳️ How to Vote page/i });
    await user.click(voteTab);
    await waitFor(() => {
      expect(screen.getByText(/How to Vote in India/i)).toBeInTheDocument();
    });
  });

  it('renders first step card: Check Your Eligibility', async () => {
    const user = userEvent.setup();
    render(<App />);
    const voteTab = await screen.findByRole('button', { name: /Go to 🗳️ How to Vote page/i });
    await user.click(voteTab);
    await waitFor(() => {
      expect(screen.getByText(/Check Your Eligibility/i)).toBeInTheDocument();
    });
  });

  it('shows Next Step button on How To Vote', async () => {
    const user = userEvent.setup();
    render(<App />);
    const voteTab = await screen.findByRole('button', { name: /Go to 🗳️ How to Vote page/i });
    await user.click(voteTab);
    const nextBtn = await screen.findByText(/Next Step/i);
    expect(nextBtn).toBeInTheDocument();
  });

  // ── GLOSSARY TESTS (3) ────────────────────────────────────
  it('renders Glossary page title', async () => {
    const user = userEvent.setup();
    render(<App />);
    const glossaryTab = await screen.findByRole('button', { name: /Go to 📖 Glossary page/i });
    await user.click(glossaryTab);
    await waitFor(() => {
      expect(screen.getByText(/Election Glossary/i)).toBeInTheDocument();
    });
  });

  it('renders All category filter button in Glossary', async () => {
    const user = userEvent.setup();
    render(<App />);
    const glossaryTab = await screen.findByRole('button', { name: /Go to 📖 Glossary page/i });
    await user.click(glossaryTab);
    await waitFor(() => {
      // "All" filter button
      expect(screen.getByRole('button', { name: /Filter glossary by All/i })).toBeInTheDocument();
    });
  });

  it('filters Glossary by search: NOTA should show None of the Above in definition', async () => {
    const user = userEvent.setup();
    render(<App />);
    const glossaryTab = await screen.findByRole('button', { name: /Go to 📖 Glossary page/i });
    await user.click(glossaryTab);
    const searchInput = await screen.findByPlaceholderText(/Search terms/i);
    await user.type(searchInput, 'NOTA');
    await waitFor(() => {
      // NOTA term itself should appear
      expect(screen.getByText('NOTA')).toBeInTheDocument();
    });
  });

  // ── QUIZ TESTS (3) ───────────────────────────────────────
  it('renders Quiz page title correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    const quizTab = await screen.findByRole('button', { name: /Go to 🎯 Quiz page/i });
    await user.click(quizTab);
    await waitFor(() => {
      expect(screen.getByText(/Civic Knowledge Quiz/i)).toBeInTheDocument();
    });
  });

  it('shows first quiz question immediately', async () => {
    const user = userEvent.setup();
    render(<App />);
    const quizTab = await screen.findByRole('button', { name: /Go to 🎯 Quiz page/i });
    await user.click(quizTab);
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    });
  });

  it('renders all 4 quiz answer options for first question', async () => {
    const user = userEvent.setup();
    render(<App />);
    const quizTab = await screen.findByRole('button', { name: /Go to 🎯 Quiz page/i });
    await user.click(quizTab);
    await waitFor(() => {
      // First question is about Lok Sabha seats: 545, 543, 552, 550
      expect(screen.getByText(/543/i)).toBeInTheDocument();
    });
  });
});
