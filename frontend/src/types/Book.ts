// 단일 책 객체 인터페이스
export interface Book {
  authors: string[]; // API 응답에서 authors가 string[]으로 오는 것으로 보임
  contents: string;
  datetime: string;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
  // 필요한 경우 여기에 추가 필드를 정의하세요.
}

// API 응답 전체 인터페이스 (documents 배열을 포함)
export interface BookApiResponse {
  documents: Book[];
  // API 응답에 페이지네이션 정보 등이 있다면 여기에 추가하세요.
  // 예를 들어, meta: { total_count: number; pageable_count: number; is_end: boolean; };
}

// Home 컴포넌트 Props 인터페이스
// App.tsx에서 Home 컴포넌트로 전달되는 props의 타입을 정의
export interface HomeProps {
  apiData: BookApiResponse | null;
  isLoading: boolean;
  error: string | null;
}