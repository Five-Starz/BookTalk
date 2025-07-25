// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import ReviewRepository from '../repositories/review-repository'
const reviewRepository = new ReviewRepository();

class ReviewService {
  // 1. 리뷰 생성
  async createReview(data: {
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
  }) {
    // 1. 책정보가 Books테이블에 없다면 DB에 저장
    await reviewRepository.ensureBookExists(data);

    // 2. 리뷰 등록
    return await reviewRepository.createReview({
      isbn: data.isbn,
      rating: data.rating,
      content: data.content,
      userId: data.userId,
    });
  }
}
export default ReviewService