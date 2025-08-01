// [역할] 책 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/books' 경로에 등록되어 동작함

import express, { Router } from 'express';
import BookController from '../controllers/book-controller';
const bookController = new BookController();

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Book
 *    description: 책 관련 API
 */

/** 도서 검색 (Kakao API 연동)
 * @swagger
 * /books/search:
 *  get:
 *    summary: 도서 검색 (Kakao API 연동)
 *    tags: [Book]
 *    parameters:
 *      - name: query
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *        description: 검색할 책 제목
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.get('/books/search', bookController.getSearchedBooks);

/** 도서 별 평균평점 조회
 * @swagger
 * /books/averageRating/{isbn}:
 *  get:
 *    summary: 도서 별 평균평점 조회
 *    tags: [Book]
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 평균평점 조회할 책 ISBN
 *    responses:
 *      200:
 *       description: 평균평점 반환 성공
 */
// router.get('/books/averageRating/:isbn', bookController.getAverageRating);

/** ISBN으로 DB 내 리뷰작성된 도서정보 조회
 * @swagger
 * /books/info/{isbn}:
 *  get:
 *    summary: ISBN으로 DB 내 리뷰작성된 도서정보 조회
 *    tags: [Book]
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 검색할 책 ISBN
 *    responses:
 *      200:
 *       description: 도서정보 반환 성공
 */
router.get('/books/info/:isbn', bookController.getBookInfo)


/** 랜덤 도서 추천  
 * @swagger
 * /books/random:
 *  get:
 *    summary: 랜덤 도서 추천 
 *    tags: [Book]
 *    responses:
 *      200:
 *       description: 랜덤 도서들 반환 성공
 */
// router.get('/books/random', bookController.getRandomBooks)

export default router;
