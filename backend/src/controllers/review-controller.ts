// [역할] req, res 처리 담당. 클라이언트 응답 전용
import express from 'express';
import ReviewService from '../services/review-service'
const reviewService = new ReviewService();

class ReviewController {
  // 1. 리뷰 생성
  async createReview(req:express.Request, res:express.Response): Promise<any> {
    try {
      const {
        isbn,
        title,
        authors,
        publisher,
        publishedYear,
        thumbnail,
        description,
        rating,
        content,
      } = req.body; // 리뷰생성시 필수로 받아와야 할 body값들

      const userId = req.user?.userId;
      if (!isbn || rating==null || !content || !userId) {
        return res.status(400).json({ message: '리뷰 등록 정보가 부족합니다.' });
      }

      const createdReview = await reviewService.createReview({
        isbn,
        title,
        authors,
        publisher,
        publishedYear,
        thumbnail,
        description,
        rating,
        content,
        userId,
      });

      return res.status(201).json(createdReview); // 생성된 리뷰 반환
    } catch(error) {
      console.error('[ReviewController] 리뷰 등록 오류:', error);
      res.status(500).json({ message: '리뷰 등록 중 서버 오류' });
    }
  }
}
export default ReviewController