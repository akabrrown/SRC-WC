import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Save, Trash2, Edit2, Shield } from 'lucide-react';
import { api } from '../../api/client.js';
import { AdminUser, PermissionScope } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

const ALL_SCOPES: { id: PermissionScope; label: string; desc: string }[] = [
  { id: 'manage_settings', label: 'manage_settings', desc: 'Site Settings, Launch-Phase Teaser Toggle, Brand Assets' },
  { id: 'manage_identity', label: 'manage_identity', desc: "Candidate Profile, Vision & Values, Testimonials, Women's Corner" },
  { id: 'manage_policy', label: 'manage_policy', desc: 'Our Agenda Policy Hub Platform Builder' },
  { id: 'manage_updates', label: 'manage_updates', desc: 'Campaign Updates & News Articles' },
  { id: 'manage_media', label: 'manage_media', desc: 'Media Gallery & Photography' },
  { id: 'manage_events', label: 'manage_events', desc: 'Events & Townhall Schedule' },
  { id: 'manage_voice', label: 'manage_voice', desc: 'Student Voice Inbox, Surveys & FAQ' },
  { id: 'manage_volunteers', label: 'manage_volunteers', desc: 'Volunteer Registrations & Mobilisation Exports' },
  { id: 'manage_users', label: 'manage_users', desc: 'Admin User Management & Role Scoping' },
  { id: 'publish', label: 'publish', desc: 'Final Gate: Publish Content to Live Public Site' }
];

export const UsersPermissionsCMS: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Users & Permissions CMS | Campaign Staff Portal';
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative users.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAdd = () => {
    setEditingUser({
      name: '',
      email: '',
      role_label: 'Campaign Communications Lead',
      permission_scope: ['manage_updates', 'manage_media']
    });
    setIsAdding(true);
  };

  const handleToggleScope = (scope: PermissionScope) => {
    if (!editingUser) return;
    const current = editingUser.permission_scope || [];
    if (current.includes(scope)) {
      setEditingUser({ ...editingUser, permission_scope: current.filter(s => s !== scope) });
    } else {
      setEditingUser({ ...editingUser, permission_scope: [...current, scope] });
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name?.trim() || !editingUser.email?.trim() || !editingUser.role_label?.trim()) {
      toast.error('Validation Error', 'Name, email, and role label are required fields.');
      return;
    }

    if (!editingUser.permission_scope || editingUser.permission_scope.length === 0) {
      toast.error('Scope Requirement', 'At least one permission scope must be selected.');
      return;
    }

    setSaving(true);
    try {
      if (isAdding) {
        const created = await api.createAdminUser({
          ...editingUser,
          name: editingUser.name.trim(),
          email: editingUser.email.trim(),
          role_label: editingUser.role_label.trim()
        });
        setUsers([...users, created]);
        toast.success('Account Provisioned', `Admin account "${created.name}" created successfully.`);
      } else if (editingUser.id) {
        const updated = await api.updateAdminUser(editingUser.id, {
          name: editingUser.name.trim(),
          email: editingUser.email.trim(),
          role_label: editingUser.role_label.trim(),
          permission_scope: editingUser.permission_scope
        });
        setUsers(users.map(u => u.id === updated.id ? updated : u));
        toast.success('Account Updated', `Permissions for "${updated.name}" updated successfully.`);
      }
      setEditingUser(null);
      setIsAdding(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save administrative account.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteTargetUser) return;
    setDeleting(true);
    try {
      await api.deleteAdminUser(deleteTargetUser.id);
      setUsers(users.filter(u => u.id !== deleteTargetUser.id));
      toast.success('Account Removed', `Staff account "${deleteTargetUser.name}" removed.`);
      setDeleteTargetUser(null);
    } catch (err: any) {
      toast.error('Deletion Blocked', err.message || 'Failed to delete administrative account.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading governance & permissions matrix..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Users"
        message={error}
        onRetry={fetchUsers}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Governance & Access Control</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Users & Permission Scopes
          </h1>
          <p className="text-xs text-ink/65">
            Manage campaign staff accounts, assign granular role scopes, and enforce 3-layer authorization safeguards (§6).
          </p>
        </div>

        {!editingUser && (
          <button
            onClick={handleStartAdd}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Admin</span>
          </button>
        )}
      </div>

      {editingUser ? (
        <form onSubmit={handleSaveUser} className="campaign-card space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              {isAdding ? 'Provision New Staff Account' : `Edit Account: ${editingUser.name}`}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingUser(null); setIsAdding(false); }}
              className="text-xs text-ink/60 font-semibold hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={editingUser.name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                placeholder="e.g. Kwame Osei"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Staff Email *</label>
              <input
                type="email"
                required
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                placeholder="kwame@campaign.com"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={editingUser.role_label || ''}
                onChange={(e) => setEditingUser({ ...editingUser, role_label: e.target.value })}
                placeholder="e.g. Policy & Research Lead"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Assign Permission Scopes (§6 Role Permission Matrix)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_SCOPES.map((sc) => {
                const checked = (editingUser.permission_scope || []).includes(sc.id);
                return (
                  <label
                    key={sc.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'bg-brand-gold/10 border-brand-gold' : 'bg-muted/20 border-border hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleScope(sc.id)}
                      className="mt-0.5 rounded text-brand-gold focus:ring-brand-gold"
                    />
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-navy block">
                        {sc.label}
                      </span>
                      <span className="text-[11px] text-ink/65 leading-tight block">
                        {sc.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setEditingUser(null); setIsAdding(false); }}
              disabled={saving}
              className="px-4 py-2 text-xs text-ink/60 hover:text-ink transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2 px-6 gap-2 flex items-center"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : isAdding ? 'Provision Account' : 'Save Account Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Users Table */
        <div className="campaign-card !p-0 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-ink/60 uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Permission Scopes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-navy flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-brand-navy text-brand-gold font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink/75">{u.email}</td>
                  <td className="py-3.5 px-4 font-semibold text-brand-goldDark">{u.role_label}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.permission_scope.map((s) => (
                        <span key={s} className="bg-muted font-mono text-[10px] text-brand-navy px-2 py-0.5 rounded border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingUser(u); setIsAdding(false); }}
                        className="p-1.5 rounded hover:bg-muted text-brand-navy transition-colors"
                        title="Edit Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {users.length > 1 && (
                        <button
                          onClick={() => setDeleteTargetUser(u)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                          title="Remove Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetUser}
        title="Remove Staff Account"
        message={`Are you sure you want to permanently remove administrative access for "${deleteTargetUser?.name}" (${deleteTargetUser?.email})?`}
        confirmText="Remove Account"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteTargetUser(null)}
      />
    </div>
  );
};
