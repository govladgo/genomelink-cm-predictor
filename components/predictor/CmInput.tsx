'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CmInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CmInput({ value, onChange }: CmInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Allow empty, integers, or decimals
      if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
        setLocalValue(raw);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onChange(raw);
        }, 200);
      }
    },
    [onChange],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#fff',
        border: '2px solid var(--gl-color-border)',
        borderRadius: 12,
        padding: '12px 16px',
        transition: 'border-color 0.2s',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        placeholder="0"
        aria-label="Shared centiMorgans"
        style={{
          border: 'none',
          outline: 'none',
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'var(--gl-font)',
          color: 'var(--gl-color-primary-dark)',
          background: 'transparent',
          width: '100%',
          minWidth: 0,
        }}
      />
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: 20,
          background: '#F0F2F5',
          color: 'var(--gl-color-text-muted)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'var(--gl-font)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        cM shared
      </span>
    </div>
  );
}
