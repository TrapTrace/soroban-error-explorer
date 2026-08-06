import React, { useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';

export default function HeroSearch({ searchQuery, setSearchQuery }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px 32px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, #FFFFFF 30%, #8B949E 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Search Soroban Smart Contract Errors & Fixes
      </h1>
      
      <p style={{
        color: 'var(--color-slate)',
        fontSize: '16px',
        marginBottom: '32px'
      }}>
        Type an error string, WASM host trap, CLI code, or RPC message to get instant root cause diagnostics and code fixes.
      </p>

      {/* Search Input Box */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 16px',
        boxShadow: 'var(--shadow-glow)',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(47, 169, 140, 0.4)'
      }}>
        <Search size={20} color="var(--color-trace-teal)" style={{ marginRight: '12px' }} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Paste error text (e.g. HostError::BudgetExceeded, Storage, txBAD_SEQ)..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '16px',
            fontFamily: 'var(--font-sans)',
            padding: '12px 0'
          }}
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-slate)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--color-slate)',
            fontFamily: 'var(--font-mono)'
          }}>
            <Command size={12} /> /
          </div>
        )}
      </div>
    </div>
  );
}
