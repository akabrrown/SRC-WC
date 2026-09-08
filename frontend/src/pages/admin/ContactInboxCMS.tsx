import React, { useState, useEffect } from 'react';
import { Inbox, Mail, Phone, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../api/client.js';
import { ContactSubmission, SubmissionStatus } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';

export const ContactInboxCMS: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await api.getContactSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load contact inbox', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: SubmissionStatus) => {
    try {
      await api.updateContactStatus(id, newStatus);
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast.success('Status Updated', `Inquiry status updated to "${newStatus}".`);
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Status update failed.');
    }
  };


  if (loading) {
    return <LoadingState message="Loading secretariat contact inbox..." />;
  }

  const filtered = submissions.filter(s => statusFilter === 'all' || s.status === statusFilter);
  const unreadCount = submissions.filter(s => s.status === 'new').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Inbox className="w-3.5 h-3.5" />
            <span>Secretariat Communications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Contact Submissions Inbox
          </h1>
          <p className="text-xs text-ink/65">
            Manage inquiries, student welfare requests, and outreach communications.
          </p>
        </div>

        <div className="text-xs font-bold bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-lg border border-amber-300">
          {unreadCount} Unread Inquiries
        </div>
      </div>

      <div className="campaign-card !p-0 overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink/70">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-white"
            >
              <option value="all">All Inquiries ({submissions.length})</option>
              <option value="new">New (Unread)</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-ink/50">
              No inquiries found matching this filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="p-5 hover:bg-muted/10 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-brand-navy">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-ink/50">
                        • {item.programme}
                      </span>
                      <span className="bg-brand-gold/20 text-brand-navyDark font-bold text-[10px] px-2 py-0.5 rounded">
                        {item.enquiry_category}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink/60 font-mono">
                      Contact: {item.contact}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-ink/50">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as SubmissionStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        item.status === 'new'
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : item.status === 'responded'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-muted border-border text-ink/70'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed bg-muted/20 p-3.5 rounded-lg">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
