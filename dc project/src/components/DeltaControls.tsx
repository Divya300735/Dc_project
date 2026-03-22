import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { processDelta } from '../utils/signalProcessing';
import { DeltaControls as DeltaControlsType, DeltaData } from '../utils/types';

interface DeltaControlsProps {
  onSimulationComplete?: (data: DeltaData) => void;
}

const DeltaControls: React.FC<DeltaControlsProps> = ({ onSimulationComplete }) => {
  const [signalType, setSignalType] = useState<'sine' | 'square' | 'triangle'>('sine');
  const [amplitude, setAmplitude] = useState(2.0);
  const [signalFrequency, setSignalFrequency] = useState(2);
  const [samplingFrequency, setSamplingFrequency] = useState(20);
  const [stepSize, setStepSize] = useState(0.1);
  const [isSimulating, setIsSimulating] = useState(false);

  const signalTypes = [
    { value: 'sine', label: 'Sine Wave', icon: '〰️' },
    { value: 'square', label: 'Square Wave', icon: '⬜' },
    { value: 'triangle', label: 'Triangle Wave', icon: '🔺' }
  ];

  const handleGenerateSignal = () => {
    const controls: DeltaControlsType = {
      signalType,
      amplitude,
      signalFrequency,
      samplingFrequency,
      stepSize
    };
    
    const data = processDelta(controls);
    if (onSimulationComplete) {
      onSimulationComplete(data);
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    const controls: DeltaControlsType = {
      signalType,
      amplitude,
      signalFrequency,
      samplingFrequency,
      stepSize
    };
    
    setTimeout(() => {
      const data = processDelta(controls);
      if (onSimulationComplete) {
        onSimulationComplete(data);
      }
      setIsSimulating(false);
    }, 1000);
  };

  const handleReset = () => {
    setSignalType('sine');
    setAmplitude(2.0);
    setSignalFrequency(2);
    setSamplingFrequency(20);
    setStepSize(0.1);
    setIsSimulating(false);
    
    if (onSimulationComplete) {
      onSimulationComplete(null as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <h2 className="text-xl font-bold text-white mb-6">Delta Modulation Parameters</h2>
      
      {/* Signal Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          SIGNAL TYPE
        </label>
        <div className="relative">
          <select
            value={signalType}
            onChange={(e) => setSignalType(e.target.value as any)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {signalTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <span className="text-gray-400">▼</span>
          </div>
        </div>
      </div>

      {/* Amplitude */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AMPLITUDE
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((amplitude - 0.1) / 4.9) * 100}%, #4b5563 ${((amplitude - 0.1) / 4.9) * 100}%, #4b5563 100%)`
            }}
          />
          <div className="w-16 text-right">
            <span className="text-white font-medium">{amplitude.toFixed(1)} V</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1 V</span>
          <span>5.0 V</span>
        </div>
      </div>

      {/* Signal Frequency */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          SIGNAL FREQUENCY
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={signalFrequency}
            onChange={(e) => setSignalFrequency(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((signalFrequency - 1) / 49) * 100}%, #4b5563 ${((signalFrequency - 1) / 49) * 100}%, #4b5563 100%)`
            }}
          />
          <div className="w-16 text-right">
            <span className="text-white font-medium">{signalFrequency} Hz</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 Hz</span>
          <span>50 Hz</span>
        </div>
      </div>

      {/* Sampling Frequency */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          SAMPLING FREQUENCY (FS)
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={samplingFrequency}
            onChange={(e) => setSamplingFrequency(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((samplingFrequency - 10) / 490) * 100}%, #4b5563 ${((samplingFrequency - 10) / 490) * 100}%, #4b5563 100%)`
            }}
          />
          <div className="w-16 text-right">
            <span className="text-white font-medium">{samplingFrequency} Hz</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10 Hz</span>
          <span>500 Hz</span>
        </div>
      </div>

      {/* Step Size */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          STEP SIZE
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={stepSize}
            onChange={(e) => setStepSize(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((stepSize - 0.01) / 0.99) * 100}%, #4b5563 ${((stepSize - 0.01) / 0.99) * 100}%, #4b5563 100%)`
            }}
          />
          <div className="w-16 text-right">
            <span className="text-white font-medium">{stepSize.toFixed(2)} V</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.01 V</span>
          <span>1.00 V</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={handleGenerateSignal}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>📊</span>
          <span>Generate Signal</span>
        </button>
        
        <button 
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isSimulating ? '⏳' : '▶️'}</span>
          <span>{isSimulating ? 'Processing...' : 'Run Delta Simulation'}</span>
        </button>
        
        <button 
          onClick={handleReset}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>🔄</span>
          <span>Reset</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DeltaControls;
