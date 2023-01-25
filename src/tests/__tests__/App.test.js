import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom'
import App from '../../App';

it('renders the main app page', ()=>{
  render(<App/>, {wrapper: MemoryRouter});
  const loginButton = screen.getByText('Login')
  expect(loginButton).toBeInTheDocument();
});
