"use client";

import { useState } from "react";

export function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const code = `import { TelerithmClient } from "@telerithm/sdk-js";

const t = new TelerithmClient({
  dsn: "https://key@demo.telerithm.cloud/source"
});

// Log an error
t.error("Payment failed", {
  userId: "u_123",
  amount: 99.00
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between bg-surface px-5 py-3">
        <span className="text-[13px] font-medium text-muted">SDK Integration</span>
        <button
          onClick={handleCopy}
          className="rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted transition hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#080c10] px-5 py-4 font-mono text-[13px] leading-relaxed text-[#94a3b8]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
