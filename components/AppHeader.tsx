'use client';

import React from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Nav menu items (decorative for standalone tool — no real routing)  */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: { label: string; hasDropdown: boolean; active?: boolean }[] = [
  { label: 'HOME', hasDropdown: true },
  { label: 'TRAITS', hasDropdown: true },
  { label: 'REPORTS', hasDropdown: false },
  { label: 'GENEALOGY', hasDropdown: true, active: true },
  { label: 'BONUS', hasDropdown: false },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function ChevronDown({ color = '#263856', size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3.99L8.87.09a.22.22 0 0 1 .35 0l.69.7a.22.22 0 0 1 0 .37L5.18 5.93A.24.24 0 0 1 5 6a.24.24 0 0 1-.18-.07L.09 1.17a.22.22 0 0 1 0-.37l.69-.7a.22.22 0 0 1 .35 0L5 3.99Z"
        fill={color}
      />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

function QuestionCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#4582C9" strokeWidth="1.5" />
      <path
        d="M6.8 7C6.9 6.3 7.3 5.7 7.9 5.3C8.5 4.9 9.1 4.8 9.8 4.9C10.4 5 10.9 5.3 11.2 5.8C11.5 6.3 11.6 6.8 11.5 7.3C11.4 8.1 10.5 8.6 9.7 9C9.5 9.1 9.2 9.3 9.1 9.5V10.5"
        stroke="#4582C9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="9.1" cy="12.8" r="0.9" fill="#4582C9" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path
        d="M7 1L1 7L7 13M1 7H17"
        stroke="#4582C9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function UserAvatar() {
  return (
    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12.5" cy="12.5" r="12" stroke="#C9D6E4" strokeWidth="1" fill="#F5F8FC" />
      <path
        d="M4.78 21.69C5.45 19.56 6.93 17.8 8.87 16.77C9.82 17.6 11.05 18.1 12.37 18.1C13.83 18.1 15.18 17.49 16.16 16.5C18.24 17.41 19.89 19.14 20.68 21.28C18.54 23.28 15.66 24.5 12.5 24.5C9.56 24.5 6.87 23.44 4.78 21.69Z"
        fill="#C9D6E4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 11.68C7.47 14.33 9.75 16.3 12.37 16.3C14.99 16.3 17.27 14.33 17.67 11.72C18.1 11.68 18.57 11.32 18.57 10.88C18.57 10.48 18.27 10.14 17.88 10.09C17.21 10.19 15.21 9.42 14.78 9.25C14.81 9.42 14.8 9.53 14.76 9.6C14.73 9.64 14.69 9.67 14.63 9.68C14.36 9.71 14.08 9.73 13.81 9.73C12.14 9.73 10.85 9.04 10.22 8.7C10.05 8.61 9.9 8.53 9.85 8.52C9.82 8.56 9.73 8.66 9.64 8.77C9.47 8.96 9.24 9.23 9.13 9.35C8.59 9.92 7.67 10.22 7.21 10.22C7.06 10.22 6.95 10.19 6.89 10.13C6.48 10.13 6.17 10.47 6.17 10.88C6.17 11.32 6.52 11.68 6.96 11.68H7Z"
        fill="#C9D6E4"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface AppHeaderProps {
  rightSlot?: React.ReactNode;
}

export function AppHeader({ rightSlot }: AppHeaderProps) {
  return (
    <header style={{ fontFamily: 'var(--gl-font)' }}>
      {/* ============ Top nav bar ============ */}
      <div
        style={{
          background: '#F9FCFF',
          padding: '0 clamp(24px, 4vw, 64px)',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Logo — matches Figma 206×46px logo component */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gl-logo-icon.svg"
            alt="Genomelink"
            style={{ height: 46, width: 36 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gl-logo-text.svg"
            alt=""
            style={{ width: 160, height: 23, marginLeft: 9, position: 'relative', top: 1 }}
          />
        </div>

        {/* Nav items */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginLeft: 60,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#263856',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
                {/* Underline (active state for GENEALOGY) */}
                <div
                  style={{
                    height: 2,
                    borderRadius: 1,
                    background: item.active
                      ? 'linear-gradient(90deg, #FF7C11, #FFB300)'
                      : 'transparent',
                  }}
                />
              </div>
              {item.hasDropdown && <ChevronDown size={8} />}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingLeft: 20,
            flexShrink: 0,
          }}
        >
          {/* Upgrade CTA */}
          <span
            style={{
              fontSize: 14,
              lineHeight: '20px',
              color: '#8FABCF',
              whiteSpace: 'nowrap',
            }}
          >
            Upgrade to unlock <span style={{ fontWeight: 600 }}>312+</span> traits
          </span>
          <button
            type="button"
            style={{
              background: '#FF7C11',
              border: '1px solid transparent',
              borderRadius: 32,
              padding: '8px 16px',
              width: 127,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: '16px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--gl-font)',
            }}
          >
            Upgrade
          </button>

          {/* User area — use rightSlot (UserSwitcher) or default avatar */}
          {rightSlot || (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <UserAvatar />
              <ChevronDown size={10} />
            </div>
          )}
        </div>
      </div>

      {/* ============ Orange gradient line ============ */}
      <div
        style={{
          height: 3,
          background: 'linear-gradient(90deg, #FF7C11 0%, #FFB300 50%, #7ABF43 100%)',
        }}
      />

      {/* ============ Sub-header ============ */}
      <div
        style={{
          background: '#F5F8FC',
          padding: '0 clamp(24px, 4vw, 64px)',
          height: 56,
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
            left: 'clamp(24px, 4vw, 64px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 16,
            fontWeight: 600,
            color: '#4582C9',
            textDecoration: 'none',
            lineHeight: '24px',
          }}
        >
          <BackArrow />
          Back to tools
        </Link>

        {/* Center: page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChainIcon />
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#263856',
              lineHeight: '32px',
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
            right: 'clamp(24px, 4vw, 64px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 16,
            fontWeight: 600,
            color: '#4582C9',
            textDecoration: 'none',
            lineHeight: '24px',
          }}
        >
          <QuestionCircle />
          How to use?
        </Link>
      </div>
    </header>
  );
}
