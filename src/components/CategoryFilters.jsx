import React from 'react';
import { Filter, CheckCircle } from 'lucide-react';

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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto 24px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: isActive ? '1px solid var(--color-trace-teal)' : '1px solid var(--color-border)',
                background: isActive ? 'rgba(47, 169, 140, 0.15)' : 'rgba(22, 27, 34, 0.6)',
                color: isActive ? 'var(--color-trace-teal)' : 'var(--color-slate)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {cat.label}
              <span style={{
                fontSize: '11px',
                background: isActive ? 'rgba(47, 169, 140, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                padding: '2px 6px',
                borderRadius: '10px',
                color: isActive ? '#fff' : 'var(--color-slate)'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Verified Only Toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: verifiedOnly ? 'var(--color-trace-teal)' : 'var(--color-slate)',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'rgba(22, 27, 34, 0.6)',
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)'
      }}>
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          style={{ accentColor: 'var(--color-trace-teal)', cursor: 'pointer' }}
        />
        <CheckCircle size={15} color={verifiedOnly ? 'var(--color-trace-teal)' : 'var(--color-slate)'} />
        Verified Fixes Only
      </label>
    </div>
  );
}
