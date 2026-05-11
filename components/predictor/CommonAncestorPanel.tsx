'use client';

import { useMemo } from 'react';
import {
  POPULATION_CONTEXTS,
  recentAncestorCM,
} from '@/data/populationContext';
import { getRelationshipsForCM } from '@/data/sharedCmData';

interface CommonAncestorPanelProps {
  inputCM: number;
  populationId: string;
  onPopulationChange: (id: string) => void;
}

export function CommonAncestorPanel({
  inputCM,
  populationId,
  onPopulationChange,
}: CommonAncestorPanelProps) {
  const population = useMemo(
    () => POPULATION_CONTEXTS.find((p) => p.id === populationId) || POPULATION_CONTEXTS[0],
    [populationId]
  );

  const recentCM = inputCM > 0 ? recentAncestorCM(inputCM, population) : 0;

  // Compute predicted relationships using the population-adjusted residual cM
  const predictions = useMemo(() => {
    if (inputCM <= 0 || populationId === 'none') return [];
    return getRelationshipsForCM(recentCM).slice(0, 4);
  }, [inputCM, populationId, recentCM]);

  const isNonePopulation = populationId === 'none';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 124, 17, 0.04), rgba(69, 130, 201, 0.04))',
        border: '1px solid var(--gl-color-border-light)',
        borderRadius: 12,
        padding: 16,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--gl-color-primary-dark)',
            margin: '0 0 2px',
            fontFamily: 'var(--gl-font)',
          }}
        >
          cM Clarity
        </h3>
        <p
          style={{
            fontSize: 11,
            color: 'var(--gl-color-text-muted)',
            margin: 0,
            fontFamily: 'var(--gl-font)',
          }}
        >
          Some populations share DNA from historical common ancestry — not just from
          recent relationships. Pick a population to see how that affects the prediction.
        </p>
      </div>

      {/* Population selector */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--gl-color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 4,
            fontFamily: 'var(--gl-font)',
          }}
        >
          Common ancestor population
        </label>
        <select
          value={populationId}
          onChange={(e) => onPopulationChange(e.target.value)}
          className="gl-select"
          style={{ width: '100%', maxWidth: 360 }}
        >
          {POPULATION_CONTEXTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
              {p.era ? ` — ${p.era}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Narrative */}
      {!isNonePopulation && population.narrative && (
        <div
          style={{
            background: 'var(--gl-color-surface)',
            border: '1px solid var(--gl-color-border-light)',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--gl-color-text-secondary)',
            lineHeight: 1.55,
            fontFamily: 'var(--gl-font)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--gl-color-primary-attention)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}
          >
            {population.era}
          </div>
          <div>{population.narrative}</div>
        </div>
      )}

      {/* Prediction breakdown */}
      {!isNonePopulation && inputCM > 0 && (
        <div
          style={{
            background: 'var(--gl-color-surface)',
            border: '1px solid var(--gl-color-border-light)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 10,
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gl-color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              cM breakdown for {inputCM} cM observed
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={cmBreakdownTile('rgba(255, 124, 17, 0.08)', '#d46a0e')}>
              <div style={cmBreakdownLabel}>Population baseline</div>
              <div style={cmBreakdownValue}>~{population.sharedPopulationFloor} cM</div>
            </div>
            <div style={cmBreakdownTile('rgba(69, 130, 201, 0.08)', '#245FA4')}>
              <div style={cmBreakdownLabel}>Recent-ancestor signal</div>
              <div style={cmBreakdownValue}>~{recentCM.toFixed(0)} cM</div>
            </div>
          </div>

          {predictions.length > 0 ? (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gl-color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6,
                }}
              >
                Adjusted relationship predictions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {predictions.map((p, i) => {
                  const pct = Math.round(p.probability * 100);
                  const labelPrefix = i === 0 ? 'Most likely' : i === 1 ? 'Also possible' : 'Less likely';
                  return (
                    <div
                      key={p.relationship}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 8px',
                        background: i === 0 ? 'rgba(122, 191, 67, 0.06)' : 'transparent',
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: 'var(--gl-font)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--gl-color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          minWidth: 80,
                        }}
                      >
                        {labelPrefix}
                      </span>
                      <span style={{ flex: 1, fontWeight: 500, color: 'var(--gl-color-primary-dark)' }}>
                        {p.relationship}
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: i === 0 ? 'var(--gl-color-positive)' : 'var(--gl-color-text-muted)',
                          minWidth: 36,
                          textAlign: 'right',
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 12,
                color: 'var(--gl-color-text-muted)',
                fontStyle: 'italic',
                padding: '8px 0',
              }}
            >
              After subtracting the population baseline, residual cM is too low to predict a recent
              relationship — the match is likely explained by population-level shared ancestry alone.
            </div>
          )}
        </div>
      )}

      {/* Example */}
      {!isNonePopulation && population.exampleMatchPattern && (
        <div
          style={{
            fontSize: 11,
            color: 'var(--gl-color-text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            paddingTop: 8,
            borderTop: '1px dashed var(--gl-color-border-light)',
          }}
        >
          <strong style={{ fontStyle: 'normal', color: 'var(--gl-color-text-secondary)' }}>
            Example:
          </strong>{' '}
          {population.exampleMatchPattern}
        </div>
      )}

      {isNonePopulation && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--gl-color-text-muted)',
            padding: '12px 4px',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Pick a population above to see how shared population ancestry might affect this cM
          prediction.
        </div>
      )}

      {/* v1 disclaimer */}
      <div
        style={{
          fontSize: 9,
          color: 'var(--gl-color-text-muted)',
          textAlign: 'center',
          marginTop: 12,
          paddingTop: 8,
          borderTop: '1px solid var(--gl-color-border-light)',
        }}
      >
        Population baselines are approximations from genealogical literature. Treat as guidance,
        not exact figures.
      </div>
    </div>
  );
}

const cmBreakdownTile = (bg: string, color: string): React.CSSProperties => ({
  flex: 1,
  padding: '8px 12px',
  borderRadius: 6,
  background: bg,
  color,
});

const cmBreakdownLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  opacity: 0.85,
  marginBottom: 2,
};

const cmBreakdownValue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
};
