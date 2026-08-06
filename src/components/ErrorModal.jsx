import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, Code2, Wrench, Bug } from 'lucide-react';

export default function ErrorModal({ entry, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!entry) return null;

  const handleCopyCode = () => {
    if (entry.reproduction_steps) {
      navigator.clipboard.writeText(entry.reproduction_steps);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 8, 12, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          background: '#161B22',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          border: '1px solid rgba(47, 169, 140, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--color-slate)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-category">{entry.category}</span>
            <span className={`badge ${entry.verified ? 'badge-verified' : 'badge-unverified'}`}>
              {entry.verified ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
              {entry.verified ? 'Verified Fix' : 'Unverified'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', fontFamily: 'var(--font-mono)' }}>
              Soroban v{entry.soroban_version}
            </span>
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            {entry.title}
          </h2>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--color-trap-amber)',
            background: 'rgba(226, 152, 75, 0.1)',
            padding: '6px 12px',
            borderRadius: '6px',
            display: 'inline-block',
            border: '1px solid rgba(226, 152, 75, 0.2)'
          }}>
            Code: {entry.error_code}
          </div>
        </div>

        {/* Summary Box */}
        <div style={{
          background: 'rgba(47, 169, 140, 0.08)',
          borderLeft: '4px solid var(--color-trace-teal)',
          padding: '16px 20px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '28px',
          fontSize: '15px',
          color: 'var(--color-text-main)'
        }}>
          {entry.summary}
        </div>

        {/* Symptoms Section */}
        {entry.symptoms && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: '#FF6B6B', marginBottom: '8px' }}>
              <Bug size={18} /> Symptoms
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', whiteSpace: 'pre-line' }}>
              {entry.symptoms}
            </p>
          </div>
        )}

        {/* Root Causes Section */}
        {entry.root_causes && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: 'var(--color-trap-amber)', marginBottom: '8px' }}>
              <AlertTriangle size={18} /> Root Causes
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', whiteSpace: 'pre-line' }}>
              {entry.root_causes}
            </p>
          </div>
        )}

        {/* Reproduction Code Section */}
        {entry.reproduction_steps && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                <Code2 size={18} /> Code Snippet / Trigger
              </h4>
              <button
                onClick={handleCopyCode}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                {copied ? <Check size={14} color="var(--color-trace-teal)" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre style={{
              background: '#0D1117',
              border: '1px solid var(--color-border)',
              padding: '16px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '13px',
              color: '#58A6FF'
            }}>
              <code>{entry.reproduction_steps}</code>
            </pre>
          </div>
        )}

        {/* Verified Solutions Section */}
        {entry.solutions && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: 'var(--color-trace-teal)', marginBottom: '8px' }}>
              <Wrench size={18} /> Verified Solutions & Fixes
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(47, 169, 140, 0.2)',
              fontSize: '14px',
              color: '#fff',
              whiteSpace: 'pre-line'
            }}>
              {entry.solutions}
            </div>
          </div>
        )}

        {/* External Reference Link */}
        {entry.references && (
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <a
              href={entry.references}
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--color-trace-teal)',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              Stellar Documentation Reference <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
