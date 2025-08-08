import { useState, useEffect } from 'react';
import axios from 'axios'; // type AxiosResponse
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
      let averageRating = 0;
      try {
        setIsLoading(true)
        setError(null);
        const bookmarkcount = await axios.post(`https://booktalk-server.onrender.com/bookmarks/count`, {
          isbn: isbn
        });
        const bookrating = `https://booktalk-server.onrender.com/books/averageRating/${isbn}`;

        try {
          const responseRating=await axios.get(bookrating);
          averageRating=parseInt(responseRating.data.avgRating, 10);
        } catch (ratingError) {
          // axios 에러인지 확인
          if (axios.isAxiosError(ratingError) && ratingError.response) {
            // 백엔드가 400 상태 코드와 특정 메시지를 보낼 경우
            if (ratingError.response.status === 400 &&
                ratingError.response.data?.message === '평점을 계산하기 위해서는 더 많은 리뷰가 필요합니다.') {
              console.warn(`[useBookDetails] ${isbn} 책에 대한 평점 부족 에러 감지. 평점을 0으로 설정합니다.`);
              averageRating = 0; // 에러 발생 시 0으로 설정
            } else {
              // 다른 종류의 400 에러이거나 다른 HTTP 에러일 경우
              console.error(`[useBookDetails] 평점 API 호출 중 예상치 못한 에러:`, ratingError.response);
              // 이 에러는 여기서 잡지만, 전체 프로세스를 중단시키지 않고 default 0을 사용
              averageRating = 0; // 또는 -1 등 다른 기본값
            }
          } else {
            // Axios 에러가 아닌 다른 종류의 에러 (네트워크 문제 등)
            console.error(`[useBookDetails] 평점 API 호출 중 알 수 없는 에러:`, ratingError);
            averageRating = 0; // 역시 0으로 처리하고 진행
          }
        }

        // ✅ API 요청 URL을 /books/search?query={isbn}으로 변경
        const requestUrl = `https://booktalk-server.onrender.com/books/search?query=${isbn}`;

        // ✅ 응답이 배열 형태임을 가정하고 제네릭 타입 설정
        const response = await axios.get<BookDetail[]>(requestUrl);

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
            total_rating:averageRating,
          };

          setBookData(decodedBook);
        } else {
          // 검색 결과가 없으면 에러 처리
          setBookData(null);
          setError('요청하신 ISBN에 해당하는 책을 찾을 수 없습니다.');
        }

      } catch (err) {
        console.error('useBookDetails.ts: API 요청 에러 발생:', err);
        if (axios.isAxiosError(err)) {
          console.error('useBookDetails.ts: Axios 에러 응답:', err.response);
          setError(`책 정보를 불러오는 데 실패했습니다: ${err.response?.status} - ${err.response?.data?.message || '알 수 없는 오류'}`);
        } else {
          setError('책 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  return { bookData, isLoading, error };
};

export const useBookDetailsInMyPage = (isbn: string | undefined): UseBookDetailsResult => {
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn) {
      // ISBN이 없으면 에러 처리 후 함수 종료
      setError("책 정보를 불러올 ISBN이 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);
      setBookData(null);

      try {
        const response = await axios.get<BookDetail>(`https://booktalk-server.onrender.com/books/info/${isbn}`);

        if (response.data) {
          const book = response.data;

          const decodedBook: BookDetail = {
            ...book,
            title: `${decodeHtml(book.title)}`,
            description: `${decodeHtml(book.description)}`,
            authors: `${Array.isArray(book.authors)
              ? book.authors.map(author => decodeHtml(author))
              : decodeHtml(book.authors)}`,
            // 기존 API 응답에 없는 값은 기본값으로 설정
            bookmarkCount: 0,
            total_rating: 0,
          };

          setBookData(decodedBook);
          setIsLoading(false);
        } else {
          setBookData(null);
          setError('요청하신 ISBN에 해당하는 책을 찾을 수 없습니다.');
          setIsLoading(false);
        }

      } catch (err) {
        console.error('useBookDetailsInMyPage.ts: API 요청 에러 발생:', err);
        setError('책 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.');
        setBookData(null);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]); // ISBN이 변경될 때마다 훅을 다시 실행

  return { bookData, isLoading, error };
};

interface UseRecommendListResult {
  recommendList: BookDetail[] | null;
  isLoadingRecommended: boolean;
  errorRecommended: string | null;
}

export const useRecommendList = (isbn: string | undefined): UseRecommendListResult => {
  const [recommendList, setRecommendList] = useState<BookDetail[] | null>(null);
  const [isLoadingRecommended, setIsLoading] = useState<boolean>(false);
  const [errorRecommended, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ isbn이 없을 경우 API 호출을 막는 가드 절
    if (!isbn) {
      return;
    }

    const fetchRecommendList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // axios.get의 제네릭 타입을 명시하여 응답 데이터의 타입을 명확히 합니다.
        // 백엔드가 BookDetail[]을 직접 반환한다고 가정합니다.
        const response = await axios.get<BookDetail[]>(`https://booktalk-server.onrender.com/books/random`);

        setRecommendList(response.data);
      } catch (err) {
        // Axios 에러 처리 강화: Hot10에서 했던 것처럼 상세 에러 메시지 로깅
        if (axios.isAxiosError(err)) {
          // 서버에서 보낸 에러 응답 데이터를 콘솔에 출력
          console.error('검색 결과 불러오기 실패 (Axios 에러):', err.response?.data || err.message);
          // 사용자에게 더 친절한 에러 메시지
          setError(`검색 결과를 불러오는 데 실패했습니다: ${err.response?.status} ${err.response?.statusText || ''} - ${err.response?.data?.message || '알 수 없는 서버 오류'}`);
        } else {
          console.error('검색 결과 불러오기 실패 (알 수 없는 에러):', err);
          setError('검색 결과를 불러오는 중 알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendList();
  }, [isbn]);

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
      return;
    }

    const fetchReviews = async () => {
      try {
        setErrorReviews(null);

        const requestUrl4 = `https://booktalk-server.onrender.com/reviews/search2/{isbn}?isbn=${isbn}`;
        const response4 = await axios.get(requestUrl4);
        setIsLoadingReviews(true);
        setReviews(response4.data);
        // const requestUrl = `https://booktalk-server.onrender.com/reviews/search/{isbn}?isbn=${isbn}`;
        // const response = await axios.get(requestUrl);
        // setIsLoadingReviews(true);

        // let responseCount:AxiosResponse<number>;
        // let requestUrl2:string
        // let responseComment:AxiosResponse<number>
        // for(let i=0;i<response.data.length;i++){
        //   responseCount = await axios.post(`https://booktalk-server.onrender.com/likes/count`, {
        //    reviewId: `${response.data[i].reviewId}`
        //   });
        //   response.data[i].likeCount=responseCount.data;
        //   requestUrl2=`https://booktalk-server.onrender.com/comment/review/count/${response.data[i].reviewId}`;
        //   responseComment=await axios.get(requestUrl2);
        //   response.data[i].commentCount=responseComment.data;
        // }
        // setReviews(response.data);

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
      }
    };

    fetchReviews();
  }, [isbn]);

  return { reviews, isLoadingReviews, errorReviews };
};