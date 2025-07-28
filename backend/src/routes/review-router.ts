
// [역할] 리뷰 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/review' 경로에 등록되어 동작함

import express, { Router } from 'express';
import ReviewController from '../controllers/review-controller';
import { authenticateToken } from './../middlewares/auth-middleware';
const reviewController = new ReviewController();

const router: Router = express.Router();

/** 리뷰 작성
 * @swagger
 * /reviews/create:
 *  post:
 *    summary: 리뷰 작성
 *    tags: [Review]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
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

/** 특정 책의 전체 리뷰 조회
 * @swagger
 * /reviews/search:
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

/** 리뷰 수정
 * @swagger
 * /reviews/{reviewId}:
 *  patch:
 *    summary: 리뷰 수정
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 리뷰수정할 대상 책의 ISBN 번호
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: 수정할 리뷰의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - rating
 *              - content
 *            properties:
 *              rating:
 *                type: number
 *                format: float
 *                enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
 *                description: 수정할 평점 (0.0 ~ 5.0, 0.5점 단위)
 *              content:
 *                type: string
 *                description: 수정할 리뷰 글
 *    responses:
 *      200:
 *        description: 리뷰 수정 성공
 *      400:
 *        description: 잘못된 요청
 *      404:
 *        description: 리뷰를 찾을 수 없음
 */
router.patch('/reviews/:reviewId',authenticateToken, reviewController.updateReview);

/** 리뷰 수정
 * @swagger
 * /reviews/{reviewId}:
 *  patch:
 *    summary: 리뷰 수정
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        description: 리뷰수정할 대상 책의 ISBN 번호
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: 수정할 리뷰의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - rating
 *              - content
 *            properties:
 *              rating:
 *                type: number
 *                format: float
 *                enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
 *                description: 수정할 평점 (0.0 ~ 5.0, 0.5점 단위)
 *              content:
 *                type: string
 *                description: 수정할 리뷰 글
 *    responses:
 *      200:
 *        description: 리뷰 수정 성공
 *      400:
 *        description: 잘못된 요청
 *      404:
 *        description: 리뷰를 찾을 수 없음
 */
router.patch('/reviews/:reviewId',authenticateToken, reviewController.updateReview);

export default router;
