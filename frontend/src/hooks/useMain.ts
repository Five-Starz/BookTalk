import { useState, useEffect } from 'react';
import axios from 'axios';
import type { BookDetail, BookApiResponse } from '../types/BookType';
import type { ReviewDetail } from '../types/ReviewType';
import type { UseReviewsResult } from '../hooks/useBook';
import { decodeHtml } from '../utils/decodeHtml';

export const useMainReviews = (listType: string): UseReviewsResult => {
  const [reviews, setReviews] = useState<ReviewDetail[] | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {       
        const response = await axios.get(`http://localhost:8000/main/reviews/${listType}`);
        setIsLoadingReviews(true);
        const reviewData = response.data.reviews;
        const fetchedReviews = Array.isArray(reviewData) ? reviewData : [reviewData];

        if (fetchedReviews.length > 0) {
          const bookOfReview = await Promise.all(
            fetchedReviews.map(async (review) => {
              const bookResponse = await axios.get<BookDetail>(`http://localhost:8000/books/info/${review.isbn}`);
              return {
                ...review,
                book: bookResponse.data
              };
            })
          );
          setReviews(bookOfReview);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('리뷰 데이터 불러오기 에러 (useReviews):', err);
        if (axios.isAxiosError(err)) {
          // 에러 메시지를 좀 더 명확하게 수정합니다.
          const status = err.response?.status;
          if (status === 404) {
            setErrorReviews('인기 리뷰를 찾을 수 없습니다.'); 
          } else {
            setErrorReviews('리뷰를 불러오는 데 실패했습니다.');
          }
          setIsLoadingReviews(false);
        } else {
          setErrorReviews('리뷰를 불러오는 중 알 수 없는 오류가 발생했습니다.');
          setIsLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [listType]);

  return { reviews, isLoadingReviews, errorReviews };
};

export const use10List = (listType: string) => {
  const [apiData, setApiData] = useState<BookApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BookApiResponse>(`http://localhost:8000/main/books/${listType}`);
        const rawBooks = response.data.books;
        
        // ✅ 배열의 각 책 정보를 순회하며 필요한 필드를 디코딩
        const decodedBooks = rawBooks.map(book => ({
            ...book,
            title: `${decodeHtml(book.title)}`,
            description: `${decodeHtml(book.description)}`,
        }));

        // ✅ 디코딩된 데이터로 상태 업데이트
        setApiData({ books: decodedBooks });
        setIsLoading(true);
      } catch (err) {
        switch(listType){
          case 'want': setError('북마크 조회 중 오류 발생');
            break;
          case 'good': setError('평점순 조회 중 오류 발생');
            break;
        }
        console.error(`${listType} API 에러:`, err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [listType]);

  return { apiData, isLoading, error };
}