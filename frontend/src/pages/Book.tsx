import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

import BookInfo from '../components/book/BookInfo'
import RecommendList from '../components/book/RecommendList'; // ✨ 새로 만들 컴포넌트
import ReviewsSection from '../components/book/ReviewSection';

import type { BookDetail } from '../types/BookType';
import type { ReviewDetail } from '../types/ReviewType'; 

const Book = () => {
  const { isbn } = useParams<{ isbn: string }>();

  // 책 데이터, 로딩 상태, 에러 상태를 관리합니다.
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 리뷰 데이터 상태 추가
  const [reviews, setReviews] = useState<ReviewDetail[] | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  // '이런 책은 어떠세요?' 섹션에 보여줄 추천 도서 목록 상태
  const [recommendedBooks, setRecommendedBooks] = useState<BookDetail[] | null>(null);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  // 컴포넌트 마운트 시 또는 isbn이 변경될 때 책 정보를 가져옵니다.
  useEffect(() => {
    if (!isbn) {
      setError("책 정보를 불러올 ISBN이 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        setError(null);    // 기존 에러 초기화
        // ✅ API 요청 URL도 함께 출력해봅니다.
        console.log('BookInfo API 호출 URL:', `http://localhost:8000/book/${isbn}`);
        const response = await axios.get(`http://localhost:8000/book/${isbn}`);
        setBookData(response.data);
        console.log('받아온 책 상세 데이터 (BookPage):', response.data);
      } catch (err) {
        console.error('책 상세 데이터 불러오기 에러 (BookPage):', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('요청하신 ISBN에 해당하는 책을 찾을 수 없습니다.');
        } else {
          setError('책 정보를 불러오는 데 실패했습니다.');
        }
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchBookDetails();
  }, [isbn]); // isbn이 변경될 때마다 useEffect를 다시 실행합니다.

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setIsLoadingRecommended(true);
        setErrorRecommended(null);
        // 백엔드에 '추천 도서'를 가져오는 API 엔드포인트가 필요합니다.
        // 예: http://localhost:8000/api/books/recommended?limit=5 (5개만 가져오는 예시)
        // 이 API가 BookApiResponse { documents: Book[] } 형태로 응답한다고 가정합니다.
        const response = await axios.get('http://localhost:8000/api/books/recommended?limit=5');
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

  // ✅ 리뷰 데이터를 불러오는 useEffect 훅 추가
  useEffect(() => {
    if (!isbn) {
      setErrorReviews("리뷰를 불러올 ISBN이 없습니다.");
      setIsLoadingReviews(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        setErrorReviews(null);

        // API 엔드포인트: /reviews/search/{isbn}
        const response = await axios.get(`http://localhost:8000/reviews/search/${isbn}`);
        
        // 백엔드 응답 형태에 따라 response.data가 바로 리뷰 배열일 수도 있고,
        // reviews: Review[] 필드 안에 있을 수도 있습니다.
        // 예를 들어 response.data.reviews라면 setReviews(response.data.reviews);
        setReviews(response.data); // 현재는 response.data가 바로 배열이라고 가정
        console.log('받아온 리뷰 데이터:', response.data);

      } catch (err) {
        console.error('리뷰 데이터 불러오기 에러:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setErrorReviews('해당 책에 대한 리뷰를 찾을 수 없습니다.');
        } else {
          setErrorReviews('리뷰를 불러오는 데 실패했습니다.');
        }
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [isbn]); // ISBN이 변경될 때마다 리뷰를 다시 불러옵니다.

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        책 정보를 불러오는 중입니다...
      </div>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        {error}
      </div>
    );
  }

  // 데이터가 없거나 로드되지 않았을 때 표시할 UI
  if (!bookData) {
    return (
      <div className="flex justify-center items-center h-48">
        해당 책 정보를 찾을 수 없습니다.
      </div>
    );
  }

    // isbn 값이 없으면 (예: /book 경로로 직접 접근) 오류 메시지를 표시하거나 리다이렉트할 수 있습니다.
  if (!isbn) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        유효한 책 정보를 찾을 수 없습니다. (ISBN 누락)
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-12 md:gap-20'>
      {/* BookInfo는 책 상세 데이터만 받아서 표시 */}
      <BookInfo book={bookData} />

      {/* ReviewsSection은 리뷰 데이터와 관련 로딩/에러 상태를 받음 */}
      <ReviewsSection 
        reviews={reviews} 
        isLoading={isLoadingReviews} 
        error={errorReviews} 
      />

      {/* RecommendedBooksSection은 추천 도서 데이터와 관련 로딩/에러 상태를 받음 */}
      <RecommendList
        recommendedBooks={recommendedBooks} 
        isLoading={isLoadingRecommended} 
        error={errorRecommended} 
      />
    </div>    
  //   <div className='flex flex-col gap-12 md:gap-20'>
  //     <BookInfo book={bookData} />
  //     <div>
  //       <div className='flex justify-between mb-3 md:mb-6'>
  //         <h2>리뷰들</h2>
  //         {/* 리뷰가 로딩 중이거나 에러 상태가 아닐 때만 '더보기' 버튼 표시 */}
  //         {!isLoadingReviews && !errorReviews && reviews && reviews.length > 0 && (
  //           <button className='text-[#999]'>더보기</button>
  //         )}
  //       </div>

  //       {/* ✅ 리뷰 로딩, 에러, 데이터 없음 UI */}
  //       {isLoadingReviews && (
  //         <div className="text-center">리뷰를 불러오는 중입니다...</div>
  //       )}
  //       {errorReviews && (
  //         <div className="text-center text-red-500">{errorReviews}</div>
  //       )}
  //       {!isLoadingReviews && !errorReviews && (!reviews || reviews.length === 0) && (
  //         <div className="text-center">이 책에 대한 리뷰가 아직 없습니다.</div>
  //       )}

  //       {/* ✅ 리뷰 데이터가 있을 때만 ReviewCard 렌더링 */}
  //       {reviews && reviews.length > 0 && (
  //         <>
  //           <div className='hidden justify-between flex-wrap gap-2 lg:flex'>
  //             {/* ReviewCard에 실제 리뷰 데이터와 고유 key 전달 */}
  //             {/* 예를 들어, 처음 6개의 리뷰만 표시 */}
  //             {reviews.slice(0, 6).map(review => (
  //               <ReviewCard key={review.id} review={review} width='[calc(33.3%-6px)]' />
  //             ))}
  //           </div>
  //           <div className='hidden justify-between flex-wrap gap-2 sm:flex lg:hidden'>
  //             {reviews.slice(0, 4).map(review => (
  //               <ReviewCard key={review.id} review={review} width='[calc(50%-4px)]' />
  //             ))}
  //           </div>
  //           <div className='block justify-between flex-wrap gap-2 sm:hidden'>
  //             {reviews.slice(0, 1).map(review => ( // 작은 화면에서는 1개만
  //               <ReviewCard key={review.id} review={review} width='[calc(100%)]' />
  //             ))}
  //           </div>
  //         </>
  //       )}
  //     </div>
  //     <div>
  //       <h2 className='mb-3 md:mb-6'>이런 책은 어떠세요?</h2>
  //       {isLoadingRecommended && <div className="text-center">추천 도서를 불러오는 중입니다...</div>}
  //       {errorRecommended && <div className="text-center text-red-500">{errorRecommended}</div>}
        
  //       {/* recommendedBooks가 유효하고 비어있지 않을 때만 렌더링 */}
  //       {recommendedBooks && recommendedBooks.length > 0 ? (
  //         <>
  //           {/* 큰 화면 (md 이상): 5개 나열 */}
  //           <div className='justify-between gap-2 hidden md:flex'>
  //             {recommendedBooks.slice(0, 5).map((book) => ( // 최대 5개만 렌더링
  //               <BookCard key={book.isbn} book={book} width='1/5' />
  //             ))}
  //           </div>
  //           {/* 작은 화면 (md 미만): 3개 나열 */}
  //           <div className="flex justify-between gap-2 md:hidden">
  //             {recommendedBooks.slice(0, 3).map((book) => ( // 최대 3개만 렌더링
  //               <BookCard key={book.isbn} book={book} width='1/3' />
  //             ))}
  //           </div>
  //         </>
  //       ) : (
  //         !isLoadingRecommended && !errorRecommended && (
  //           <div className="text-center">추천 도서가 없습니다.</div>
  //         )
  //       )}
  //     </div>
  //   </div>
  )
}

export default Book;
