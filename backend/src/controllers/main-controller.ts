// [역할] req, res 처리 담당. 클라이언트 응답 전용

import { Request, Response } from 'express';
import { MainService } from '../services/main-service'

export class MainController {
  // 1. 좋아요 수가 많은 리뷰
  static async getMostLikedReviews(req:Request, res:Response) {
    const reviews = await MainService.fetchMostLikedReviews();
    res.json({ reviews });
  }

  // 2. 오늘의 랜덤 리뷰
  static async getRandomReviewOfTheDay(req:Request, res:Response) {
    const review = await MainService.fetchRandomReview();
    res.json({ review });
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  static async getMostReviewed10Books(req:Request, res:Response) {
    const books = await MainService.fetchMostReviewedBooks();
    res.json({ books });
  }

  // 4. 평점이 좋은 책 (good 10)
  static async getHighestRated10Books(req:Request, res:Response) {
    const books = await MainService.fetchTopRatedBooks();
    res.json({ books });
  }

  // 5. 보고싶어요 수가 많은 책 (want 10)
  static async getMostWished10Books(req:Request, res:Response) {
    const books = await MainService.fetchMostWishedBooks();
    res.json({ books });
  }
}
