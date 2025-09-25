import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import Subscribe from './pages/Subscribe'
import Success from './pages/Success'
import Cancel from './pages/Cancel'

export default function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/auth/callback" element={<AuthCallback />} />
				<Route path="/subscribe" element={<Subscribe />} />
				<Route path="/success" element={<Success />} />
				<Route path="/cancel" element={<Cancel />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Layout>
	)
}



