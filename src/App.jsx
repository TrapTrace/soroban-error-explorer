import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import CategoryFilters from './components/CategoryFilters';
import ErrorCard from './components/ErrorCard';
import ErrorModal from './components/ErrorModal';
import LiveStudio from './components/LiveStudio';
import Documentation from './components/Documentation';
import Footer from './components/Footer';
import { SearchX } from 'lucide-react';

import entriesData from './data/entries.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'studio' | 'docs'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Theme: dark by default (per brand §2), persisted across visits.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('traptrace-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('traptrace-theme', theme);
    } catch {
      // Private mode / storage blocked — theme still applies for this visit.
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0C0F14' : '#F7F5F0');
  }, [theme]);

  // URL Query Parameters Handling on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const entryParam = params.get('entry');
      const qParam = params.get('q') || params.get('search');
      const catParam = params.get('cat') || params.get('category');

      if (tabParam && ['catalog', 'studio', 'docs'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      if (entryParam) {
        const found = entriesData.find(e => e.id === entryParam);
        if (found) setSelectedEntry(found);
      }
      if (qParam) {
        setSearchQuery(qParam);
      }
      if (catParam) {
        setActiveCategory(catParam);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: entriesData.length };
    entriesData.forEach((entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter entries dynamically
  const filteredEntries = useMemo(() => {
    return entriesData.filter((entry) => {
      // Category filter
      if (activeCategory !== 'all' && entry.category !== activeCategory) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && !entry.verified) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = entry.title.toLowerCase().includes(q);
        const matchCode = entry.error_code.toLowerCase().includes(q);
        const matchSummary = entry.summary.toLowerCase().includes(q);
        const matchTags = entry.tags.some(t => t.toLowerCase().includes(q));
        const matchSymptoms = (entry.symptoms || '').toLowerCase().includes(q);

        return matchTitle || matchCode || matchSummary || matchTags || matchSymptoms;
      }

      return true;
    });
  }, [searchQuery, activeCategory, verifiedOnly]);

  const verifiedCount = useMemo(() => {
    return entriesData.filter(e => e.verified).length;
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setVerifiedOnly(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        totalEntries={entriesData.length}
        verifiedCount={verifiedCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'catalog' && (
          <>
            <HeroSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <CategoryFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              categoryCounts={categoryCounts}
            />

            {/* Catalog Grid */}
            <div className="container">
              {filteredEntries.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <SearchX size={28} color="var(--color-trace-teal)" />
                  </div>
                  <h3>No matching errors found</h3>
                  <p>Try adjusting your search terms or turning off the verified filter.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="card-grid">
                  {filteredEntries.map((entry) => (
                    <ErrorCard
                      key={entry.id}
                      entry={entry}
                      onSelect={(item) => setSelectedEntry(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'studio' && (
          <LiveStudio 
            catalogEntries={entriesData} 
            onSelectEntry={(item) => setSelectedEntry(item)} 
          />
        )}

        {activeTab === 'docs' && (
          <Documentation />
        )}
      </main>

      <ErrorModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />

      <Footer />
    </div>
  );
}
