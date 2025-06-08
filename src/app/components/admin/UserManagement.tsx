// components/UserManagement.tsx
'use client'

import { deleteUser, getAllUsers, updateUserBalances } from '@/lib/getUserProfile';
import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSave, FiX, FiDollarSign, FiUsers } from 'react-icons/fi';
 
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  balance: number;
  usdcwallet_balance?: number;
  usdtwallet_balance?: number;
  dotwallet_balance?: number;
  xrpwallet_balance?: number;
  ethwallet_balance?: number;
  avaxwallet_balance?: number;
  adawallet_balance?: number;
  solwallet_balance?: number;
  btcwallet_balance?: number;
  bnbwallet_balance?: number;
}

const currencyFields = [
  'balance',
  'usdcwallet_balance',
  'usdtwallet_balance',
  'dotwallet_balance',
  'xrpwallet_balance',
  'ethwallet_balance',
  'avaxwallet_balance',
  'adawallet_balance',
  'solwallet_balance',
  'btcwallet_balance',
  'bnbwallet_balance'
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllUsers();
      if (result.error) {
        setError(result.error);
      } else if (result.users) {
        setUsers(result.users);
      }
    } catch (err) {
        console.log('Error fetching users:', err);
        
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({
      balance: user.balance,
      usdcwallet_balance: user.usdcwallet_balance,
      usdtwallet_balance: user.usdtwallet_balance,
      dotwallet_balance: user.dotwallet_balance,
      xrpwallet_balance: user.xrpwallet_balance,
      ethwallet_balance: user.ethwallet_balance,
      avaxwallet_balance: user.avaxwallet_balance,
      adawallet_balance: user.adawallet_balance,
      solwallet_balance: user.solwallet_balance,
      btcwallet_balance: user.btcwallet_balance,
      bnbwallet_balance: user.bnbwallet_balance
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({});
  };

  const handleUpdate = async (userId: string) => {
    if (!editForm) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await updateUserBalances(userId, editForm);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('User balances updated successfully');
        setEditingUserId(null);
        fetchUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
        console.log('Error fetching users:', err);

      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await deleteUser(userId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('User deleted successfully');
        fetchUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
        console.log('Error fetching users:', err);

      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditForm(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiUsers className="text-blue-500" /> User Management
        </h1>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !users.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {editingUserId === user.id ? (
                          <input
                            type="number"
                            value={editForm.balance || 0}
                            onChange={(e) => handleInputChange('balance', e.target.value)}
                            className="w-24 p-1 border rounded"
                          />
                        ) : (
                          `$${user.balance.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                        {editingUserId === user.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(user.id)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                              disabled={loading}
                            >
                              <FiSave /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                              disabled={loading}
                            >
                              <FiX /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <FiEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              disabled={loading}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {editingUserId && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-blue-500" /> Edit Wallet Balances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currencyFields.map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace('_balance', '').replace('wallet', '')}
                  </label>
                  <input
                    type="number"
                    value={editForm[field as keyof User] || 0}
                    onChange={(e) => handleInputChange(field as keyof User, e.target.value)}
                    className="w-full p-2 border rounded"
                    step="0.00000001"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleUpdate(editingUserId)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                disabled={loading}
              >
                <FiSave /> Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-2"
                disabled={loading}
              >
                <FiX /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}