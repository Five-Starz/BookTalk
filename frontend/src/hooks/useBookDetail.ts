import { useState, useEffect } from 'react';
import axios from 'axios';
import type { BookDetail } from '../types/BookType';

interface UseBookDetailsResult {
  bookData: BookDetail | null;
  isLoading: boolean;
  error: string | null;
}

export const useBookDetails = (isbn: string | undefined): UseBookDetailsResult => {
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn) {
      setError("책 정보를 불러올 ISBN이 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ API 요청 URL을 /books/search?query={isbn}으로 변경
        const requestUrl = `http://localhost:8000/books/search?query=${isbn}`; 
        console.log('useBookDetails.ts: API 요청 URL:', requestUrl);

        // ✅ 응답이 배열 형태임을 가정하고 제네릭 타입 설정
        const response = await axios.get<BookDetail[]>(requestUrl); 
        
        // 검색 결과가 배열로 오므로, 첫 번째 책을 사용
        if (response.data && response.data.length > 0) {
          setBookData(response.data[0]); // ✅ 배열의 첫 번째 요소 사용
          console.log('useBookDetails.ts: API 응답 데이터 (첫 번째 책):', response.data[0]);
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