import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { getPrimaryIsbn } from '../utils/getPrimaryIsbn';

import type { BookDetail } from '../types/BookType';
import BookCard from '../components/ui/BookCard';

const SearchList = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  // searchResults의 초기값을 null이 아닌 빈 배열로 변경 (Hot10과 동일하게)
  const [searchResults, setSearchResults] = useState<BookDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pagination 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ✅ 페이지네이션 처리
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const pagedSearchResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

   // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 페이지 바뀔 때 맨 위로 스크롤 (선택)
  };

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      setError("검색어를 입력해주세요.");
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // axios.get의 제네릭 타입을 명시하여 응답 데이터의 타입을 명확히 합니다.
        // 백엔드가 BookDetail[]을 직접 반환한다고 가정합니다.
        const response = await axios.get<BookDetail[]>(`http://localhost:8000/books/search?query=${query}`);

        // 응답 데이터가 바로 BookDetail[] 배열이라고 가정하고 설정
        setSearchResults(response.data);
        // console.log('검색 결과 데이터:', response.data);

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

    fetchSearchResults();
  }, [query]);

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

  // searchResults는 항상 배열이므로, 단순히 length로 확인
  if (searchResults.length === 0) {
    return (
      <div className="p-4 text-center">
        "{query}"에 대한 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="pt-[105px] pb-[10%] md:pb-[200px]">
      <h2 className="text-2xl font-bold mb-4">"{query}" 검색 결과</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {pagedSearchResults.map((book) => {
          const finalIsbn = getPrimaryIsbn(book.isbn);

          return (
            <Link
              key={finalIsbn}
              to={`/book/${finalIsbn}`}
              className={`flex flex-col items-center p-2`}
            >
              <BookCard book={book} />
            </Link>
          );
        })}
      </div>
       {/* ✅ 페이지네이션 */}
      <div className="flex justify-center mt-8">
        <ul className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <li
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`cursor-pointer px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "text-orange-600 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SearchList