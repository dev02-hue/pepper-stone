// app/profile/page.tsx
import { getUserProfile } from '@/lib/getUserProfile';
import { format } from 'date-fns';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaDollarSign, 
  FaGift, 
  FaCalendarAlt,
  FaShieldAlt
} from 'react-icons/fa';

export default async function ProfilePage() {
  const { profile, error } = await getUserProfile();

  if (error === 'signin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-white/20 rounded-full p-3">
                <FaUser className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-blue-100 mt-1">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 text-sm px-3 py-1 rounded-full border-0">
                    {profile.referral_level || 'Standard'} Tier
                  </span>
                  <span className="bg-white/20 text-sm px-3 py-1 rounded-full border-0 flex items-center gap-1">
                    <FaShieldAlt className="h-3 w-3" />
                    Verified {profile.auth_email ? 'Email' : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Balance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Account Balance</p>
                <p className="text-3xl font-semibold mt-1">
                  ${profile.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="h-5 w-5 text-gray-500" />
                <p>{profile.email}</p>
              </div>
              {profile.phone_number && (
                <div className="flex items-center space-x-2">
                  <FaPhone className="h-5 w-5 text-gray-500" />
                  <p>{profile.phone_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Referral Program */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Referral Program</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FaGift className="h-5 w-5 text-gray-500" />
                <p>Code: {profile.referral_code || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaGift className="h-5 w-5 text-gray-500" />
                <p>Level: {profile.referral_level || 'Standard'}</p>
              </div>
            </div>
          </div>

          {/* Account Dates */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Account Dates</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="h-5 w-5 text-gray-500" />
                <p>Created: {format(new Date(profile.created_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="h-5 w-5 text-gray-500" />
                <p>Updated: {format(new Date(profile.updated_at), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}