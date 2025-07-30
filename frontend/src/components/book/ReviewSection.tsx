// components/sections/ReviewsSection.tsx
import React from 'react';
import ReviewCard from '../ui/ReviewCard'; // ReviewCard 임포트
import type { ReviewDetail } from '../../types/ReviewType'; // 타입 임포트

interface ReviewsSectionProps {
  reviews: ReviewDetail[] | null;
  isLoading: boolean;
  error: string | null;
}

const ReviewsSection = ({ reviews, isLoading, error }: ReviewsSectionProps) => {
  return (
    <div>
      <div className='flex justify-between mb-3 md:mb-6'>
        <h2>리뷰들</h2>
        {!isLoading && !error && reviews && reviews.length > 0 && (
          <button className='text-[#999]'>더보기</button>
        )}
      </div>

      {isLoading && (
        <div className="text-center">리뷰를 불러오는 중입니다...</div>
      )}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}
      {!isLoading && !error && (!reviews || reviews.length === 0) && (
        <div className="text-center">이 책에 대한 리뷰가 아직 없습니다.</div>
      )}

      {reviews && reviews.length > 0 && (
        <>
          <div className='hidden justify-between flex-wrap gap-2 lg:flex'>
            {reviews.slice(0, 6).map(review => (
              <ReviewCard key={review.id} review={review} width='[calc(33.3%-6px)]' />
            ))}
          </div>
          <div className='hidden justify-between flex-wrap gap-2 sm:flex lg:hidden'>
            {reviews.slice(0, 4).map(review => (
              <ReviewCard key={review.id} review={review} width='[calc(50%-4px)]' />
            ))}
          </div>
          <div className='block justify-between flex-wrap gap-2 sm:hidden'>
            {reviews.slice(0, 1).map(review => (
              <ReviewCard key={review.id} review={review} width='[calc(100%)]' />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsSection;