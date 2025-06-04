// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaDollarSign, 
  FaGift, 
  FaCalendarAlt,
  FaShieldAlt,
  FaEdit,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { RiVipCrownFill } from 'react-icons/ri';
import { BsFillCreditCardFill, BsCurrencyExchange } from 'react-icons/bs';
import { getUserProfile } from '@/lib/getUserProfile';

const ProfileCard = ({ 
  icon, 
  title, 
  value,
  children 
}: {
  icon: React.ReactNode,
  title: string,
  value?: string | number,
  children?: React.ReactNode
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start space-x-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        {value && (
          <p className="text-xl font-semibold mt-1 text-gray-800">
            {value}
          </p>
        )}
        {children}
      </div>
    </div>
  </motion.div>
);

const ExpandableSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isExpanded ? (
          <FaChevronUp className="text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ProfilePage() {
  interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    balance?: number;
    phone_number?: string;
    referral_code?: string;
    referral_level?: string;
    auth_email?: boolean;
    created_at: string;
    updated_at: string;
  }

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'activity'>('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { profile, error } = await getUserProfile();
        if (error) {
          setError(error);
        } else {
          if (profile) {
            setProfile(profile);
          }
        }
      } catch (err) {
        console.log(err)
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error === 'signin') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md border border-gray-100">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
          >
            Sign In
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (error || !profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md border border-gray-100">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative bg-white/20 rounded-full p-4 backdrop-blur-sm"
              >
                <FaUser className="h-10 w-10" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 shadow-md"
                >
                  <FaEdit className="h-4 w-4" />
                </motion.button>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-blue-100 mt-1 flex items-center gap-2">
                      <FaEnvelope className="h-4 w-4" />
                      {profile.email}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <motion.span 
                      whileHover={{ y: -2 }}
                      className="bg-white/20 text-sm px-3 py-1 rounded-full border-0 flex items-center gap-1"
                    >
                      <RiVipCrownFill className="h-3 w-3 text-yellow-300" />
                      {profile.referral_level || 'Standard'} Tier
                    </motion.span>
                    <motion.span 
                      whileHover={{ y: -2 }}
                      className="bg-white/20 text-sm px-3 py-1 rounded-full border-0 flex items-center gap-1"
                    >
                      <FaShieldAlt className="h-3 w-3 text-green-300" />
                      Verified {profile.auth_email ? 'Email' : 'User'}
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'security' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'activity' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Activity
          </button>
        </motion.div>

        {/* Profile Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Account Balance */}
              <ProfileCard
                icon={<FaDollarSign className="h-6 w-6 text-blue-600" />}
                title="Account Balance"
                value={`$${profile.balance?.toFixed(2) || '0.00'}`}
              />

              {/* Payment Methods */}
              <ProfileCard
                icon={<BsFillCreditCardFill className="h-6 w-6 text-purple-600" />}
                title="Payment Methods"
              >
                <p className="text-gray-500 mt-2">3 cards linked</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1"
                >
                  Manage Cards
                </motion.button>
              </ProfileCard>

              {/* Transactions */}
              <ProfileCard
                icon={<BsCurrencyExchange className="h-6 w-6 text-green-600" />}
                title="Recent Transactions"
              >
                <p className="text-gray-500 mt-2">12 transactions this month</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1"
                >
                  View All
                </motion.button>
              </ProfileCard>

              {/* Contact Information */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection title="Contact Information">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    {profile.phone_number && (
                      <div className="flex items-center space-x-3">
                        <FaPhone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile.phone_number}</p>
                        </div>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1"
                    >
                      Update Contact Info
                    </motion.button>
                  </div>
                </ExpandableSection>
              </div>

              {/* Referral Program */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection title="Referral Program">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaGift className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Your Code</p>
                        <p className="font-medium">{profile.referral_code || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RiVipCrownFill className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Tier Level</p>
                        <p className="font-medium">{profile.referral_level || 'Standard'}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1"
                    >
                      View Referral Stats
                    </motion.button>
                  </div>
                </ExpandableSection>
              </div>

              {/* Account Dates */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection title="Account Information">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {format(new Date(profile.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">
                          {format(new Date(profile.updated_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </ExpandableSection>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Security content would go here */}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Activity content would go here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}