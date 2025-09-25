import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from '../pages/Login'

describe('Login', () => {
  it('renders login form elements', () => {
    render(<Login />)
    
    expect(screen.getByText('Sign in to Chameleon')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })
})
