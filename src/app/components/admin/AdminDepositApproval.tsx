'use client'
import { useState, useEffect } from 'react';
 import { getTransactions } from '@/lib/get-transactions';
import { approveCryptoDeposit, rejectCryptoDeposit } from '@/lib/depositActions';

export default function CryptoDepositsTable() {
  interface Transaction {
    id: string;
    user_email: string;
    crypto_type: string;
    amount: number;
    reference: string;
    created_at: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPendingDeposits = async () => {
      try {
        setLoading(true);
        const result = await getTransactions();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setTransactions(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDeposits();
  }, []);

  const handleApprove = async (transactionId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [transactionId]: true }));
      const result = await approveCryptoDeposit(transactionId);
      
      if (result.success) {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [transactionId]: true }));
      const result = await rejectCryptoDeposit(transactionId);
      
      if (result.success) {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejection failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  if (loading) return <div className="text-center py-8">Loading transactions...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No pending deposits found
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tx.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.crypto_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(tx.id)}
                      disabled={actionLoading[tx.id]}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
                    >
                      {actionLoading[tx.id] ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(tx.id)}
                      disabled={actionLoading[tx.id]}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                    >
                      {actionLoading[tx.id] ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}