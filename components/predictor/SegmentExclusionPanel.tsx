'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Segment, AncestryComponent } from '@/data/types';
import { POPULATION_CONTEXTS, getRelevantPopulations } from '@/data/populationContext';
import { scoreSegments } from '@/data/segmentExclusion';

interface SegmentExclusionPanelProps {
  segments: Segment[];
  totalCM: number;
  populationId: string;
  onPopulationChange: (id: string) => void;
  excludedIndices: Set<number>;
  onExcludedChange: (indices: Set<number>) => void;
  effectiveCM: number;
  ancestryComposition?: AncestryComponent[];
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transition: 'transform 0.15s',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="#6786AC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PopulationDropdownProps {
  populations: { id: string; label: string; era: string; sharedPopulationFloor: number }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function PopulationDropdown({ populations, selectedId, onSelect }: PopulationDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = populations.find((p) => p.id === selectedId) ?? populations[0];

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 12 }}>
      <label
        style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '20px',
          color: '#6786AC',
          marginBottom: 4,
          fontFamily: 'var(--gl-font)',
        }}
      >
        Population context
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
          padding: '8px 12px',
          background: '#fff',
          border: '1px solid rgba(201, 214, 228, 0.6)',
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: 'var(--gl-font)',
          fontSize: 14,
          color: '#263856',
          textAlign: 'left',
          lineHeight: '20px',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.label}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 5px 10px rgba(74, 93, 128, 0.16)',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {populations.map((p) => {
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: '100%',
                  padding: '10px 16px',
                  background: isSelected ? 'rgba(69, 130, 201, 0.06)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--gl-font)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(69, 130, 201, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected ? 'rgba(69, 130, 201, 0.06)' : '#fff';
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#263856',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {p.label}
                </span>
                {p.era && (
                  <span style={{ fontSize: 11, lineHeight: '16px', color: '#6786AC' }}>
                    {p.era}
                    {p.sharedPopulationFloor > 0 && ` · ~${p.sharedPopulationFloor} cM baseline`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SegmentExclusionPanel({
  segments,
  totalCM,
  populationId,
  onPopulationChange,
  excludedIndices,
  onExcludedChange,
  effectiveCM,
  ancestryComposition,
}: SegmentExclusionPanelProps) {
  const excludedCM = totalCM - effectiveCM;
  const includedCount = segments.length - excludedIndices.size;
  const excludedCount = excludedIndices.size;

  const population = useMemo(
    () => POPULATION_CONTEXTS.find((p) => p.id === populationId) ?? POPULATION_CONTEXTS[0],
    [populationId],
  );

  const relevantPopulations = useMemo(
    () => getRelevantPopulations((ancestryComposition ?? []).map((a) => a.region)),
    [ancestryComposition],
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
        background: 'rgba(201, 214, 228, 0.2)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '24px',
            color: '#263856',
            margin: 0,
            fontFamily: 'var(--gl-font)',
          }}
        >
          Segment Analysis
        </h3>
        <span
          style={{
            fontSize: 14,
            lineHeight: '20px',
            color: '#6786AC',
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
      <PopulationDropdown
        populations={relevantPopulations}
        selectedId={populationId}
        onSelect={onPopulationChange}
      />

      {/* Summary tiles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(69, 130, 201, 0.08)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: '#245FA4', textTransform: 'uppercase', marginBottom: 2 }}>
            Included
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: '#245FA4' }}>
            {effectiveCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 14, lineHeight: '20px', color: '#6786AC' }}>
            {includedCount} segment{includedCount !== 1 ? 's' : ''}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            background: excludedCount > 0 ? 'rgba(255, 124, 17, 0.08)' : 'rgba(201, 214, 228, 0.2)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: excludedCount > 0 ? '#d46a0e' : '#6786AC', textTransform: 'uppercase', marginBottom: 2 }}>
            Excluded
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: excludedCount > 0 ? '#d46a0e' : '#6786AC' }}>
            {excludedCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 14, lineHeight: '20px', color: '#6786AC' }}>
            {excludedCount} segment{excludedCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Segment list */}
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(201, 214, 228, 0.6)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 48px 1fr 56px 48px',
            gap: 0,
            padding: '6px 8px',
            borderBottom: '1px solid rgba(201, 214, 228, 0.4)',
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
                  borderBottom: '1px solid rgba(201, 214, 228, 0.4)',
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={includeAll}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'var(--gl-font)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: '16px',
            color: '#263856',
            background: 'transparent',
            border: '1px solid rgba(38, 56, 86, 0.6)',
            borderRadius: 32,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Include all
        </button>
        <button
          onClick={excludeAll}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'var(--gl-font)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: '16px',
            color: '#263856',
            background: 'transparent',
            border: '1px solid rgba(38, 56, 86, 0.6)',
            borderRadius: 32,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Exclude all
        </button>
      </div>

    </div>
  );
}
