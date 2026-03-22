import React from 'react';
import { SignalPoint } from '../utils/types';

interface SignalGraphProps {
  title: string;
  data: SignalPoint[];
  color?: string;
  strokeWidth?: number;
  height?: number;
}

const SignalGraph: React.FC<SignalGraphProps> = ({ 
  title, 
  data, 
  color = '#3b82f6', 
  strokeWidth = 2,
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">{title}</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Simple SVG graph implementation
  const width = 600;
  const padding = 40;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Find min and max values for scaling
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  const maxTime = Math.max(...data.map(d => d.time));
  const timeRange = maxTime || 1;

  // Convert data points to SVG coordinates
  const points = data.map(point => ({
    x: padding + (point.time / timeRange) * graphWidth,
    y: padding + (1 - (point.value - minValue) / valueRange) * graphHeight
  }));

  // Create path string
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
        <svg width={width} height={height} className="w-full h-full">
          {/* Grid lines */}
          <g className="opacity-20">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line
                key={`h-${i}`}
                x1={padding}
                y1={padding + (i / 5) * graphHeight}
                x2={padding + graphWidth}
                y2={padding + (i / 5) * graphHeight}
                stroke="#6b7280"
                strokeWidth="1"
              />
            ))}
            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line
                key={`v-${i}`}
                x1={padding + (i / 5) * graphWidth}
                y1={padding}
                x2={padding + (i / 5) * graphWidth}
                y2={padding + graphHeight}
                stroke="#6b7280"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Axes */}
          <line
            x1={padding}
            y1={padding + graphHeight}
            x2={padding + graphWidth}
            y2={padding + graphHeight}
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={padding + graphHeight}
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Signal line */}
          <path
            d={pathData}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            className="drop-shadow-lg"
          />

          {/* Labels */}
          <text x={padding + graphWidth / 2} y={height - 10} fill="#9ca3af" fontSize="12" textAnchor="middle">
            Time (s)
          </text>
          <text x={20} y={padding + graphHeight / 2} fill="#9ca3af" fontSize="12" textAnchor="middle" transform={`rotate(-90 20 ${padding + graphHeight / 2})`}>
            Amplitude
          </text>

          {/* Y-axis values */}
          <g fill="#6b7280" fontSize="10">
            <text x={padding - 5} y={padding + 5} textAnchor="end">{maxValue.toFixed(2)}</text>
            <text x={padding - 5} y={padding + graphHeight} textAnchor="end">{minValue.toFixed(2)}</text>
          </g>

          {/* X-axis values */}
          <g fill="#6b7280" fontSize="10">
            <text x={padding} y={height - 5} textAnchor="middle">0</text>
            <text x={padding + graphWidth} y={height - 5} textAnchor="middle">{maxTime.toFixed(3)}</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SignalGraph;
