import React, { useState, useEffect, useRef } from 'react';
import { Users, Download, Eye, CheckCircle2, Phone, Mail, BookOpen, Clock } from 'lucide-react';
import { api } from '../../api/client.js';
import { VolunteerRegistration, RegistrationType } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';

export const VolunteersCMS: React.FC = () => {
  const toast = useToast();
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRegistration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVolunteer) {
        setSelectedVolunteer(null);
        return;
      }
      if (e.key === 'Tab' && selectedVolunteer && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (selectedVolunteer) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVolunteer]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const volunteerList = await api.getVolunteers();
      setVolunteers(volunteerList);
    } catch (err) {
      console.error('Failed to load volunteer records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (volunteers.length === 0) {
      toast.warning('No Records', 'No volunteer registrations available to export.');
      return;
    }

    const headers = [
      'ID',
      'Full Name',
      'Registration Type',
      'Programme',
      'Level',
      'Phone',
      'Email',
      'Area of Interest',
      'Availability',
      'Skills',
      'Motivation',
      'Submitted At'
    ];

    const rows = volunteers.map(volunteerItem => [
      `"${volunteerItem.id}"`,
      `"${volunteerItem.full_name}"`,
      `"${volunteerItem.registration_type}"`,
      `"${volunteerItem.programme}"`,
      `"${volunteerItem.level}"`,
      `"${volunteerItem.phone}"`,
      `"${volunteerItem.email}"`,
      `"${volunteerItem.area_of_interest}"`,
      `"${volunteerItem.availability}"`,
      `"${(volunteerItem.skills || '').replace(/"/g, '""')}"`,
      `"${(volunteerItem.motivation || '').replace(/"/g, '""')}"`,
      `"${volunteerItem.created_at}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SRC_WC_Volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported', `Successfully exported ${volunteers.length} volunteer records.`);
  };


  const filtered = volunteers.filter(v => typeFilter === 'all' || v.registration_type === typeFilter);

  if (loading) {
    return <LoadingState message="Loading volunteer mobilisation database..." />;
  }

  const getTypeBadge = (type: RegistrationType) => {
    switch (type) {
      case 'campaign_team':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 uppercase">Campaign Team</span>;
      case 'ambassador':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">Ambassador</span>;
      case 'volunteer':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase">Volunteer</span>;
      case 'supporter':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">Supporter</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Mobilisation & Field Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Join the Movement / Volunteers
          </h1>
          <p className="text-xs text-ink/65">
            Manage registrations, campus ambassadors, volunteer assignments, and export mobilization data.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV for Mobilisation</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="campaign-card !p-0 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink/70">Role Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-white"
            >
              <option value="all">All Registrations ({volunteers.length})</option>
              <option value="volunteer">Volunteers</option>
              <option value="campaign_team">Campaign Team</option>
              <option value="ambassador">Hall/Class Ambassadors</option>
              <option value="supporter">Supporters</option>
            </select>
          </div>

          <span className="text-xs font-medium text-ink/50">
            Showing {filtered.length} of {volunteers.length} registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-ink/60 uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Programme & Level</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Area of Interest</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-ink/50">
                    No registrations found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-navy">
                      {volunteer.full_name}
                    </td>
                    <td className="py-3 px-4">
                      {getTypeBadge(volunteer.registration_type)}
                    </td>
                    <td className="py-3 px-4 text-ink/75">
                      <span className="font-medium block">{volunteer.programme}</span>
                      <span className="text-[10px] text-ink/50">Level {volunteer.level}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-ink/80">
                      {volunteer.phone}
                    </td>
                    <td className="py-3 px-4 text-ink/70">
                      {volunteer.area_of_interest}
                    </td>
                    <td className="py-3 px-4 text-ink/50 whitespace-nowrap">
                      {new Date(volunteer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="p-1.5 rounded hover:bg-muted text-brand-navy"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedVolunteer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="volunteer-details-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navyDark/80 animate-in fade-in duration-150"
        >
          <div ref={modalRef} className="bg-surface rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                  Volunteer Record
                </span>
                <h3 id="volunteer-details-title" className="text-lg font-extrabold text-brand-navy">
                  {selectedVolunteer.full_name}
                </h3>
              </div>
              {getTypeBadge(selectedVolunteer.registration_type)}
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-lg">
                <div>
                  <span className="text-ink/50 block">Programme</span>
                  <span className="font-bold text-brand-navy">{selectedVolunteer.programme}</span>
                </div>
                <div>
                  <span className="text-ink/50 block">Academic Level</span>
                  <span className="font-bold text-brand-navy">Level {selectedVolunteer.level}</span>
                </div>
                <div>
                  <span className="text-ink/50 block">Phone</span>
                  <span className="font-bold text-brand-navy">{selectedVolunteer.phone}</span>
                </div>
                <div>
                  <span className="text-ink/50 block">Email</span>
                  <span className="font-bold text-brand-navy truncate block">{selectedVolunteer.email}</span>
                </div>
              </div>

              <div>
                <span className="text-ink/50 font-bold block mb-1">Area of Interest</span>
                <p className="p-2.5 bg-white border border-border rounded font-medium text-ink/80">
                  {selectedVolunteer.area_of_interest}
                </p>
              </div>

              <div>
                <span className="text-ink/50 font-bold block mb-1">Availability</span>
                <p className="p-2.5 bg-white border border-border rounded font-medium text-ink/80">
                  {selectedVolunteer.availability}
                </p>
              </div>

              {selectedVolunteer.skills && (
                <div>
                  <span className="text-ink/50 font-bold block mb-1">Reported Skills</span>
                  <p className="p-2.5 bg-white border border-border rounded text-ink/75 leading-relaxed">
                    {selectedVolunteer.skills}
                  </p>
                </div>
              )}

              {selectedVolunteer.motivation && (
                <div>
                  <span className="text-ink/50 font-bold block mb-1">Motivation & Goals</span>
                  <p className="p-2.5 bg-white border border-border rounded text-ink/75 leading-relaxed">
                    {selectedVolunteer.motivation}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="btn-navy text-xs py-2 px-6"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
