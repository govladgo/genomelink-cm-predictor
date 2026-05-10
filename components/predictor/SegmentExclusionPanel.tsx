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
    <div ref={ref} style={{ position: 'relative' }}>
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
          padding: '14px',
          background: '#fff',
          border: '1px solid #8FABCF',
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
                <span style={{ fontSize: 14, lineHeight: '20px', color: '#263856', fontWeight: isSelected ? 600 : 400 }}>
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
  const excludedCM = Math.max(0, totalCM - effectiveCM);
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
        padding: '24px 16px',
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '24px',
          color: '#263856',
          margin: '0 0 16px',
          fontFamily: 'var(--gl-font)',
        }}
      >
        Segment Analysis
      </h3>

      {/* Population selector */}
      <div style={{ marginBottom: 16 }}>
        <PopulationDropdown
          populations={relevantPopulations}
          selectedId={populationId}
          onSelect={onPopulationChange}
        />
      </div>

      {/* 4 stat tiles */}
      <div className="segment-stats-grid" style={{ marginBottom: 16 }}>
        {/* Total segments */}
        <div
          style={{
            background: 'rgba(201, 214, 228, 0.2)',
            border: '1px solid rgba(103, 134, 172, 0.3)',
            borderRadius: 12,
            padding: '8px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#263856', fontFamily: 'var(--gl-font)' }}>
            {segments.length}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#6786AC', fontFamily: 'var(--gl-font)' }}>
            Total segments
          </div>
        </div>

        {/* IBD hotspots */}
        <div
          style={{
            background: 'rgba(201, 214, 228, 0.2)',
            border: '1px solid rgba(103, 134, 172, 0.3)',
            borderRadius: 12,
            padding: '8px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#263856', fontFamily: 'var(--gl-font)' }}>
            {hotspotSegmentCount}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#6786AC', fontFamily: 'var(--gl-font)' }}>
            IBD hotspots
          </div>
        </div>

        {/* Included */}
        <div
          style={{
            background: 'rgba(122, 184, 255, 0.1)',
            border: '1px solid #7AB8FF',
            borderRadius: 12,
            padding: '8px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#4582C9', fontFamily: 'var(--gl-font)' }}>
            {effectiveCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#263856', fontFamily: 'var(--gl-font)' }}>
            Included
          </div>
          <div style={{ fontSize: 12, fontWeight: 400, lineHeight: '16px', color: '#6786AC', fontFamily: 'var(--gl-font)' }}>
            {includedCount} segment{includedCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Excluded */}
        <div
          style={{
            background: 'rgba(255, 124, 17, 0.1)',
            border: '1px solid #FF7C11',
            borderRadius: 12,
            padding: '8px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#F2690B', fontFamily: 'var(--gl-font)' }}>
            {excludedCM.toFixed(1)} cM
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#263856', fontFamily: 'var(--gl-font)' }}>
            Excluded
          </div>
          <div style={{ fontSize: 12, fontWeight: 400, lineHeight: '16px', color: '#6786AC', fontFamily: 'var(--gl-font)' }}>
            {excludedCount} segment{excludedCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Segment table */}
      <div
        className="segment-table-scroll"
        style={{
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ minWidth: 500 }}>
          {/* Table header */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              padding: '16px 16px 16px 72px',
              borderBottom: '2px solid rgba(201, 214, 228, 0.6)',
              background: '#fff',
              fontSize: 16,
              fontWeight: 600,
              color: 'rgba(38, 56, 86, 0.6)',
              fontFamily: 'var(--gl-font)',
              lineHeight: '24px',
            }}
          >
            <span style={{ flex: 1 }}>Chr</span>
            <span style={{ flex: 1 }}>Region</span>
            <span style={{ flex: 1 }}>cM</span>
            <span style={{ flex: 1 }}>SNPs</span>
          </div>

          {/* Table body */}
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {sortedSegments.map((seg) => {
              const isExcluded = excludedIndices.has(seg.index);
              const sizeBp = seg.endBp - seg.startBp;
              const hasHotspot = seg.hotspotLabels.length > 0;
              return (
                <div
                  key={seg.index}
                  onClick={() => toggleSegment(seg.index)}
                  style={{
                    display: 'flex',
                    gap: 32,
                    padding: 16,
                    borderBottom: '1px solid rgba(201, 214, 228, 0.6)',
                    cursor: 'pointer',
                    opacity: isExcluded ? 0.5 : 1,
                    background: isExcluded ? '#fff' : (scoreBg(seg.populationScore) || '#fff'),
                    transition: 'opacity 0.15s, background 0.15s',
                    fontSize: 16,
                    fontFamily: 'var(--gl-font)',
                    alignItems: 'center',
                    lineHeight: '24px',
                  }}
                >
                  {/* Checkbox */}
                  <span style={{ flexShrink: 0, width: 24 }}>
                    <input
                      type="checkbox"
                      checked={!isExcluded}
                      onChange={() => toggleSegment(seg.index)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        margin: 0,
                        cursor: 'pointer',
                        accentColor: '#FF7C11',
                        width: 24,
                        height: 24,
                      }}
                    />
                  </span>

                  {/* Chr */}
                  <span style={{ flex: 1, fontWeight: 600, color: '#263856' }}>
                    {seg.chromosome}
                  </span>

                  {/* Region */}
                  <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, color: '#263856' }}>
                    <span>{formatMb(sizeBp)}</span>
                    {seg.isTriangulated && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--gl-color-positive)',
                          background: 'rgba(122, 191, 67, 0.1)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          lineHeight: '14px',
                        }}
                      >
                        TRI
                      </span>
                    )}
                    {hasHotspot && (
                      <span
                        title={seg.hotspotLabels.join(', ')}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#FF7C11',
                          background: 'rgba(255, 124, 17, 0.10)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          cursor: 'help',
                          textTransform: 'uppercase',
                          lineHeight: '14px',
                        }}
                      >
                        IBD
                      </span>
                    )}
                  </span>

                  {/* cM */}
                  <span style={{ flex: 1, fontWeight: 600, color: isExcluded ? '#6786AC' : '#263856' }}>
                    {seg.cM.toFixed(1)}
                  </span>

                  {/* SNPs */}
                  <span style={{ flex: 1, color: '#263856' }}>
                    {seg.snps > 0 ? seg.snps.toLocaleString() : '—'}
                  </span>
                </div>
              );
            })}

            {/* Action buttons row */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: 16,
                borderBottom: '1px solid rgba(201, 214, 228, 0.6)',
                background: '#fff',
              }}
            >
              <button
                onClick={excludeAll}
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--gl-font)',
                  textTransform: 'uppercase',
                  lineHeight: '16px',
                  color: '#D52C43',
                  background: 'transparent',
                  border: '1px solid #D52C43',
                  borderRadius: 32,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Exclude all
              </button>
              <button
                onClick={includeAll}
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--gl-font)',
                  textTransform: 'uppercase',
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
