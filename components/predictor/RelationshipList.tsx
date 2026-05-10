'use client';
import React from 'react';
import { SharedCmEntryV4 } from '@/data/types';

interface RelationshipListProps {
  results: SharedCmEntryV4[];
  originalCM?: number;
  effectiveCM?: number;
}

function getBarColor(index: number): string {
  if (index === 0) return '#7ABF43';
  return '#8FABCF';
}

export function RelationshipList({ results, originalCM, effectiveCM }: RelationshipListProps) {
  if (results.length === 0) return null;

  const hasExclusion = effectiveCM != null && originalCM != null && effectiveCM !== originalCM;
  const maxProb = results[0]?.probability || 1;

  return (
    <div className="relationship-grid">
      {results.map((entry, index) => {
        const pct = Math.round(entry.probability * 100);
        const barColor = getBarColor(index);
        const isTop = index === 0;
        const barWidthPct = maxProb > 0 ? (entry.probability / maxProb) * 100 : 0;

        return (
          <div
            key={entry.relationship}
            style={{
              background: '#fff',
              border: '1px solid rgba(201, 214, 228, 0.6)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {/* Header: name + badge + percentage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: '24px',
                      color: '#263856',
                      fontFamily: 'var(--gl-font)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.relationship}
                  </span>
                  {isTop && (
                    <span
                      style={{
                        background: 'rgba(255, 124, 17, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#FF7C11',
                        textTransform: 'uppercase',
                        lineHeight: '14px',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--gl-font)',
                      }}
                    >
                      Most likely
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: '28px',
                    color: isTop ? '#5EA634' : '#263856',
                    fontFamily: 'var(--gl-font)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  {pct}%
                </span>
              </div>
              {hasExclusion && (
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#6786AC',
                    fontFamily: 'var(--gl-font)',
                  }}
                >
                  Based on {effectiveCM!.toFixed(1)} cM ({(originalCM! - effectiveCM!).toFixed(1)} cM excluded from {originalCM} cM total)
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ position: 'relative', height: 8 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(38, 56, 86, 0.1)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: 8,
                  borderRadius: 4,
                  background: barColor,
                  width: `${barWidthPct}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Range / Average footer */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontSize: 12,
                lineHeight: '16px',
                color: '#6786AC',
                fontFamily: 'var(--gl-font)',
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>Range</span>
                <span>{entry.minCM.toLocaleString()} &ndash; {entry.maxCM.toLocaleString()} cM</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'right' }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>Average</span>
                <span>{entry.avgCM.toLocaleString()} cM</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
