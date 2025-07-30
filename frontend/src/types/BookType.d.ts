// 단일 책 객체 인터페이스
export interface BookDetail {
  authors: string | string[];
  description: string;
  publishedYear: number | string;
  isbn: string;
  publisher: string;
  thumbnail: string;
  title: string;
}

// API 응답 전체 인터페이스 (documents 배열을 포함)
export interface BookApiResponse {
  books: BookDetail[];
  // API 응답에 페이지네이션 정보 등이 있다면 여기에 추가하세요.
  // 예를 들어, meta: { total_count: number; pageable_count: number; is_end: boolean; };
}

export interface BookCardProps {
  book: BookDetail; // 책 데이터 전체를 받을 prop 추가
  width: string; // '1/3', 'full', '80', 'px-10' 등 Tailwind 클래스 문자열을 받음
}