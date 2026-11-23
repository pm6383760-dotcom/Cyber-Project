import React, { createContext, useContext, useState, useEffect } from 'react';
import { scanApi } from '../api/api';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [currentScan, setCurrentScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [scanError, setScanError] = useState(null);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Scan simulation steps to provide a realistic cyberpunk scanner experience
  const scanUrl = async (url) => {
    setIsScanning(true);
    setScanError(null);
    setCurrentScan(null);

    try {
      setScanStep('1/4: Parsing URL Lexical Properties & Shannon Entropy...');
      await new Promise(r => setTimeout(r, 400));

      setScanStep('2/4: Querying Domain Reputation, SSL & TLD Abuse Database...');
      await new Promise(r => setTimeout(r, 450));

      setScanStep('3/4: Executing Scikit-Learn Random Forest Feature Inference...');
      await new Promise(r => setTimeout(r, 400));

      setScanStep('4/4: Generating Explainable Threat Indicators & Safety Advisories...');

      const res = await scanApi.analyzeUrl(url);

      if (res.data && res.data.scan) {
        setCurrentScan(res.data.scan);
        // Refresh history in background
        fetchHistory();
        fetchAnalytics();
        return res.data.scan;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to analyze URL.';
      setScanError(msg);
      throw new Error(msg);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const fetchHistory = async (params = {}) => {
    setLoadingHistory(true);
    try {
      const res = await scanApi.getHistory(params);
      if (res.data && res.data.scans) {
        setHistory(res.data.scans);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await scanApi.getAnalytics();
      if (res.data && res.data.analytics) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const deleteScan = async (id) => {
    try {
      await scanApi.deleteScan(id);
      setHistory(prev => prev.filter(s => (s._id || s.id) !== id));
      if (currentScan && (currentScan.id === id || currentScan._id === id)) {
        setCurrentScan(null);
      }
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to delete scan:', err);
    }
  };

  const clearHistory = async () => {
    try {
      await scanApi.clearHistory();
      setHistory([]);
      setCurrentScan(null);
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchAnalytics();
  }, []);

  return (
    <ScanContext.Provider
      value={{
        currentScan,
        setCurrentScan,
        isScanning,
        scanStep,
        scanError,
        history,
        analytics,
        loadingHistory,
        scanUrl,
        fetchHistory,
        fetchAnalytics,
        deleteScan,
        clearHistory
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
