import { useEffect, useState } from 'react';
import { postsApi, usersApi, reportsApi, adminApi } from '../../services/api';
import type { Post, UserProfile } from '../../types/entities';

interface Report {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetOwnerId?: string;
  targetOwnerUsername?: string;
  category: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: any;
}

interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
  onActionComplete: () => void;
}

export function ReportDetailModal({ report, onClose, onActionComplete }: ReportDetailModalProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchReportDetails() {
      setLoading(true);
      try {
        if (report.targetType === 'post') {
          // Fetch post details
          const response = await postsApi.getById(report.targetId);
          setPost(response.data);
        } else if (report.targetType === 'user' && report.targetOwnerId) {
          // Fetch user profile details
          const response = await usersApi.getById(report.targetOwnerId);
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching report details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReportDetails();
  }, [report]);

  const handleResolve = async () => {
    setActionLoading(true);
    try {
      await reportsApi.updateReport(report.id, { status: 'resolved' });
      alert('Report uspešno razrešen!');
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Greška pri razrešavanju reporta');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    setActionLoading(true);
    try {
      await reportsApi.updateReport(report.id, { status: 'dismissed' });
      alert('Report uspešno odbačen!');
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('Greška pri odbacivanju reporta');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!report.targetOwnerId || !report.targetOwnerUsername) return;

    const confirmed = window.confirm(
      `Banovati korisnika @${report.targetOwnerUsername}? Ovo će obrisati njihov profil i sav sadržaj.`
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await adminApi.toggleBan(report.targetOwnerId);
      await reportsApi.updateReport(report.id, { status: 'resolved' });
      alert(`Korisnik @${report.targetOwnerUsername} uspešno banovan!`);
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Greška pri banovanju korisnika');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;

    const confirmed = window.confirm('Obrisati ovaj post? Ova akcija se ne može poništiti.');
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await adminApi.deletePost(report.targetId);
      await reportsApi.updateReport(report.id, { status: 'resolved' });
      alert('Post uspešno obrisan!');
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Greška pri brisanju posta');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-tradey-black/60 flex items-center justify-center z-50 px-4 overflow-y-auto py-8"
      onClick={onClose}
    >
      <div
        className="bg-white border border-tradey-black/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-tradey-black/10 p-6 flex items-center justify-between">
          <h2 className="font-fayte text-2xl text-tradey-black uppercase">Report Details</h2>
          <button
            onClick={onClose}
            className="text-tradey-black/60 hover:text-tradey-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Info */}
          <div className="bg-tradey-red/5 border border-tradey-red/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-tradey-red text-white font-sans text-xs uppercase font-medium rounded">
                {report.category}
              </span>
              <span className="px-3 py-1 bg-tradey-black/10 text-tradey-black font-sans text-xs uppercase rounded">
                {report.targetType}
              </span>
            </div>
            <p className="font-sans text-sm text-tradey-black/80 mb-2">
              <span className="font-semibold">Reportovan od:</span> @{report.reporterUsername}
            </p>
            {report.targetOwnerUsername && (
              <p className="font-sans text-sm text-tradey-black/80 mb-2">
                <span className="font-semibold">Korisnik:</span> @{report.targetOwnerUsername}
              </p>
            )}
            {report.description && (
              <p className="font-sans text-sm text-tradey-black/80 italic mt-3 p-3 bg-white border-l-2 border-tradey-red">
                "{report.description}"
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tradey-red"></div>
            </div>
          )}

          {/* Post Details */}
          {!loading && report.targetType === 'post' && post && (
            <div className="border border-tradey-black/10 p-6">
              <h3 className="font-fayte text-xl text-tradey-black uppercase mb-4">Reportovani Post</h3>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${post.title} - ${index + 1}`}
                      className="w-full aspect-square object-cover border border-tradey-black/10"
                    />
                  ))}
                </div>
              )}

              {/* Post Info */}
              <div className="space-y-3">
                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Naslov</p>
                  <p className="font-sans text-lg font-semibold text-tradey-black">{post.title}</p>
                </div>

                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Opis</p>
                  <p className="font-sans text-sm text-tradey-black/80 whitespace-pre-wrap">{post.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Cena</p>
                    <p className="font-sans text-lg font-semibold text-tradey-red">{post.price} RSD</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Kategorija</p>
                    <p className="font-sans text-sm text-tradey-black">{post.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Stanje</p>
                    <p className="font-sans text-sm text-tradey-black">{post.condition}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Veličina</p>
                    <p className="font-sans text-sm text-tradey-black">{post.size}</p>
                  </div>
                </div>

                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Lokacija</p>
                  <p className="font-sans text-sm text-tradey-black">{post.location}</p>
                </div>

                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Autor</p>
                  <p className="font-sans text-sm text-tradey-black">@{post.authorUsername}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Details */}
          {!loading && report.targetType === 'user' && userProfile && (
            <div className="border border-tradey-black/10 p-6">
              <h3 className="font-fayte text-xl text-tradey-black uppercase mb-4">Reportovani Korisnik</h3>

              <div className="flex items-start gap-6 mb-6">
                {/* Avatar */}
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.username}
                    className="w-24 h-24 rounded-full object-cover border-2 border-tradey-black/10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-tradey-black/10 flex items-center justify-center border-2 border-tradey-black/10">
                    <span className="font-fayte text-3xl text-tradey-black">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Username</p>
                    <p className="font-fayte text-2xl text-tradey-black">@{userProfile.username}</p>
                  </div>

                  {userProfile.bio && (
                    <div>
                      <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Bio</p>
                      <p className="font-sans text-sm text-tradey-black/80 whitespace-pre-wrap">{userProfile.bio}</p>
                    </div>
                  )}

                  {userProfile.location && (
                    <div>
                      <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Lokacija</p>
                      <p className="font-sans text-sm text-tradey-black">{userProfile.location}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div>
                      <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Followers</p>
                      <p className="font-sans text-lg font-semibold text-tradey-black">
                        {userProfile.followers?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Following</p>
                      <p className="font-sans text-lg font-semibold text-tradey-black">
                        {userProfile.following?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-tradey-black/40 uppercase mb-1">Rating</p>
                      <p className="font-sans text-lg font-semibold text-tradey-black">
                        {userProfile.rating || 0} ⭐
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Not Found Message */}
          {!loading && ((report.targetType === 'post' && !post) || (report.targetType === 'user' && !userProfile)) && (
            <div className="bg-tradey-red/10 border border-tradey-red/20 p-6 text-center">
              <p className="font-sans text-tradey-red">
                {report.targetType === 'post' ? 'Post nije pronađen.' : 'Korisnik nije pronađen.'}
              </p>
              <p className="font-sans text-sm text-tradey-black/60 mt-2">
                Možda je već obrisan.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-tradey-black/10 p-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDismiss}
              disabled={actionLoading}
              className="px-6 py-3 bg-tradey-black/10 text-tradey-black font-sans text-sm hover:bg-tradey-black/20 transition-colors disabled:opacity-50"
            >
              Dismiss
            </button>

            <button
              onClick={handleResolve}
              disabled={actionLoading}
              className="px-6 py-3 bg-green-500 text-white font-sans text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Resolve
            </button>

            {report.targetType === 'post' && post && (
              <button
                onClick={handleDeletePost}
                disabled={actionLoading}
                className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:bg-tradey-red/80 transition-colors disabled:opacity-50"
              >
                Delete Post
              </button>
            )}

            {report.targetType === 'user' && userProfile && (
              <button
                onClick={handleBanUser}
                disabled={actionLoading}
                className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:bg-tradey-red/80 transition-colors disabled:opacity-50"
              >
                Ban User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
