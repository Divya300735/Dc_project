import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DeltaControls, DeltaData } from '../utils/types';
import { processDelta } from '../utils/signalProcessing';
import ControlPanel, { Select, Slider, Button } from './ControlPanel';
import SignalGraph from './SignalGraph';
import DataTable from './DataTable';

const DeltaModulation: React.FC = () => {
  const [controls, setControls] = useState<DeltaControls>({
    signalType: 'sine',
    amplitude: 1,
    signalFrequency: 10,
    samplingFrequency: 100,
    stepSize: 0.1
  });

  const [data, setData] = useState<DeltaData | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const result = processDelta(controls);
      setData(result);
    }
  }, [controls, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setControls({
      signalType: 'sine',
      amplitude: 1,
      signalFrequency: 10,
      samplingFrequency: 100,
      stepSize: 0.1
    });
    setData(null);
  };

  const updateControl = <K extends keyof DeltaControls>(key: K, value: DeltaControls[K]) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const deltaColumns = [
    { key: 'time', label: 'Time (s)', width: '100px' },
    { key: 'signalValue', label: 'Signal Value', width: '120px' },
    { key: 'staircaseValue', label: 'Staircase', width: '120px' },
    { key: 'bit', label: 'Bit', width: '80px' },
    { key: 'direction', label: 'Direction', width: '100px' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ControlPanel title="Delta Modulation Controls">
            <Select
              label="Signal Type"
              value={controls.signalType}
              onChange={(value) => updateControl('signalType', value as any)}
              options={[
                { value: 'sine', label: 'Sine Wave' },
                { value: 'square', label: 'Square Wave' },
                { value: 'triangle', label: 'Triangle Wave' }
              ]}
            />
            
            <Slider
              label="Amplitude"
              value={controls.amplitude}
              onChange={(value) => updateControl('amplitude', value)}
              min={0.1}
              max={5}
              step={0.1}
              unit="V"
            />
            
            <Slider
              label="Signal Frequency"
              value={controls.signalFrequency}
              onChange={(value) => updateControl('signalFrequency', value)}
              min={1}
              max={50}
              step={1}
              unit="Hz"
            />
            
            <Slider
              label="Sampling Frequency"
              value={controls.samplingFrequency}
              onChange={(value) => updateControl('samplingFrequency', value)}
              min={20}
              max={500}
              step={10}
              unit="Hz"
            />
            
            <Slider
              label="Step Size"
              value={controls.stepSize}
              onChange={(value) => updateControl('stepSize', value)}
              min={0.01}
              max={1}
              step={0.01}
              unit="V"
            />
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleStart} disabled={isRunning}>
                Start
              </Button>
              <Button onClick={handleStop} disabled={!isRunning} variant="secondary">
                Stop
              </Button>
              <Button onClick={handleReset} variant="secondary">
                Reset
              </Button>
            </div>
          </ControlPanel>
        </div>
        
        <div className="lg:col-span-2">
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignalGraph
                  title="Analog Signal"
                  data={data.analogSignal}
                  color="#3b82f6"
                />
                <SignalGraph
                  title="Staircase Approximation"
                  data={data.staircaseSignal}
                  color="#10b981"
                  strokeWidth={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <SignalGraph
                  title="Bitstream"
                  data={data.bitstream}
                  color="#f59e0b"
                  strokeWidth={3}
                  height={250}
                />
              </div>
              
              <DataTable
                title="Delta Modulation Data Table"
                data={data.tableData}
                columns={deltaColumns}
              />
            </motion.div>
          )}
          
          {!data && (
            <div className="bg-dark-secondary rounded-lg p-8 border border-dark-border text-center">
              <p className="text-muted text-lg">
                Click "Start" to begin Delta modulation simulation
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeltaModulation;
