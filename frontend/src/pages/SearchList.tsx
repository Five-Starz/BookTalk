import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

// Book 인터페이스만 임포트합니다.
import type { BookApiResponse, Book } from '../types/Book';
import BookCard from '../components/ui/BookCard';

const SearchList = () => {
  const [searchParams] = useSearchParams(); // URL 쿼리 파라미터를 가져오는 훅
  const query = searchParams.get('query'); // 'query' 파라미터의 값 가져오기 (예: '자연')

  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 검색어가 없으면 (예: 그냥 /books/search 로 접근) 데이터 요청을 하지 않습니다.
    if (!query) {
      setSearchResults([]); // 검색 결과 없음으로 설정
      setIsLoading(false);
      setError("검색어를 입력해주세요.");
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null); // 이전 에러 초기화

        // 요청 URL을 동적으로 변경합니다.
        // 백엔드 URL이 'http://localhost:8000/books/search'이고 'query' 파라미터를 받는다고 가정합니다.
        const response = await axios.get<BookApiResponse>(`http://localhost:8000/books/search?query=${query}`);
        
        // API 응답 구조가 BookApiResponse { documents: Book[] } 형태임을 가정하고 처리합니다.
        setSearchResults(response.data.documents);
        console.log('검색 결과 데이터:', response.data.documents);
      } catch (err) {
        console.error('검색 결과 불러오기 에러:', err);
        setError('검색 결과를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // query 값이 변경될 때마다 데이터를 다시 불러옵니다.

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        "{query}"에 대한 책을 검색 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        오류: {error}
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="p-4 text-center">
        "{query}"에 대한 검색 결과가 없습니다.
      </div>
    );
  }
    
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">"{query}" 검색 결과</h2>
      {/* SearchList에서 그리드 컨테이너를 정의하고, BookCard는 각 그리드 아이템이 됩니다. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {searchResults.map((book) => (
        // Link 컴포넌트로 전체 카드를 감싸 클릭 시 /book/:isbn 경로로 이동
        <Link to={`/book/${book.isbn}`} className={`flex flex-col items-center p-2`}>
          <BookCard key={book.isbn} book={book} width='1/2' />
        </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchList
