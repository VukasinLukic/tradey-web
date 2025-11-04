import { useState } from 'react';
import { reportsApi } from '../../services/api';

interface ReportButtonProps {
  targetType: 'post' | 'user';
  targetId: string;
  className?: string;
}

const CATEGORIES = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'scam', label: 'Scam or fraud' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'fake', label: 'Fake or misleading' },
  { value: 'other', label: 'Other' },
] as const;

export function ReportButton({ targetType, targetId, className = '' }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reportsApi.createReport({
        targetType,
        targetId,
        category: category as any,
        description: description.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setCategory('');
        setDescription('');
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShowModal(false);
      setCategory('');
      setDescription('');
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <>
      {/* Report Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 text-tradey-black/60 hover:text-tradey-red transition-colors ${className}`}
        title={`Report this ${targetType}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        <span className="text-sm font-sans">Report</span>
      </button>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            {/* Close Button */}
            {!loading && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-tradey-black/40 hover:text-tradey-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {success ? (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-fayte text-2xl text-tradey-black mb-2 uppercase">Report Submitted</h3>
                <p className="font-sans text-tradey-black/60 text-sm">
                  Thank you for helping keep TRADEY safe. We'll review this report shortly.
                </p>
              </div>
            ) : (
              /* Report Form */
              <>
                <h2 className="font-fayte text-2xl text-tradey-black mb-2 uppercase">
                  Report {targetType === 'post' ? 'Post' : 'User'}
                </h2>
                <p className="font-sans text-tradey-black/60 text-sm mb-6">
                  Help us understand what's wrong with this {targetType}.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-tradey-black mb-2">
                      Reason for reporting *
                    </label>
                    <div className="space-y-2">
                      {CATEGORIES.map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex items-center gap-3 p-3 border border-tradey-black/10 rounded-lg cursor-pointer hover:border-tradey-red transition-colors"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={value}
                            checked={category === value}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-tradey-red focus:ring-tradey-red"
                          />
                          <span className="font-sans text-sm text-tradey-black">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Optional Description */}
                  <div>
                    <label htmlFor="description" className="block font-sans text-sm font-medium text-tradey-black mb-2">
                      Additional details (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more context about this report..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 bg-white border border-tradey-black/20 rounded-lg text-tradey-black text-sm font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-xs text-tradey-black/40 mt-1 font-sans">
                      {description.length}/500 characters
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-tradey-red/10 border border-tradey-red rounded-lg p-3">
                      <p className="text-tradey-red text-sm font-sans">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 py-3 bg-white border border-tradey-black/20 text-tradey-black font-sans text-sm font-semibold rounded-full hover:bg-tradey-black/5 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !category}
                      className="flex-1 py-3 bg-tradey-red hover:bg-tradey-red/80 text-white font-sans text-sm font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
