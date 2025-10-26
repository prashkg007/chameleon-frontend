import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
	// Load environment variables
	const env = loadEnv(mode, process.cwd(), '')
	
	return {
		plugins: [react()],
		server: { 
			port: 5173,
			host: true,
      watch: {
        usePolling: true
      }
		},
		preview: { 
			port: 5174,
			host: true
		},
		build: {
			outDir: 'dist',
			assetsDir: 'assets',
			sourcemap: false,
			minify: 'esbuild',
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ['react', 'react-dom'],
						router: ['react-router-dom'],
						lucide: ['lucide-react']
					}
				}
			}
		},
		base: '/',
		optimizeDeps: {
			include: ['lucide-react']
		},
		// Define environment variables
		define: {
			__APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode)
		}
	}
})