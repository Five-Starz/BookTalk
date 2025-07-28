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
        return res.status(400).json({ message: '리뷰 등록에 필요한 정보가 부족합니다.' });
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

  // 2. 특정 책의 리뷰 조회
  async searchReviewsByBook(req:express.Request, res:express.Response): Promise<any> {
    try {
      const {
        isbn,
        title,
        authors,
        publishedYear,
      } = req.query; // 리뷰생성시 필수로 받아와야 할 parameters 값들

      if (!isbn || !title || !authors || !publishedYear) {
        return res.status(400).json({ message: '특정 책의 리뷰 조회를 위한 정보가 부족합니다.' });
      }

      const reviewsByBook = await reviewService.searchReviewsByBook({
        isbn: isbn as string,
        title: title as string,
        authors: authors as string,
        publishedYear: Number(publishedYear),
      });

      return res.status(200).json(reviewsByBook);   // 조회된 특정 책의 리뷰들 반환
    } catch(error) {
      console.error('[ReviewController] 특정 책의 리뷰 조회 오류:', error);
      res.status(500).json({ message: '특정 책의 리뷰 조회 중 서버 오류' });
    }
  }

  // 3. 리뷰 수정
  async updateReview(req:express.Request, res:express.Response): Promise<any> {
    try {
      const {
        isbn,
        rating,
        content,
      } = req.body; // 리뷰수정 시 필수로 받아와야 할 body값들

      const userId = req.user?.userId;
      if (rating==null || !content || !userId) {
        return res.status(400).json({ message: '리뷰 수정에 필요한 정보가 부족합니다.' });
      }

      const updatedReview = await reviewService.updateReview({
        isbn,
        rating,
        content,
        userId
      });

      return res.status(200).json(updatedReview); // 수정된 리뷰 반환
    } catch(error) {
      console.error('[ReviewController] 리뷰 수정 오류:', error);
      res.status(500).json({ message: '리뷰 수정 중 서버 오류' });
    }
  }
}
export default ReviewController