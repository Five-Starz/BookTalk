import { BookDetail } from "./BookType";

export interface ReviewDetail {
  book: BookDetail;
  id: string;
  rating: number;
  content: string;
  userId: number;
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
}