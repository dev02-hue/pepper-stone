'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiDollarSign, 
  FiGift, 
  FiCalendar,
  FiShield,
  FiEdit2,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
  FiRefreshCw,
  FiActivity,
  FiLock,
  FiLogOut
} from 'react-icons/fi';
import { RiVipCrownLine } from 'react-icons/ri';
import { BsCurrencyExchange } from 'react-icons/bs';
import Image from 'next/image';
import { getUserProfile } from '@/lib/getUserProfile';

const ProfileCard = ({ 
  icon, 
  title, 
  value,
  children,
  color = 'blue'
}: {
  icon: React.ReactNode,
  title: string,
  value?: string | number,
  children?: React.ReactNode,
  color?: 'blue' | 'purple' | 'green' | 'orange'
}) => {
  const colorMap = {
    blue: 'from-blue-50 to-blue-100 text-blue-600',
    purple: 'from-purple-50 to-purple-100 text-purple-600',
    green: 'from-green-50 to-green-100 text-green-600',
    orange: 'from-orange-50 to-orange-100 text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
    >
      <div className="flex items-start space-x-4">
        <div className={`bg-gradient-to-br ${colorMap[color]} p-3 rounded-xl shadow-inner`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
          {value && (
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {value}
            </p>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const ExpandableSection = ({ 
  title, 
  children,
  icon,
  defaultOpen = false
}: { 
  title: string, 
  children: React.ReactNode,
  icon?: React.ReactNode,
  defaultOpen?: boolean 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.005 }}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="bg-gray-100 p-2 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isExpanded ? (
          <FiChevronUp className="text-gray-400" />
        ) : (
          <FiChevronDown className="text-gray-400" />
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

const SecurityBadge = ({ verified, text }: { verified: boolean, text: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
      verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    <FiShield className={verified ? 'text-green-500' : 'text-yellow-500'} />
    <span>{text}</span>
  </motion.div>
);

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src="/assets/auth-required.svg"
              alt="Authentication required"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all"
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
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src="/assets/error.svg"
              alt="Error"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
          <div className="flex space-x-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all"
            >
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg shadow-md transition-all"
            >
              Go Home
            </motion.button>
          </div>
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
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-10">
            {/* <Image
              src="/assets/abstract-bg.svg"
              alt="Background pattern"
              fill
              className="object-cover"
            /> */}
          </div>
          
          <div className="p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative bg-white/20 rounded-full p-1 backdrop-blur-sm border-2 border-white/30"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <FiUser className="h-10 w-10 text-white" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 shadow-lg"
                >
                  <FiEdit2 className="h-4 w-4 text-white" />
                </motion.button>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-blue-100 mt-1 flex items-center gap-2">
                      <FiMail className="h-4 w-4" />
                      {profile.email}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <SecurityBadge 
                      verified={!!profile.auth_email} 
                      text={profile.auth_email ? 'Verified Email' : 'Email Not Verified'} 
                    />
                    <motion.span 
                      whileHover={{ y: -2 }}
                      className="bg-white/20 text-sm px-3 py-1 rounded-full border-0 flex items-center gap-1"
                    >
                      <RiVipCrownLine className="h-4 w-4 text-yellow-300" />
                      {profile.referral_level || 'Standard'} Tier
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
          className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiUser className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'security' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiLock className="h-4 w-4" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'activity' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiActivity className="h-4 w-4" />
            Activity
          </button>
        </motion.div>

        {/* Refresh Button */}
        <motion.button
          onClick={fetchProfile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors ml-auto"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </motion.button>

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
                icon={<FiDollarSign className="h-6 w-6" />}
                title="Account Balance"
                value={`$${profile.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
              />

              {/* Payment Methods */}
              <ProfileCard
                icon={<FiCreditCard className="h-6 w-6" />}
                title="Payment Methods"
                color="purple"
              >
                {/* <div className="mt-3 flex items-center">
                  <div className="w-8 h-8 relative mr-2">
                    <Image
                      src="/assets/visa.svg"
                      alt="Visa"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-8 h-8 relative mr-2">
                    <Image
                      src="/assets/mastercard.svg"
                      alt="Mastercard"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs text-gray-500">+1 more</span>
                </div> */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1"
                >
                  Manage Payment Methods
                </motion.button>
              </ProfileCard>

              {/* Recent Transactions */}
              <ProfileCard
                icon={<BsCurrencyExchange className="h-6 w-6" />}
                title="Recent Transactions"
                color="green"
              >
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-gray-500">This month</p>
                  <p className="font-medium">12 transactions</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1"
                >
                  View All Transactions
                </motion.button>
              </ProfileCard>

              {/* Contact Information */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection 
                  title="Contact Information"
                  icon={<FiMail className="h-5 w-5 text-blue-500" />}
                  defaultOpen
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FiMail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    {profile.phone_number ? (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FiPhone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{profile.phone_number}</p>
                        </div>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FiPhone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-blue-600">Add phone number</p>
                          </div>
                        </div>
                        <FiEdit2 className="h-4 w-4 text-gray-400" />
                      </motion.button>
                    )}
                  </div>
                </ExpandableSection>
              </div>

              {/* Referral Program */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection 
                  title="Referral Program"
                  icon={<FiGift className="h-5 w-5 text-purple-500" />}
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiGift className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Your Referral Code</p>
                          <p className="font-medium text-lg">
                            {profile.referral_code || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RiVipCrownLine className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Tier Level</p>
                          <p className="font-medium">
                            {profile.referral_level || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-md"
                    >
                      View Referral Dashboard
                    </motion.button>
                  </div>
                </ExpandableSection>
              </div>

              {/* Account Information */}
              <div className="sm:col-span-2 lg:col-span-1">
                <ExpandableSection 
                  title="Account Information"
                  icon={<FiCalendar className="h-5 w-5 text-orange-500" />}
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">
                            {format(new Date(profile.created_at), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">
                            {format(new Date(profile.updated_at), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 mt-4 py-2 text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Sign Out
                    </motion.button>
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
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h3>
                <p className="text-gray-500">Security features coming soon</p>
              </div>
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
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <p className="text-gray-500">Activity log coming soon</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}