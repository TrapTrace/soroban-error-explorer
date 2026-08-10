import React from 'react';
import { CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Errors' },
  { id: 'host-error', label: 'Host Errors' },
  { id: 'cli-error', label: 'CLI Errors' },
  { id: 'rpc-error', label: 'RPC Errors' },
  { id: 'sdk-error', label: 'SDK Errors' }
];

export default function CategoryFilters({
  activeCategory,
  setActiveCategory,
  verifiedOnly,
  setVerifiedOnly,
  categoryCounts
}) {
  return (
    <div className="container filters">
      {/* Category chips */}
      <div className="chip-row" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`chip ${isActive ? 'chip--active' : ''}`}
              aria-pressed={isActive}
            >
              {cat.label}
              <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Verified toggle */}
      <label className={`toggle-pill ${verifiedOnly ? 'toggle-pill--on' : ''}`}>
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
        />
        <CheckCircle size={15} />
        Verified Fixes Only
      </label>
    </div>
  );
}
