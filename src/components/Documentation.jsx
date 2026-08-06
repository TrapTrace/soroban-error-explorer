import React, { useState } from 'react';
import { BookOpen, Terminal, Shield, Code2, Cpu, Database, Wrench, Copy, Check, ExternalLink } from 'lucide-react';

export default function Documentation() {
  const [copiedCmd, setCopiedCmd] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Docs Header Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.9), rgba(13, 17, 23, 0.95))',
        border: '1px solid rgba(47, 169, 140, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <BookOpen size={28} color="var(--color-trace-teal)" />
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>
            TrapTrace Documentation & Developer Guide
          </h1>
        </div>
        <p style={{ color: 'var(--color-slate)', fontSize: '15px', maxWidth: '850px' }}>
          Comprehensive guide to Soroban smart contract error diagnostics, state archival lifecycles, WASM execution envelopes, CLI tool usage, and contribution guidelines.
        </p>
      </div>

      {/* Grid Layout for Doc Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
        
        {/* Sidebar Nav */}
        <aside style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '8px' }}>
              Table of Contents
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <a href="#cli-quickstart" style={{ padding: '8px 12px', borderRadius: '6px', color: '#fff', fontSize: '13px', textDecoration: 'none', background: 'rgba(255,255,255,0.03)' }}>
                1. CLI Quickstart (`soroban-explain`)
              </a>
              <a href="#error-architecture" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--color-slate)', fontSize: '13px', textDecoration: 'none' }}>
                2. Soroban Error Architecture
              </a>
              <a href="#state-archival" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--color-slate)', fontSize: '13px', textDecoration: 'none' }}>
                3. State Archival & TTL Expiration
              </a>
              <a href="#contribution-schema" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--color-slate)', fontSize: '13px', textDecoration: 'none' }}>
                4. Schema & Contribution Guidelines
              </a>
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Section 1: CLI Quickstart */}
          <section id="cli-quickstart" className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal color="var(--color-trace-teal)" size={20} /> 1. CLI Quickstart (`soroban-explain`)
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '16px' }}>
              Install the lightweight Python command-line utility to query error diagnostics directly from your local terminal session during smart contract development.
            </p>

            <div style={{ background: '#0D1117', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ color: '#58A6FF', fontSize: '13px' }}>pip install traptrace-cli</code>
              <button onClick={() => copyToClipboard('pip install traptrace-cli', 'pip')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                {copiedCmd === 'pip' ? <Check size={14} color="var(--color-trace-teal)" /> : <Copy size={14} />}
              </button>
            </div>

            <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Command Line Usage Examples:</h4>
            <pre style={{ background: '#0D1117', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#A5D6FF', overflowX: 'auto' }}>
              <code>{`# Explain an error string or host trap code
soroban-explain "HostError::BudgetExceeded"

# Display detailed symptoms and verified solution steps
soroban-explain "ttl" --detailed

# Filter by error category
soroban-explain --category host-error

# Output raw JSON for IDE extension integration
soroban-explain "account-not-found" --json`}</code>
            </pre>
          </section>

          {/* Section 2: Soroban Error Architecture */}
          <section id="error-architecture" className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu color="var(--color-trap-amber)" size={20} /> 2. Soroban Error Architecture
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '16px' }}>
              Errors in Soroban occur across four distinct architectural layers. Understanding which layer emitted the error accelerates resolution:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: 'var(--color-trace-teal)', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Host Errors</h4>
                <p style={{ color: 'var(--color-slate)', fontSize: '13px' }}>Emitted by the Soroban Environment VM when execution budget limits are exceeded, panics occur, or invalid contract IDs are called.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: 'var(--color-trap-amber)', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>CLI Errors</h4>
                <p style={{ color: 'var(--color-slate)', fontSize: '13px' }}>Occur during key management, un-funded account deployment attempts, or sequence number mismatches (`txBAD_SEQ`).</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: '#58A6FF', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>RPC Simulation Errors</h4>
                <p style={{ color: 'var(--color-slate)', fontSize: '13px' }}>Returned by `simulateTransaction` when authorization trees fail verification or footprint storage keys are missing.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ color: '#D2A8FF', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>SDK Conversion Errors</h4>
                <p style={{ color: 'var(--color-slate)', fontSize: '13px' }}>Raised when client libraries fail to deserialize raw XDR `ScVal` structures into native JavaScript or Rust types.</p>
              </div>
            </div>
          </section>

          {/* Section 3: State Archival */}
          <section id="state-archival" className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database color="#58A6FF" size={20} /> 3. State Archival & TTL Expiration (CAP-0046)
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '16px' }}>
              Soroban persistent and instance storage entries are bounded by a Time-To-Live (TTL) ledger counter. If an entry reaches zero remaining TTL ledgers, it is archived to prevent ledger bloat.
            </p>

            <div style={{ background: 'rgba(226, 152, 75, 0.08)', borderLeft: '4px solid var(--color-trap-amber)', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '16px', fontSize: '13px', color: '#fff' }}>
              <strong>Important:</strong> Attempting to read or write an archived storage key raises <code>HostError::EntryArchived</code>. To restore an archived key, issue a <code>RestoreFootprint</code> operation.
            </div>

            <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Extending TTL in Contract Logic:</h4>
            <pre style={{ background: '#0D1117', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#7EE787', overflowX: 'auto' }}>
              <code>{`// Extend storage key lifespan by 100,000 ledgers if remaining TTL < 1,000 ledgers
env.storage().persistent().extend_ttl(&storage_key, 1000, 100000);`}</code>
            </pre>
          </section>

          {/* Section 4: Schema & Contribution */}
          <section id="contribution-schema" className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield color="var(--color-trace-teal)" size={20} /> 4. Schema & Contribution Guidelines
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '16px' }}>
              All catalog entries in <code>soroban-error-index</code> are formatted in Markdown with a YAML frontmatter header validated against <code>schema/entry.schema.json</code>.
            </p>

            <pre style={{ background: '#0D1117', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#FFA657', overflowX: 'auto' }}>
              <code>{`---
id: my-error-id
title: Host Error - Short Description
category: host-error # host-error | cli-error | rpc-error | sdk-error
error_code: ErrorCodeString
verified: true # true if confirmed on testnet/mainnet with reproduction
summary: Concise 1-2 sentence description.
tags: [tag1, tag2]
soroban_version: "21.0.0"
---`}</code>
            </pre>
          </section>

        </div>
      </div>
    </div>
  );
}
