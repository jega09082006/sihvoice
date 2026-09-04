import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import UploadAnalyze from './pages/UploadAnalyze';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

function AnimatedRoutes({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <UploadAnalyze />
            </motion.div>
          }
        />

        <Route
          path="/analytics"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Analytics />
            </motion.div>
          }
        />

        <Route
          path="*"
          element={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-gray-100 font-mono transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="flex-1">
          <AnimatedRoutes theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </Router>
  );
}
