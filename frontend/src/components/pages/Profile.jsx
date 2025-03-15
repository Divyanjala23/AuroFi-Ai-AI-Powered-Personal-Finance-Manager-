import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Edit,
  Save,
  Lock,
  Bell,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  Link,
  Gift,
  MessageCircle,
} from 'lucide-react';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
        console.log(data);
        setTempName(data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: tempName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setUser({ ...user, name: tempName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    onLogout(); // Call the onLogout function passed from App.js
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">Profile</h1>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Personal Information</h2>

            {/* Name Field */}
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-teal-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-teal-600">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full p-2 border border-teal-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                ) : (
                  <p className="text-lg font-medium text-teal-800">{user.name}</p>
                )}
              </div>
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              </button>
            </div>

            {/* Email Field */}
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-teal-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-teal-600">Email</label>
                <p className="text-lg font-medium text-teal-800">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Account Settings</h2>

            {/* Change Password */}
            <button
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Lock className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Change Password</span>
            </button>

            {/* Email Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Bell className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Email Notifications</span>
            </button>
          </div>

          {/* Security and Privacy */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Security and Privacy</h2>

            {/* Login History */}
            <button
              onClick={() => navigate('/login-history')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Login History</span>
            </button>

            {/* Privacy Settings */}
            <button
              onClick={() => navigate('/privacy-settings')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Privacy Settings</span>
            </button>
          </div>

          {/* Subscription and Billing */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Subscription and Billing</h2>

            {/* Subscription Plan */}
            <button
              onClick={() => navigate('/subscription')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <CreditCard className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Subscription Plan</span>
            </button>

            {/* Billing History */}
            <button
              onClick={() => navigate('/billing-history')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <CreditCard className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Billing History</span>
            </button>
          </div>

          {/* Support and Help */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Support and Help</h2>

            {/* Contact Support */}
            <button
              onClick={() => navigate('/contact-support')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <HelpCircle className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Contact Support</span>
            </button>

            {/* Feedback */}
            <button
              onClick={() => navigate('/feedback')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Feedback</span>
            </button>
          </div>

          {/* Social Integration */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-teal-800">Social Integration</h2>

            {/* Social Media Links */}
            <button
              onClick={() => navigate('/social-links')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Link className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Social Media Links</span>
            </button>

            {/* Referral Program */}
            <button
              onClick={() => navigate('/referral-program')}
              className="w-full flex items-center gap-3 p-4 bg-white hover:bg-teal-50 rounded-xl transition-colors duration-200"
            >
              <Gift className="h-5 w-5 text-teal-600" />
              <span className="text-teal-800 font-medium">Referral Program</span>
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 text-red-600" />
            <span className="text-red-600 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;