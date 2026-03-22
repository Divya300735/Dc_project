export type SignalType = 'sine' | 'square' | 'triangle';

export interface SignalPoint {
  time: number;
  value: number;
}

export interface PCMData {
  analogSignal: SignalPoint[];
  sampledSignal: SignalPoint[];
  quantizedSignal: SignalPoint[];
  pcmWaveform: SignalPoint[];
  tableData: PCMTableRow[];
}

export interface PCMTableRow {
  sampleIndex: number;
  time: number;
  sampleValue: number;
  quantizationLevel: number;
  quantizedValue: number;
  binaryCode: string;
}

export interface DeltaData {
  analogSignal: SignalPoint[];
  staircaseSignal: SignalPoint[];
  bitstream: SignalPoint[];
  tableData: DeltaTableRow[];
}

export interface DeltaTableRow {
  time: number;
  signalValue: number;
  staircaseValue: number;
  bit: number;
  direction: 'up' | 'down';
}

export interface PCMControls {
  signalType: SignalType;
  amplitude: number;
  signalFrequency: number;
  samplingFrequency: number;
  quantizationBits: number;
}

export interface DeltaControls {
  signalType: SignalType;
  amplitude: number;
  signalFrequency: number;
  samplingFrequency: number;
  stepSize: number;
}
