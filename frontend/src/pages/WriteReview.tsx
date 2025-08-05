import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookDetails } from '../hooks/useBook'; // 책 정보 불러오는 훅

import { RatingStar, useReviewForm } from '../hooks/useReview'; 
import { useUserStore } from '../store/userStore';


const WriteReview: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const {userId} = useUserStore();

  // 책 정보 로딩 훅 (이 훅은 그대로 여기에 둡니다. 폼 훅은 이 데이터를 받아서 사용해요.)
  const { bookData, isLoading: isLoadingBook, error: errorBook } = useBookDetails(isbn || '');

  // ✅ useReviewForm 훅 사용 (currentUserId 전달)
  const {
    formData,
    handleChange,
    handleRatingChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  } = useReviewForm({ 
    initialIsbn: isbn || '', 
    bookData, 
    userId: userId || 0
  });


  // 로딩/에러/책 없음 상태 처리 (이전과 동일)
  if (isLoadingBook) {
    return <div className="p-4 text-center">책 정보 로딩 중...</div>;
  }
  if (errorBook) {
    return <div className="p-4 text-center text-red-500">책 정보를 불러오는데 오류가 발생했습니다: {errorBook}</div>;
  }
  if (!bookData) {
    return <div className="p-4 text-center">리뷰를 작성할 책 정보를 찾을 수 없습니다. (유효한 ISBN이 필요합니다.)</div>;
  }

  return (
    <div className='pt-[105px] pb-[10%] md:pb-[200px]'>
      <div className="flex justify-between items-start gap-4">
        {/* 썸네일과 책 정보 표시 (이전과 동일) */}
        <img
          className='hidden lg:block rounded-lg max-w-fit min-h-[300px] object-contain'
          src={bookData.thumbnail} 
          alt={bookData.title + " 표지"}
        />
        <div className='flex-grow'>
          <div className='mb-4'>
            <div className='flex'>
              <img
                className='block lg:hidden mr-4 rounded-lg max-w-fit max-h-[180px] object-contain'
                src={bookData.thumbnail} 
                alt={bookData.title + " 표지"}
              />
              <div className='lg:flex flex-grow justify-between'>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{bookData.title}</h2>
                  <p>{Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors}</p>
                  <p className='year text-sm mb-4'>{bookData.publishedYear ? bookData.publishedYear : '연도 정보 없음'}</p>
                </div>
                <div className='text-center'>
                  <h4 className='hidden mb-2 lg:block'>평점</h4>
                  <RatingStar 
                    ratingIndex={formData.rating} // 현재 평점 전달
                    setRatingIndex={handleRatingChange} // 평점 변경 함수 전달
                  />
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default WriteReview;