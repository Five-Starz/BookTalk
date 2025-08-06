import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewCard from '../components/ui/ReviewCard';
import CommentList from '../components/ui/CommentList';
import { useReviewDetails } from '../hooks/useReview';
import { useBookDetailsInMyPage } from '../hooks/useBook'; // 책 정보만 가져오는 새로운 훅을 가정합니다.

const ReviewOne = () => {
  const { reviewId: reviewIdParam } = useParams<{ reviewId: string }>();
  const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : undefined;

  // ✅ Step 1: reviewId를 사용하여 리뷰 정보를 가져옵니다.
  const { reviewData, isLoadingReview, errorReview } = useReviewDetails(reviewId);
  const isbn = reviewData?.isbn;

  // ✅ Step 2: 리뷰 정보에서 isbn을 추출하여 책 정보를 가져옵니다.
  const { bookData, isLoading, error } = useBookDetailsInMyPage(isbn);

  if (reviewId === undefined) {
    return <div>잘못된 접근입니다.</div>;
  }

  // ✅ 로딩 및 에러 처리 로직을 통합합니다.
  if (isLoadingReview || isLoading) {
    return <div>리뷰 정보를 불러오는 중입니다...</div>;
  }
  if (errorReview || error) {
    return <div>오류가 발생했습니다: {errorReview || error}</div>;
  }
  if (!reviewData || !bookData) {
    return <div>리뷰 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='pt-[105px] pb-[10%] md:pb-[200px]'>
      <div className="flex justify-between items-start gap-6">
        <div className='hidden lg:block w-[200px]'>
          <Link to={`/book/${isbn}`}>
            <img
              className='rounded-xl max-w-fit min-h-[300px] object-contain'
              src={bookData.thumbnail}
              alt={bookData.title + " 표지"}
            />
            <div>
              <h3 className="mt-4 mb-2">{bookData.title}</h3>
              <p>{Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors}</p>
            </div>
          </Link>
        </div>
        <div className='flex-grow'>
          <Link to={`/book/${isbn}`}>
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
          </Link>
          {/* ✅ ReviewCard에 데이터만 props로 전달 */}
          <ReviewCard review={reviewData} />
          <CommentList reviewId={reviewId} />
        </div>
      </div>
    </div>
  );
};

export default ReviewOne;