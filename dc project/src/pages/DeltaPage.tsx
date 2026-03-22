import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DeltaControls from '../components/DeltaControls';
import SignalGraph from '../components/SignalGraph';
import DataTable from '../components/DataTable';
import { DeltaData } from '../utils/types';

const DeltaPage: React.FC = () => {
  const [simulationData, setSimulationData] = useState<DeltaData | null>(null);

  const handleSimulationComplete = (data: DeltaData) => {
    setSimulationData(data);
  };

  const deltaColumns = [
    { key: 'time', label: 'Time (s)', width: '100px' },
    { key: 'signalValue', label: 'Signal Value', width: '120px' },
    { key: 'staircaseValue', label: 'Staircase', width: '120px' },
    { key: 'bit', label: 'Bit', width: '80px' },
    { key: 'direction', label: 'Direction', width: '100px' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1">
          <DeltaControls onSimulationComplete={handleSimulationComplete} />
        </div>
        
        {/* Right Panel - Graphs and Results */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Delta Modulation Results</h2>
            
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
                    title="Staircase Approximation"
                    data={simulationData.staircaseSignal}
                    color="#10b981"
                    strokeWidth={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SignalGraph
                    title="Delta Bitstream"
                    data={simulationData.bitstream}
                    color="#ef4444"
                    strokeWidth={2}
                    height={200}
                  />
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">Bit Sequence</p>
                      <p className="text-white font-mono text-lg">
                        {simulationData.bitstream.map(point => point.value).join('')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <DataTable
                  title="Delta Modulation Data Table"
                  data={simulationData.tableData}
                  columns={deltaColumns}
                />
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                  <p className="text-gray-400">Signal graphs will appear here after simulation</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                  <p className="text-gray-400">Bitstream will appear here</p>
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

export default DeltaPage;
