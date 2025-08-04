import { useState, useEffect } from 'react';
import axios, { type AxiosResponse } from 'axios';
import type { BookDetail } from '../types/BookType';
import type { ReviewDetail } from '../types/ReviewType';
import { decodeHtml } from '../utils/decodeHtml';

interface UseBookDetailsResult {
  bookData: BookDetail | null;
  isLoading: boolean;
  error: string | null;
}

export const useBookDetails = (isbn: string | undefined): UseBookDetailsResult => {
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn) {
      setError("책 정보를 불러올 ISBN이 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setError(null);
        const bookmarkcount = await axios.post(`http://localhost:8000/bookmarks/count`, {
          isbn: isbn
        });
        const bookrating = `http://localhost:8000/books/averageRating/${isbn}`; 
        const responeRating=await axios.get(bookrating);
        // ✅ API 요청 URL을 /books/search?query={isbn}으로 변경
        const requestUrl = `http://localhost:8000/books/search?query=${isbn}`; 

        // ✅ 응답이 배열 형태임을 가정하고 제네릭 타입 설정
        const response = await axios.get<BookDetail[]>(requestUrl);
        console.log(response)
        
        // 검색 결과가 배열로 오므로, 첫 번째 책을 사용
        if (response.data && response.data.length > 0) {
          const rawBook = response.data[0];

          // ✅ API 응답의 문자열 데이터를 setBookData에 저장하기 전에 디코딩
          const decodedBook: BookDetail = {
            ...rawBook,
            title: `${decodeHtml(rawBook.title)}`,
            description: `${decodeHtml(rawBook.description)}`,
            authors: `${Array.isArray(rawBook.authors)
              ? rawBook.authors.map(author => decodeHtml(author))
              : decodeHtml(rawBook.authors)}`,              
            bookmarkCount:bookmarkcount.data,   
            total_rating:parseInt(responeRating.data.avgRating,10),
          };

          setBookData(decodedBook);
        } else {
          // 검색 결과가 없으면 에러 처리
          setBookData(null);
          setError('요청하신 ISBN에 해당하는 책을 찾을 수 없습니다.');
          setIsLoading(false);
        }
        setIsLoading(true);
        
      } catch (err) {
        console.error('useBookDetails.ts: API 요청 에러 발생:', err);
        if (axios.isAxiosError(err)) {
          console.error('useBookDetails.ts: Axios 에러 응답:', err.response);
          setError(`책 정보를 불러오는 데 실패했습니다: ${err.response?.status} - ${err.response?.data?.message || '알 수 없는 오류'}`);
          setIsLoading(false);
        } else {
          setError('책 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.');
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  return { bookData, isLoading, error };
};

interface UseRecommendListResult {
  recommendList: BookDetail[] | null;
  isLoadingRecommended: boolean;
  errorRecommended: string | null;
}

export const useRecommendList = (): UseRecommendListResult => {
  const [recommendList, setRecommendList] = useState<BookDetail[] | null>(null);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(false);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendList = async () => {
      try {
        setErrorRecommended(null);
        const response = await axios.get('http://localhost:8000/books/random');
        // 백엔드 응답이 `documents` 필드 안에 배열을 주는 경우
        setRecommendList(response.data.documents || []);
        setIsLoadingRecommended(true);
      } catch (err) {
        console.error('추천 도서 불러오기 에러 (useRecommendList):', err);
        setErrorRecommended('추천 도서를 불러오는 데 실패했습니다.');
        setIsLoadingRecommended(false);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendList();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return { recommendList, isLoadingRecommended, errorRecommended };
};




export interface UseReviewsResult {
  reviews: ReviewDetail[] | null;
  isLoadingReviews: boolean;
  errorReviews: string | null;
}

export const useReviews = (isbn: string | undefined): UseReviewsResult => {
  const [reviews, setReviews] = useState<ReviewDetail[] | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);
  useEffect(() => {
    if (!isbn) {
      setErrorReviews("리뷰를 불러올 ISBN이 없습니다.");
      setIsLoadingReviews(false);
      console.log('useReviews: ISBN이 없어 조기 반환');
      return;
    }

    const fetchReviews = async () => {
      try {
        setErrorReviews(null);

        const requestUrl = `http://localhost:8000/reviews/search/{isbn}?isbn=${isbn}`;
        const response = await axios.get(requestUrl);
        setIsLoadingReviews(true);

        let responseCount:AxiosResponse<number>;
        let requestUrl2:string
        let responseComment:AxiosResponse<number>
        for(let i=0;i<response.data.length;i++){
          responseCount = await axios.post(`http://localhost:8000/likes/count`, {
           reviewId: `${response.data[i].reviewId}`
          });
          response.data[i].rating=responseCount.data;
          requestUrl2=`http://localhost:8000/comment/review/count/${response.data[i].reviewId}`;
          responseComment=await axios.get(requestUrl2);
          response.data[i].commentCount=responseComment.data;
        }
        setReviews(response.data);

      } catch (err) {
        console.error('리뷰 데이터 불러오기 에러 (useReviews):', err);
        if (axios.isAxiosError(err)) {
          // ✅ Axios 에러 응답 상세 확인
          console.error('useReviews: Axios 에러 응답:', err.response); 
          // 400 에러 처리 추가
          if (err.response?.status === 400) {
            setErrorReviews(`리뷰 요청이 유효하지 않습니다: ${err.response?.data?.message || '잘못된 요청'}`);
          } else if (err.response?.status === 404) {
            // 이 경우 404 에러 메시지가 잘 나올 것입니다.
            setErrorReviews('해당 책에 대한 리뷰를 찾을 수 없습니다.'); 
          } else {
            setErrorReviews('리뷰를 불러오는 데 실패했습니다.');
          }
        } else {
          setErrorReviews('리뷰를 불러오는 중 알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoadingReviews(false);
        console.log('useReviews: 로딩 종료');
      }
    };

    fetchReviews();
  }, [isbn]);

  return { reviews, isLoadingReviews, errorReviews };
};