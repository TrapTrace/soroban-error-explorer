import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Code } from 'lucide-react';

export default function ErrorCard({ entry, onSelect }) {
  const isVerified = entry.verified;

  return (
    <div
      onClick={() => onSelect(entry)}
      className="glass-panel"
      style={{
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--color-trace-teal)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        {/* Card Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span className="badge badge-category">
            {entry.category}
          </span>
          <span className={`badge ${isVerified ? 'badge-verified' : 'badge-unverified'}`}>
            {isVerified ? (
              <>
                <CheckCircle2 size={13} /> Verified
              </>
            ) : (
              <>
                <AlertTriangle size={13} /> Unverified
              </>
            )}
          </span>
        </div>

        {/* Error Code pill */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-trap-amber)',
          background: 'rgba(226, 152, 75, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block',
          marginBottom: '10px',
          border: '1px solid rgba(226, 152, 75, 0.2)'
        }}>
          {entry.error_code}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
          lineHeight: 1.3
        }}>
          {entry.title}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: '14px',
          color: 'var(--color-slate)',
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {entry.summary}
        </p>
      </div>

      {/* Footer & Action Link */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {entry.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              #{tag}
            </span>
          ))}
        </div>
        
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-trace-teal)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          View Fix <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
