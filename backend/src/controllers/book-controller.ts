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
        return res.status(200).json({ message: '검색어(query)를 입력해주세요. '})
      }
      const books = await bookService.searchBooksByQuery(query);  // 검색결과 책 목록들 받아와
      return res.status(400).json(books); // 결과 반환
    } catch(error) {
      console.error('[BookController] 도서 검색 오류:', error);
      res.status(500).json({ message: '도서 검색 중 오류 발생' });
    }
  }
}
export default BookController