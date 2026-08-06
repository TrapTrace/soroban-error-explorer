import React from 'react';
import { Terminal, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: '#090D12',
      padding: '32px 24px',
      marginTop: '60px',
      color: 'var(--color-slate)',
      fontSize: '14px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={18} color="var(--color-trace-teal)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
            TrapTrace Ecosystem
          </span>
          <span>— Open Source Soroban Developer Tooling</span>
        </div>

        <div>
          Targeting <strong style={{ color: 'var(--color-trap-amber)' }}>Stellar Wave 8</strong>
        </div>
      </div>
    </footer>
  );
}
