import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PCMControls, PCMData } from '../utils/types';
import { processPCM } from '../utils/signalProcessing';
import ControlPanel, { Select, Slider, Button } from './ControlPanel';
import SignalGraph from './SignalGraph';
import DataTable from './DataTable';

const PCMModulation: React.FC = () => {
  const [controls, setControls] = useState<PCMControls>({
    signalType: 'sine',
    amplitude: 1,
    signalFrequency: 10,
    samplingFrequency: 100,
    quantizationBits: 4
  });

  const [data, setData] = useState<PCMData | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const result = processPCM(controls);
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
      quantizationBits: 4
    });
    setData(null);
  };

  const updateControl = <K extends keyof PCMControls>(key: K, value: PCMControls[K]) => {
    setControls(prev => ({ ...prev, [key]: value }));
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ControlPanel title="PCM Controls">
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
              label="Quantization Bits"
              value={controls.quantizationBits}
              onChange={(value) => updateControl('quantizationBits', value)}
              min={2}
              max={8}
              step={1}
              unit="bits"
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
                  title="Sampled Signal"
                  data={data.sampledSignal}
                  color="#10b981"
                  strokeWidth={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignalGraph
                  title="Quantized Signal"
                  data={data.quantizedSignal}
                  color="#f59e0b"
                  strokeWidth={2}
                />
                <SignalGraph
                  title="PCM Digital Waveform"
                  data={data.pcmWaveform}
                  color="#ef4444"
                  strokeWidth={2}
                  height={200}
                />
              </div>
              
              <DataTable
                title="PCM Data Table"
                data={data.tableData}
                columns={pcmColumns}
              />
            </motion.div>
          )}
          
          {!data && (
            <div className="bg-dark-secondary rounded-lg p-8 border border-dark-border text-center">
              <p className="text-muted text-lg">
                Click "Start" to begin PCM modulation simulation
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PCMModulation;
