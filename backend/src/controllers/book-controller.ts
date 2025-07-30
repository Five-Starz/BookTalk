import { par } from './../../node_modules/effect/src/internal/blockedRequests';
// [역할] req, res 처리 담당. 클라이언트 응답 전용

import { Request, Response } from 'express';
import BookService from '../services/book-service'
const bookService = new BookService();

class BookController {
  // 1. 검색 결과
  async getSearchedBooks(req:Request, res:Response): Promise<any> {
    try {
      const { query } = req.query;  // 검색도서명 저장
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: '검색어(query)를 입력해주세요. '})
      }
      const books = await bookService.searchBooksByQuery(query);  // 검색결과 책 목록들 받아와
      return res.status(200).json(books); // 결과 반환
    } catch(error) {
      console.error('[BookController] 도서 검색 오류:', error);
      res.status(500).json({ message: '도서 검색 중 오류 발생' });
    }
  }

  // 2. 도서 별 평균평점 조회
  async getAverageRatingByBook(req:Request, res:Response) {
    try {
      const {isbn} = req.params;  // 검색할 도서 ISBN 저장
      console.log('[Book Controller] 받은 isbn', isbn);

      if (!isbn || typeof isbn !== 'string') {
        return res.status(400).json({ message: '검색할 책 ISBN(query)을 입력해주세요. '})
      }
      const rating = await bookService.getAverageRatingByBook(isbn);  // ISBN으로 책 검색 후 평균평점 계산해 받아와
      console.log('[Book Controller] 서비스에서 받은 평균 평점: ', rating);

      return res.status(200).json(rating);
    } catch(error) {
      console.error('[BookController] 도서 별 평균평점 조회 오류:', error);
      res.status(500).json({ message: '도서 별 평균평점 조회 중 오류 발생' });
    }
  }
}
export default BookController