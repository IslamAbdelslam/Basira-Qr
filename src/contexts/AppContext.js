import React, { createContext, useContext, useReducer, useEffect } from 'react';
import StorageService from '../services/StorageService';

// Types
const AppActionTypes = {
  SET_API_KEY: 'SET_API_KEY',
  SET_SETUP_COMPLETE: 'SET_SETUP_COMPLETE',
  ADD_SCAN_RESULT: 'ADD_SCAN_RESULT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Initial state
const initialState = {
  apiKey: null,
  isSetupComplete: false,
  scanHistory: [],
  isLoading: false,
  error: null,
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case AppActionTypes.SET_API_KEY:
      return {
        ...state,
        apiKey: action.payload,
      };
    case AppActionTypes.SET_SETUP_COMPLETE:
      return {
        ...state,
        isSetupComplete: action.payload,
      };
    case AppActionTypes.ADD_SCAN_RESULT:
      return {
        ...state,
        scanHistory: [action.payload, ...state.scanHistory.slice(0, 19)], // Keep last 20
      };
    case AppActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AppActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext(null);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setApiKey: async (key) => {
      try {
        await StorageService.storeApiKey(key);
        dispatch({ type: AppActionTypes.SET_API_KEY, payload: key });
        dispatch({ type: AppActionTypes.SET_SETUP_COMPLETE, payload: true });
      } catch (error) {
        console.error('Error storing API key:', error);
        throw error;
      }
    },

    addScanResult: (result) => {
      const scanResult = {
        ...result,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: AppActionTypes.ADD_SCAN_RESULT, payload: scanResult });
    },

    setLoading: (loading) => {
      dispatch({ type: AppActionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: AppActionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: AppActionTypes.SET_ERROR, payload: null });
    },

    loadInitialData: async () => {
      try {
        const apiKey = await StorageService.getApiKey();
        if (apiKey) {
          dispatch({ type: AppActionTypes.SET_API_KEY, payload: apiKey });
          dispatch({ type: AppActionTypes.SET_SETUP_COMPLETE, payload: true });
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    },
  };

  // Load initial data on mount
  useEffect(() => {
    actions.loadInitialData();
  }, []);

  const value = {
    state,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;