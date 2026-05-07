'use client';

import React from 'react';
import Link from 'next/link';

function GenomeLinkLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#263856" />
      <path
        d="M8 18.5C9.5 17 11 14.5 11.5 13C12 11.5 12 10 11 8.5"
        stroke="#FF7C11" strokeWidth="2" strokeLinecap="round"
      />
      <path
        d="M20 9.5C18.5 11 17 13.5 16.5 15C16 16.5 16 18 17 19.5"
        stroke="#7ABF43" strokeWidth="2" strokeLinecap="round"
      />
      <path
        d="M9.5 11.5H18.5" stroke="#4582C9" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M9.5 16.5H18.5" stroke="#4582C9" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="#6786AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="#6786AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#4582C9" strokeWidth="1.5" />
      <path
        d="M6 6.2C6.1 5.6 6.4 5.1 6.9 4.8C7.4 4.5 7.9 4.4 8.5 4.5C9 4.6 9.4 4.8 9.7 5.2C10 5.6 10.1 6 10 6.5C9.9 7.2 9.2 7.6 8.5 7.9C8.3 8 8.1 8.1 8 8.4V9.2"
        stroke="#4582C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="8" cy="11.2" r="0.8" fill="#4582C9" />
    </svg>
  );
}

function BackArrowSmall() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path
        d="M6 1L1 6L6 11M1 6H13"
        stroke="#4582C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

interface AppHeaderProps {
  rightSlot?: React.ReactNode;
}

export function AppHeader({ rightSlot }: AppHeaderProps) {
  return (
    <header style={{ fontFamily: 'var(--gl-font)' }}>
      {/* Top nav bar */}
      <div
        style={{
          background: '#fff',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: logo + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GenomeLinkLogo />
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#263856',
              letterSpacing: '-0.01em',
            }}
          >
            Genomelink
          </span>
        </div>

        {/* Right: user switcher slot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {rightSlot}
        </div>
      </div>

      {/* Orange gradient line */}
      <div
        style={{
          height: 3,
          background: 'linear-gradient(90deg, #FF7C11 0%, #FFB300 50%, #7ABF43 100%)',
        }}
      />

      {/* Sub-header */}
      <div
        style={{
          background: '#F5F8FC',
          padding: '0 24px',
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid #E8EFF8',
        }}
      >
        {/* Left: back link */}
        <Link
          href="/"
          style={{
            position: 'absolute',
            left: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: '#4582C9',
            textDecoration: 'none',
          }}
        >
          <BackArrowSmall />
          Back to tools
        </Link>

        {/* Center: page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChainIcon />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#263856',
            }}
          >
            Common Ancestor cM
          </span>
        </div>

        {/* Right: how to use */}
        <Link
          href="/help"
          style={{
            position: 'absolute',
            right: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 13,
            fontWeight: 500,
            color: '#4582C9',
            textDecoration: 'none',
          }}
        >
          <QuestionIcon />
          How to use?
        </Link>
      </div>
    </header>
  );
}
