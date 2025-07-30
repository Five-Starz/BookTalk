// src/hooks/useRecommendList.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { BookDetail } from '../types/BookType'; // BookDetail 타입 경로에 맞게 수정

interface UseRecommendListResult {
  recommendList: BookDetail[] | null;
  isLoadingRecommended: boolean;
  errorRecommended: string | null;
}

export const useRecommendList = (): UseRecommendListResult => {
  const [recommendList, setRecommendList] = useState<BookDetail[] | null>(null);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState<boolean>(true);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendList = async () => {
      try {
        setIsLoadingRecommended(true);
        setErrorRecommended(null);
        const response = await axios.get('http://localhost:8000/api/books/recommended?limit=5');
        // 백엔드 응답이 `documents` 필드 안에 배열을 주는 경우
        setRecommendList(response.data.documents || []); 
      } catch (err) {
        console.error('추천 도서 불러오기 에러 (useRecommendList):', err);
        setErrorRecommended('추천 도서를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendList();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return { recommendList, isLoadingRecommended, errorRecommended };
};