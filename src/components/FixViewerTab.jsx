import React, { useState } from 'react';
import { Wrench, Copy, Check, Code2, ArrowRight } from 'lucide-react';

const FIXES = {
  "arith-error": {
    title: "Checked Arithmetic & Zero-Division Guards",
    desc: "Replace raw unchecked arithmetic operators (+, -, *, /) with checked host arithmetic.",
    bad: `// ❌ BUGGY: Raw arithmetic triggers WASM unreachable trap on overflow
pub fn calculate_reward(env: Env, base: u64, multiplier: u64) -> u64 {
    base * multiplier + 100 // Overflow panic if product > u64::MAX
}`,
    fix: `// ✅ REMEDIATED: Use checked arithmetic with custom contract error enum
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    ArithmeticOverflow = 1,
}

pub fn calculate_reward(env: Env, base: u64, multiplier: u64) -> Result<u64, Error> {
    let product = base.checked_mul(multiplier).ok_or(Error::ArithmeticOverflow)?;
    let total = product.checked_add(100).ok_or(Error::ArithmeticOverflow)?;
    Ok(total)
}`
  },
  "require-auth-missing": {
    title: "Explicit Caller Authorization & Scoped Args",
    desc: "Ensure the required Address signs the invocation or scope authorization to arguments.",
    bad: `// ❌ BUGGY: Missing require_auth allows unauthorized withdrawals
pub fn withdraw(env: Env, owner: Address, amount: i128) {
    transfer_internal(&env, &owner, amount);
}`,
    fix: `// ✅ REMEDIATED: Enforce explicit authentication before performing state mutations
pub fn withdraw(env: Env, owner: Address, amount: i128) {
    owner.require_auth();
    transfer_internal(&env, &owner, amount);
}`
  },
  "entry-archived-ttl-expired": {
    title: "Storage State TTL Auto-Extension",
    desc: "Extend instance and persistent storage TTL to prevent ledger entry archival.",
    bad: `// ❌ BUGGY: Storing contract state without TTL maintenance causes state expiration
pub fn store_config(env: Env, config: Config) {
    env.storage().instance().set(&DataKey::Config, &config);
}`,
    fix: `// ✅ REMEDIATED: Automatically extend state TTL during contract interaction
pub fn store_config(env: Env, config: Config) {
    env.storage().instance().set(&DataKey::Config, &config);
    env.storage().instance().extend_ttl(17280, 518400); // Extend by ~30 days
}`
  }
};

export default function FixViewerTab() {
  const [selectedError, setSelectedError] = useState("arith-error");
  const [copied, setCopied] = useState(false);

  const fixData = FIXES[selectedError] || FIXES["arith-error"];

  const handleCopy = () => {
    navigator.clipboard.writeText(fixData.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-mono font-semibold text-paper-100">Automated Remediation Code Generator</h3>
        </div>
        <p className="text-xs text-paper-400 mb-4">
          Select any verified Soroban error pattern to view ready-to-paste Rust remediation blocks and best practice refactoring patterns.
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(FIXES).map(id => (
            <button
              key={id}
              onClick={() => setSelectedError(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedError === id 
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 font-bold' 
                  : 'bg-ink-950 text-paper-400 border border-ink-800 hover:text-paper-200'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-mono font-bold text-paper-100">{fixData.title}</h4>
            <p className="text-xs text-paper-400 font-mono mt-0.5">{fixData.desc}</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-ink-950 hover:bg-ink-800 text-paper-200 border border-ink-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Fix"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg">
            <div className="text-[11px] font-mono text-rose-400 font-bold mb-2">❌ Before (Buggy Pattern)</div>
            <pre className="text-xs font-mono text-rose-200/90 overflow-x-auto whitespace-pre">{fixData.bad}</pre>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg">
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-2">✅ After (Remediated Rust Soroban Best Practice)</div>
            <pre className="text-xs font-mono text-emerald-200/90 overflow-x-auto whitespace-pre">{fixData.fix}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
