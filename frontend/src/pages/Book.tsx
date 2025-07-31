// BookPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

// ✨ 커스텀 훅 임포트
import { useBookDetails, useReviews, useRecommendList } from '../hooks/useBook';

import BookInfo from '../components/book/BookInfo';
import RecommendList from '../components/book/RecommendList';
import ReviewsSection from '../components/book/ReviewSection';

// BookPage는 이제 컨테이너 역할을 더욱 명확하게 수행합니다.
const Book = () => {
  const { isbn } = useParams<{ isbn: string }>();

  // ✅ 각 커스텀 훅을 호출하여 데이터, 로딩, 에러 상태를 가져옵니다.
  const { bookData, isLoading, error } = useBookDetails(isbn);
  const { reviews, isLoadingReviews, errorReviews } = useReviews(isbn);
  const { recommendList, isLoadingRecommended, errorRecommended } = useRecommendList();

  // 최상위 로딩 및 에러 처리 (책 상세 정보 로딩에 집중)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        책 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        {error}
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="flex justify-center items-center h-48">
        해당 책 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // isbn 값이 없는 경우는 useBookDetails 훅에서 이미 처리되었으므로 여기서 다시 확인할 필요는 없습니다.
  // (useBookDetails 훅의 early return 로직 때문)

  return (
    <div className='flex flex-col gap-12 md:gap-20'>
      <BookInfo book={bookData} />

      {/* ReviewsSection과 RecommendList는 이제 각 섹션의 로딩/에러/데이터 없음 상태를 스스로 처리합니다. */}
      <ReviewsSection 
        reviews={reviews} 
        isLoading={isLoadingReviews} 
        error={errorReviews} 
      />

      <RecommendList
        recommendList={recommendList} 
        isLoading={isLoadingRecommended} 
        error={errorRecommended} 
      />
    </div>
  );
};

export default Book;