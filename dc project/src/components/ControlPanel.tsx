import React from 'react';
import { SignalType } from '../utils/types';

interface ControlPanelProps {
  children: React.ReactNode;
  title: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ children, title }) => {
  return (
    <div className="bg-dark-secondary rounded-lg p-6 border border-dark-border">
      <h2 className="text-xl font-bold text-text mb-6">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-dark border border-dark-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step = 1, unit = '' }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">
        {label}: {value}{unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-dark-accent rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', disabled = false }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
    : "bg-dark-accent text-text hover:bg-dark-border focus:ring-gray-500";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default ControlPanel;
