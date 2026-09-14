import React, { useState, useEffect } from 'react';
import { History, Search, FileText, CheckCircle2, Settings, Shield } from 'lucide-react';
import { api } from '../../api/client.js';
import { AuditLogEntry } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';

const PAGE_SIZE = 15;

export const AuditLogCMS: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    document.title = 'System Audit Trail | Campaign Staff Portal';
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit trail.');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('UPDATE') || action.includes('EDIT')) return <FileText className="w-4 h-4 text-brand-gold" />;
    if (action.includes('CREATE') || action.includes('PUBLISH')) return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    if (action.includes('SETTINGS') || action.includes('TOGGLE')) return <Settings className="w-4 h-4 text-blue-600" />;
    return <History className="w-4 h-4 text-brand-navy" />;
  };

  if (loading) {
    return <LoadingState message="Loading immutable audit logs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Audit Log"
        message={error}
        onRetry={fetchLogs}
      />
    );
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.admin_name.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          Append-only chronological record of all administrative publishing, approvals, updates, and mutations (§4 Audit Trail).
        </p>
      </div>

      <div className="campaign-card !p-0 overflow-hidden">
        {/* Search & Header Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by admin, action, entity..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border text-xs focus:border-brand-gold bg-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-ink/60">
            <span className="font-semibold text-brand-navy">Logged Actions: {filteredLogs.length}</span>
            <span>•</span>
            <span className="text-[11px] text-brand-goldDark font-semibold uppercase">Immutable Append-Only</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {paginatedLogs.length === 0 ? (
            <EmptyState
              title="No Audit Entries Found"
              message={searchQuery ? 'No log entries matched your search query.' : 'No audit logs recorded in system yet.'}
            />
          ) : (
            paginatedLogs.map((log) => (
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
                      {new Date(log.created_at).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-ink/80">
                    <strong className="font-bold text-brand-navy uppercase text-[10px] bg-muted px-1.5 py-0.5 rounded mr-1.5 border border-border">
                      {log.action}
                    </strong>
                    <span>on <strong>{log.entity}</strong></span>
                    {log.details && <span className="text-ink/60"> — {log.details}</span>}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-xs">
            <span className="text-ink/60">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-border bg-white text-ink/70 hover:text-ink disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-border bg-white text-ink/70 hover:text-ink disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
