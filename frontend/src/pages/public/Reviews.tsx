import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ReviewFormData } from "@/types/review";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    rating: 0,
    comment: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch reviews from the backend and filter for 4+ star ratings
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<{ data: Review[]; success: boolean }>(`${apiBaseUrl}/reviews`);
      
      if (!data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }

      // Filter reviews to only include 4 and 5 star ratings
      const filteredReviews = data.data.filter(
        (review: Review) => review.rating >= 4
      );
      setReviews(filteredReviews);

      // Calculate average rating for filtered reviews
      if (filteredReviews.length > 0) {
        const totalRating = filteredReviews.reduce(
          (acc: number, review: Review) => acc + review.rating,
          0
        );
        setAverageRating(Number((totalRating / filteredReviews.length).toFixed(1)));
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reviews';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reviews.length, isAutoScrolling]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.rating === 0 || !formData.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post<{ success: boolean; message?: string }>(
        `${apiBaseUrl}/reviews`,
        formData
      );

      if (data.success) {
        toast.success("Thank you for your review!");
        setFormData({ name: "", rating: 0, comment: "" });
        setShowForm(false);
        await fetchReviews(); // Refresh the reviews
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const nextReview = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  interface StarRatingProps {
    rating: number;
    interactive?: boolean;
    onStarClick?: (rating: number) => void;
  }

  const StarRating: React.FC<StarRatingProps> = ({
    rating,
    interactive = false,
    onStarClick,
  }) => {
    const handleClick = (star: number) => {
      if (interactive && onStarClick) {
        onStarClick(star);
      }
    };

    return (
      <div className="flex space-x-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 transition-transform duration-200 transform ${
              star <= rating ? "text-blue-500 fill-blue-500" : "text-gray-300"
            } ${
              interactive
                ? "cursor-pointer hover:scale-110 hover:text-blue-400"
                : ""
            }`}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {isLoading && reviews.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium text-lg">
              Submitting your review...
            </p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-blue-900 tracking-tight">
            Had a great experience? Share with us!
          </h2>
          <p className="text-blue-600 text-xl max-w-3xl mx-auto mt-4 leading-relaxed">
            Discover what our valued customers are saying about their
            experiences with us
          </p>
          {reviews.length > 0 && (
            <div className="mt-6">
              <span className="text-2xl font-bold text-gray-700">
                Average Rating: {averageRating.toFixed(1)}/5
              </span>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 mx-0.5 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Carousel */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-10 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <div className="flex-1 mx-10">
                {reviews.length > 0 && (
                  <div className="text-center transition-opacity duration-500">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex justify-center mb-5">
                        <div role="img" aria-label={`Rating: ${reviews[currentIndex]?.rating} out of 5`}>
                          <StarRating
                            rating={reviews[currentIndex]?.rating || 0}
                          />
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg mb-5 leading-relaxed italic">
                        "{reviews[currentIndex]?.comment || "No comment"}"
                      </p>
                      <div className="text-center">
                        <p className="text-blue-800 font-semibold text-xl">
                          {reviews[currentIndex]?.name || "Anonymous"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-3">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoScrolling(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-500 scale-125"
                      : "bg-blue-300 hover:bg-blue-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="text-center mb-12">
          {showForm ? (
            <button
              onClick={() => setShowForm(false)}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline focus:outline-none"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg hover:underline focus:outline-none"
            >
              Share with us
            </button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-2xl border border-blue-100 transition-all duration-300">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              We'd Love Your Feedback!
            </h3>

            <div className="space-y-8">
              <div>
                <label className="block text-blue-800 font-semibold mb-3 text-lg">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-5 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-700 text-lg"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-3 text-lg">
                  Rating
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={formData.rating}
                    interactive={true}
                    onStarClick={handleStarClick}
                  />
                </div>
                <p className="text-center text-blue-600 mt-3 text-sm font-medium">
                  Click to rate your experience
                </p>
              </div>

              <div>
                <label className="block text-blue-800 font-semibold mb-3 text-lg">
                  Your Review
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full px-5 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-700 text-lg resize-none"
                  rows={6}
                  placeholder="Share your experience with us..."
                  required
                />
              </div>

              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
