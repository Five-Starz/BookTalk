// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import { MainRepository } from '../repositories/main-repository'

export class MainService {
  // 1. 좋아요 수가 많은 리뷰
  static async fetchMostLikedReviews() {

  }

  // 2. 오늘의 랜덤 리뷰
  static async fetchRandomReview() {

  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  static async fetchMostReviewedBooks() {

  }

  // 4. 평점이 좋은 책 (good 10)
  static async fetchTopRatedBooks() {

  }

  // 5. 보고싶어요 수가 많은 책 (want 10)
  static async fetchMostWishedBooks() {

  }
}