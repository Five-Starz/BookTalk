import { BookDetail } from "./BookType";

export interface ReviewDetail {
  book: BookDetail;
  reviewId: string;
  rating: number;
  content: string;
  userId: number;
}

interface UseReviewFormProps {
  initialIsbn: string; // 초기 ISBN (useParams에서 가져온 값)
  bookData: BookDetail | null; // useBookDetails 훅에서 가져온 책 데이터
}

interface UseReviewFormResult {
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
  authors: string;
  publisher: string;
  publishedYear: number;
  thumbnail: string;
  description: string;
  rating: number;
  content: string;
}

interface ReviewCardProps {
  review: ReviewDetail; // Review 객체를 prop으로 받습니다.
  width: string; // Tailwind CSS width 클래스를 받습니다.
}

interface ReviewsSectionProps {
  reviews: ReviewDetail[] | null;
  isLoading: boolean;
  error: string | null;
  bookData: BookDetail | null; //
}