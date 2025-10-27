import { useState, useEffect } from 'react';
import { AppState, AppLaunchState } from '../types/AppState';

// Initial app state with default values
const initialAppState: AppState = {
  windowSize: {
    width: 1200,
    height: 800,
    minWidth: 1280,
    minHeight: 720,
  },
  isAppReady: false,
  hasError: false,
  errorMessage: undefined,
  library: [],
  timeline: [],
  selectedClipId: null,
};

/**
 * Custom hook for managing app state during launch and runtime
 * Handles initialization, error states, and provides state management
 */
export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [launchState, setLaunchState] = useState<AppLaunchState>({
    isReady: false,
    windowSize: { width: 1200, height: 800 },
    error: null,
  });

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setAppState(prev => ({
          ...prev,
          isAppReady: true,
          hasError: false,
          errorMessage: undefined,
        }));
        
        setLaunchState(prev => ({
          ...prev,
          isReady: true,
          error: null,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        setAppState(prev => ({
          ...prev,
          isAppReady: false,
          hasError: true,
          errorMessage,
        }));
        
        setLaunchState(prev => ({
          ...prev,
          isReady: false,
          error: errorMessage,
        }));
      }
    };

    initializeApp();
  }, []);

  // Update window size
  const updateWindowSize = (width: number, height: number) => {
    setAppState(prev => ({
      ...prev,
      windowSize: {
        ...prev.windowSize,
        width,
        height,
      },
    }));
    
    setLaunchState(prev => ({
      ...prev,
      windowSize: { width, height },
    }));
  };

  // Set error state
  const setError = (errorMessage: string) => {
    setAppState(prev => ({
      ...prev,
      hasError: true,
      errorMessage,
      isAppReady: false,
    }));
    
    setLaunchState(prev => ({
      ...prev,
      error: errorMessage,
      isReady: false,
    }));
  };

  // Clear error state
  const clearError = () => {
    setAppState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
      isAppReady: true,
    }));
    
    setLaunchState(prev => ({
      ...prev,
      error: null,
      isReady: true,
    }));
  };

  return {
    appState,
    launchState,
    updateWindowSize,
    setError,
    clearError,
  };
};
