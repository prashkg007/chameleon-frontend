import { describe, it, expect, vi } from 'vitest'
import { config } from '../config'

describe('config', () => {
	it('has apiBaseUrl', () => {
		expect(config.apiBaseUrl).toBeDefined()
		expect(typeof config.apiBaseUrl).toBe('string')
	})
})









