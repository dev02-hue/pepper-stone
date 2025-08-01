'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiRefreshCw, FiSearch, FiInfo } from 'react-icons/fi'
import { getAllLoans, approveLoan, rejectLoan } from '@/lib/loan'
import type { Loan } from '@/lib/loan'

export default function AdminLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState({
    loans: true,
    processing: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('pending')
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    const filtered = loans.filter(loan => {
      const matchesStatus = selectedStatus === 'all' || loan.status === selectedStatus
      const matchesSearch = loan.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${loan.firstName || ''} ${loan.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.reference.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && (searchTerm === '' || matchesSearch)
    })
    setFilteredLoans(filtered)
  }, [loans, searchTerm, selectedStatus])

  const fetchLoans = async () => {
    setLoading(prev => ({ ...prev, loans: true }))
    setError('')
    try {
      const result = await getAllLoans()
      if (result.error) throw new Error(result.error)
      setLoans(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loans')
    } finally {
      setLoading(prev => ({ ...prev, loans: false }))
    }
  }

  const handleApprove = async (loanId: string) => {
    setLoading(prev => ({ ...prev, processing: true }))
    setError('')
    setSuccess('')
    try {
      const result = await approveLoan(loanId)
      if (result.error) throw new Error(result.error)
      setSuccess('Loan approved successfully!')
      fetchLoans()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve loan')
    } finally {
      setLoading(prev => ({ ...prev, processing: false }))
    }
  }

  const handleReject = async (loanId: string) => {
    setLoading(prev => ({ ...prev, processing: true }))
    setError('')
    setSuccess('')
    try {
      const result = await rejectLoan(loanId, 'Rejected by admin')
      if (result.error) throw new Error(result.error)
      setSuccess('Loan rejected successfully!')
      fetchLoans()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject loan')
    } finally {
      setLoading(prev => ({ ...prev, processing: false }))
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Loan Administration
      </motion.h1>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          {success}
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user email, name or reference..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={fetchLoans}
              disabled={loading.loans}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={loading.loans ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {loading.loans ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No loans found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${loan.firstName || ''} ${loan.lastName || ''}`.trim() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{loan.userEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${loan.amount} - {loan.planTitle}</div>
                      <div className="text-sm text-gray-500">{loan.reference}</div>
                      {loan.purpose && (
                        <div className="text-xs text-gray-400 mt-1">Purpose: {loan.purpose}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {loan.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(loan.id)}
                            disabled={loading.processing}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <FiCheck className="inline mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(loan.id)}
                            disabled={loading.processing}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <FiX className="inline mr-1" /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedLoan(loan)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiInfo className="inline mr-1" /> Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Loan Details</h3>
              <button
                onClick={() => setSelectedLoan(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">User Information</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {`${selectedLoan.firstName || ''} ${selectedLoan.lastName || ''}`.trim() || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {selectedLoan.userEmail || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Loan Information</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Reference:</span> {selectedLoan.reference}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span> ${selectedLoan.amount}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Plan:</span> {selectedLoan.planTitle}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(selectedLoan.status)}`}>
                      {selectedLoan.status}
                    </span>
                  </p>
                </div>
              </div>

              {selectedLoan.purpose && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Purpose</h4>
                  <p className="text-sm">{selectedLoan.purpose}</p>
                </div>
              )}

              {selectedLoan.repaymentSchedule && selectedLoan.repaymentSchedule.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Repayment Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedLoan.repaymentSchedule.map((repayment, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {new Date(repayment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              ${repayment.amount}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(repayment.status)}`}>
                                {repayment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedLoan.adminNotes && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h4>
                  <p className="text-sm">{selectedLoan.adminNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}