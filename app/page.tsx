"use client";

import { useState } from "react";
import { ScenarioButton } from "@/components/ScenarioButton";
import { LogCounter } from "@/components/LogCounter";
import { CodeSnippet } from "@/components/CodeSnippet";
import { CustomLogModal } from "@/components/CustomLogModal";
import { runFailedLogin, runSlowCheckout, runNormalTraffic, runPaymentError } from "@/lib/scenarios";

export default function Home() {
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleScenario = async (scenarioId: string) => {
    setLoading(scenarioId);
    setError(null);

    try {
      let count = 0;

      switch (scenarioId) {
        case "failed-login":
          count = await runFailedLogin();
          break;
        case "slow-checkout":
          count = await runSlowCheckout();
          break;
        case "normal-traffic":
          count = await runNormalTraffic();
          break;
        case "payment-error":
          count = await runPaymentError();
          break;
      }

      setLogCount((prev) => prev + count);
    } catch (err: any) {
      setError(err.message || "Failed to send logs");
      console.error("Scenario error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-12%,_rgba(217,119,6,0.08),_transparent)]" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            Early Preview
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Telerithm Playground
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See it in action
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Trigger realistic scenarios and watch structured logs flow into Telerithm in real-time.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Log Counter */}
        <div className="mt-10">
          <LogCounter count={logCount} />
        </div>

        {/* Scenarios */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Scenarios</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-surface-hover"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Custom Log
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ScenarioButton
              id="failed-login"
              title="Failed Login"
              description="User tries to log in, fails 3x, gets locked out"
              logCount={5}
              service="auth-service"
              loading={loading === "failed-login"}
              onClick={() => handleScenario("failed-login")}
            />
            <ScenarioButton
              id="slow-checkout"
              title="Slow Checkout"
              description="Payment API times out, retry, success"
              logCount={8}
              service="payment-service"
              loading={loading === "slow-checkout"}
              onClick={() => handleScenario("slow-checkout")}
            />
            <ScenarioButton
              id="normal-traffic"
              title="Normal Traffic"
              description="Background activity, healthy system"
              logCount={100}
              service="mixed"
              loading={loading === "normal-traffic"}
              onClick={() => handleScenario("normal-traffic")}
            />
            <ScenarioButton
              id="payment-error"
              title="Payment Error"
              description="Card declined, retry fails, order cancelled"
              logCount={8}
              service="payment-service"
              loading={loading === "payment-error"}
              onClick={() => handleScenario("payment-error")}
            />
          </div>
        </div>

        {/* Code Snippet */}
        <div className="mt-12">
          <CodeSnippet />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">See the logs you just sent</p>
          <a
            href="https://demo.telerithm.cloud/logs"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Open Telerithm Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
          <p className="mt-4 font-mono text-xs text-muted">
            demo@telerithm.cloud / demo1234
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-6 text-center">
          <p className="font-mono text-[11px] text-muted">
            play.telerithm.cloud
          </p>
        </footer>
      </div>

      <CustomLogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLogSent={() => setLogCount((prev) => prev + 1)}
      />
    </div>
  );
}
