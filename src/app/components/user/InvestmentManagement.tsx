'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 
  FiTrendingUp, 
  
  FiInfo, 
  FiPlus, 
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiX,
  FiCalendar,
 
} from 'react-icons/fi'
import { 
  createInvestment,
  getUserInvestments,
  getInvestmentPlans,
  processInvestmentPayouts,
  type UserInvestment,
  type InvestmentPlan
} from '@/lib/investmentPlanActions'

export default function InvestmentManagement() {
  const [investments, setInvestments] = useState<UserInvestment[]>([])
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState({
    investments: true,
    plans: true,
    creating: false,
    processing: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createModal, setCreateModal] = useState({
    open: false,
    planId: '',
    amount: 0
  })
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ investments: true, plans: true, creating: false, processing: false });
        setError('');
        
        const [investmentsData, plansData] = await Promise.all([
          getUserInvestments(),
          getInvestmentPlans()
        ]);
  
        // Explicitly check for errors in responses
        if (investmentsData?.error) {
          throw new Error(investmentsData.error);
        }
        if (plansData?.error) {
          throw new Error(plansData.error);
        }
  
        // Ensure data exists before setting state
        setInvestments(investmentsData?.data || []);
        setPlans(plansData?.data || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Fetch error:', err);
      } finally {
        setLoading({ investments: false, plans: false, creating: false, processing: false });
      }
    };
  
    fetchData();
  }, []);

  const handleCreateInvestment = async () => {
    if (!createModal.planId || createModal.amount <= 0) {
      setError('Please select a plan and enter a valid amount')
      return
    }

    setLoading(prev => ({ ...prev, creating: true }))
    setError('')
    setSuccess('')

    try {
      const result = await createInvestment(
        createModal.planId,
        createModal.amount
      )

      if (result.error) throw new Error(result.error)

      setSuccess('Investment created successfully!')
      setCreateModal({ open: false, planId: '', amount: 0 })

      // Refresh investments
      const investmentsData = await getUserInvestments()
      if (investmentsData.error) throw new Error(investmentsData.error)
      setInvestments(investmentsData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create investment')
    } finally {
      setLoading(prev => ({ ...prev, creating: false }))
    }
  }

  const handleProcessPayouts = async () => {
    if (!confirm('Are you sure you want to process investment payouts?')) return
    
    setLoading(prev => ({ ...prev, processing: true }))
    setError('')
    setSuccess('')

    try {
      const result = await processInvestmentPayouts()
      
      if (result.error) throw new Error(result.error)
      
      setSuccess('Investment payouts processed successfully!')
      
      // Refresh investments
      const investmentsData = await getUserInvestments()
      if (investmentsData.error) throw new Error(investmentsData.error)
      setInvestments(investmentsData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payouts')
    } finally {
      setLoading(prev => ({ ...prev, processing: false }))
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
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

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = Date.now()
    
    if (now >= end) return 100
    if (now <= start) return 0
    
    return ((now - start) / (end - start)) * 100
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Investment Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage your investments and track returns</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleProcessPayouts}
            disabled={loading.processing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading.processing ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <FiRefreshCw />
            )}
            Process Payouts
          </button>
          <button
            onClick={() => setCreateModal({ open: true, planId: '', amount: 0 })}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus size={18} /> New Investment
          </button>
        </div>
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

      {/* Investments Grid */}
      {loading.investments ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : investments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <FiTrendingUp className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Investments</h3>
          <p className="text-gray-500 mb-4">You don&apos;t have any investments yet. Start by creating a new investment.</p>
          <button
            onClick={() => setCreateModal({ open: true, planId: '', amount: 0 })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" /> Create Investment
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => (
            <motion.div
              key={investment.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => setSelectedInvestment(investment)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{investment.planTitle}</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      ${investment.amount.toLocaleString()} @ {investment.planPercentage}%
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor(investment.status)} capitalize`}>
                    {investment.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(calculateProgress(investment.startDate, investment.endDate))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${calculateProgress(investment.startDate, investment.endDate)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(investment.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(investment.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expected Return</p>
                    <p className="font-medium">${investment.expectedReturn.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payouts</p>
                    <p className="font-medium">{investment.totalPayouts}</p>
                  </div>
                </div>
              </div>
              {investment.nextPayoutDate && investment.status === 'active' && (
                <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                  <div className="flex items-center text-blue-700 text-sm">
                    <FiCalendar className="mr-2" />
                    <span>Next payout: {formatDate(investment.nextPayoutDate)}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Investment Modal */}
      <AnimatePresence>
        {createModal.open && (
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
                <h3 className="text-xl font-semibold text-gray-900">New Investment</h3>
                <button
                  onClick={() => setCreateModal({ open: false, planId: '', amount: 0 })}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Plan</label>
                  <select
                    value={createModal.planId}
                    onChange={(e) => setCreateModal({ ...createModal, planId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title} (${plan.min_amount.toLocaleString()} - ${plan.max_amount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {createModal.planId && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <FiInfo className="mr-2" />
                      Plan Details
                    </h4>
                    {plans.find(p => p.id === createModal.planId) && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Return:</span>
                          <span className="font-medium ml-1">
                            {plans.find(p => p.id === createModal.planId)?.percentage}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium ml-1">
                            {plans.find(p => p.id === createModal.planId)?.duration_days} days
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Payout Interval:</span>
                          <span className="font-medium ml-1">
                            Every {plans.find(p => p.id === createModal.planId)?.interval_days} days
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Amount:</span>
                          <span className="font-medium ml-1">
                            ${plans.find(p => p.id === createModal.planId)?.min_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={createModal.amount || ''}
                    onChange={(e) => setCreateModal({ ...createModal, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    min={plans.find(p => p.id === createModal.planId)?.min_amount || 0}
                    max={plans.find(p => p.id === createModal.planId)?.max_amount || 1000000}
                  />
                  {createModal.planId && (
                    <p className="mt-1 text-xs text-gray-500">
                      Min: ${plans.find(p => p.id === createModal.planId)?.min_amount.toLocaleString()}, 
                      Max: ${plans.find(p => p.id === createModal.planId)?.max_amount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setCreateModal({ open: false, planId: '', amount: 0 })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvestment}
                  disabled={loading.creating || !createModal.planId || createModal.amount <= 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.creating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Create Investment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investment Details Modal */}
      <AnimatePresence>
        {selectedInvestment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedInvestment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Investment Details</h3>
                <button
                  onClick={() => setSelectedInvestment(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">{selectedInvestment.planTitle}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor(selectedInvestment.status)} capitalize`}>
                        {selectedInvestment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${selectedInvestment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Return Rate:</span>
                      <span className="font-medium">{selectedInvestment.planPercentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-medium">${selectedInvestment.expectedReturn.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedInvestment.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{formatDate(selectedInvestment.endDate)}</span>
                    </div>
                    {selectedInvestment.nextPayoutDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Next Payout:</span>
                        <span className="font-medium">{formatDate(selectedInvestment.nextPayoutDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Payouts:</span>
                      <span className="font-medium">{selectedInvestment.totalPayouts}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Investment Progress</h5>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${calculateProgress(selectedInvestment.startDate, selectedInvestment.endDate)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Start</span>
                      <span>{Math.round(calculateProgress(selectedInvestment.startDate, selectedInvestment.endDate))}%</span>
                      <span>End</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h5 className="font-medium text-blue-800 mb-3 flex items-center">
                      <FiTrendingUp className="mr-2" />
                      Projected Returns
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Principal:</span>
                        <span className="font-medium">${selectedInvestment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Returns:</span>
                        <span className="font-medium">${selectedInvestment.expectedReturn.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-medium text-green-600">
                          ${(selectedInvestment.amount + selectedInvestment.expectedReturn).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedInvestment(null)}
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