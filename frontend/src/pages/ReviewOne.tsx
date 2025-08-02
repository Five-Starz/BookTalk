import React from 'react'
import { useLocation } from 'react-router-dom'; // useNavigate도 훅 안으로 이동
import ReviewCard from '../components/ui/ReviewCard';
import {useRevCommentForm} from '../hooks/useReview';

const ReviewOne = () => {
  const location = useLocation();

  // state가 없을 경우를 대비해 기본값({})을 할당
  const { review, bookData, reviewData } = location.state || {};
  // book 객체는 Book 페이지에서 전달받은 값이고, review.book은 BestReview에서 전달받은 값
  // 데이터 구조에 따라 bookInfo를 결정합니다.
  const bookInfo = reviewData?.book || bookData;
  const reviewInfo = reviewData || review;

  // ✅ useReviewForm 훅 사용
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  } = useRevCommentForm({ reviewId, });

  if (!reviewInfo || !bookInfo) {
    // 두 변수 중 하나라도 없으면 로딩 중 상태로 처리
    return <div>리뷰 정보를 불러오는 중입니다...</div>;
  }

  console.log(reviewInfo)

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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? '리뷰 작성 중...' : '리뷰 작성 완료'}
            </button>
          </div>

          {submitError && <p className="text-red-500 text-sm mt-4">{submitError}</p>}
          {submitSuccess && <p className="text-green-500 text-sm mt-4">리뷰가 성공적으로 작성되었습니다!</p>}
        </form>
      </div>
    </div>
  );
};

export default ReviewOne
