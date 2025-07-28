// [역할] 리뷰 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/review' 경로에 등록되어 동작함

import express, { Router } from 'express';
import ReviewController from '../controllers/review-controller';
const reviewController = new ReviewController();

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
 *                description: 책 ISBN 번호
 *              title:
 *                type: string
 *                description: 책 제목
 *              authors:
 *                type: string
 *                description: 저자명
 *              publisher:
 *                type: string
 *                description: 출판사    
 *              publishedYear:
 *                type: integer
 *                description: 출판연도
 *              thumbnail:
 *                type: string
 *                description: 책 썸네일 이미지 주소
 *              description:
 *                type: string
 *                description: 책 설명
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
router.post('/reviews', reviewController.createReview);

/** 특정 책의 전체 리뷰 조회
 * @swagger
 * /reviews/search:
 *  get:
 *    summary: 특정 책의 전체 리뷰 조회
 *    tags: [Review]
 *    parameters:
 *      - in: query
 *        name: isbn
 *        schema:
 *          type: string
 *        description: 책 ISBN 번호
 *      - in: query
 *        name: title
 *        schema:
 *          type: string
 *        description: 책 제목
 *      - in: query
 *        name: authors
 *        schema:
 *          type: string
 *        description: 저자명
 *      - in: query
 *        name: publishedYear
 *        schema:
 *          type: integer
 *        description: 출판연도
 *    responses:
 *      200:
 *        description: 리뷰 목록 조회 성공
 *      400:
 *        description: 잘못된 요청
 */
router.get('/reviews/search', reviewController.searchReviewsByBook)

export default router;
