'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiDollarSign, 
  FiClock,  
  FiInfo, 
  FiPlus,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiTrendingUp,
} from 'react-icons/fi'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { getLoanPlans, initiateLoan, getUserLoans } from '@/lib/loan'
import type { LoanPlan, Loan } from '@/lib/loan'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

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

  // Fetch data on component mount
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

  // Format currency
  const formatCurrency = useCallback((value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), [])

  // Format dates
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Prepare data for charts
  const prepareLoanAmountsData = useCallback(() => {
    return userLoans.map(loan => ({
      name: loan.planTitle || 'Unknown Plan',
      amount: loan.amount,
      status: loan.status
    }))
  }, [userLoans])

  const prepareLoanStatusData = useCallback(() => {
    const statusCounts: Record<string, number> = {}
    
    userLoans.forEach(loan => {
      statusCounts[loan.status] = (statusCounts[loan.status] || 0) + 1
    })
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [userLoans])

  // Handle loan initiation
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

  // Status color mapping
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

  // Reset modal state
  const resetModal = () => {
    setInitiateModal({ open: false, planId: '', amount: 0, purpose: '' })
    setError('')
    setSuccess('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
          <p className="text-gray-600 mt-1">Apply for loans and track your applications</p>
        </div>
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

      {/* Dashboard Summary */}
      {!loading.loans && userLoans.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Borrowed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    userLoans.reduce((sum, loan) => sum + loan.amount, 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <FiDollarSign size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Loans</p>
                <p className="text-2xl font-bold text-green-600">
                  {userLoans.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <FiTrendingUp size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Applications</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userLoans.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                <FiClock size={20} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Visualization */}
      {!loading.loans && userLoans.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Amounts</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareLoanAmountsData()}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Plan: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" name="Loan Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareLoanStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareLoanStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} loans`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loan Plans Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Loan Plans</h2>
        {loading.plans ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <FiDollarSign className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Plans Available</h3>
            <p className="text-gray-500">There are currently no loan plans offered.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{plan.title}</h3>
                      <p className="text-gray-600 mt-1 text-sm">
                        {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {plan.interest}% interest
                    </span>
                  </div>

                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{plan.durationDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repayment:</span>
                      <span className="font-medium capitalize">{plan.repaymentInterval}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">{plan.repaymentInterval}%</span>
                    </div> */}
                  </div>

                  <button
                    onClick={() => setInitiateModal({
                      open: true,
                      planId: plan.id,
                      amount: plan.minAmount,
                      purpose: ''
                    })}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
                  >
                    <FiPlus size={16} /> Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* User Loans Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Loan Applications</h2>
        {loading.loans ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : userLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <FiDollarSign className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Applications</h3>
            <p className="text-gray-500 mb-4">You haven&apos;t applied for any loans yet.</p>
            <button
              onClick={() => setInitiateModal({ open: true, planId: '', amount: 0, purpose: '' })}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" /> Apply for Loan
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Details
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
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(loan.amount)}</div>
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
      </motion.section>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
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
                      Min: {formatCurrency(plans.find(p => p.id === initiateModal.planId)?.minAmount || 0)}, 
                      Max: {formatCurrency(plans.find(p => p.id === initiateModal.planId)?.maxAmount || 0)}
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
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">{selectedLoan.planTitle}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor(selectedLoan.status)} capitalize`}>
                        {selectedLoan.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedLoan.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Application Date:</span>
                      <span className="font-medium">{formatDate(selectedLoan.createdAt)}</span>
                    </div>
                  </div>

                  {selectedLoan.purpose && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700">Purpose</h5>
                      <p className="text-gray-600">{selectedLoan.purpose}</p>
                    </div>
                  )}
                </div>

                <div>
                  {selectedLoan.approvedAt && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Approval Details</h5>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Approved On:</span>
                        <span className="font-medium">{formatDate(selectedLoan.approvedAt)}</span>
                      </div>
                      {selectedLoan.dueDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{formatDate(selectedLoan.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedLoan.repaymentSchedule && selectedLoan.repaymentSchedule.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Repayment Schedule</h5>
                      <div className="border rounded-lg divide-y">
                        {selectedLoan.repaymentSchedule.map((repayment, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Payment {index + 1}</p>
                              <p className="text-sm text-gray-500">{formatDate(repayment.dueDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(repayment.amount)}</p>
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