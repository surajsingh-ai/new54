import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { reviews, loading, averageRating, reviewCount, userReview, addReview } = useReviews(productId);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await addReview(rating, reviewText);
    if (result) {
      setShowForm(false);
      setRating(5);
      setReviewText('');
    }
    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating > 0 ? `${averageRating} out of 5` : 'No reviews yet'} 
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        
        {user && !userReview && !showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline">
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Review</label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                    {review.user_id === user?.id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Your review
                      </span>
                    )}
                  </div>
                  {review.review_text && (
                    <p className="text-sm mt-2 text-muted-foreground">{review.review_text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
};

export default ProductReviews;
