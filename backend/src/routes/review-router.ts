// [역할] 리뷰 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/review' 경로에 등록되어 동작함

import express, { Router } from 'express';
import ReviewController from '../controllers/review-controller';
const reviewController = new ReviewController();

const router: Router = express.Router();

/**
 * @swagger
 * /books/search:
 *  get:
 *    summary: 리뷰 작성
 *    tags: [Review]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: 책 제목
 *              authors:
 *                type: string
 *                description: 저자명
 *              publishedYear:
 *                type: integer
 *                description: 출판연도
 *              rating:
 *                type: number
 *                format: float
 *                enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
 *                description: 평점 (0.0 ~ 5.0, 0.5점 단위)
 *              content:
 *                type: string
 *                description: 리뷰 글
 *    responses:
 *      201:
 *        description: 리뷰 등록 성공
 *      400:
 *        description: 잘못된 요청
 */
router.post('/', reviewController.createReview);

export default router;
