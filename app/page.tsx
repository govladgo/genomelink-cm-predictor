'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RelationshipList } from '@/components/predictor/RelationshipList';
import { MatchList } from '@/components/predictor/MatchList';
import { SegmentExclusionPanel } from '@/components/predictor/SegmentExclusionPanel';
import { UserSwitcher } from '@/components/UserSwitcher';
import { AppHeader } from '@/components/AppHeader';
import { getRelationshipsForCM } from '@/data/sharedCmData';
import { getPopulationById, suggestPopulationForAncestry } from '@/data/populationContext';
import { computeDefaultExclusions, computeEffectiveCM } from '@/data/segmentExclusion';
import {
  loadUserIndex, loadUserDataset,
  getSelectedUserIdFromUrl, setSelectedUserIdInUrl,
  DemoUser,
} from '@/data/adapters/realData';
import { DNAMatch, Segment, SharedCmEntryV4 } from '@/data/types';

interface IndexEntry {
  id: string;
  displayName: string;
  initials: string;
  avatarColor: string;
  primaryPopulation: string;
  matchCount: number;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSummary(match: DNAMatch, topResult: SharedCmEntryV4 | null, effectiveCM: number): string {
  const name = match.name.split(' ')[0];
  const region = match.ancestryComposition?.[0]?.region;
  const segCount = match.segments?.length ?? 0;

  let text = `You share ${effectiveCM.toLocaleString()} cM with ${name}`;
  if (segCount > 0) {
    text += ` across ${segCount} DNA segment${segCount !== 1 ? 's' : ''}`;
  }
  text += '.';

  if (topResult) {
    const pct = Math.round(topResult.probability * 100);
    text += ` The most likely relationship is ${topResult.relationship} (${pct}% probability), with a typical range of ${topResult.minCM.toLocaleString()}–${topResult.maxCM.toLocaleString()} cM.`;
  }

  if (region) {
    text += ` Shared ancestry region: ${region}.`;
  }

  return text;
}

export default function Home() {
  const [populationId, setPopulationId] = useState('none');
  const [excludedSegmentIndices, setExcludedSegmentIndices] = useState<Set<number>>(new Set());

  const [userIndex, setUserIndex] = useState<IndexEntry[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>('user-1');
  const [, setActiveUser] = useState<DemoUser | null>(null);
  const [matches, setMatches] = useState<DNAMatch[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) ?? null,
    [matches, selectedMatchId],
  );

  const segments: Segment[] = useMemo(
    () => (selectedMatch?.segments ?? []) as Segment[],
    [selectedMatch],
  );
  const hasMultipleSegments = segments.length >= 2;

  const effectiveCM = useMemo(() => {
    if (!selectedMatch) return 0;
    if (!hasMultipleSegments || excludedSegmentIndices.size === 0) return selectedMatch.sharedCM;
    return Math.min(computeEffectiveCM(segments, excludedSegmentIndices), selectedMatch.sharedCM);
  }, [selectedMatch, hasMultipleSegments, segments, excludedSegmentIndices]);

  const results = useMemo(() => {
    if (effectiveCM <= 0) return [];
    return getRelationshipsForCM(effectiveCM);
  }, [effectiveCM]);

  const topResult = results.length > 0 ? results[0] : null;

  const summaryText = useMemo(() => {
    if (!selectedMatch || !topResult) return '';
    return generateSummary(selectedMatch, topResult, effectiveCM);
  }, [selectedMatch, topResult, effectiveCM]);

  const recomputeExclusions = useCallback(
    (segs: Segment[], popId: string) => {
      const floor = getPopulationById(popId).sharedPopulationFloor;
      setExcludedSegmentIndices(computeDefaultExclusions(segs, floor, popId));
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const index = await loadUserIndex();
        if (cancelled) return;
        setUserIndex(index);
        const initialId = getSelectedUserIdFromUrl();
        const validId = index.find((u) => u.id === initialId) ? initialId : index[0]?.id;
        if (validId) {
          setActiveUserId(validId);
          const ds = await loadUserDataset(validId);
          if (!cancelled) {
            setActiveUser(ds.user);
            setMatches(ds.matches);
            setLoadingMatches(false);
          }
        }
      } catch (err) {
        console.error('Failed to load demo data:', err);
        if (!cancelled) setLoadingMatches(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSelectUser = async (userId: string) => {
    setLoadingMatches(true);
    setActiveUserId(userId);
    setSelectedUserIdInUrl(userId);
    setSelectedMatchId(null);
    setExcludedSegmentIndices(new Set());
    try {
      const ds = await loadUserDataset(userId);
      setActiveUser(ds.user);
      setMatches(ds.matches);
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSelectMatch = (match: DNAMatch) => {
    setSelectedMatchId(match.id);

    let popId = 'none';
    if (match.ancestryComposition && match.ancestryComposition.length > 0) {
      popId = suggestPopulationForAncestry(match.ancestryComposition[0].region);
    }
    setPopulationId(popId);

    const segs = (match.segments ?? []) as Segment[];
    if (segs.length >= 2) {
      recomputeExclusions(segs, popId);
    } else {
      setExcludedSegmentIndices(new Set());
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('prediction-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePopulationChange = (newPopId: string) => {
    setPopulationId(newPopId);
    if (hasMultipleSegments) {
      recomputeExclusions(segments, newPopId);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FCFF' }}>
      <AppHeader
        rightSlot={
          userIndex.length > 0 ? (
            <UserSwitcher
              users={userIndex}
              activeId={activeUserId}
              onSelect={handleSelectUser}
            />
          ) : undefined
        }
      />

      <div className="cmp-container" style={{ maxWidth: 1440, margin: '0 auto', padding: '24px clamp(16px, 4vw, 64px)' }}>
        {/* Main 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '256px 1fr',
            gap: 24,
            alignItems: 'start',
          }}
          className="cmp-layout"
        >
          {/* Left sidebar — match list */}
          <aside
            style={{
              position: 'sticky',
              top: 24,
              height: 'calc(100vh - 48px)',
              maxHeight: 'calc(100vh - 48px)',
            }}
          >
            <MatchList
              matches={matches}
              selectedId={selectedMatchId}
              onSelect={handleSelectMatch}
              loading={loadingMatches}
            />
          </aside>

          {/* Right column — prediction card */}
          <main id="prediction-card" style={{ minWidth: 0 }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid rgba(201, 214, 228, 0.6)',
                borderRadius: 12,
                padding: 24,
              }}
            >
              {!selectedMatch ? (
                <div
                  style={{
                    textAlign: 'center', padding: '60px 0',
                    fontSize: 16, lineHeight: '24px',
                    fontFamily: 'var(--gl-font)',
                    color: '#6786AC',
                  }}
                >
                  Select a match from the list to see relationship predictions
                </div>
              ) : (
                <>
                  {/* Match header: name + source + stat tiles */}
                  <div className="match-detail-header" style={{ marginBottom: 24 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          lineHeight: '28px',
                          color: '#263856',
                          fontFamily: 'var(--gl-font)',
                          margin: 0,
                        }}
                      >
                        {selectedMatch.name}
                      </h2>
                      <div
                        style={{
                          fontSize: 14,
                          lineHeight: '20px',
                          color: '#6786AC',
                          fontFamily: 'var(--gl-font)',
                          marginTop: 4,
                        }}
                      >
                        {capitalize(selectedMatch.source)} · {selectedMatch.relationship}
                        {selectedMatch.ancestryComposition && selectedMatch.ancestryComposition.length > 0 &&
                          ` · ${selectedMatch.ancestryComposition[0].region}`}
                      </div>
                    </div>
                    <div className="match-stat-tiles">
                      {[
                        { value: selectedMatch.sharedCM.toLocaleString(), label: 'cM shared' },
                        { value: String(segments.length), label: 'Segments' },
                        { value: String(results.length), label: 'Matches' },
                      ].map((tile) => (
                        <div
                          key={tile.label}
                          style={{
                            background: 'rgba(201, 214, 228, 0.2)',
                            borderRadius: 12,
                            padding: '8px 6px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              lineHeight: '28px',
                              color: '#263856',
                              fontFamily: 'var(--gl-font)',
                            }}
                          >
                            {tile.value}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              lineHeight: '16px',
                              color: '#6786AC',
                              fontFamily: 'var(--gl-font)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {tile.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary section */}
                  {summaryText && (
                    <div style={{ marginBottom: 24 }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          lineHeight: '24px',
                          color: '#263856',
                          fontFamily: 'var(--gl-font)',
                          margin: '0 0 8px',
                        }}
                      >
                        Summary
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: '22px',
                          color: '#6786AC',
                          fontFamily: 'var(--gl-font)',
                          margin: 0,
                        }}
                      >
                        {summaryText}
                      </p>
                    </div>
                  )}

                  {/* Segment exclusion panel — only for multi-segment matches */}
                  {hasMultipleSegments && (
                    <div style={{ marginBottom: 24 }}>
                    <SegmentExclusionPanel
                      segments={segments}
                      totalCM={selectedMatch.sharedCM}
                      populationId={populationId}
                      onPopulationChange={handlePopulationChange}
                      excludedIndices={excludedSegmentIndices}
                      onExcludedChange={setExcludedSegmentIndices}
                      effectiveCM={effectiveCM}
                      ancestryComposition={selectedMatch.ancestryComposition}
                    />
                    </div>
                  )}

                  {/* Results */}
                  {results.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center', padding: '40px 0',
                        fontSize: 16, lineHeight: '24px',
                        fontFamily: 'var(--gl-font)',
                        color: '#6786AC',
                      }}
                    >
                      No matching relationships found for {effectiveCM.toFixed(1)} cM
                    </div>
                  ) : (
                    <>
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
                            fontSize: 16, fontWeight: 600,
                            lineHeight: '24px',
                            fontFamily: 'var(--gl-font)',
                            color: '#263856',
                          }}
                        >
                          Possible relationships
                        </span>
                        <span
                          style={{
                            fontSize: 14, lineHeight: '20px',
                            fontFamily: 'var(--gl-font)',
                            color: '#6786AC',
                          }}
                        >
                          {results.length} match{results.length !== 1 ? 'es' : ''}
                        </span>
                      </div>

                      <RelationshipList
                        results={results}
                        originalCM={selectedMatch.sharedCM}
                        effectiveCM={excludedSegmentIndices.size > 0 ? effectiveCM : undefined}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className="cmp-footer"
              style={{
                marginTop: 24,
                textAlign: 'center',
                fontSize: 12,
                lineHeight: '16px',
                fontFamily: 'var(--gl-font)',
                color: '#8FABCF',
              }}
            >
              Data based on the Shared cM Project v4 (Bettinger/Larkin/Perl).
              Population baselines from genealogical literature.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
