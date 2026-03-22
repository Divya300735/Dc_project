import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PCMControls from '../components/PCMControls';
import SignalGraph from '../components/SignalGraph';
import DataTable from '../components/DataTable';
import { PCMData } from '../utils/types';

const PCMPage: React.FC = () => {
  const [simulationData, setSimulationData] = useState<PCMData | null>(null);

  const handleSimulationComplete = (data: PCMData) => {
    setSimulationData(data);
  };

  const pcmColumns = [
    { key: 'sampleIndex', label: 'Sample', width: '80px' },
    { key: 'time', label: 'Time (s)', width: '100px' },
    { key: 'sampleValue', label: 'Sample Value', width: '120px' },
    { key: 'quantizationLevel', label: 'Level', width: '80px' },
    { key: 'quantizedValue', label: 'Quantized', width: '120px' },
    { key: 'binaryCode', label: 'Binary', width: '100px' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1">
          <PCMControls onSimulationComplete={handleSimulationComplete} />
        </div>
        
        {/* Right Panel - Graphs and Results */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">PCM Simulation Results</h2>
            
            {simulationData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SignalGraph
                    title="Analog Signal"
                    data={simulationData.analogSignal}
                    color="#3b82f6"
                  />
                  <SignalGraph
                    title="Sampled Signal"
                    data={simulationData.sampledSignal}
                    color="#10b981"
                    strokeWidth={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SignalGraph
                    title="Quantized Signal"
                    data={simulationData.quantizedSignal}
                    color="#f59e0b"
                    strokeWidth={2}
                  />
                  <SignalGraph
                    title="PCM Digital Waveform"
                    data={simulationData.pcmWaveform}
                    color="#ef4444"
                    strokeWidth={2}
                    height={200}
                  />
                </div>
                
                <DataTable
                  title="PCM Data Table"
                  data={simulationData.tableData}
                  columns={pcmColumns}
                />
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                  <p className="text-gray-400">Signal graphs will appear here after simulation</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                  <p className="text-gray-400">PCM waveform will appear here</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 min-h-[200px] flex items-center justify-center">
                  <p className="text-gray-400">Data table will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCMPage;
