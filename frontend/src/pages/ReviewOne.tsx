import React from 'react'
import { useParams, useLocation } from 'react-router-dom'; // useNavigate도 훅 안으로 이동
import ReviewCard from '../components/ui/ReviewCard';
import CommentList from '../components/ui/CommentList';

const ReviewOne = () => {
  const { reviewId: reviewIdParam } = useParams<{ reviewId: string }>(); // URL에서 reviewId 가져오기
  const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : undefined; // 숫자로 변환

  const location = useLocation();

  // state가 없을 경우를 대비해 기본값({})을 할당
  const { review, bookData, reviewData } = location.state || {};
  // book 객체는 Book 페이지에서 전달받은 값이고, review.book은 BestReview에서 전달받은 값
  // 데이터 구조에 따라 bookInfo를 결정합니다.
  const bookInfo = reviewData?.book || bookData;
  const reviewInfo = reviewData || review;

  const currentUserId = 1;

  if (!reviewInfo || !bookInfo) {
    // 두 변수 중 하나라도 없으면 로딩 중 상태로 처리
    return <div>리뷰 정보를 불러오는 중입니다...</div>;
  }

  if (reviewId === undefined) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="flex justify-between items-start gap-6">
      <div className='hidden lg:block w-[200px]'>
        <img
          className='rounded-xl max-w-fit min-h-[300px] object-contain'
          src={bookInfo.thumbnail} 
          alt={bookInfo.thumbnail + " 표지"}
        />
        <div>
          <h3 className="mt-4 mb-2">{bookInfo.title}</h3>
          <p>{Array.isArray(bookInfo.authors) ? bookInfo.authors.join(', ') : bookInfo.authors}</p>
        </div>
      </div>
      <div className='flex-grow'>
        <>
          <div className='flex lg:hidden mb-4'>
            <img
              className='mr-4 rounded-lg max-w-fit max-h-[180px] object-contain'
              src={bookInfo.thumbnail} 
              alt={bookInfo.title + " 표지"}
            />
            <div className='lg:flex flex-grow justify-between'>
              <div>
                <h3 className="mb-2">{bookInfo.title}</h3>
                <p>{Array.isArray(bookInfo.authors) ? bookInfo.authors.join(', ') : bookInfo.authors}</p>
              </div>
            </div>
          </div>
              {/* <div className='text-center'>
                <h4 className='mb-2'>평점</h4>
                {review.rating}
              </div> */}
        </>
        <ReviewCard review={reviewInfo} />
        <CommentList reviewId={reviewId} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default ReviewOne
