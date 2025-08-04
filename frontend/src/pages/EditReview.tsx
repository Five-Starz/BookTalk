import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookDetailsInMyPage } from '../hooks/useBook'
import { RatingStar, useReviewForm, useReviewDetails } from '../hooks/useReview';


const EditReview: React.FC = () => {
  const { reviewId: reviewIdParam } = useParams<{ reviewId: string }>();
  const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : undefined;

  // ✅ 1. reviewId로 기존 리뷰 정보를 불러옵니다.
  const { reviewData: existingReview, isLoadingReview, errorReview } = useReviewDetails(reviewId);

  // ✅ 2. 기존 리뷰에 포함된 책 ISBN을 사용하여 책 정보를 불러옵니다.
  const bookIsbn = existingReview?.book.isbn;
  const { bookData, isLoading: isLoadingBook, error: errorBook } = useBookDetailsInMyPage(bookIsbn);

  // ✅ 3. useReviewForm 훅에 existingReview 데이터를 전달합니다.
  const {
    formData,
    handleChange,
    handleRatingChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  } = useReviewForm({ bookData, existingReview });


  if (isLoadingReview || isLoadingBook) {
    return <div className="p-4 text-center">리뷰 정보 로딩 중...</div>;
  }
  if (errorReview || errorBook) {
    return <div className="p-4 text-center text-red-500">정보를 불러오는데 오류가 발생했습니다: {errorReview || errorBook}</div>;
  }
  if (!existingReview || !bookData) {
    return <div className="p-4 text-center">수정할 리뷰 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex justify-between items-start gap-4">
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
                  ratingIndex={formData.rating}
                  setRatingIndex={handleRatingChange}
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
              {isSubmitting ? '리뷰 수정 중...' : '리뷰 수정 완료'}
            </button>
          </div>
          {submitError && <p className="text-red-500 text-sm mt-4">{submitError}</p>}
          {submitSuccess && <p className="text-green-500 text-sm mt-4">리뷰가 성공적으로 수정되었습니다!</p>}
        </form>
      </div>
    </div>
  );
};

export default EditReview;