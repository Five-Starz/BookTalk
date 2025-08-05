// components/sections/ReviewsSection.tsx
import React from 'react';
import ReviewCard from '../ui/ReviewCard'; // ReviewCard 임포트
import type { ReviewsSectionProps } from '../../types/ReviewType'; // 타입 임포트
import { Link } from 'react-router-dom';
import { getPrimaryIsbn } from '../../utils/getPrimaryIsbn';

const ReviewsSection = ({ reviews, isLoading, error, bookData }: ReviewsSectionProps) => {

  if (isLoading || !bookData) {
      return <div className='text-center'>리뷰를 불러오는 중입니다...</div>;
  }

  if (error) return <div className="text-center text-red-500">{error}</div>

  if (!reviews || reviews.length === 0) {
    return <div className='text-center'>이 책에 대한 리뷰가 아직 없습니다.</div>;
  }
  
  const isbn = getPrimaryIsbn(bookData.isbn);

  return (
    <div>
      <div className='flex justify-between mb-3 md:mb-6'>
        <h2>리뷰들</h2>
        {!isLoading && !error && reviews && reviews.length > 0 && (
          <Link to={`/book/${isbn}/reviews`} className='text-[#999]'>더보기</Link>
        )}
      </div>
      
      {reviews && reviews.length > 0 && (
        <>
          <div className='hidden flex-wrap gap-2 lg:flex'>
            {reviews.slice(0, 6).map(review => (
              <Link to={`/review/${review.reviewId}`} state={{bookData, review}} className='w-[calc(33.3%-6px)]'>
                <ReviewCard key={review.reviewId} review={review} />
              </Link>
            ))}
          </div>
          <div className='hidden flex-wrap gap-2 sm:flex lg:hidden'>
            {reviews.slice(0, 4).map(review => (
              <Link to={`/review/${review.reviewId}`} state={{bookData, review}} className='w-[calc(50%-4px)]'>
                <ReviewCard key={review.reviewId} review={review} />
              </Link>
            ))}
          </div>
          <div className='block flex-wrap gap-2 sm:hidden'>
            {reviews.slice(0, 1).map(review => (
              <Link to={`/review/${review.reviewId}`} state={{bookData, review}} className='w-[calc(100%)]'>
                <ReviewCard key={review.reviewId} review={review} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsSection;