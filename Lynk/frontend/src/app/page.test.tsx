import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
  it('renders the Lynk heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Lynk/i });
    expect(heading).toBeDefined();
  });
});
