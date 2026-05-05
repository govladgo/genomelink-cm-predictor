'use client';
import React, { useState, useMemo } from 'react';
import { CmInput } from '@/components/predictor/CmInput';
import { RelationshipList } from '@/components/predictor/RelationshipList';
import { EndogamyPanel } from '@/components/predictor/EndogamyPanel';
import { CommonAncestorPanel } from '@/components/predictor/CommonAncestorPanel';
import { InfoBox } from '@/components/predictor/InfoBox';
import { getRelationshipsForCM } from '@/data/sharedCmData';

export default function Home() {
  const [cmValue, setCmValue] = useState('');
  const [endogamyEnabled, setEndogamyEnabled] = useState(false);
  const [endogamyFactor, setEndogamyFactor] = useState(1.0);
  const [populationId, setPopulationId] = useState('none');

  const numericCM = parseFloat(cmValue) || 0;
  const factor = endogamyEnabled ? endogamyFactor : 1.0;

  const results = useMemo(() => {
    if (numericCM <= 0) return [];
    return getRelationshipsForCM(numericCM, factor);
  }, [numericCM, factor]);

  const topResult = results.length > 0 ? results[0] : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F9FCFF',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 720 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
          }}
        >
          {/* Logo placeholder */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--gl-color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--gl-font)',
              flexShrink: 0,
            }}
          >
            GL
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              fontFamily: 'var(--gl-font)',
              color: 'var(--gl-color-primary-dark)',
              lineHeight: 1.3,
            }}
          >
            Shared cM relationship predictor
          </h1>
        </div>

        {/* Main card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 10px rgba(74, 93, 128, 0.13)',
            padding: 32,
          }}
        >
          {/* cM input */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
                marginBottom: 8,
              }}
            >
              Enter shared centiMorgan (cM) value
            </label>
            <CmInput value={cmValue} onChange={setCmValue} />
          </div>

          {/* Endogamy panel */}
          <div style={{ marginBottom: 16 }}>
            <EndogamyPanel
              enabled={endogamyEnabled}
              factor={endogamyFactor}
              inputCM={numericCM}
              onEnabledChange={setEndogamyEnabled}
              onFactorChange={setEndogamyFactor}
            />
          </div>

          {/* Common Ancestor cM panel — population-context view */}
          <div style={{ marginBottom: 24 }}>
            <CommonAncestorPanel
              inputCM={numericCM}
              populationId={populationId}
              onPopulationChange={setPopulationId}
            />
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'var(--gl-color-border)',
              marginBottom: 20,
            }}
          />

          {/* Results */}
          {numericCM <= 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 0',
                fontSize: 14,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
              }}
            >
              Enter a cM value above to see relationship probabilities
            </div>
          ) : results.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 0',
                fontSize: 14,
                fontFamily: 'var(--gl-font)',
                color: 'var(--gl-color-text-muted)',
              }}
            >
              No matching relationships found for {numericCM} cM
              {endogamyEnabled && factor !== 1.0
                ? ` (adjusted to ${Math.round(numericCM / factor)} cM)`
                : ''}
            </div>
          ) : (
            <>
              {/* Results header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--gl-font)',
                    color: 'var(--gl-color-primary-dark)',
                  }}
                >
                  Possible relationships
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--gl-font)',
                    color: 'var(--gl-color-text-muted)',
                  }}
                >
                  {results.length} match{results.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Info box for top result */}
              {topResult && <InfoBox entry={topResult} />}

              {/* Relationship list */}
              <div style={{ marginTop: 16 }}>
                <RelationshipList results={results} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 11,
            fontFamily: 'var(--gl-font)',
            color: 'var(--gl-color-text-subtle)',
            lineHeight: 1.6,
          }}
        >
          Data based on the Shared cM Project v4 (Bettinger/Larkin/Perl).
          <br />
          Probabilities are approximate. Use tree research to confirm relationships.
        </div>
      </div>
    </div>
  );
}
