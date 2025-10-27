import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usersApi } from '../../services/api';

const STYLE_OPTIONS = [
  'Y2K',
  'Streetwear',
  'Vintage',
  'Elegant',
  'Minimal',
  'Casual',
  'Grunge',
  'Bohemian',
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface PreferencesModalProps {
  onClose: () => void;
  onSave?: () => void;
  currentPreferences?: {
    preferredStyles?: string[];
    size?: string;
    gender?: 'male' | 'female' | 'unisex';
  };
}

export function PreferencesModal({ onClose, onSave, currentPreferences }: PreferencesModalProps) {
  const { user } = useAuth();
  const [preferredStyles, setPreferredStyles] = useState<string[]>(
    currentPreferences?.preferredStyles || []
  );
  const [size, setSize] = useState(currentPreferences?.size || '');
  const [gender, setGender] = useState<'male' | 'female' | 'unisex'>(
    currentPreferences?.gender || 'unisex'
  );
  const [loading, setLoading] = useState(false);

  const toggleStyle = (style: string) => {
    setPreferredStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleSave = async () => {
    if (!user || preferredStyles.length === 0 || !size) {
      alert('Please select at least one style and size');
      return;
    }

    setLoading(true);
    try {
      await usersApi.updatePreferences(user.uid, {
        preferredStyles,
        size,
        gender,
      });
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="font-fayte text-4xl text-tradey-black uppercase mb-6">
          Tell Us Your Style
        </h2>

        {/* Styles */}
        <div className="mb-6">
          <label className="font-sans font-semibold text-tradey-black mb-3 block">
            What styles interest you? (Select at least one)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLE_OPTIONS.map(style => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-3 border-2 transition-all font-sans text-sm ${
                  preferredStyles.includes(style)
                    ? 'border-tradey-red bg-tradey-red text-white'
                    : 'border-tradey-black/20 text-tradey-black hover:border-tradey-red'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-6">
          <label className="font-sans font-semibold text-tradey-black mb-3 block">
            Your Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-4 py-3 border-2 border-tradey-black/20 font-sans text-sm focus:outline-none focus:border-tradey-red"
          >
            <option value="">Select size</option>
            {SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="mb-8">
          <label className="font-sans font-semibold text-tradey-black mb-3 block">
            Gender Preference
          </label>
          <div className="flex gap-4">
            {[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'unisex', label: 'Unisex' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setGender(option.value as any)}
                className={`flex-1 px-4 py-3 border-2 transition-all font-sans text-sm ${
                  gender === option.value
                    ? 'border-tradey-red bg-tradey-red text-white'
                    : 'border-tradey-black/20 text-tradey-black hover:border-tradey-red'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-tradey-black text-tradey-black font-sans text-sm hover:bg-tradey-black hover:text-white transition-all"
            disabled={loading}
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            disabled={loading || preferredStyles.length === 0 || !size}
            className="flex-1 px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
