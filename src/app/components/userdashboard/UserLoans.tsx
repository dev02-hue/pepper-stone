'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiDollarSign, 
  FiClock,  
  FiInfo, 
  FiPlus,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiArrowRight
} from 'react-icons/fi'
import { getLoanPlans, initiateLoan, getUserLoans } from '@/lib/loan'
import type { LoanPlan, Loan } from '@/lib/loan'

export default function UserLoans() {
  const [plans, setPlans] = useState<LoanPlan[]>([])
  const [userLoans, setUserLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState({
    plans: true,
    loans: true,
    initiating: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [initiateModal, setInitiateModal] = useState({
    open: false,
    planId: '',
    amount: 0,
    purpose: ''
  })
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, loansData] = await Promise.all([
          getLoanPlans(),
          getUserLoans()
        ])

        if (plansData.error) throw new Error(plansData.error)
        setPlans(plansData.data || [])
        
        if (loansData.error) throw new Error(loansData.error)
        setUserLoans(loansData.data || [])
        
        setLoading({ plans: false, loans: false, initiating: false })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setLoading({ plans: false, loans: false, initiating: false })
      }
    }

    fetchData()
  }, [])

  const handleInitiateLoan = async () => {
    if (!initiateModal.planId || initiateModal.amount <= 0) {
      setError('Please select a plan and enter a valid amount')
      return
    }

    setLoading(prev => ({ ...prev, initiating: true }))
    setError('')
    setSuccess('')

    try {
      const result = await initiateLoan({
        planId: initiateModal.planId,
        amount: initiateModal.amount,
        purpose: initiateModal.purpose
      })

      if (result.error) throw new Error(result.error)

      setSuccess('Loan application submitted successfully!')
      setInitiateModal({ open: false, planId: '', amount: 0, purpose: '' })

      // Refresh loans
      const loansData = await getUserLoans()
      if (loansData.error) throw new Error(loansData.error)
      setUserLoans(loansData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate loan')
    } finally {
      setLoading(prev => ({ ...prev, initiating: false }))
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const resetModal = () => {
    setInitiateModal({ open: false, planId: '', amount: 0, purpose: '' })
    setError('')
    setSuccess('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
        <button
          onClick={() => setInitiateModal({ ...initiateModal, open: true })}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <FiPlus size={18} /> Apply for Loan
        </button>
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md"
          >
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-3" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md"
          >
            <div className="flex items-center">
              <FiCheck className="text-green-500 mr-3" />
              <div>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Loan Plans Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Available Loan Plans</h2>
            {loading.plans && (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            )}
          </div>

          {loading.plans ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No loan plans currently available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setInitiateModal({
                    open: true,
                    planId: plan.id,
                    amount: plan.minAmount,
                    purpose: ''
                  })}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{plan.title}</h3>
                      <p className="text-gray-600 mt-1 text-sm">
                        ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {plan.interest}% interest
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      <span>{plan.durationDays} days term</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-gray-400" />
                      <span className="capitalize">{plan.repaymentInterval} payments</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      Apply now <FiArrowRight className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Loans Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Loan Applications</h2>
            {loading.loans && (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            )}
          </div>

          {loading.loans ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userLoans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven&apos;t applied for any loans yet
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userLoans.map((loan) => (
                      <motion.tr
                        key={loan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="cursor-pointer"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">${loan.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{loan.planTitle}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(loan.status)} capitalize`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(loan.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLoan(loan)
                            }}
                          >
                            <FiInfo className="inline mr-1" /> Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Initiate Loan Modal */}
      <AnimatePresence>
        {initiateModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Apply for Loan</h3>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Plan</label>
                  <select
                    value={initiateModal.planId}
                    onChange={(e) => setInitiateModal({ ...initiateModal, planId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title} (${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={initiateModal.amount || ''}
                    onChange={(e) => setInitiateModal({ ...initiateModal, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    min={plans.find(p => p.id === initiateModal.planId)?.minAmount || 0}
                    max={plans.find(p => p.id === initiateModal.planId)?.maxAmount || 1000000}
                  />
                  {initiateModal.planId && (
                    <p className="mt-1 text-xs text-gray-500">
                      Min: ${plans.find(p => p.id === initiateModal.planId)?.minAmount.toLocaleString()}, 
                      Max: ${plans.find(p => p.id === initiateModal.planId)?.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                  <textarea
                    value={initiateModal.purpose}
                    onChange={(e) => setInitiateModal({ ...initiateModal, purpose: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="What will you use this loan for?"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={resetModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiateLoan}
                  disabled={loading.initiating || !initiateModal.planId || initiateModal.amount <= 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.initiating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Submit Application'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loan Details Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLoan(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Loan Details</h3>
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">${selectedLoan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-medium">{selectedLoan.planTitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(selectedLoan.status)} capitalize`}>
                      {selectedLoan.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(selectedLoan.createdAt)}</p>
                  </div>
                </div>

                {selectedLoan.approvedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Approved On</p>
                    <p className="font-medium">{formatDate(selectedLoan.approvedAt)}</p>
                  </div>
                )}

                {selectedLoan.dueDate && (
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{formatDate(selectedLoan.dueDate)}</p>
                  </div>
                )}

                {selectedLoan.purpose && (
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium">{selectedLoan.purpose}</p>
                  </div>
                )}

                {selectedLoan.adminNotes && (
                  <div>
                    <p className="text-sm text-gray-500">Admin Notes</p>
                    <p className="font-medium">{selectedLoan.adminNotes}</p>
                  </div>
                )}

                {selectedLoan.repaymentSchedule && selectedLoan.repaymentSchedule.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Repayment Schedule</p>
                    <div className="border rounded-lg divide-y">
                      {selectedLoan.repaymentSchedule.map((repayment, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Payment {index + 1}</p>
                            <p className="text-sm text-gray-500">{formatDate(repayment.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${repayment.amount.toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              repayment.status === 'paid' ? 'bg-green-100 text-green-800' :
                              repayment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {repayment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}