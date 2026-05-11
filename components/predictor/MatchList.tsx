'use client';

import { useState, useMemo } from 'react';
import { DNAMatch } from '@/data/types';

interface MatchListProps {
  matches: DNAMatch[];
  selectedId: string | null;
  onSelect: (match: DNAMatch) => void;
  loading?: boolean;
}

export function MatchList({ matches, selectedId, onSelect, loading }: MatchListProps) {
  const [query, setQuery] = useState('');
  const [maxRender, setMaxRender] = useState(80);

  // Sort by cM descending so the most "interesting" matches are at top.
  // Filter by name query if present.
  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? matches.filter((m) => m.name.toLowerCase().includes(q))
      : matches;
    return [...filtered].sort((a, b) => b.sharedCM - a.sharedCM);
  }, [matches, query]);

  const visible = sorted.slice(0, maxRender);

  return (
    <div
      className="match-list-wrapper"
      style={{
        background: 'var(--gl-color-surface)',
        borderRadius: 12,
        boxShadow: 'var(--gl-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 8px', borderBottom: '1px solid var(--gl-color-border-light)' }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--gl-color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}
        >
          Your matches ({matches.length.toLocaleString()})
        </div>
        <input
          type="text"
          placeholder="Search matches"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMaxRender(80);
          }}
          className="gl-input"
          style={{ width: '100%', fontSize: 14, padding: '8px 10px' }}
        />
      </div>

      {/* List */}
      <div
        className="custom-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '4px 6px 8px' }}
      >
        {loading && (
          <div style={emptyState}>Loading matches…</div>
        )}
        {!loading && sorted.length === 0 && (
          <div style={emptyState}>
            {query ? 'No matches found.' : 'No matches loaded.'}
          </div>
        )}
        {!loading &&
          visible.map((m) => {
            const isSelected = m.id === selectedId;
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  width: '100%',
                  border: 'none',
                  borderRadius: 8,
                  background: isSelected ? 'rgba(122, 184, 255, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                  transition: 'background 0.1s',
                  fontFamily: 'var(--gl-font)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--gl-color-bg)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: m.avatarColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {m.initials}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--gl-color-primary-dark)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gl-color-text-muted)', marginTop: 2 }}>
                    {m.sharedCM} cM · {m.relationship}
                  </div>
                </div>
              </button>
            );
          })}

        {!loading && sorted.length > maxRender && (
          <button
            onClick={() => setMaxRender((n) => n + 100)}
            style={{
              width: '100%',
              padding: '8px',
              border: 'none',
              background: 'transparent',
              color: 'var(--gl-color-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--gl-font)',
            }}
          >
            Show more ({sorted.length - maxRender} remaining)
          </button>
        )}
      </div>
    </div>
  );
}

const emptyState: React.CSSProperties = {
  padding: 24,
  textAlign: 'center',
  fontSize: 12,
  color: 'var(--gl-color-text-muted)',
  fontFamily: 'var(--gl-font)',
};
