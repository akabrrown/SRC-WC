import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Save, UserCheck, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { api } from '../../api/client.js';
import { AdminUser, PermissionScope } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';

const ALL_SCOPES: { id: PermissionScope; label: string; desc: string }[] = [
  { id: 'manage_settings', label: 'manage_settings', desc: 'Site Settings, Launch-Phase Teaser Toggle, Brand Assets' },
  { id: 'manage_identity', label: 'manage_identity', desc: 'Candidate Profile, Vision & Values, Testimonials, Women’s Corner' },
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
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role_label: string;
    permission_scope: PermissionScope[];
  }>({
    name: '',
    email: '',
    role_label: 'Communications Lead',
    permission_scope: ['manage_updates', 'manage_media']
  });
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleScope = (scope: PermissionScope) => {
    const current = newUser.permission_scope;
    if (current.includes(scope)) {
      setNewUser({ ...newUser, permission_scope: current.filter(s => s !== scope) });
    } else {
      setNewUser({ ...newUser, permission_scope: [...current, scope] });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('Validation Error', 'Name and email are required fields.');
      return;
    }
    setSaving(true);
    try {
      const created = await api.createAdminUser(newUser);
      setUsers([...users, created]);
      setIsAdding(false);
      setNewUser({
        name: '',
        email: '',
        role_label: 'Team Member',
        permission_scope: ['manage_updates']
      });
      toast.success('Account Provisioned', `Admin user "${created.name}" was successfully registered.`);
    } catch (err: any) {
      toast.error('Provisioning Failed', err.message || 'Failed to add user.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading governance & permissions matrix..." />;
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
            Manage campaign staff accounts and assign granular permission scopes (§6).
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Admin</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleCreateUser} className="campaign-card space-y-5">

          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              Provision New Staff Account
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-ink/60 font-semibold"
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
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. Kwame Osei"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Staff Email *</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="kwame@campaign.com"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Governance Role Label *</label>
              <input
                type="text"
                required
                value={newUser.role_label}
                onChange={(e) => setNewUser({ ...newUser, role_label: e.target.value })}
                placeholder="e.g. Policy & Research Lead"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Assign Permission Scopes (§6 Role Matrix)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_SCOPES.map((sc) => {
                const checked = newUser.permission_scope.includes(sc.id);
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
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-ink/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2 px-6 gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Creating...' : 'Provision Account'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="campaign-card !p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-ink/60 uppercase text-[10px] font-bold border-b border-border">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role Label</th>
              <th className="py-3 px-4">Permission Scopes</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
