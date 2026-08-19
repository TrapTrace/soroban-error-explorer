import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, Code2, Wrench, Bug, Info } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function ErrorModal({ entry, onClose }) {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);
  // Captured once when the modal opens, so focus always restores to the true trigger.
  const restoreFocusRef = useRef(null);

  // Manage focus: move into the dialog on open, trap Tab, restore on close.
  useEffect(() => {
    if (!entry) return;
    // Capture the trigger only once per open so re-runs never overwrite it.
    if (!restoreFocusRef.current) {
      restoreFocusRef.current = document.activeElement;
    }
    // Defer so the panel is mounted before focusing; land on the first focusable
    // so Shift+Tab from the opening state cycles back inside the dialog.
    const raf = requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector(FOCUSABLE_SELECTOR);
      (firstFocusable || panelRef.current)?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const isOnFirst = document.activeElement === first || document.activeElement === panelRef.current;
        const isOnLast = document.activeElement === last;
        if (e.shiftKey && isOnFirst) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && isOnLast) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', handleKeyDown);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null; // allow re-capture on next open
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const handleCopyCode = () => {
    if (entry.reproduction_steps) {
      navigator.clipboard.writeText(entry.reproduction_steps);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${entry.id}`}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        tabIndex={-1}
      >
        {/* Close Button */}
        <button onClick={onClose} className="modal-close" aria-label="Close dialog">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-category">{entry.category}</span>
            {entry.severity && (
              <span className={`badge badge-severity badge-severity--${entry.severity}`}>
                {entry.severity}
              </span>
            )}
            <span className={`badge ${entry.verified ? 'badge-verified' : 'badge-unverified'}`}>
              {entry.verified ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
              {entry.verified ? 'Verified Fix' : 'Unverified'}
            </span>
            <span className="modal-version">Soroban v{entry.soroban_version}</span>
          </div>

          <button
            onClick={() => {
              const url = `${window.location.origin}/?entry=${entry.id}`;
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '12px' }}
            title="Copy shareable link to this error entry"
          >
            {copied ? <Check size={13} color="var(--color-trace-teal)" /> : <Copy size={13} />}
            {copied ? 'Link Copied!' : 'Share Link'}
          </button>
        </div>

        <h2 id={`modal-title-${entry.id}`} className="modal-title">{entry.title}</h2>

        {/* Summary callout (icon panel — not a colored left border) */}
        <div className="callout">
          <span className="callout-icon">
            <Info size={18} color="var(--color-trace-teal)" />
          </span>
          <span>{entry.summary}</span>
        </div>

        {/* Symptoms */}
        {entry.symptoms && (
          <div className="modal-section">
            <h4 className="modal-section-head modal-section-head--symptoms">
              <Bug size={18} /> Symptoms
            </h4>
            <p className="modal-section-body">{entry.symptoms}</p>
          </div>
        )}

        {/* Root Causes */}
        {entry.root_causes && (
          <div className="modal-section">
            <h4 className="modal-section-head modal-section-head--causes">
              <AlertTriangle size={18} /> Root Causes
            </h4>
            <p className="modal-section-body">{entry.root_causes}</p>
          </div>
        )}

        {/* Code Snippet */}
        {entry.reproduction_steps && (
          <div className="modal-section">
            <div className="section-toolbar">
              <h4 className="modal-section-head modal-section-head--code" style={{ marginBottom: 0 }}>
                <Code2 size={18} /> Code Snippet / Trigger
              </h4>
              <button
                onClick={handleCopyCode}
                className="btn btn-secondary"
                style={{ padding: '5px 11px', fontSize: '12px' }}
              >
                {copied ? <Check size={14} color="var(--color-trace-teal)" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="code-block">
              <code>{entry.reproduction_steps}</code>
            </pre>
          </div>
        )}

        {/* Solutions */}
        {entry.solutions && (
          <div className="modal-section">
            <h4 className="modal-section-head modal-section-head--solutions">
              <Wrench size={18} /> Verified Solutions &amp; Fixes
            </h4>
            <div className="solutions-panel">{entry.solutions}</div>
          </div>
        )}

        {/* Related Entries */}
        {entry.related_entries && entry.related_entries.length > 0 && (
          <div className="modal-section" style={{ marginTop: '16px' }}>
            <h4 className="modal-section-head" style={{ fontSize: '13px', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Related Companion Errors:
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {entry.related_entries.map((relId) => (
                <span
                  key={relId}
                  style={{
                    padding: '4px 10px',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-trace-teal)'
                  }}
                >
                  #{relId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reference */}
        {entry.references && (
          <div className="modal-ref">
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
