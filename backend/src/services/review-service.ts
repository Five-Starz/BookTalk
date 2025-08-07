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
    // 0. 책정보가 Books테이블에 없다면 DB에 저장 -> 잘라낸 isbn-13 받아옴
    const slicedISBN = await bookRepository.ensureBookExists(data);

    // 1. slicedISBN으로 이미 존재하는 리뷰인지 체크
    if (await reviewRepository.hasUserReviewedBook(data.userId,slicedISBN)) {
      throw new Error('[review-service error]이미 해당 도서에 리뷰를 작성하셨습니다.');
    };

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
    reviewId: number;
    rating: number;
    content: string;
    userId: number;
  }) {
    // 0. 이미 존재하는 리뷰인지 체크
    const existing = await reviewRepository.hasReviewByUser(data.reviewId, data.userId);
    console.log(`review-service.ts/updateReview().existing : ${existing}`);   // true
    if (!existing) {
      throw new Error('[review-service error] 사용자가 해당 책에 작성한 리뷰가 존재하지 않습니다.');
    };

    // 1. 리뷰 수정
    return await reviewRepository.updateReview(data.reviewId, {
      rating: data.rating,
      content: data.content,
      userId: data.userId,
    });
  }
  
  // 4. 리뷰 삭제
  async deleteReview(data: {
    reviewId: number;
    userId: number;
  }) {
    // 0. 이미 존재하는 리뷰인지 체크
    const existing = await reviewRepository.hasReviewByUser(data.reviewId, data.userId);
    console.log(`review-service.ts/updateReview().existing : ${existing}`);   // true
    if (!existing) {
      throw new Error('[review-service error] 사용자가 해당 책에 작성한 리뷰가 존재하지 않습니다.');
    };

    // 1. 특정 사용자의 특정 책 reviewId 가져오기
    const reviewId = await reviewRepository.getReviewIdByUserIdAndISBN(data.userId);
    if (reviewId == undefined) {
      throw new Error('[review-service error] 사용자가 해당 책에 작성한 reviewId를 가져올 수 없습니다.')
    };

    // 2. 리뷰 삭제
    return await reviewRepository.deleteReview(reviewId, data.userId);
  }

  // 유저 리뷰 검색
  async findReviewByUserId(userId:number){
    return reviewRepository.findReviewByUserId(userId);
  };

  // 유저 리뷰 개수
  async UserReviewCount(userId:number){
    return reviewRepository.UserReviewCount(userId);
  };

  async findById(reviewId:number){
    return reviewRepository.findById(reviewId);
  };

  async searchReviewsByISBN2(isbn: string){
    return reviewRepository.searchReviewsByISBN2(isbn);
  };
  
  async searchReviewsByReviewId(reviewId:number){
    return reviewRepository.searchReviewsByReviewId(reviewId);
  }
}
export default ReviewService