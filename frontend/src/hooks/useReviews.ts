// src/hooks/useReviews.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ReviewDetail } from '../types/ReviewType'; // ReviewDetail 타입 경로에 맞게 수정

interface UseReviewsResult {
  reviews: ReviewDetail[] | null;
  isLoadingReviews: boolean;
  errorReviews: string | null;
}

export const useReviews = (isbn: string | undefined): UseReviewsResult => {
const [reviews, setReviews] = useState<ReviewDetail[] | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  useEffect(() => {
    console.log('useReviews: 훅에 전달된 ISBN:', isbn); // ✅ 훅에 전달된 ISBN 확인

    if (!isbn) {
      setErrorReviews("리뷰를 불러올 ISBN이 없습니다.");
      setIsLoadingReviews(false);
      console.log('useReviews: ISBN이 없어 조기 반환');
      return;
    }

    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        setErrorReviews(null);

        const requestUrl = `http://localhost:8000/reviews/search/${isbn}`;
        console.log('useReviews: API 요청 URL:', requestUrl); // ✅ 실제 요청 URL 확인

        const response = await axios.get(requestUrl);
        console.log('useReviews: API 응답 데이터:', response.data); // ✅ 성공 시 응답 데이터 확인

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