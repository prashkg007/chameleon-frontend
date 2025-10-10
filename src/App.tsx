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
import paymentService from './services/paymentService';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  credits: number;
}

// Home component with template design
function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        const userInfo = authService.getUserInfo();
        if (userInfo) {
          try {
            const credits = await paymentService.fetchCredits();
            setUser({
              id: '1',
              name: userInfo.name,
              email: userInfo.email,
              plan: 'free',
              subscriptionStatus: 'active',
              credits,
            });
          } catch (error) {
            console.error('Failed to fetch credits:', error);
            setUser({
              id: '1',
              name: userInfo.name,
              email: userInfo.email,
              plan: 'free',
              subscriptionStatus: 'active',
              credits: 0,
            });
          }
        }
      }
    };
    loadUser();
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

  const handleSelectPlan = async (amount: number, credits: number | 'unlimited', planType: 'one-time' | 'subscription') => {
    if (!authService.isAuthenticated()) {
      authService.redirectToCognito();
      return;
    }

    // For subscription plans, we'll use -1 as credits indicator
    const creditsValue = credits === 'unlimited' ? -1 : credits;
    
    await paymentService.initRazorpayCheckout(
      amount,
      creditsValue,
      async () => {
        // Success - reload user data
        const userInfo = authService.getUserInfo();
        if (userInfo) {
          try {
            const newCredits = await paymentService.fetchCredits();
            setUser({
              id: '1',
              name: userInfo.name,
              email: userInfo.email,
              plan: planType === 'subscription' ? 'pro' : 'free',
              subscriptionStatus: 'active',
              credits: newCredits,
            });
          } catch (error) {
            console.error('Failed to refresh credits:', error);
          }
        }
      },
      (error) => {
        console.error('Payment failed:', error);
      }
    );
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
          <Pricing onSelectPlan={handleSelectPlan} />
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