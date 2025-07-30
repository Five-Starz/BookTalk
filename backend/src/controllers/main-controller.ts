// [역할] req, res 처리 담당. 클라이언트 응답 전용

import { Request, Response } from 'express';
import MainService from '../services/main-service'
const mainService = new MainService();

class MainController {
  // 1. 좋아요 수가 많은 리뷰
  async getMostLikedReviews(req:Request, res:Response): Promise<Response> {
    const reviews = await mainService.fetchMostLiked3Reviews();
    return res.json({ reviews });
  }

  // 2. 오늘의 랜덤 리뷰
  async getRandomReviewOfTheDay(req:Request, res:Response): Promise<Response> {
    const review = await mainService.fetchRandomReview();
    return res.json({ review });
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  async getMostReviewed10Books(req:Request, res:Response): Promise<Response> {
    const books = await mainService.fetchMostReviewedBooks();
    return res.json({ books });
  }

  // 4. 평점이 좋은 책 (good 10)
  async getHighestRated10Books(req:Request, res:Response): Promise<Response> {
    const books = await mainService.fetchTopRatedBooks();
    return res.json({ books });
  }

  // // 5. 보고싶어요 수가 많은 책 (want 10)
  // async getMostWished10Books(req:Request, res:Response): Promise<Response> {
  //   const books = await mainService.fetchMostWishedBooks();
  //   return res.json({ books });
  // }
}
export default MainController