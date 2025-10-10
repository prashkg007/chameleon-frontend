import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, Settings, AlertTriangle, Coins } from 'lucide-react';
import paymentService from '../services/paymentService';

interface UserType {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  credits: number;
}

interface UserProfileProps {
  user: UserType | null;
  onBack: () => void;
  onUpdateUser: (user: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBuyCredits = async (amount: number, credits: number) => {
    setIsProcessingPayment(true);
    setPaymentMessage(null);

    await paymentService.initRazorpayCheckout(
      amount,
      credits,
      async () => {
        // Success handler
        setIsProcessingPayment(false);
        setPaymentMessage({ type: 'success', text: `Successfully purchased ${credits} credits!` });
        
        // Refresh credits
        try {
          const newCredits = await paymentService.fetchCredits();
          if (user) {
            onUpdateUser({ ...user, credits: newCredits });
          }
        } catch (error) {
          console.error('Failed to refresh credits:', error);
        }

        // Clear message after 5 seconds
        setTimeout(() => setPaymentMessage(null), 5000);
      },
      (error) => {
        // Failure handler
        setIsProcessingPayment(false);
        setPaymentMessage({ type: 'error', text: error });
        setTimeout(() => setPaymentMessage(null), 5000);
      }
    );
  };

  // const handleUnsubscribe = () => {
  //   const updatedUser = { ...user, subscriptionStatus: 'cancelled' };
  //   onUpdateUser(updatedUser);
  //   setShowCancelModal(false);
  // };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Available Credits</p>
                      <p className="text-white text-3xl font-bold flex items-center">
                        <Coins className="h-8 w-8 mr-2" />
                        {user.credits}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Buy More
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <span className="text-white capitalize">{user.plan}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                {paymentMessage && (
                  <div className={`p-4 rounded-lg ${
                    paymentMessage.type === 'success' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {paymentMessage.text}
                  </div>
                )}

                <div className="bg-gray-700/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Buy Credits</h3>
                  <p className="text-gray-400 mb-6">Purchase credits to use our AI analysis service. Each credit is valid for one question.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Starter Pack</p>
                          <p className="text-white text-2xl font-bold flex items-center">
                            <Coins className="h-6 w-6 mr-2" />
                            10 Credits
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Price</p>
                          <p className="text-white text-2xl font-bold">$5</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyCredits(5, 10)}
                        disabled={isProcessingPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        {isProcessingPayment ? 'Processing...' : 'Buy Now'}
                      </button>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Unlimited Plan</p>
                          <p className="text-white text-2xl font-bold flex items-center">
                            <Coins className="h-6 w-6 mr-2" />
                            Unlimited
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Per Month</p>
                          <p className="text-white text-2xl font-bold">$39</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyCredits(39, -1)}
                        disabled={isProcessingPayment}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        {isProcessingPayment ? 'Processing...' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.subscriptionStatus === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.subscriptionStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white capitalize text-xl font-bold">{user.plan} Plan</p>
                    <p className="text-gray-400">
                      {user.plan === 'free' ? 'Free forever' : `$${user.plan === 'pro' ? '29' : '99'}/month`}
                    </p>
                    {user.subscriptionStatus === 'active' && user.plan !== 'free' && (
                      <p className="text-sm text-gray-400">Next billing date: March 15, 2025</p>
                    )}
                  </div>
                </div>
                
                {user.plan !== 'free' && user.subscriptionStatus === 'active' && (
                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Danger Zone</h4>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Cancel Subscription</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive updates about your account</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Auto-start on Boot</p>
                        <p className="text-sm text-gray-400">Launch StealthBuddy when computer starts</p>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing cycle.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-gray-600 hover:border-gray-500 text-white py-2 rounded-lg transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  if (user) {
                    onUpdateUser({ ...user, subscriptionStatus: 'cancelled' });
                  }
                  setShowCancelModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;