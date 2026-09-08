import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Trash2, Edit2, CheckCircle2, AlertCircle, MapPin, Clock } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignEvent, ContentStatus } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

export const EventsCMS: React.FC = () => {
  const toast = useToast();
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEvent, setEditingEvent] = useState<Partial<CampaignEvent> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getAllEventsAdmin();
      setEvents(data);
    } catch (err: any) {
      toast.error('Fetch Failed', err.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingEvent({
      name: '',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '5:00 PM - 7:00 PM',
      venue: 'Main Campus / LBC Auditorium',
      description: '',
      registration_link: '',
      status: 'published'
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.name || !editingEvent.event_date) {
      toast.error('Validation Error', 'Event name and date are required.');
      return;
    }
    setSaving(true);

    try {
      if (isCreating) {
        const created = await api.createEvent(editingEvent);
        setEvents([...events, created]);
        toast.success('Event Created', `"${created.name}" added to campaign calendar.`);
      } else if (editingEvent.id) {
        const updated = await api.updateEvent(editingEvent.id, editingEvent);
        setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
        toast.success('Event Updated', `"${updated.name}" updated successfully.`);
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
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.deleteEvent(deleteTargetId);
      setEvents(events.filter(e => e.id !== deleteTargetId));
      toast.success('Event Deleted', 'Event removed from schedule.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading campus events..." />;
  }

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
            Schedule hall tours, leadership symposiums, and campaign meet-and-greets.
          </p>
        </div>

        {!editingEvent && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
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
              className="text-xs text-ink/60 hover:text-ink font-semibold"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
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
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Event'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {events.map((evt) => (
            <div key={evt.id} className="campaign-card flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge-published">{evt.status}</span>
                  <h3 className="text-base font-bold text-brand-navy">{evt.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink/60">
                  <span className="font-semibold text-brand-goldDark">{new Date(evt.event_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{evt.event_time}</span>
                  <span>•</span>
                  <span>{evt.venue}</span>
                </div>
                <p className="text-xs text-ink/70 pt-1">{evt.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditingEvent(evt); setIsCreating(false); }}
                  className="p-2 rounded hover:bg-muted text-brand-navy"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(evt.id)}
                  className="p-2 rounded hover:bg-red-50 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Event"
        message="Are you sure you want to remove this event from the campaign calendar?"
        confirmText="Delete Event"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

