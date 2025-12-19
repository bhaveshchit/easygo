import React from 'react';
import './../App.css';

export default function SuccessCard({ visible, message, onClose }) {
  if (!visible) return null;
  return (
    <div className="success-card" role="status" aria-live="polite">
      <div className="success-inner">
        <div className="success-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="36" height="36">
            <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M4 12.5l4.5 4.5L20 6" />
          </svg>
        </div>
        <div className="success-content">
          <div className="success-title">{message}</div>
        </div>
        <button className="success-close" aria-label="Close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}