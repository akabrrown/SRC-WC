import React, { useState, useEffect } from 'react';
import { Inbox, Search } from 'lucide-react';
import { api } from '../../api/client.js';
import { ContactSubmission, SubmissionStatus } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';

const PAGE_SIZE = 10;

export const ContactInboxCMS: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    document.title = 'Contact Inbox CMS | Campaign Staff Portal';
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getContactSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load contact inbox submissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: SubmissionStatus) => {
    try {
      await api.updateContactStatus(id, newStatus);
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast.success('Status Updated', `Inquiry status changed to "${newStatus}".`);
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Failed to update inquiry status.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading secretariat contact inbox..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Inquiries"
        message={error}
        onRetry={fetchSubmissions}
      />
    );
  }

  const filtered = submissions.filter((s) => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.programme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const unreadCount = submissions.filter(s => s.status === 'new').length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
        {/* Filter & Search Bar */}
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
              placeholder="Search by name, contact, message..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border text-xs focus:border-brand-gold bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink/70">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
          {paginatedItems.length === 0 ? (
            <EmptyState
              title="No Inquiries Found"
              message={searchQuery ? 'No messages matched your search query.' : 'No contact inquiries logged yet.'}
            />
          ) : (
            paginatedItems.map((item) => (
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
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-xs">
            <span className="text-ink/60">
              Showing page {currentPage} of {totalPages} ({filtered.length} total)
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
