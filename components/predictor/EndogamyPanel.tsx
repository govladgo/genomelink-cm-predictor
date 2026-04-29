'use client';
import React, { useState } from 'react';

interface EndogamyPanelProps {
  enabled: boolean;
  factor: number;
  inputCM: number;
  onEnabledChange: (enabled: boolean) => void;
  onFactorChange: (factor: number) => void;
}

export function EndogamyPanel({
  enabled,
  factor,
  inputCM,
  onEnabledChange,
  onFactorChange,
}: EndogamyPanelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const adjustedCM = inputCM > 0 ? Math.round(inputCM / factor) : 0;

  return (
    <div
      style={{
        background: '#F7F8FA',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'var(--gl-font)',
            color: 'var(--gl-color-primary-dark)',
          }}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            style={{ accentColor: 'var(--gl-color-secondary)' }}
          />
          I have endogamous ancestry
        </label>

        <span
          style={{ position: 'relative', display: 'inline-flex' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--gl-color-gray-semi)',
              color: 'var(--gl-color-text-muted)',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'help',
            }}
          >
            ?
          </span>
          {showTooltip && (
            <span
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: 6,
                background: 'var(--gl-color-secondary)',
                color: '#fff',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 11,
                lineHeight: 1.5,
                width: 260,
                fontFamily: 'var(--gl-font)',
                zIndex: 10,
                pointerEvents: 'none',
                whiteSpace: 'normal',
              }}
            >
              Endogamy occurs when ancestors married within the same community
              over many generations. This inflates shared cM values, making
              relationships appear closer than they actually are. The adjustment
              divides your cM value by the factor to estimate the true
              relationship distance.
            </span>
          )}
        </span>
      </div>

      {enabled && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
              }}
            >
              Adjustment factor: {factor.toFixed(1)}x
              {inputCM > 0 && (
                <>
                  {' '}(your {inputCM} cM &rarr; adjusted to {adjustedCM} cM)
                </>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
              }}
            >
              0.5x
            </span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={factor}
              onChange={(e) => onFactorChange(parseFloat(e.target.value))}
              style={{
                flex: 1,
                accentColor: 'var(--gl-color-secondary)',
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
              }}
            >
              2.0x
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
