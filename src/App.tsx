import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Shortcuts from './components/Shortcuts';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import AuthCallback from './pages/AuthCallback';
import authService from './services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
}

// Home component with template design
function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const userInfo = authService.getUserInfo();
      if (userInfo) {
        setUser({
          id: '1',
          name: userInfo.name,
          email: userInfo.email,
          plan: 'free',
          subscriptionStatus: 'active'
        });
      }
    }
  }, []);

  const handleLogin = () => {
    authService.redirectToCognito();
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleSignup = () => {
    authService.redirectToCognito();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        user={user} 
        onLogin={handleLogin}
        onProfile={() => setShowProfile(true)}
        onLogout={handleLogout}
      />
      
      {!showProfile ? (
        <>
          <Hero onGetStarted={handleSignup} />
          <HowItWorks />
          <Shortcuts />
          <Features />
          <Pricing onSelectPlan={handleSignup} />
          <Footer />
        </>
      ) : (
        <UserProfile 
          user={user} 
          onBack={() => setShowProfile(false)}
          onUpdateUser={setUser}
        />
      )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;