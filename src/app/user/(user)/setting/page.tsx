// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWallet, 
  FaKey, 
  FaEnvelope, 
  FaSignOutAlt,
  FaChevronRight,
  FaUserShield,
  FaBell,
  FaLanguage,
  FaPalette
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences'>('account');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  const settingsOptions = {
    account: [
      {
        title: "Wallet Manager",
        icon: <FaWallet className="text-blue-500" />,
        action: () => handleNavigation('/user/wallet-manager'),
        description: "Manage your connected wallets and addresses"
      },
      {
        title: "Change Email",
        icon: <FaEnvelope className="text-purple-500" />,
        action: () => handleNavigation('/user/change-email'),
        description: "Update your account email address"
      }
    ],
    security: [
      {
        title: "Change Password",
        icon: <FaKey className="text-green-500" />,
        action: () => handleNavigation('/change-password'),
        description: "Update your account password"
      },
      {
        title: "Two-Factor Authentication",
        icon: <FaUserShield className="text-orange-500" />,
        action: () => handleNavigation('/two-factor-auth'),
        description: "Enable extra security for your account"
      }
    ],
    preferences: [
      {
        title: "Notification Settings",
        icon: <FaBell className="text-yellow-500" />,
        action: () => handleNavigation('/notifications'),
        description: "Customize your notification preferences"
      },
      {
        title: "Language",
        icon: <FaLanguage className="text-red-500" />,
        action: () => handleNavigation('/language'),
        description: "Change application language"
      },
      {
        title: "Appearance",
        icon: <FaPalette className="text-indigo-500" />,
        action: () => handleNavigation('/appearance'),
        description: "Dark mode and theme settings"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Settings Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Preferences
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {settingsOptions[activeTab].map((option, index) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={index}
                    onClick={option.action}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{option.title}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sign Out Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full mt-8 flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <FaSignOutAlt />
          <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
        </motion.button>

        {/* Coming Soon Section */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Transaction History",
              "API Keys",
              "Linked Accounts",
              "Privacy Settings",
              "Billing Information",
              "Export Data"
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <h3 className="font-medium text-gray-700">{item}</h3>
                <p className="text-sm text-gray-500 mt-1">Available in next update</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;