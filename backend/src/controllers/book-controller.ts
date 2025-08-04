// [역할] req, res 처리 담당. 클라이언트 응답 전용

import { Request, Response } from 'express';
import { Books } from '@prisma/client';
import BookService from '../services/book-service'
const bookService = new BookService();

class BookController {
  // 검색 결과
  async getSearchedBooks(req:Request, res:Response): Promise<any> {
    try {
      const { query } = req.query;  // 검색도서명 저장

      if (!query || typeof query !== 'string') {
        return res.status(200).json({ message: '검색어를 입력해주세요. '});
      }

      const books = await bookService.searchBooksByQuery(query);  // 검색결과 책 목록들 받아와
      return res.status(200).json(books); // 결과 반환
    } catch(error) {
      console.error('[BookController] 도서 검색 오류:', error);
      res.status(500).json({ message: '도서 검색 중 오류가 발생했습니다.' });
    }
  }


  // 도서 별 평균평점 조회
  async getAverageRatingByBook(req:Request, res:Response): Promise<any> {
    try {
      const { isbn } = req.params;  // 검색할 도서 ISBN 저장
      console.log('[Book Controller] 받은 isbn', isbn);

      if (!isbn || typeof isbn !== 'string') {
        return res.status(400).json({ message: '검색할 책 ISBN(params)을 입력해주세요. '})
      }
      const result = await bookService.getAverageRatingByBook(isbn);  // ISBN으로 책 검색 후 평균평점 계산한 값과 리뷰개수 받아와

      if (!result || result.avgRating === null) {
        return res.status(400).json({
          message: '평점을 계산하기 위해서는 더 많은 리뷰가 필요합니다.',
          reviewCount: result?.reviewCount ?? 0,  // 1이거나 없으면 0으로 보여줌
        });
      }

      const { avgRating, reviewCount } = result;
      console.log('[Book Controller] 서비스에서 받은 평균 평점: ', avgRating);

      return res.status(200).json({avgRating, reviewCount});
    } catch(error) {
      console.error('[BookController] 도서 별 평균평점 조회 오류:', error);
      res.status(500).json({ message: '서버 오류로 평균 평점을 조회할 수 없습니다.' });
    }
  }

  // ISBN으로 DB 내 리뷰작성된 도서정보 조회
  async getBookInfo(req:Request, res:Response): Promise<any> {
    try {
      const { isbn } = req.params;  // 검색도서 ISBN 저장
      if (!isbn || typeof isbn !== 'string') {
        return res.status(200).json({ message: '유효하지 않은 ISBN입니다. '});
      }

      const bookInfo = await bookService.searchBookByISBN(isbn);  // 검색결과 책 목록들 받아와

      if (!bookInfo) {
        return res.status(404).json({ message: '해당 ISBN에 대한 책 정보를 찾을 수 없습니다.' });
      }

      return res.status(200).json(bookInfo); // 결과 반환
    } catch(error) {
      console.error('[BookController] 도서정보 조회 오류:', error);
      res.status(500).json({ message: '도서 정보를 불러오는 중 서버 오류가 발생했습니다.' });
    }
  }

  // 랜덤 도서들 조회
  async getRandomBooks(req:Request, res:Response): Promise<any> {
    try {
      const randombooks = await bookService.getRandomBooks();

      if (!randombooks || randombooks.length === 0) {
        return res.status(404).json({ message: '추천 가능한 도서가 없습니다.' });
      }

      return res.status(200).json(randombooks);
    } catch(error) {
      console.error('[BookController] 랜덤 도서들 조회 오류:', error);
      res.status(500).json({ message: '랜덤 도서를 불러오는 중 서버 오류가 발생했습니다.' });
    }
  }
}
export default BookController