'use client';

import React, { useMemo } from 'react';
import { Segment } from '@/data/types';
import { POPULATION_CONTEXTS } from '@/data/populationContext';
import { scoreSegments } from '@/data/segmentExclusion';

interface SegmentExclusionPanelProps {
  segments: Segment[];
  totalCM: number;
  populationId: string;
  onPopulationChange: (id: string) => void;
  excludedIndices: Set<number>;
  onExcludedChange: (indices: Set<number>) => void;
  effectiveCM: number;
}

function formatMb(bp: number): string {
  const mb = bp / 1_000_000;
  return mb >= 1 ? `${mb.toFixed(1)} Mb` : `${(bp / 1_000).toFixed(0)} kb`;
}

function scoreBg(score: number): string {
  if (score >= 0.5) return 'rgba(255, 124, 17, 0.10)';
  if (score >= 0.25) return 'rgba(196, 147, 10, 0.08)';
  return 'transparent';
}

export function SegmentExclusionPanel({
  segments,
  totalCM,
  populationId,
  onPopulationChange,
  excludedIndices,
  onExcludedChange,
  effectiveCM,
}: SegmentExclusionPanelProps) {
  const excludedCM = totalCM - effectiveCM;
  const includedCount = segments.length - excludedIndices.size;
  const excludedCount = excludedIndices.size;

  const population = useMemo(
    () => POPULATION_CONTEXTS.find((p) => p.id === populationId) ?? POPULATION_CONTEXTS[0],
    [populationId],
  );

  const scored = useMemo(
    () => scoreSegments(segments, populationId, population.sharedPopulationFloor),
    [segments, populationId, population.sharedPopulationFloor],
  );

  const sortedSegments = useMemo(() => {
    return scored
      .map((sc) => ({ ...segments[sc.index], ...sc }))
      .sort((a, b) => b.cM - a.cM);
  }, [segments, scored]);

  const hotspotSegmentCount = useMemo(
    () => scored.filter((s) => s.hotspotOverlap > 0).length,
    [scored],
  );

  const toggleSegment = (index: number) => {
    const next = new Set(excludedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      if (includedCount <= 1) return;
      next.add(index);
    }
    onExcludedChange(next);
  };

  const includeAll = () => onExcludedChange(new Set());

  const excludeAll = () => {
    const largestIdx = sortedSegments[0]?.index;
    const all = new Set(segments.map((_, i) => i));
    if (largestIdx != null) all.delete(largestIdx);
    onExcludedChange(all);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(69, 130, 201, 0.04), rgba(122, 191, 67, 0.04))',
        border: '1px solid var(--gl-color-border-light)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gl-color-primary-dark)',
            margin: 0,
            fontFamily: 'var(--gl-font)',
          }}
        >
          Segment Analysis
        </h3>
        <span
          style={{
            fontSize: 10,
            color: 'var(--gl-color-text-muted)',
            fontFamily: 'var(--gl-font)',
          }}
        >
          {segments.length} segments
          {hotspotSegmentCount > 0 && populationId !== 'none' && (
            <> · {hotspotSegmentCount} in IBD hotspots</>
          )}
        </span>
      </div>

      {/* Population selector */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--gl-color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 4,
            fontFamily: 'var(--gl-font)',
          }}
        >
          Population context
        </label>
        <select
          value={populationId}
          onChange={(e) => onPopulationChange(e.target.value)}
          className="gl-select"
          style={{ width: '100%', maxWidth: 320, fontSize: 12 }}
        >
          {POPULATION_CONTEXTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
              {p.era ? ` — ${p.era}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 6,
            background: 'rgba(69, 130, 201, 0.08)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: '#245FA4', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Included
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#245FA4' }}>
            {effectiveCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 10, color: 'var(--gl-color-text-muted)' }}>
            {includedCount} segment{includedCount !== 1 ? 's' : ''}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 6,
            background: excludedCount > 0 ? 'rgba(255, 124, 17, 0.08)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: excludedCount > 0 ? '#d46a0e' : 'var(--gl-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Excluded
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: excludedCount > 0 ? '#d46a0e' : 'var(--gl-color-text-muted)' }}>
            {excludedCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 10, color: 'var(--gl-color-text-muted)' }}>
            {excludedCount} segment{excludedCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Segment list */}
      <div
        style={{
          background: '#fff',
          border: '1px solid var(--gl-color-border-light)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 48px 1fr 56px 48px',
            gap: 0,
            padding: '6px 8px',
            borderBottom: '1px solid var(--gl-color-border-light)',
            background: '#F7F8FA',
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--gl-color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontFamily: 'var(--gl-font)',
          }}
        >
          <span />
          <span>Chr</span>
          <span>Region</span>
          <span style={{ textAlign: 'right' }}>cM</span>
          <span style={{ textAlign: 'right' }}>SNPs</span>
        </div>
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {sortedSegments.map((seg) => {
            const isExcluded = excludedIndices.has(seg.index);
            const sizeBp = seg.endBp - seg.startBp;
            const hasHotspot = seg.hotspotLabels.length > 0;
            return (
              <div
                key={seg.index}
                onClick={() => toggleSegment(seg.index)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 48px 1fr 56px 48px',
                  gap: 0,
                  padding: '5px 8px',
                  borderBottom: '1px solid var(--gl-color-border-light)',
                  cursor: 'pointer',
                  opacity: isExcluded ? 0.45 : 1,
                  background: isExcluded ? 'rgba(0,0,0,0.02)' : scoreBg(seg.populationScore),
                  transition: 'opacity 0.15s, background 0.15s',
                  fontSize: 12,
                  fontFamily: 'var(--gl-font)',
                  alignItems: 'center',
                }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={!isExcluded}
                    onChange={() => toggleSegment(seg.index)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ margin: 0, cursor: 'pointer', accentColor: 'var(--gl-color-secondary)' }}
                  />
                </span>
                <span style={{ fontWeight: 600, color: 'var(--gl-color-primary-dark)' }}>
                  {seg.chromosome}
                </span>
                <span style={{ color: 'var(--gl-color-text-muted)', fontSize: 11, lineHeight: 1.3 }}>
                  <span>{formatMb(sizeBp)}</span>
                  {seg.isTriangulated && (
                    <span
                      style={{
                        marginLeft: 5,
                        fontSize: 8,
                        fontWeight: 600,
                        color: 'var(--gl-color-positive)',
                        background: 'rgba(122, 191, 67, 0.1)',
                        padding: '1px 3px',
                        borderRadius: 3,
                      }}
                    >
                      TRI
                    </span>
                  )}
                  {hasHotspot && (
                    <span
                      title={seg.hotspotLabels.join(', ')}
                      style={{
                        marginLeft: 5,
                        fontSize: 8,
                        fontWeight: 600,
                        color: '#d46a0e',
                        background: 'rgba(255, 124, 17, 0.10)',
                        padding: '1px 3px',
                        borderRadius: 3,
                        cursor: 'help',
                      }}
                    >
                      IBD
                    </span>
                  )}
                </span>
                <span style={{ textAlign: 'right', fontWeight: 600, color: isExcluded ? 'var(--gl-color-text-muted)' : 'var(--gl-color-primary-dark)' }}>
                  {seg.cM.toFixed(1)}
                </span>
                <span style={{ textAlign: 'right', color: 'var(--gl-color-text-muted)', fontSize: 11 }}>
                  {seg.snps > 0 ? seg.snps.toLocaleString() : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          onClick={includeAll}
          className="gl-btn gl-btn--secondary"
          style={{ padding: '4px 10px', fontSize: 11 }}
        >
          Include all
        </button>
        <button
          onClick={excludeAll}
          className="gl-btn gl-btn--secondary"
          style={{ padding: '4px 10px', fontSize: 11 }}
        >
          Exclude all
        </button>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          fontSize: 9,
          color: 'var(--gl-color-text-muted)',
          textAlign: 'center',
          paddingTop: 6,
          borderTop: '1px solid var(--gl-color-border-light)',
        }}
      >
        Segments in known IBD hotspot regions (HLA, pericentromeric, founder haplotypes) are prioritized for exclusion.
        Based on Gusev 2012, Li 2014, Bherer 2013.
      </div>
    </div>
  );
}
