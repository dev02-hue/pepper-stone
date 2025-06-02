'use client';

import { approveCryptoDeposit, rejectCryptoDeposit } from '@/lib/depositActions';
import { getTransactions } from '@/lib/get-transactions';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  crypto_type?: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await getTransactions();
        if (fetchError) {
          setError(fetchError);
        } else if (data) {
          setTransactions(data);
        }
      } catch (err) {
        console.log(err)
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleApprove = async (transactionId: string) => {
    try {
      setProcessing(prev => ({ ...prev, [transactionId]: true }));
      const result = await approveCryptoDeposit(transactionId);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setTransactions(prev => prev.map(tx =>
          tx.id === transactionId ? { ...tx, status: 'completed' } : tx
        ));
      }
    } catch (err) {
        console.log(err)
      setError('Failed to approve transaction');
    } finally {
      setProcessing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      setProcessing(prev => ({ ...prev, [transactionId]: true }));
      const { success, error: rejectionError } = await rejectCryptoDeposit(transactionId);
      if (rejectionError) {
        setError(rejectionError);
      } else if (success) {
        setTransactions(prev => prev.map(tx =>
          tx.id === transactionId ? { ...tx, status: 'rejected' } : tx
        ));
      }
    } catch (err) {
        console.log(err)
      setError('Failed to reject transaction');
    } finally {
      setProcessing(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="p-4">No pending transactions found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.type}
                {transaction.crypto_type && (
                  <span className="ml-1 text-xs text-gray-400">({transaction.crypto_type})</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.currency}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.status === 'pending' && transaction.type === 'deposit' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(transaction.id)}
                      disabled={processing[transaction.id]}
                      className={`px-3 py-1 text-xs rounded ${processing[transaction.id]
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                      {processing[transaction.id] ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(transaction.id)}
                      disabled={processing[transaction.id]}
                      className={`px-3 py-1 text-xs rounded ${processing[transaction.id]
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                    >
                      {processing[transaction.id] ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
