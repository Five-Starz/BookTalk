import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../ui/BookCard'; // BookCard 임포트
import type { BookDetail } from '../../types/BookType'; // 타입 임포트

interface RecommendListProps {
  recommendList: BookDetail[] | null;
  isLoading: boolean;
  error: string | null;
}

const RecommendList = ({ 
  recommendList, 
  isLoading, 
  error 
}: RecommendListProps) => {

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h2 className='mb-3 md:mb-6'>이런 책은 어떠세요?</h2>
      {isLoading && <div className="text-center">추천 도서를 불러오는 중입니다...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      
      {recommendList && recommendList.length > 0 ? (
        <div className='w-full'>
          {/* 큰 화면 (md 이상): 5개 나열 */}
          <div className='justify-between gap-2 hidden md:flex'>
            {recommendList.slice(0, 5).map((book) => (
              <Link to={`/book/${book.isbn}`}
                onClick={scrollToTop}>
                <BookCard key={book.isbn} book={book} />
              </Link>
            ))}
          </div>
          {/* 작은 화면 (md 미만): 3개 나열 */}
          <div className="flex justify-between gap-2 md:hidden">
            {recommendList.slice(0, 3).map((book) => (
              <Link to={`/book/${book.isbn}`}
                onClick={scrollToTop}>
                <BookCard key={book.isbn} book={book} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        !isLoading && !error && (
          <div className="text-center">추천 도서가 없습니다.</div>
        )
      )}
    </div>
  );
};

export default RecommendList;