import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PCMPage from './pages/PCMPage';
import DeltaPage from './pages/DeltaPage';

type TabType = 'pcm' | 'delta';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pcm');

  const tabs = [
    { id: 'pcm' as TabType, label: 'PCM', icon: '📊' },
    { id: 'delta' as TabType, label: 'Delta Modulation', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Signal Modulation Tool
              </h1>
              <p className="text-gray-400 text-sm">
                PCM & Delta Modulation Simulator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-medium transition-all duration-200 border-b-4 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-400 bg-gray-700'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'pcm' && <PCMPage />}
          {activeTab === 'delta' && <DeltaPage />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 relative">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>
              Signal Modulation Simulation Tool - Educational Platform
            </p>
          </div>
        </div>
        
        {/* Made with Replit Button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full transition-colors flex items-center space-x-1">
            <span>🔨</span>
            <span>Made with Replit</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
