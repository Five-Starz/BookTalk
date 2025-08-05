import { BookDetail } from "./BookType";

// 리뷰 구현 관련 데이터
export interface ReviewDetail {
  book: BookDetail;
  reviewId: number;
  rating: number;
  content: string;
  userId: number;
  commentCount: number;
  isbn: string;
  likeCount:number;
}

export interface ReviewCardProps {
  review: ReviewDetail; // Review 객체를 prop으로 받습니다.
}

export interface ReviewsSectionProps {
  reviews: ReviewDetail[] | null;
  isLoading: boolean;
  error: string | null;
  bookData: BookDetail | null; //
}


// 리뷰 작성 관련 데이터
export interface UseReviewFormProps {
  initialIsbn?: string; // 초기 ISBN (useParams에서 가져온 값)
  bookData: BookDetail | null; // useBookDetails 훅에서 가져온 책 데이터
  userId: number; // 현재 로그인한 유저 아이디
}

export interface UseReviewFormResult {
  formData: ReviewSubmitData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRatingChange: (newRating: number) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export interface ReviewSubmitData {
  isbn: string;
  title: string;
  authors: string | string[];
  publisher: string;
  publishedYear: number;
  thumbnail: string;
  description: string;
  rating: number;
  content: string;
  userId: number;
}


// 리뷰 수정 관련 데이터
export interface UseEditReviewFormProps {
  existingReview: ReviewDetail | null;
  userId: number;
}

export interface UseEditReviewFormResult {
  formData: { // 수정 폼은 rating과 content만 관리
    rating: number;
    content: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRatingChange: (newRating: number) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export interface ReviewEditedData {
  rating: number;
  content: string;
  userId: number;
}