import React from 'react';
import { Terminal, Shield, BookOpen, Github, Search, FileText } from 'lucide-react';

export default function Header({ totalEntries, verifiedCount, activeTab, setActiveTab }) {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo Brand & Nav Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <button className="logo" onClick={() => setActiveTab('catalog')} aria-label="TrapTrace home">
            <div className="logo-mark">
              <Terminal size={20} color="#fff" />
            </div>
            <div className="wordmark">
              <span className="wordmark-name">TrapTrace</span>
              <span className="wordmark-tag">Soroban Error Index</span>
            </div>
          </button>

          {/* Navigation */}
          <nav className="nav" aria-label="Primary">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`nav-tab ${activeTab === 'catalog' ? 'nav-tab--active' : ''}`}
              aria-current={activeTab === 'catalog' ? 'page' : undefined}
            >
              <Search size={14} /> Error Catalog
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`nav-tab ${activeTab === 'docs' ? 'nav-tab--active' : ''}`}
              aria-current={activeTab === 'docs' ? 'page' : undefined}
            >
              <FileText size={14} /> Documentation &amp; Guides
            </button>
          </nav>
        </div>

        {/* Header Stats & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="header-stats">
            <span className="stat">
              <BookOpen size={14} color="var(--color-trace-teal)" />
              <strong>{totalEntries}</strong> Entries
            </span>
            <span className="stat">
              <Shield size={14} color="var(--color-trace-teal)" />
              <strong>{verifiedCount}</strong> Verified
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
