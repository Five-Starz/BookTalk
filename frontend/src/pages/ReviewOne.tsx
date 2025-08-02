import React from 'react'
import { useLocation } from 'react-router-dom'; // useNavigate도 훅 안으로 이동
import ReviewCard from '../components/ui/ReviewCard';

const ReviewOne = () => {
  const location = useLocation();

  // ✅ state가 없을 경우를 대비해 기본값({})을 할당합니다.
  const { review, bookData, reviewData } = location.state || {};
  // ✅ book 객체는 Book 페이지에서 전달받은 값이고, review.book은 BestReview에서 전달받은 값입니다.
  // 데이터 구조에 따라 bookInfo를 결정합니다.
  const bookInfo = reviewData?.book || bookData;
  const reviewInfo = reviewData || review;

  // 이제 reviewInfo와 bookInfo 변수를 사용해 렌더링하면 됩니다.

  if (!reviewInfo || !bookInfo) {
    // 두 변수 중 하나라도 없으면 로딩 중 상태로 처리
    return <div>리뷰 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="flex justify-between items-start gap-4">
      <div className='hidden lg:block'>
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
        <ReviewCard review={reviewInfo} width='full' />        
      </div>
    </div>
  );
};

export default ReviewOne
