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
    // 1. 책정보가 Books테이블에 없다면 DB에 저장 -> 잘라낸 isbn-13 받아옴
    const slicedISBN = await bookRepository.ensureBookExists(data);

    // 2. 리뷰 등록
    return await reviewRepository.createReview({
      isbn: slicedISBN, // 잘라낸 isbn-13으로 제대로 리뷰등록
      rating: data.rating,
      content: data.content,
      userId: data.userId,
    });
  }

  // 2. 특정 책의 전체 리뷰 조회
  async searchReviewsByBook(data: {
    isbn: string;
  }) {
    // 1. 책 정보로 리뷰조회할 대상 책 조회
    const book = await bookRepository.getBookInfo(data.isbn);

    // 2. 대상 책의 ISBN으로 쓰여진 리뷰 조회
    return await reviewRepository.searchReviewsByISBN(data.isbn);
  }

  // 3.리뷰 수정
  async updateReview(data: {
    isbn: string;
    rating: number;
    content: string;
    userId: number;
  }) {
    // 0. 이미 존재하는 리뷰인지 체크
    const existing = await reviewRepository.hasReviewByUser(data.userId, data.isbn);
    console.log(`review-service.ts/updateReview().existing : ${existing}`);   // true
    if (!existing) {
      throw new Error('[review-service error] 사용자가 해당 책에 작성한 리뷰가 존재하지 않습니다.');
    };

    // 1. 특정 사용자의 특정 책 reviewId 가져오기
    const reviewId = await reviewRepository.getReviewIdByUserIdAndISBN(data.userId, data.isbn);
    if (reviewId == undefined) {
      throw new Error('[review-service error] 사용자가 해당 책에 작성한 reviewId를 가져올 수 없습니다.')
    };

    // 2. 리뷰 수정
    return await reviewRepository.updateReview(reviewId, {
      isbn: data.isbn,
      rating: data.rating,
      content: data.content,
      userId: data.userId,
    });
  }
}
export default ReviewService