'use client';

import { useState, useCallback } from 'react';
 import {createSecretPhrase }from '@/lib/phrase';
 import{ getSecretPhrase }from '@/lib/phrase';
 import {updateSecretPhrase} from '@/lib/phrase';
 import{ deleteSecretPhrase} from '@/lib/phrase';

interface SecretPhrase {
  id: string;
  user_id: string;
  phrase_text: string;
  created_at: string;
  updated_at: string;
}

interface UseSecretPhraseReturn {
  // State
  phrase: SecretPhrase | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createPhrase: (phrase: string) => Promise<void>;
  fetchPhrase: () => Promise<void>;
  updatePhrase: (newPhrase: string) => Promise<void>;
  deletePhrase: () => Promise<void>;
  clearError: () => void;
}

export function useSecretPhrase(): UseSecretPhraseReturn {
  const [phrase, setPhrase] = useState<SecretPhrase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createPhrase = useCallback(async (phraseText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createSecretPhrase(phraseText);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.success && result.data) {
        setPhrase(result.data);
        // You can show a toast notification here
        console.log(result.message); // "Wallet connected successfully"
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Create phrase error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPhrase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getSecretPhrase();
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.success && result.data) {
        setPhrase(result.data);
      }
    } catch (err) {
      setError('Failed to fetch secret phrase');
      console.error('Fetch phrase error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePhrase = useCallback(async (newPhrase: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateSecretPhrase(newPhrase);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.success && result.data) {
        setPhrase(result.data);
        console.log(result.message); // "Secret phrase updated successfully"
      }
    } catch (err) {
      setError('Failed to update secret phrase');
      console.error('Update phrase error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePhrase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteSecretPhrase();
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.success) {
        setPhrase(null);
        console.log(result.message); // "Secret phrase deleted successfully"
      }
    } catch (err) {
      setError('Failed to delete secret phrase');
      console.error('Delete phrase error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    phrase,
    isLoading,
    error,
    createPhrase,
    fetchPhrase,
    updatePhrase,
    deletePhrase,
    clearError,
  };
}