'use client';
import React from 'react';

interface HistogramProps {
  buckets: number[];
  color: string;
  width?: number;
  height?: number;
}

export function Histogram({ buckets, color, width = 80, height = 24 }: HistogramProps) {
  const barWidth = width / buckets.length;
  const gap = 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {buckets.map((val, i) => {
        const barHeight = Math.max(1, val * (height - 2));
        return (
          <rect
            key={i}
            x={i * barWidth + gap / 2}
            y={height - barHeight}
            width={barWidth - gap}
            height={barHeight}
            rx={1}
            fill={color}
            opacity={0.7 + val * 0.3}
          />
        );
      })}
    </svg>
  );
}
