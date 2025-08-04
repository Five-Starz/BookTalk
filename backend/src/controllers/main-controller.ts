// [역할] req, res 처리 담당. 클라이언트 응답 전용

import { Request, Response } from 'express';
import MainService from '../services/main-service'
const mainService = new MainService();

class MainController {
  // 1. 좋아요 수가 많은 리뷰 3개 조회
  async getMostLikedReviews(req:Request, res:Response): Promise<Response> {
    try {
      const reviews = await mainService.fetchMostLiked3Reviews();

      if (!reviews) {
        return res.status(404).json({ message: "좋아요 수가 많은 리뷰가 없습니다." });
      }

      return res.status(200).json({reviews});
    } catch(error) {
      console.error('[MainController] 좋아요 리뷰 조회 중 오류:', error);
      return res.status(500).json({ message: "좋아요 리뷰 조회 중 서버 오류 발생" });
    } 
  }

  // 2. 오늘의 랜덤 리뷰
  async getRandomReviewOfTheDay(req:Request, res:Response): Promise<Response> {
    try {
      const reviews = await mainService.fetchRandomReview();

      if (!reviews) {
        return res.status(404).json({ message: "오늘의 랜덤 리뷰가 없습니다." });
      }

      return res.status(200).json({ reviews });
    } catch(error) {
      console.error('[MainController] 랜덤 리뷰 조회 중 오류:', error);
      return res.status(500).json({ message: "랜덤 리뷰 조회 중 서버 오류 발생" });
    }
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  async getMostReviewed10Books(req:Request, res:Response): Promise<Response> {
    try {
      const books = await mainService.fetchMostReviewedBooks();

      if (!books || books.length === 0) {
        return res.status(404).json({ message: "리뷰 수가 많은 책이 없습니다." });
      }

      return res.status(200).json({ books });
    } catch(error) {
      console.error('[MainController] hot 책 조회 중 오류:', error);
      return res.status(500).json({ message: "hot 책 조회 중 서버 오류 발생" });
    }
  }

  // 4. 평점이 좋은 책 (good 10)
  async getHighestRated10Books(req:Request, res:Response): Promise<Response> {
    try {
      const books = await mainService.fetchTopRatedBooks();

      if (!books || books.length === 0) {
        return res.status(404).json({ message: "평점이 높은 책이 없습니다." });
      }

      return res.status(200).json({ books });
    } catch(error) {
      console.error('[MainController] good 책 조회 중 오류', error);
      return res.status(500).json({ message: "good 책 조회 중 서버 오류 발생" });
    }
  }

  // 5. 보고싶어요 수가 많은 책 (want 10)
  async getMostWished10Books(req:Request, res:Response): Promise<Response> {
    try {
      const books = await mainService.fetchMostWishedBooks();

      if (!books || books.length === 0) {
        return res.status(404).json({ message: "보고싶어요 수가 많은 책이 없습니다." });
      }

      return res.status(200).json({ books });
    } catch(error) {
      console.error('[MainController] want 책 조회 중 오류', error);
      return res.status(500).json({ message: "want 책 조회 중 서버 오류 발생" });
    }
  }
}
export default MainController