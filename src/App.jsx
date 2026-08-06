import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import CategoryFilters from './components/CategoryFilters';
import ErrorCard from './components/ErrorCard';
import ErrorModal from './components/ErrorModal';
import Documentation from './components/Documentation';
import Footer from './components/Footer';

import entriesData from './data/entries.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'docs'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        totalEntries={entriesData.length}
        verifiedCount={verifiedCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'catalog' ? (
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
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
            }}>
              {filteredEntries.length === 0 ? (
                <div className="glass-panel" style={{
                  textAlign: 'center',
                  padding: '60px 24px',
                  color: 'var(--color-slate)'
                }}>
                  <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>
                    No matching errors found
                  </h3>
                  <p>Try adjusting your search terms or turning off the verified filter.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '24px'
                }}>
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
        ) : (
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
