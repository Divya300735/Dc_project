import { SignalType, SignalPoint, PCMData, PCMTableRow, DeltaData, DeltaTableRow, PCMControls, DeltaControls } from './types';

/**
 * Generate analog signal based on type and parameters
 */
export function generateSignal(
  signalType: SignalType,
  amplitude: number,
  frequency: number,
  duration: number = 0.1,
  sampleRate: number = 1000
): SignalPoint[] {
  const points: SignalPoint[] = [];
  const numPoints = Math.floor(duration * sampleRate);
  
  for (let i = 0; i < numPoints; i++) {
    const time = i / sampleRate;
    let value = 0;
    
    switch (signalType) {
      case 'sine':
        value = amplitude * Math.sin(2 * Math.PI * frequency * time);
        break;
      case 'square':
        value = amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * time));
        break;
      case 'triangle':
        const period = 1 / frequency;
        const t = time % period;
        const normalizedT = t / period;
        value = amplitude * (normalizedT < 0.5 ? 4 * normalizedT - 1 : 3 - 4 * normalizedT);
        break;
    }
    
    points.push({ time, value });
  }
  
  return points;
}

/**
 * Sample the analog signal at specified frequency
 */
export function sampleSignal(signal: SignalPoint[], samplingFrequency: number): SignalPoint[] {
  if (signal.length === 0) return [];
  
  const sampleInterval = 1 / samplingFrequency;
  const sampled: SignalPoint[] = [];
  
  for (let time = 0; time <= signal[signal.length - 1].time; time += sampleInterval) {
    // Find the closest point in the original signal
    let closestPoint = signal[0];
    let minDistance = Math.abs(signal[0].time - time);
    
    for (const point of signal) {
      const distance = Math.abs(point.time - time);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    sampled.push({ time, value: closestPoint.value });
  }
  
  return sampled;
}

/**
 * Quantize sampled signal using uniform quantization
 */
export function quantizeSignal(
  sampledSignal: SignalPoint[],
  quantizationBits: number,
  amplitude: number
): { quantizedSignal: SignalPoint[], tableData: PCMTableRow[] } {
  const levels = Math.pow(2, quantizationBits);
  const stepSize = (2 * amplitude) / levels;
  const quantizedSignal: SignalPoint[] = [];
  const tableData: PCMTableRow[] = [];
  
  sampledSignal.forEach((point, index) => {
    // Normalize to [0, levels-1]
    const normalizedValue = (point.value + amplitude) / (2 * amplitude);
    const quantizationLevel = Math.round(normalizedValue * (levels - 1));
    
    // Convert back to signal range
    const quantizedValue = -amplitude + (quantizationLevel * stepSize);
    
    // Generate binary code
    const binaryCode = quantizationLevel.toString(2).padStart(quantizationBits, '0');
    
    quantizedSignal.push({ time: point.time, value: quantizedValue });
    
    tableData.push({
      sampleIndex: index,
      time: point.time,
      sampleValue: point.value,
      quantizationLevel,
      quantizedValue,
      binaryCode
    });
  });
  
  return { quantizedSignal, tableData };
}

/**
 * Generate PCM digital waveform
 */
export function generatePCMWaveform(tableData: PCMTableRow[], bitDuration: number): SignalPoint[] {
  const waveform: SignalPoint[] = [];
  
  tableData.forEach((row, sampleIndex) => {
    const startTime = sampleIndex * bitDuration * row.binaryCode.length;
    
    row.binaryCode.split('').forEach((bit, bitIndex) => {
      const time = startTime + bitIndex * bitDuration;
      waveform.push({ time, value: bit === '1' ? 1 : 0 });
    });
  });
  
  return waveform;
}

/**
 * Process PCM modulation
 */
export function processPCM(controls: PCMControls): PCMData {
  // Generate analog signal
  const analogSignal = generateSignal(
    controls.signalType,
    controls.amplitude,
    controls.signalFrequency
  );
  
  // Sample the signal
  const sampledSignal = sampleSignal(analogSignal, controls.samplingFrequency);
  
  // Quantize the sampled signal
  const { quantizedSignal, tableData } = quantizeSignal(
    sampledSignal,
    controls.quantizationBits,
    controls.amplitude
  );
  
  // Generate PCM waveform
  const bitDuration = 1 / (controls.samplingFrequency * controls.quantizationBits);
  const pcmWaveform = generatePCMWaveform(tableData, bitDuration);
  
  return {
    analogSignal,
    sampledSignal,
    quantizedSignal,
    pcmWaveform,
    tableData
  };
}

/**
 * Process Delta modulation
 */
export function processDelta(controls: DeltaControls): DeltaData {
  // Generate analog signal
  const analogSignal = generateSignal(
    controls.signalType,
    controls.amplitude,
    controls.signalFrequency
  );
  
  // Sample the signal
  const sampledSignal = sampleSignal(analogSignal, controls.samplingFrequency);
  
  // Delta modulation algorithm
  const staircaseSignal: SignalPoint[] = [];
  const bitstream: SignalPoint[] = [];
  const tableData: DeltaTableRow[] = [];
  
  let staircaseValue = 0;
  
  sampledSignal.forEach((point, index) => {
    const prevStaircase = index > 0 ? staircaseSignal[index - 1].value : 0;
    
    // Compare signal with staircase approximation
    const error = point.value - prevStaircase;
    const bit = error >= 0 ? 1 : 0;
    
    // Update staircase value
    staircaseValue = prevStaircase + (bit === 1 ? controls.stepSize : -controls.stepSize);
    
    // Clamp to amplitude range
    staircaseValue = Math.max(-controls.amplitude, Math.min(controls.amplitude, staircaseValue));
    
    staircaseSignal.push({ time: point.time, value: staircaseValue });
    bitstream.push({ time: point.time, value: bit });
    
    tableData.push({
      time: point.time,
      signalValue: point.value,
      staircaseValue,
      bit,
      direction: bit === 1 ? 'up' : 'down'
    });
  });
  
  return {
    analogSignal,
    staircaseSignal,
    bitstream,
    tableData
  };
}
