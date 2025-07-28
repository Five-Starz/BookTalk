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
      
      const userId = req.user?.userId || 2; // swagger UI 같은 외부 도구에서 테스트할 때는 인증 토큰이 없거나, 미들웨어를 거치지 않기 때문에 req.user가 없는 상황이어서 임시로 1 할당 -> 나중에 테스트 끝나면 지워야함
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
      if (error instanceof Error && error.message?.includes('이미 해당 도서에 리뷰')) {
        console.error('[ReviewController] 리뷰 중복 오류:', error);
        return res.status(409).json({ message: '이미 해당 도서에 리뷰를 작성하셨습니다.' });
      }

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
}
export default ReviewController