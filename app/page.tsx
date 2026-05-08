'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RelationshipList } from '@/components/predictor/RelationshipList';
import { InfoBox } from '@/components/predictor/InfoBox';
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
import { DNAMatch, Segment } from '@/data/types';

interface IndexEntry {
  id: string;
  displayName: string;
  initials: string;
  avatarColor: string;
  primaryPopulation: string;
  matchCount: number;
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
    return computeEffectiveCM(segments, excludedSegmentIndices);
  }, [selectedMatch, hasMultipleSegments, segments, excludedSegmentIndices]);

  const results = useMemo(() => {
    if (effectiveCM <= 0) return [];
    return getRelationshipsForCM(effectiveCM);
  }, [effectiveCM]);

  const topResult = results.length > 0 ? results[0] : null;

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

    // Auto-suggest population from the match's ancestry composition
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

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 16px' }}>
        {/* Main 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 280px) 1fr',
            gap: 20,
            alignItems: 'start',
          }}
          className="cmp-layout"
        >
          {/* Left sidebar — match list */}
          <aside
            style={{
              position: 'sticky',
              top: 24,
              maxHeight: 'calc(100vh - 48px)',
              minHeight: 480,
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
                  {/* Selected match callout */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      marginBottom: 24,
                      background: 'rgba(122, 184, 255, 0.1)',
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: selectedMatch.avatarColor, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {selectedMatch.initials}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: '#263856' }}>
                        Predicting for {selectedMatch.name}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: '20px', color: '#6786AC' }}>
                        {selectedMatch.sharedCM} cM · {selectedMatch.relationship}
                        {selectedMatch.ancestryComposition && selectedMatch.ancestryComposition.length > 0 &&
                          ` · ${selectedMatch.ancestryComposition[0].region}`}
                      </div>
                    </div>
                  </div>

                  {/* Shared cM display */}
                  <div style={{ marginBottom: 24 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 14,
                        lineHeight: '20px',
                        fontWeight: 400,
                        fontFamily: 'var(--gl-font)',
                        color: '#6786AC',
                        marginBottom: 4,
                      }}
                    >
                      Shared centiMorgan (cM) value
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#fff',
                        border: '1px solid #8FABCF',
                        borderRadius: 8,
                        padding: 14,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          lineHeight: '20px',
                          fontWeight: 400,
                          fontFamily: 'var(--gl-font)',
                          color: '#263856',
                          flex: 1,
                        }}
                      >
                        {selectedMatch.sharedCM}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          lineHeight: '20px',
                          fontFamily: 'var(--gl-font)',
                          color: '#6786AC',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        cM shared
                      </span>
                    </div>
                  </div>

                  {/* Segment exclusion panel — only for multi-segment matches */}
                  {hasMultipleSegments && (
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
                  )}

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      background: 'rgba(201, 214, 228, 0.6)',
                      marginBottom: 24,
                    }}
                  />

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

                      {topResult && (
                        <InfoBox
                          entry={topResult}
                          originalCM={selectedMatch.sharedCM}
                          effectiveCM={excludedSegmentIndices.size > 0 ? effectiveCM : undefined}
                        />
                      )}
                      <div style={{ marginTop: 16 }}>
                        <RelationshipList results={results} />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 24,
                textAlign: 'center',
                fontSize: 14,
                lineHeight: '20px',
                fontFamily: 'var(--gl-font)',
                color: '#6786AC',
              }}
            >
              Data based on the Shared cM Project v4 (Bettinger/Larkin/Perl).
              Population baselines from genealogical literature — approximations.
              <br />
              Demo data: real DNA-pair structure; names, ancestry, and vendor assignments synthesized.
            </div>
          </main>
        </div>
      </div>

      {/* Mobile responsive: collapse to 1 column under 900px */}
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.cmp-layout) {
            grid-template-columns: 1fr !important;
          }
          :global(.cmp-layout aside) {
            position: static !important;
            max-height: 360px !important;
          }
        }
      `}</style>
    </div>
  );
}
