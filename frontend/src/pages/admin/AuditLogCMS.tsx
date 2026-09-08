import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, CheckCircle2, User, FileText, Settings, Heart } from 'lucide-react';
import { api } from '../../api/client.js';
import { AuditLogEntry } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const AuditLogCMS: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit log', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading immutable audit logs..." />;
  }

  const getActionIcon = (action: string) => {
    if (action.includes('update') || action.includes('edit')) return <FileText className="w-4 h-4 text-brand-gold" />;
    if (action.includes('publish')) return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (action.includes('settings')) return <Settings className="w-4 h-4 text-blue-600" />;
    return <History className="w-4 h-4 text-brand-navy" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
          <History className="w-3.5 h-3.5" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-navy">
          System Audit Trail
        </h1>
        <p className="text-xs text-ink/65">
          Append-only chronological record of all administrative publishing, approvals, and mutations.
        </p>
      </div>

      <div className="campaign-card !p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs font-bold text-brand-navy">
            Logged Actions ({logs.length})
          </span>
          <span className="text-[11px] text-ink/50">
            Immutable Append-Only Log
          </span>
        </div>

        <div className="divide-y divide-border">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-ink/50">
              No audit logs recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-muted flex-shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-brand-navy">
                      {log.admin_name}
                    </span>
                    <span className="text-[11px] text-ink/50 font-mono">
                      {new Date(log.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>

                  <p className="text-xs text-ink/80">
                    <strong className="font-semibold text-brand-goldDark uppercase text-[10px] mr-1.5">
                      {log.action}
                    </strong>
                    <span>on {log.entity}</span>
                    {log.details && <span className="text-ink/60"> — {log.details}</span>}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
