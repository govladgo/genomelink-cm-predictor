'use client';
import React from 'react';
import { SharedCmEntryV4 } from '@/data/types';

interface InfoBoxProps {
  entry: SharedCmEntryV4;
}

export function InfoBox({ entry }: InfoBoxProps) {
  return (
    <div
      style={{
        background: '#F7F8FA',
        borderRadius: 8,
        padding: '12px 16px',
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: 'var(--gl-font)',
          color: 'var(--gl-color-text-muted)',
          lineHeight: 1.6,
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--gl-color-primary-dark)' }}>
          Most likely: {entry.relationship}
        </span>
        <br />
        Typical range: {entry.minCM} &ndash; {entry.maxCM} cM
        &nbsp;&middot;&nbsp;
        Average: {entry.avgCM} cM
      </div>
    </div>
  );
}
