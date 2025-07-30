import React, {useState, useEffect} from 'react'
import axios from 'axios';

import BookInfo from '../components/BookInfo'
import BookCard from '../components/ui/BookCard'
import ReviewCard from '../components/ui/ReviewCard'

import type { BookApiResponse, Book } from '../types/Book';

const Book = () => {
  // '이런 책은 어떠세요?' 섹션에 보여줄 추천 도서 목록 상태
  const [recommendedBooks, setRecommendedBooks] = useState<Book[] | null>(null);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setIsLoadingRecommended(true);
        setErrorRecommended(null);
        // 백엔드에 '추천 도서'를 가져오는 API 엔드포인트가 필요합니다.
        // 예: http://localhost:8000/api/books/recommended?limit=5 (5개만 가져오는 예시)
        // 이 API가 BookApiResponse { documents: Book[] } 형태로 응답한다고 가정합니다.
        const response = await axios.get<BookApiResponse>('http://localhost:8000/api/books/recommended?limit=5');
        setRecommendedBooks(response.data.documents);
        console.log('추천 도서 데이터:', response.data.documents);
      } catch (err) {
        console.error('추천 도서 불러오기 에러:', err);
        setErrorRecommended('추천 도서를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedBooks();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // TODO: 리뷰 데이터도 여기서 불러와야 한다면 유사하게 useEffect와 state 추가

  return (
    <div className='flex flex-col gap-12 md:gap-20'>
      <BookInfo />
      <div>
        <div className='flex justify-between mb-3 md:mb-6'>
          <h2>리뷰들</h2>
          <button className='text-[#999]'>더보기</button>
        </div>
        <div className='hidden justify-between flex-wrap gap-2 lg:flex'>
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
        </div>
        <div className='hidden justify-between flex-wrap gap-2 sm:flex lg:hidden'>
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
        </div>
        <div className='block justify-between flex-wrap gap-2 sm:hidden'>
          <ReviewCard width='[calc(100%)]' />
        </div>
      </div>
      <div>
        <h2 className='mb-3 md:mb-6'>이런 책은 어떠세요?</h2>
        {isLoadingRecommended && <div className="text-center">추천 도서를 불러오는 중입니다...</div>}
        {errorRecommended && <div className="text-center text-red-500">{errorRecommended}</div>}
        
        {/* recommendedBooks가 유효하고 비어있지 않을 때만 렌더링 */}
        {recommendedBooks && recommendedBooks.length > 0 ? (
          <>
            {/* 큰 화면 (md 이상): 5개 나열 */}
            <div className='justify-between gap-2 hidden md:flex'>
              {recommendedBooks.slice(0, 5).map((book) => ( // 최대 5개만 렌더링
                <BookCard key={book.isbn} book={book} width='1/5' />
              ))}
            </div>
            {/* 작은 화면 (md 미만): 3개 나열 */}
            <div className="flex justify-between gap-2 md:hidden">
              {recommendedBooks.slice(0, 3).map((book) => ( // 최대 3개만 렌더링
                <BookCard key={book.isbn} book={book} width='1/3' />
              ))}
            </div>
          </>
        ) : (
          !isLoadingRecommended && !errorRecommended && (
            <div className="text-center">추천 도서가 없습니다.</div>
          )
        )}
      </div>
    </div>
  )
}

export default Book
