import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

test('renders Authix landing heading', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const heading = screen.getByText(/Build Tenant-Branded Mentorship Businesses at Scale/i);
  expect(heading).toBeInTheDocument();
});
