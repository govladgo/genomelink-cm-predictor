'use client';
import React from 'react';
import { SharedCmEntryV4 } from '@/data/types';
import { Histogram } from './Histogram';

interface RelationshipListProps {
  results: SharedCmEntryV4[];
}

function getBarColor(index: number, probability: number): string {
  if (index === 0) return '#4582C9';
  if (probability > 0.2) return '#7ABF43';
  if (probability > 0.05) return '#FFB300';
  return '#C9D6E4';
}

export function RelationshipList({ results }: RelationshipListProps) {
  if (results.length === 0) {
    return null;
  }

  const maxProb = results[0]?.probability || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {results.map((entry, index) => {
        const pct = Math.round(entry.probability * 100);
        const barColor = getBarColor(index, entry.probability);
        const isTop = index === 0;
        const barWidthPct = maxProb > 0 ? (entry.probability / maxProb) * 100 : 0;

        return (
          <div
            key={entry.relationship}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              background: isTop ? 'rgba(69, 130, 201, 0.06)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            {/* Relationship name */}
            <span
              style={{
                width: 200,
                minWidth: 200,
                fontSize: 13,
                fontWeight: isTop ? 600 : 400,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-primary-dark)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={entry.relationship}
            >
              {entry.relationship}
            </span>

            {/* Histogram sparkline */}
            <Histogram
              buckets={entry.histogram}
              color={barColor}
              width={80}
              height={24}
            />

            {/* Probability bar */}
            <div
              style={{
                flex: 1,
                height: 8,
                background: '#F0F2F5',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${barWidthPct}%`,
                  height: '100%',
                  background: barColor,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Percentage */}
            <span
              style={{
                width: 48,
                minWidth: 48,
                textAlign: 'right',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--gl-font)',
                color: isTop ? '#4582C9' : 'var(--gl-color-text-muted)',
              }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
