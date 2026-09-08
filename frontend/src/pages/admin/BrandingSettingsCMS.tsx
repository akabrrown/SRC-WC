import React, { useState, useEffect } from 'react';
import { Palette, Save, CheckCircle2, AlertCircle, Phone, Mail, MessageSquare, MapPin } from 'lucide-react';
import { api } from '../../api/client.js';
import { BrandAssets, ContactChannels } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';

export const BrandingSettingsCMS: React.FC = () => {
  const toast = useToast();
  const [brand, setBrand] = useState<BrandAssets | null>(null);
  const [channels, setChannels] = useState<ContactChannels | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([
        api.getBrandAssets(),
        api.getContactChannels()
      ]);
      setBrand(b);
      setChannels(c);
    } catch (err) {
      console.error('Failed to load branding data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;
    setSaving(true);
    try {
      await api.updateBrandAssets(brand);
      toast.success('Branding Updated', 'Brand assets and visual identity tokens saved.');
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save branding.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading branding tokens & channels..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
          <Palette className="w-3.5 h-3.5" />
          <span>Visual Identity & Channels</span>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-navy">
          Branding & Official Channels
        </h1>
        <p className="text-xs text-ink/65">
          Configure official campaign logo, typography notes, and contact channels.
        </p>
      </div>

      {brand && (
        <form onSubmit={handleSave} className="space-y-6">

          <div className="campaign-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-3">
              1. Brand Palette & Typography Tokens
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg border border-border bg-white text-center">
                <div className="w-full h-8 rounded bg-[#00004E] mb-2" />
                <span className="text-xs font-bold block text-brand-navy">UPSA Navy</span>
                <span className="text-[10px] text-ink/50 font-mono">#00004E</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-white text-center">
                <div className="w-full h-8 rounded bg-[#C69500] mb-2" />
                <span className="text-xs font-bold block text-brand-navy">UPSA Gold</span>
                <span className="text-[10px] text-ink/50 font-mono">#C69500</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-white text-center">
                <div className="w-full h-8 rounded bg-[#F4F1EA] mb-2 border border-border" />
                <span className="text-xs font-bold block text-brand-navy">Warm Grey</span>
                <span className="text-[10px] text-ink/50 font-mono">#F4F1EA</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-white text-center">
                <div className="w-full h-8 rounded bg-[#1A1A1A] mb-2" />
                <span className="text-xs font-bold block text-brand-navy">Ink Body</span>
                <span className="text-[10px] text-ink/50 font-mono">#1A1A1A</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Campaign Logo URL
              </label>
              <input
                type="text"
                value={brand.logo_url || ''}
                onChange={(e) => setBrand({ ...brand, logo_url: e.target.value })}
                placeholder="https://.../logo.png"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
              <p className="text-[11px] text-ink/50 mt-1">
                Leave blank to render the clean typographic UPSA SRC wordmark.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Branding Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
