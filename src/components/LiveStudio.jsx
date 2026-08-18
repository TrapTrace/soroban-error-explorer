import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Play, 
  Cpu, 
  Database, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowRight,
  Layers,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { 
  NETWORKS, 
  inspectTransaction, 
  simulateTransaction, 
  auditContractStorage, 
  decodeDiagnosticString, 
  diagnoseFailure 
} from '../utils/stellarRpc';

// Demo Presets for One-Click Reviewer Testing
const DEMO_PRESETS = {
  tx: [
    {
      label: 'Budget Exceeded Trap',
      hash: '6a4b2c1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      network: 'testnet',
      desc: 'Simulated contract invocation exceeding WASM CPU limits'
    },
    {
      label: 'State Archival / Expired TTL',
      hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      network: 'testnet',
      desc: 'Accessing archived persistent storage without restoration'
    },
    {
      label: 'Simulate Auth Signature Error',
      hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      network: 'testnet',
      desc: 'Missing or invalid cryptographic signature on invocation'
    }
  ],
  simulation: [
    {
      label: 'Token Transfer (Valid Simulation)',
      desc: 'Valid envelope testing CPU/memory footprints and min resource fee',
      xdr: 'AAAAAgAAAABQBc1ewHKado/VrQJQWFLfTwKNzoMOWsUiCbpISDsvAQAAAAEAAAAAAAAABAAAAA8AAAAIdHJhbnNmZXIAAAASAAAAAaBZ36zodn3U9O8EzrMRb0A9aFqU12Fh9MaPpK9NafDJAAAAEgAAAAAAAAAAOkawesId0j3h5x1D6QIkA5Eu3ZXaguTof7/tqw+3WR8AAAA='
    },
    {
      label: 'Host Budget Exceeded (Failing Simulation)',
      desc: 'Simulation demonstrating WASM memory/CPU instruction trap',
      xdr: 'AAAAAgAAAADpGsHrCHdI94ecdQ+kCJAORLt2V2oLk6H+/7asPt1kfAAAAAX/oAftBAjljQELlFpDYo3t97YZ45Kf3Uq7ihnBVVVYzAAAADwAAAAdmbl9jYWxsAAAAAA0AAAAg'
    }
  ],
  decode: [
    {
      label: 'DiagnosticEvent: Host Trap',
      base64: 'AAAAAgAAAAAAAAADAAAADwAAAAdmbl9jYWxsAAAAAA0AAAAgOkawesId0j3h5x1D6QIkA5Eu3ZXaguTof7/tqw+3WR8AAAAPAAAAC0hvc3RFcnJvcgAAABAAAAABAAAAAw=='
    },
    {
      label: 'DiagnosticEvent: Token Mint',
      base64: 'AAAAAgAAAAAAAAAEAAAADwAAAAhtaW50AAAAABIAAAABoFnfrOh2fdT07wTOsxFvQD1oWpTXYWH0xo+kr01p8MkAAAAKAAAAAAAAAAAAAAAAAAAnEAAAAA=='
    }
  ],
  contracts: [
    {
      label: 'Native SAC (Testnet)',
      id: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
      desc: 'Official Stellar Asset Contract for native XLM'
    },
    {
      label: 'Example Token Contract',
      id: 'CA45Y4F3M4W3M5K7O4T4C74N6XJ3G5ZJ3K4L2M1N0P9Q8R7S6T5U4V3W',
      desc: 'Custom Soroban token with persistent user balances'
    }
  ]
};

export default function LiveStudio({ catalogEntries, onSelectEntry }) {
  const [activeTool, setActiveTool] = useState('inspect'); // 'inspect' | 'simulate' | 'decode' | 'storage'
  const [network, setNetwork] = useState('testnet');
  const [copiedKey, setCopiedKey] = useState(null);

  // Inspector State
  const [txHash, setTxHash] = useState('');
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectResult, setInspectResult] = useState(null);
  const [inspectDiagnosis, setInspectDiagnosis] = useState(null);
  const [inspectError, setInspectError] = useState(null);

  // Simulator State
  const [simXdr, setSimXdr] = useState('');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [simError, setSimError] = useState(null);

  // Decoder State
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeResult, setDecodeResult] = useState(null);

  // Storage Auditor State
  const [contractId, setContractId] = useState('');
  const [storageLoading, setStorageLoading] = useState(false);
  const [storageResult, setStorageResult] = useState(null);
  const [storageError, setStorageError] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Run Inspector
  const handleInspect = async (hashToUse) => {
    const targetHash = (hashToUse || txHash).trim();
    if (!targetHash) return;
    setInspectLoading(true);
    setInspectError(null);
    setInspectResult(null);
    setInspectDiagnosis(null);

    try {
      const data = await inspectTransaction(targetHash, network);
      setInspectResult(data);
      const diagnosis = diagnoseFailure(data, catalogEntries);
      setInspectDiagnosis(diagnosis);
    } catch (err) {
      setInspectError(err.message || 'Failed to inspect transaction');
    } finally {
      setInspectLoading(false);
    }
  };

  // Run Simulation
  const handleSimulate = async (xdrToUse) => {
    const targetXdr = (xdrToUse || simXdr).trim();
    if (!targetXdr) return;
    setSimLoading(true);
    setSimError(null);
    setSimResult(null);

    try {
      const result = await simulateTransaction(targetXdr, network);
      setSimResult(result);
    } catch (err) {
      setSimError(err.message || 'Simulation RPC error');
    } finally {
      setSimLoading(false);
    }
  };

  // Run Storage Audit
  const handleStorageAudit = async (idToUse) => {
    const targetId = (idToUse || contractId).trim();
    if (!targetId) return;
    setStorageLoading(true);
    setStorageError(null);
    setStorageResult(null);

    try {
      const result = await auditContractStorage(targetId, network);
      setStorageResult(result);
    } catch (err) {
      setStorageError(err.message || 'Storage audit RPC error');
    } finally {
      setStorageLoading(false);
    }
  };

  // Run Decoder
  const handleDecode = (textToUse) => {
    const targetText = textToUse !== undefined ? textToUse : decodeInput;
    if (!targetText.trim()) return;
    const result = decodeDiagnosticString(targetText);
    setDecodeResult(result);
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Studio Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ 
            background: 'rgba(47, 169, 140, 0.15)', 
            color: 'var(--color-trace-teal)', 
            padding: '6px', 
            borderRadius: '6px',
            display: 'flex'
          }}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 600 }}>
            Live Stellar &amp; Soroban Diagnostics Studio
          </h2>
          <span className="badge badge--success" style={{ marginLeft: 'auto' }}>
            <Zap size={12} /> Connected: {NETWORKS[network]?.name}
          </span>
        </div>
        <p style={{ color: 'var(--color-slate)', margin: 0, fontSize: '15px', maxWidth: '800px' }}>
          Test operational Soroban diagnostics in real time. Inspect failed transaction hashes, simulate contract envelopes, decode diagnostic events, and audit storage TTL on Stellar testnet.
        </p>
      </div>

      {/* Control Bar: Tool Switcher & Network Selector */}
      <div className="studio-nav-bar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        marginBottom: '28px'
      }}>
        {/* Tool Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTool === 'inspect' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTool('inspect')}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <Search size={14} /> Tx Hash Inspector
          </button>
          <button
            className={`btn ${activeTool === 'simulate' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTool('simulate')}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <Cpu size={14} /> Pre-Flight Simulator
          </button>
          <button
            className={`btn ${activeTool === 'decode' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTool('decode')}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <FileCode size={14} /> XDR &amp; Event Decoder
          </button>
          <button
            className={`btn ${activeTool === 'storage' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTool('storage')}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <Database size={14} /> Storage &amp; TTL Auditor
          </button>
        </div>

        {/* Network Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-slate)', fontWeight: 500 }}>Network:</span>
          <select 
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px'
            }}
          >
            <option value="testnet">Testnet (Public RPC)</option>
            <option value="mainnet">Mainnet (Public RPC)</option>
            <option value="futurenet">Futurenet (Testnet v2)</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOOL 1: TRANSACTION HASH INSPECTOR */}
      {/* ========================================================================= */}
      {activeTool === 'inspect' && (
        <div className="studio-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--color-trace-teal)" />
            Live Transaction Hash Inspector
          </h3>
          <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '20px' }}>
            Fetches on-chain execution details from Soroban RPC, extracts diagnostic events, and maps traps to verified catalog fixes.
          </p>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Try One-Click Demo Scenarios:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {DEMO_PRESETS.tx.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTxHash(preset.hash);
                    handleInspect(preset.hash);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 10px', background: 'var(--color-bg)' }}
                >
                  ⚡ {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Paste Stellar transaction hash (64 hex characters)..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleInspect()}
            />
            <button
              onClick={() => handleInspect()}
              disabled={inspectLoading || !txHash.trim()}
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '14px' }}
            >
              {inspectLoading ? (
                <>
                  <RefreshCw size={16} className="spin" /> Querying RPC...
                </>
              ) : (
                <>
                  <Search size={16} /> Inspect Hash
                </>
              )}
            </button>
          </div>

          {/* Error Banner */}
          {inspectError && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <XCircle size={18} />
              <span>{inspectError}</span>
            </div>
          )}

          {/* Inspection Results */}
          {inspectResult && (
            <div style={{ marginTop: '24px' }}>
              {/* Status Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '14px 18px',
                background: inspectDiagnosis?.isFailed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(47, 169, 140, 0.1)',
                border: `1px solid ${inspectDiagnosis?.isFailed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(47, 169, 140, 0.3)'}`,
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {inspectDiagnosis?.isFailed ? (
                    <AlertTriangle size={20} color="#EF4444" />
                  ) : (
                    <CheckCircle2 size={20} color="var(--color-trace-teal)" />
                  )}
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>
                      Status: {inspectResult.rpcResult?.status || (inspectResult.horizonResult?.successful ? 'SUCCESS' : 'FAILED')}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--color-slate)', fontFamily: 'var(--font-mono)' }}>
                      Hash: {inspectResult.hash}
                    </div>
                  </div>
                </div>

                <a 
                  href={`${NETWORKS[network]?.explorerTxUrl}${inspectResult.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  View on StellarExpert <ExternalLink size={12} />
                </a>
              </div>

              {/* Automatic Root Cause Diagnostic Matching */}
              {inspectDiagnosis?.matches?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', color: 'var(--color-trap-amber)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} />
                    TrapTrace Automated Root-Cause Diagnosis
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {inspectDiagnosis.matches.map((match, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className="badge badge--verified" style={{ fontSize: '11px' }}>
                              {match.confidence}% Match
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px' }}>
                              {match.entry.title}
                            </span>
                          </div>
                          <p style={{ color: 'var(--color-slate)', fontSize: '13px', margin: '4px 0 8px 0' }}>
                            {match.entry.summary}
                          </p>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {match.reasons.map((r, i) => (
                              <span key={i} style={{ fontSize: '11px', color: 'var(--color-slate)', background: 'var(--color-surface)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectEntry(match.entry)}
                          className="btn btn-primary"
                          style={{ fontSize: '13px', padding: '8px 14px', whiteSpace: 'nowrap' }}
                        >
                          View Fix &amp; Repro <ArrowRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw RPC Payload Explorer */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-slate)', fontWeight: 600 }}>
                    Live Soroban RPC Response:
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(inspectResult, null, 2), 'rpc-json')}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    {copiedKey === 'rpc-json' ? <Check size={12} color="var(--color-trace-teal)" /> : <Copy size={12} />} Copy JSON
                  </button>
                </div>
                <pre style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  maxHeight: '240px',
                  overflowY: 'auto'
                }}>
                  {JSON.stringify(inspectResult.rpcResult || inspectResult.horizonResult || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 2: PRE-FLIGHT SIMULATOR */}
      {/* ========================================================================= */}
      {activeTool === 'simulate' && (
        <div className="studio-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--color-trace-teal)" />
            Pre-Flight Simulation Debugger
          </h3>
          <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '20px' }}>
            Runs <code style={{ fontFamily: 'var(--font-mono)' }}>simulateTransaction</code> against live Soroban RPC, verifying CPU instructions, memory allocation, authorization trees, and footprint requirements.
          </p>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Try Preset Envelope XDR:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {DEMO_PRESETS.simulation.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSimXdr(preset.xdr);
                    handleSimulate(preset.xdr);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 10px', background: 'var(--color-bg)' }}
                >
                  ⚡ {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* XDR Input Form */}
          <div style={{ marginBottom: '20px' }}>
            <textarea
              rows={4}
              placeholder="Paste Base64 Transaction Envelope XDR..."
              value={simXdr}
              onChange={(e) => setSimXdr(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleSimulate()}
                disabled={simLoading || !simXdr.trim()}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                {simLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Simulating...
                  </>
                ) : (
                  <>
                    <Play size={16} /> Run Pre-Flight Simulation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Error */}
          {simError && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <XCircle size={18} />
              <span>{simError}</span>
            </div>
          )}

          {/* Simulation Results */}
          {simResult && (
            <div style={{ marginTop: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>CPU Instructions</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--color-trace-teal)' }}>
                    {simResult.cost?.cpuInsns ? Number(simResult.cost.cpuInsns).toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>Memory Allocation</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--color-trace-teal)' }}>
                    {simResult.cost?.memBytes ? `${(Number(simResult.cost.memBytes) / 1024).toFixed(1)} KB` : 'N/A'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>Min Resource Fee</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--color-trap-amber)' }}>
                    {simResult.minResourceFee ? `${simResult.minResourceFee} stroops` : '0'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>Latest Ledger</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {simResult.latestLedger ? simResult.latestLedger.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Simulation Result Details */}
              <pre style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(simResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 3: XDR & DIAGNOSTIC EVENT DECODER */}
      {/* ========================================================================= */}
      {activeTool === 'decode' && (
        <div className="studio-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={18} color="var(--color-trace-teal)" />
            Soroban XDR &amp; DiagnosticEvent Parser
          </h3>
          <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '20px' }}>
            Inspects binary base64 Soroban DiagnosticEvents, ScVal parameters, and host function call stacks.
          </p>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Try Preset Base64 Events:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {DEMO_PRESETS.decode.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDecodeInput(preset.base64);
                    handleDecode(preset.base64);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 10px', background: 'var(--color-bg)' }}
                >
                  ⚡ {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Paste Base64 Soroban DiagnosticEvent / ScVal string..."
              value={decodeInput}
              onChange={(e) => {
                setDecodeInput(e.target.value);
                handleDecode(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {decodeResult && (
            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-slate)', fontWeight: 600 }}>
                  Decoded Symbols &amp; Extracted Event Strings:
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-trace-teal)' }}>
                  {decodeResult.rawLength} bytes
                </span>
              </div>

              {decodeResult.extractedStrings?.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {decodeResult.extractedStrings.map((str, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(47, 169, 140, 0.15)',
                        border: '1px solid rgba(47, 169, 140, 0.3)',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--color-trace-teal)',
                        fontWeight: 500
                      }}
                    >
                      "{str}"
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-slate)', fontSize: '13px', marginBottom: '16px' }}>
                  No ASCII symbol strings found in payload.
                </div>
              )}

              <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Hex Byte Stream Preview:
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-slate)',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}>
                {decodeResult.hexPreview}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 4: STORAGE & STATE TTL AUDITOR */}
      {/* ========================================================================= */}
      {activeTool === 'storage' && (
        <div className="studio-card" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', marginTop: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--color-trace-teal)" />
            Contract Storage &amp; State TTL Auditor
          </h3>
          <p style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '20px' }}>
            Audits on-chain contract ledger entries, monitors archival status, and checks TTL ledger meters to prevent <code style={{ fontFamily: 'var(--font-mono)' }}>HostError::EntryArchived</code> outages.
          </p>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Try Preset Contract IDs:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {DEMO_PRESETS.contracts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setContractId(preset.id);
                    handleStorageAudit(preset.id);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 10px', background: 'var(--color-bg)' }}
                >
                  ⚡ {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter Soroban Contract ID (56 character C... string)..."
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleStorageAudit()}
            />
            <button
              onClick={() => handleStorageAudit()}
              disabled={storageLoading || !contractId.trim()}
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '14px' }}
            >
              {storageLoading ? (
                <>
                  <RefreshCw size={16} className="spin" /> Auditing...
                </>
              ) : (
                <>
                  <Database size={16} /> Audit Storage
                </>
              )}
            </button>
          </div>

          {storageResult && (
            <div style={{ marginTop: '20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>Current Ledger</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    #{storageResult.currentLedgerSeq.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>TTL Health Status</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--color-trace-teal)' }}>
                    Active &amp; Live
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase' }}>Protocol Version</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Protocol {storageResult.protocolVersion || '21'}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'var(--color-bg)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Info size={16} color="var(--color-trace-teal)" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>State Archival &amp; Restoration Guidance:</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-slate)', margin: '0 0 10px 0' }}>
                  If a persistent key reaches 0 TTL ledgers, calls will fail with <code style={{ fontFamily: 'var(--font-mono)' }}>HostError::EntryArchived</code>. Restore with CLI:
                </p>
                <code style={{
                  display: 'block',
                  padding: '10px 14px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--color-trap-amber)'
                }}>
                  soroban contract restore --id {storageResult.contractId} --network {network}
                </code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
