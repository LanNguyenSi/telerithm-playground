"use client";

import { useState } from "react";
import { getTelerithmClient } from "@/lib/telerithm";

interface CustomLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSent: () => void;
}

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export function CustomLogModal({ isOpen, onClose, onLogSent }: CustomLogModalProps) {
  const [level, setLevel] = useState<"debug" | "info" | "warn" | "error">("error");
  const [service, setService] = useState("custom-app");
  const [message, setMessage] = useState("");
  const [host, setHost] = useState("play.telerithm.cloud");
  const [fields, setFields] = useState<KeyValuePair[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { id: Date.now().toString(), key: "", value: "" }]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (id: string, field: "key" | "value", value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setSuccess(false);
    try {
      const client = getTelerithmClient();
      const fieldsObject: Record<string, string> = {};
      fields.forEach((f) => {
        if (f.key.trim()) fieldsObject[f.key] = f.value;
      });
      await client.sendLogs([
        {
          level,
          service,
          message,
          fields: Object.keys(fieldsObject).length > 0 ? fieldsObject : undefined,
        },
      ]);
      setSuccess(true);
      onLogSent();
      setMessage("");
      setFields([]);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to send log:", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[15px] font-semibold text-foreground">Send Custom Log</h2>
            <button
              onClick={onClose}
              className="text-muted transition hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-muted">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "debug" | "info" | "warn" | "error")}
                className={inputClass}
              >
                <option value="debug">debug</option>
                <option value="info">info</option>
                <option value="warn">warn</option>
                <option value="error">error</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-muted">Service</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-muted">
                Message <span className="text-danger">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="Connection timeout to Stripe API"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-muted">Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-muted">Fields</label>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => handleFieldChange(field.id, "key", e.target.value)}
                      placeholder="key"
                      className={`${inputClass} min-w-0 flex-1`}
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, "value", e.target.value)}
                      placeholder="value"
                      className={`${inputClass} min-w-0 flex-1`}
                    />
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddField}
                  className="text-[13px] font-medium text-accent transition hover:brightness-110"
                >
                  + Add field
                </button>
              </div>
            </div>

            {success && (
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-[13px] text-accent">
                Log sent successfully
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-border p-5">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? "Sending..." : "Send Log"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
