import React from 'react';
import { Terminal, Shield, BookOpen, Github, Search, FileText } from 'lucide-react';

export default function Header({ totalEntries, verifiedCount, activeTab, setActiveTab }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      background: 'rgba(13, 17, 23, 0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo Brand & Nav Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('catalog')}>
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

          {/* Navigation Buttons */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('catalog')}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'catalog' ? 'rgba(47, 169, 140, 0.15)' : 'transparent',
                color: activeTab === 'catalog' ? 'var(--color-trace-teal)' : 'var(--color-slate)',
                fontWeight: activeTab === 'catalog' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={14} /> Error Catalog
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'docs' ? 'rgba(47, 169, 140, 0.15)' : 'transparent',
                color: activeTab === 'docs' ? 'var(--color-trace-teal)' : 'var(--color-slate)',
                fontWeight: activeTab === 'docs' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={14} /> Documentation & Guides
            </button>
          </nav>
        </div>

        {/* Header Stats & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-slate)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} color="var(--color-trace-teal)" />
              <strong style={{ color: '#fff' }}>{totalEntries}</strong> Entries
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="var(--color-trace-teal)" />
              <strong style={{ color: '#fff' }}>{verifiedCount}</strong> Verified
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
