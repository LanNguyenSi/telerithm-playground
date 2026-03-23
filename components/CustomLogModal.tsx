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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900">Send Custom Log</h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "debug" | "info" | "warn" | "error")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="debug">debug</option>
                <option value="info">info</option>
                <option value="warn">warn</option>
                <option value="error">error</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Service</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Connection timeout to Stripe API"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fields</label>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => handleFieldChange(field.id, "key", e.target.value)}
                      placeholder="key"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, "value", e.target.value)}
                      placeholder="value"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      −
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddField}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  + Add field
                </button>
              </div>
            </div>

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                ✓ Log sent successfully!
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-gray-200 p-5">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {sending ? "Sending..." : "Send Log"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
