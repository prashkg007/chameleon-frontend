import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

describe('Home', () => {
	it('renders hero text', () => {
		render(<Home />)
		expect(screen.getByText(/Invisible AI help for coding interviews/)).toBeInTheDocument()
	})
})









