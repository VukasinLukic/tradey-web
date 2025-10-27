import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingState } from '../components/ui/LoadingState';

export function ReviewsPage() {
  const { user } = useAuth();
  const { userProfile, loading } = useUserProfile(user?.uid);

  if (loading) {
    return <LoadingState />;
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-sans text-lg">
          Unable to load reviews
        </p>
      </div>
    );
  }

  const reviews = userProfile.reviews || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 font-sans text-sm text-tradey-black/60 hover:text-tradey-red transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-black mb-2 tracking-tight uppercase">
          My Reviews
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from your trading partners
        </p>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-tradey-black/10 bg-tradey-black/5">
          <svg
            className="w-16 h-16 text-tradey-black/20 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="font-fayte text-xl text-tradey-black mb-2 uppercase">No reviews yet</h3>
          <p className="font-sans text-tradey-black/60 text-sm">
            Complete trades to receive reviews from other users
          </p>
        </div>
      ) : (
        <div className="bg-white border border-tradey-black/10 p-8 shadow-sm">
          <div className="space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="pb-6 border-b border-tradey-black/10 last:border-0">
                <div className="flex items-start gap-4">
                  {/* Reviewer Avatar */}
                  <Link to={`/user/${review.reviewerId}`} className="flex-shrink-0">
                    {review.reviewerAvatarUrl ? (
                      <img
                        src={review.reviewerAvatarUrl}
                        alt={review.reviewerUsername}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-tradey-black/10 flex items-center justify-center">
                        <span className="font-sans text-lg text-tradey-black">
                          {review.reviewerUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-2">
                      <Link
                        to={`/user/${review.reviewerId}`}
                        className="font-sans font-semibold text-tradey-black hover:text-tradey-red transition-colors"
                      >
                        {review.reviewerUsername}
                      </Link>
                      <span className="font-sans text-xs text-tradey-black/40">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 stroke-yellow-400'
                              : 'fill-none stroke-tradey-black/20'
                          }`}
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>

                    {/* Review Comment */}
                    <p className="font-sans text-sm text-tradey-black/80 whitespace-pre-wrap leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
