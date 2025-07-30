export interface ReviewDetail {
  id: string;
  // isbn: string;
  // title: string;
  // authors: string | string[];
  // publisher: string;
  // publishedYear: number;
  // thumbnail: string;
  // description: string;
  rating: number;
  content: string;
  userId: number;
}

interface ReviewCardProps {
  review: ReviewDetail; // Review 객체를 prop으로 받습니다.
  width: string; // Tailwind CSS width 클래스를 받습니다.
}