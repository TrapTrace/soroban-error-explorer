import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ErrorCard({ entry, onSelect }) {
  const isVerified = entry.verified;

  return (
    <article className={`error-card cat-${entry.category}`}>
      {/* Stretched overlay button — the single, real, accessible card action.
          Keeps the <h3>/<p> content out of the button while covering the card. */}
      <button
        type="button"
        className="card-hit-area"
        onClick={() => onSelect(entry)}
        aria-label={`${entry.title} — view details and fix`}
      />
      <div>
        {/* Card Header Badges */}
        <div className="card-top">
          <span className="badge badge-category">{entry.category}</span>
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

        {/* Error code pill */}
        <span className="card-code" title={entry.error_code}>
          {entry.error_code}
        </span>

        {/* Title */}
        <h3 className="card-title">{entry.title}</h3>

        {/* Summary */}
        <p className="card-summary">{entry.summary}</p>
      </div>

      {/* Footer */}
      <div className="card-foot">
        <div className="card-tags">
          {entry.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="card-tag">#{tag}</span>
          ))}
        </div>
        <span className="view-fix">
          View Fix <ArrowRight size={14} />
        </span>
      </div>
    </article>
  );
}
