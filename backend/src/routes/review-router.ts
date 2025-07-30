// [역할] 리뷰 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/review' 경로에 등록되어 동작함

import express, { Router } from 'express';
import ReviewController from '../controllers/review-controller';
const reviewController = new ReviewController();
import { authenticateToken } from '../middlewares/auth-middleware';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Review
 *    description: 리뷰 관련 API
 */

/** 리뷰 작성
 * @swagger
 * /reviews:
 *  post:
 *    summary: 리뷰 작성
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - isbn
 *              - title
 *              - authors
 *              - publisher
 *              - publishedYear
 *              - thumbnail
 *              - description
 *              - rating
 *              - content
 *            properties:
 *              isbn:
 *                type: string
 *                description: 리뷰 글
 *    responses:
 *      201:
 *        description: 리뷰 등록 성공
 *      400:
 *        description: 잘못된 요청
 */
router.post('/reviews', reviewController.createReview);

/** 특정 책의 전체 리뷰 조회
 * @swagger
 * /reviews/search/{isbn}:
 *  get:
 *    summary: 특정 책의 전체 리뷰 조회
 *    tags: [Review]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              isbn:
 *                type: string
 *                description: 책 ISBN 번호
 *    responses:
 *      200:
 *        description: 리뷰 조회 성공
 *      400:
 *        description: 잘못된 요청
 */
router.get('/reviews/search/:isbn', reviewController.searchReviewsByBook);

/** 리뷰 삭제
 * @swagger
 * /reviews:
 *  patch:
 *    summary: 리뷰 삭제
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 리뷰삭제할 대상 책의 ISBN 번호
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: 삭제할 리뷰의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - rating
 *              - content
 *    responses:
 *      200:
 *        description: 리뷰 삭제 성공
 *      400:
 *        description: 잘못된 요청
 *      404:
 *        description: 리뷰를 찾을 수 없음
 */
router.patch('/reviews',authenticateToken, reviewController.updateReview);

/** 리뷰 삭제
 * @swagger
 * /reviews/{reviewId}:
 *  delete:
 *    summary: 리뷰 삭제
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 리뷰삭제할 대상 책의 ISBN 번호
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: 삭제할 리뷰의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - rating
 *              - content
 *    responses:
 *      200:
 *        description: 리뷰 삭제 성공
 *      400:
 *        description: 잘못된 요청
 *      404:
 *        description: 리뷰를 찾을 수 없음
 */
// router.delete('/reviews/:reviewId',authenticateToken, reviewController.deleteReview);

export default router;
