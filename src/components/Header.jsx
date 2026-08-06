import React from 'react';
import { Terminal, Shield, BookOpen, Github } from 'lucide-react';

export default function Header({ totalEntries, verifiedCount }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      background: 'rgba(13, 17, 23, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-trap-amber), var(--color-trace-teal))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Terminal size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '18px', color: '#fff' }}>
                TrapTrace
              </span>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-trace-teal)',
                background: 'rgba(47, 169, 140, 0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(47, 169, 140, 0.3)'
              }}>
                Soroban Error Index
              </span>
            </div>
          </div>
        </div>

        {/* Header Stats & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-slate)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} color="var(--color-trace-teal)" />
              <strong style={{ color: '#fff' }}>{totalEntries}</strong> Catalog Entries
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="var(--color-trace-teal)" />
              <strong style={{ color: '#fff' }}>{verifiedCount}</strong> Verified Fixes
            </span>
          </div>

          <a 
            href="https://github.com/TrapTrace" 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <Github size={16} /> GitHub Org
          </a>
        </div>
      </div>
    </header>
  );
}
