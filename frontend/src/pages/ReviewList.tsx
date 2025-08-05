import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBookDetails, useReviews } from '../hooks/useBook'; // 책 정보 불러오는 훅
import ReviewCard from '../components/ui/ReviewCard';


const ReviewList: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();

  // 책 정보 로딩 훅
  const { bookData, isLoading, error } = useBookDetails(isbn || '');
  // 리뷰 목록 로딩 훅
  const { reviews, isLoadingReviews, errorReviews } = useReviews(isbn);

  // 로딩/에러/책 없음 상태 처리 (이전과 동일)
  if (isLoading || isLoadingReviews) {
    return <div className="p-4 text-center">정보를 로딩 중입니다...</div>;
  }
  if (error || errorReviews) {
    return <div className="p-4 text-center text-red-500">정보를 불러오는데 오류가 발생했습니다: {error || errorReviews}</div>;
  }
  if (!bookData) {
    return <div className="p-4 text-center">책 정보를 찾을 수 없습니다.</div>;
  }
  
  return (
    <div className='pt-[105px] pb-[10%] md:pb-[200px]'>
      <div className="flex justify-between items-start gap-6">
        <div className='hidden lg:block w-[200px]'>
          <img
            className='rounded-xl max-w-fit min-h-[300px] object-contain'
            src={bookData.thumbnail}
            alt={bookData.title + " 표지"}
          />
          <div>
            <h3 className="mt-4 mb-2">{bookData.title}</h3>
            <p>{Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors}</p>
          </div>
        </div>
        <div className='flex-grow'>
          <>
            <div className='flex lg:hidden mb-4'>
              <img
                className='mr-4 rounded-lg max-w-fit max-h-[180px] object-contain'
                src={bookData.thumbnail}
                alt={bookData.title + " 표지"}
              />
              <div className='lg:flex flex-grow justify-between'>
                <div>
                  <h3 className="mb-2">{bookData.title}</h3>
                  <p>{Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors}</p>
                </div>
              </div>
            </div>
          </>
          {reviews && reviews.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {reviews.map(review => (
                <Link to={`/review/${review.reviewId}`} state={{bookData, review}} className='w-[calc(100%)]'>
                  <ReviewCard key={review.reviewId} review={review} />
                </Link>
              ))}
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;