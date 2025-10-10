'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaWallet, FaKey, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useSecretPhrase } from '@/redux/useSecretPhrase';

interface SecretPhraseFormProps {
  mode?: 'create' | 'update';
  onSuccess?: () => void;
}

export function SecretPhraseForm({ mode = 'create', onSuccess }: SecretPhraseFormProps) {
  const { phrase, createPhrase, updatePhrase, isLoading, error, clearError } = useSecretPhrase();
  const [phraseInput, setPhraseInput] = useState(phrase?.phrase_text || '');
  const [showPhrase, setShowPhrase] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (mode === 'create') {
        await createPhrase(phraseInput);
      } else {
        await updatePhrase(phraseInput);
      }
      
      setIsSuccess(true);
      
      // Reset success state after 2 seconds and call onSuccess
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
      
    } catch (err) {
        console.error('Submission error:', err);
      setIsSuccess(false);
    }
  };

  const wordCount = phraseInput.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isValid = wordCount === 12;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center mb-3">
          <div className="p-3 bg-blue-600 rounded-full">
            <FaWallet className="text-white text-xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'create' ? 'Connect Your Wallet' : 'Update Secret Phrase'}
        </h2>
        <p className="text-gray-400 mt-2">
          {mode === 'create' 
            ? 'Enter your 12-word secret phrase to connect' 
            : 'Update your wallet secret phrase'
          }
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaShieldAlt className="text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 p-4 bg-green-900/50 border border-green-700 text-green-200 rounded-lg"
          >
            <div className="flex items-center justify-center">
              <FaCheckCircle className="text-green-400 text-xl mr-2" />
              <span className="font-semibold">Wallet Connected Successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="secretPhrase" className="block text-sm font-medium text-gray-300 mb-3">
            <div className="flex items-center">
              <FaKey className="mr-2 text-blue-400" />
              12-Word Secret Phrase
            </div>
          </label>
          <div className="relative">
            <textarea
              id="secretPhrase"
              value={phraseInput}
              onChange={(e) => setPhraseInput(e.target.value)}
              onFocus={clearError}
              rows={4}
              placeholder="Enter your 12-word secret phrase separated by spaces..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-white placeholder-gray-500 transition-all duration-200"
              disabled={isLoading || isSuccess}
            />
            <motion.button
              type="button"
              onClick={() => setShowPhrase(!showPhrase)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-3 top-3 p-1 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showPhrase ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </div>
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className={`flex items-center ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isValid ? 'bg-green-400' : 'bg-red-400'}`} />
              {wordCount}/12 words
            </span>
            {!isValid && wordCount > 0 && (
              <span className="text-red-400 flex items-center">
                Must be exactly 12 words
              </span>
            )}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={!isValid || isLoading || isSuccess}
          whileHover={{ scale: !isValid || isLoading || isSuccess ? 1 : 1.02 }}
          whileTap={{ scale: !isValid || isLoading || isSuccess ? 1 : 0.98 }}
          className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:ring-offset-gray-900"
        >
          {isLoading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
              />
              Processing...
            </motion.span>
          ) : isSuccess ? (
            <span className="flex items-center justify-center">
              <FaCheckCircle className="mr-2 text-xl" />
              Connected!
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FaWallet className="mr-2" />
              {mode === 'create' ? 'Connect Wallet' : 'Update Phrase'}
            </span>
          )}
        </motion.button>
      </form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg"
      >
        <div className="flex items-start">
          <FaShieldAlt className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-200 font-semibold">Security Notice</p>
            <p className="text-sm text-yellow-300 mt-1">
              Never share your secret phrase with anyone. This should be stored securely and never exposed to third parties.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}