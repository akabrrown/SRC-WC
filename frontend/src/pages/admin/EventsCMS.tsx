import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Trash2, Edit2, Search } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignEvent, ContentStatus } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

export const EventsCMS: React.FC = () => {
  const toast = useToast();
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingEvent, setEditingEvent] = useState<Partial<CampaignEvent> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetEvent, setDeleteTargetEvent] = useState<CampaignEvent | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Events & Townhalls CMS | Campaign Staff Portal';
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllEventsAdmin();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingEvent({
      name: '',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '5:00 PM – 7:00 PM',
      venue: 'Main Campus / LBC Auditorium',
      description: '',
      registration_link: '',
      status: 'published'
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editingEvent.name?.trim() || !editingEvent.event_date?.trim() || !editingEvent.venue?.trim()) {
      toast.error('Validation Error', 'Event name, date, and venue are required fields.');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const created = await api.createEvent(editingEvent);
        setEvents([...events, created]);
        toast.success('Event Scheduled', `"${created.name}" added to campaign calendar.`);
      } else if (editingEvent.id) {
        const updated = await api.updateEvent(editingEvent.id, editingEvent);
        setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
        toast.success('Event Saved', `"${updated.name}" updated successfully.`);
      }
      setEditingEvent(null);
      setIsCreating(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetEvent) return;
    setDeleting(true);
    try {
      await api.deleteEvent(deleteTargetEvent.id);
      setEvents(events.filter(e => e.id !== deleteTargetEvent.id));
      toast.success('Event Deleted', `"${deleteTargetEvent.name}" removed from campaign calendar.`);
      setDeleteTargetEvent(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading campus events..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Events"
        message={error}
        onRetry={fetchEvents}
      />
    );
  }

  const filteredEvents = events.filter((evt) => {
    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Mobilisation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Events & Townhall Manager
          </h1>
          <p className="text-xs text-ink/65">
            Schedule hall tours, leadership symposiums, and campaign meet-and-greets across UPSA hostels and lecture blocks.
          </p>
        </div>

        {!editingEvent && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        )}
      </div>

      {editingEvent ? (
        <form onSubmit={handleSave} className="campaign-card space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              {isCreating ? 'Schedule New Campus Event' : 'Edit Event Details'}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingEvent(null); setIsCreating(false); }}
              className="text-xs text-ink/60 hover:text-ink font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Event Name *</label>
              <input
                type="text"
                required
                value={editingEvent.name || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                placeholder="e.g. Women in Leadership Townhall: Shaping Policy"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={editingEvent.event_date || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Event Time *</label>
              <input
                type="text"
                required
                value={editingEvent.event_time || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, event_time: e.target.value })}
                placeholder="e.g. 5:00 PM – 7:30 PM"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Campus Venue *</label>
              <input
                type="text"
                required
                value={editingEvent.venue || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                placeholder="e.g. Justice Aryeetey Building (JAB) Hall A"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Short Description</label>
              <textarea
                rows={3}
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                placeholder="What will be discussed or experienced at this session?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Registration Link (Optional)</label>
              <input
                type="url"
                value={editingEvent.registration_link || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, registration_link: e.target.value })}
                placeholder="https://forms.gle/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Status</label>
              <select
                value={editingEvent.status || 'published'}
                onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as ContentStatus })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { setEditingEvent(null); setIsCreating(false); }}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2 flex items-center"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Event'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, venue..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-ink/70">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-white"
              >
                <option value="all">All ({events.length})</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No Events Found"
              message={searchQuery ? 'No campus events matched your search filter.' : 'No events scheduled yet. Click below to schedule a session.'}
              actionText={searchQuery ? undefined : 'Schedule Event'}
              onAction={searchQuery ? undefined : handleCreateNew}
            />
          ) : (
            filteredEvents.map((evt) => (
              <div key={evt.id} className="campaign-card flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-published">{evt.status}</span>
                    <h3 className="text-base font-bold text-brand-navy">{evt.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-ink/60">
                    <span className="font-semibold text-brand-goldDark">{new Date(evt.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{evt.event_time}</span>
                    <span>•</span>
                    <span>{evt.venue}</span>
                  </div>
                  {evt.description && <p className="text-xs text-ink/70 pt-1">{evt.description}</p>}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingEvent(evt); setIsCreating(false); }}
                    className="p-2 rounded hover:bg-muted text-brand-navy transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetEvent(evt)}
                    className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirm Modal with Specific Item Name */}
      <ConfirmModal
        isOpen={!!deleteTargetEvent}
        title="Delete Campus Event"
        message={`Are you sure you want to remove the campus event "${deleteTargetEvent?.name}" from the campaign schedule?`}
        confirmText="Delete Event"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetEvent(null)}
      />
    </div>
  );
};
