// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import ReviewRepository from '../repositories/review-repository'
import BookRepository from '../repositories/book-repository'
const reviewRepository = new ReviewRepository();
const bookRepository = new BookRepository();

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
    // 0. 이미 존재하는 리뷰인지 체크
    if (await reviewRepository.hasReviewByUser(data.userId,data.isbn)) {
      throw new Error('[review-service error]이미 해당 도서에 리뷰를 작성하셨습니다.');
    };
    // 1. 책정보가 Books테이블에 없다면 DB에 저장
    await bookRepository.ensureBookExists(data);

    // 2. 리뷰 등록
    return await reviewRepository.createReview({
      isbn: data.isbn,
      rating: data.rating,
      content: data.content,
      userId: data.userId,
    });
  }

  // 2. 특정 책의 전체 리뷰 조회
  async searchReviewsByBook(data: {
    isbn: string;
    title: string;
    authors: string;
    publishedYear: number;
  }) {
    // 1. 책 정보로 리뷰조회할 대상 책 조회
    const book = await bookRepository.getBookInfo(data.isbn);

    // 2. 대상 책의 ISBN으로 쓰여진 리뷰 조회
    return await reviewRepository.searchReviewsByISBN(data.isbn);
  }
}
export default ReviewService