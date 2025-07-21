// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import { Reviews, Books } from '@prisma/client';
import MainRepository from '../repositories/main-repository'
const mainRepository = new MainRepository();

class MainService {
  // 1. 좋아요 수가 많은 리뷰
  async fetchMostLikedReviews(): Promise<Reviews | null> {
    return await mainRepository.fetchMostLikedReviews();
  }

  // 2. 오늘의 랜덤 리뷰
  async fetchRandomReview(): Promise<Reviews | undefined> {
    return await mainRepository.fetchRandomReview();
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  async fetchMostReviewedBooks(): Promise<Books[]> {
    return await mainRepository.fetchMostReviewedBooks();
  }

  // 4. 평점이 좋은 책 (good 10)
  async fetchTopRatedBooks(): Promise<Books[]> {
    return await mainRepository.fetchTopRatedBooks();
  }

  // // 5. 보고싶어요 수가 많은 책 (want 10)
  // async fetchMostWishedBooks(): Promise<Books[]> {
  //   return await mainRepository.fetchMostWishedBooks();
  // }
}
export default MainService