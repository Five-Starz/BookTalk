// BookPage.tsx
import { useParams } from 'react-router-dom';

// ✨ 커스텀 훅 임포트
import { useBookDetails, useReviews, useRecommendList } from '../hooks/useBook';

import BookInfo from '../components/book/BookInfo';
import RecommendList from '../components/book/RecommendList';
import ReviewsSection from '../components/book/ReviewSection';

import Skeleton from 'react-loading-skeleton';

// BookPage는 이제 컨테이너 역할을 더욱 명확하게 수행합니다.
const Book = () => {
  const { isbn } = useParams<{ isbn: string }>();

  // ✅ 각 커스텀 훅을 호출하여 데이터, 로딩, 에러 상태를 가져옵니다.
  const { bookData, isLoading, error } = useBookDetails(isbn);
  const { reviews, isLoadingReviews, errorReviews } = useReviews(isbn);
  const { recommendList, isLoadingRecommended, errorRecommended } = useRecommendList(isbn);

  // 최상위 로딩 및 에러 처리 (책 상세 정보 로딩에 집중)
  if (isLoading) {
    return <Skeleton />
    // return (
    //   <div className="flex justify-center items-center h-48">
    //     책 정보를 불러오는 중입니다...
    //   </div>
    // );
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
        책 정보를 불러오는 중입니다...
      </div>
    );
  }

  // isbn 값이 없는 경우는 useBookDetails 훅에서 이미 처리되었으므로 여기서 다시 확인할 필요는 없습니다.
  // (useBookDetails 훅의 early return 로직 때문)
  return (
    <div className='pt-[105px] pb-[10%] md:pb-[200px]'>
      <div className='flex flex-col gap-12 md:gap-20'>
        <BookInfo book={bookData} />

        {/* ReviewsSection과 RecommendList는 이제 각 섹션의 로딩/에러/데이터 없음 상태를 스스로 처리합니다. */}
        {errorReviews ?

          <div className="flex justify-center items-center h-48">
            리뷰가 존재하지 않습니다.
          </div> :

          <ReviewsSection
            reviews={reviews}
            isLoading={isLoadingReviews}
            error={errorReviews}
            bookData={bookData} // ✅ 부모 컴포넌트에서 bookData를 직접 전달
          />
        }
        <RecommendList
          recommendList={recommendList}
          isLoading={isLoadingRecommended}
          error={errorRecommended}
        />
      </div>
    </div>
  );
};

export default Book;