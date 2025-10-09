// 단일 책 객체 인터페이스
export interface BookDetail {
  authors: string | string[];
  description: string;
  publishedYear: number;
  isbn: string;
  publisher: string;
  thumbnail: string;
  title: string;
  total_rating: number;
  bookmarkCount: number;
  rank: number;
}

// API 응답 전체 인터페이스 (documents 배열을 포함)
export interface BookApiResponse {
  books: BookDetail[];
}

export interface BookCardProps {
  book: BookDetail; // 책 데이터 전체를 받을 prop 추가
 // '1/3', 'full', '80', 'px-10' 등 Tailwind 클래스 문자열을 받음
}