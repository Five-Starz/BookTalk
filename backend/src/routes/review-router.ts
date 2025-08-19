// [역할] 리뷰 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/review' 경로에 등록되어 동작함

import express, { Router } from 'express';
import ReviewController from '../controllers/review-controller';
import { authenticateToken } from '../middlewares/auth-middleware';
import { optionalAuthToken } from '../middlewares/optinal-auth-middleware';

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
 *    security:
 *      - bearerAuth: []
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                reviewId:
 *                  type: integer
 *                  example: 123
 *                message:
 *                  type: string
 *                  example: "리뷰가 성공적으로 등록되었습니다."
 *      400:
 *        description: 잘못된 요청 (필수 필드 누락, 형식 오류 등)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "리뷰 작성에 필요한 정보를 확인해주세요."
 *      401:
 *        description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Access Token이 필요합니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 작성에 실패했습니다."
 */
router.post('/reviews', authenticateToken, reviewController.createReview);

/** 특정 책의 전체 리뷰 조회
 * @swagger
 * /reviews/search/{isbn}:
 *  get:
 *    summary: 특정 책의 전체 리뷰 조회
 *    tags: [Review]
 *    parameters:
 *      - name: isbn
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *        description: 책 ISBN 번호
 *    responses:
 *      200:
 *        description: 리뷰 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  reviewId:
 *                    type: integer
 *                  userId:
 *                    type: integer
 *                  rating:
 *                    type: number
 *                    format: float
 *                  content:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *      400:
 *        description: 잘못된 요청 (ISBN 누락 또는 형식 오류)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "ISBN을 올바르게 입력해주세요."
 *      404:
 *        description: 해당 책에 대한 리뷰가 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "해당 ISBN의 리뷰가 존재하지 않습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 조회에 실패했습니다."
 */
router.get('/reviews/search/:isbn', reviewController.searchReviewsByBook);

/** 리뷰 수정
 * @swagger
 * /reviews/{reviewId}:
 *  patch:
 *    summary: 리뷰 수정
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                reviewId:
 *                  type: integer
 *                  example: 101
 *                userId:
 *                  type: integer
 *                  example: 5
 *                isbn:
 *                  type: string
 *                  example: "9788994492032"
 *                rating:
 *                  type: number
 *                  format: float
 *                  example: 4.5
 *                content:
 *                  type: string
 *                  example: "정말 유익한 책이었습니다. 추천합니다!"
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2025-08-04T09:45:12.345Z"
 *      400:
 *        description: 잘못된 요청 (파라미터 오류, body 누락 등)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "수정할 내용을 확인해주세요."
 *      401:
 *        description: 인증 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Access Token이 필요합니다."
 *      404:
 *        description: 리뷰를 찾을 수 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "해당 리뷰를 찾을 수 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 수정에 실패했습니다."
 */
router.patch('/reviews/:reviewId', authenticateToken, reviewController.updateReview);

/** 리뷰 삭제
 * @swagger
 * /reviews/{reviewId}:
 *  delete:
 *    summary: 리뷰 삭제
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: reviewId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *        description: 삭제할 리뷰의 ID
 *    responses:
 *      200:
 *        description: 리뷰 삭제 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                reviewId:
 *                  type: integer
 *                  example: 101
 *                userId:
 *                  type: integer
 *                  example: 5
 *                isbn:
 *                  type: string
 *                  example: "9788994492032"
 *                rating:
 *                  type: number
 *                  format: float
 *                  example: 3.5
 *                content:
 *                  type: string
 *                  example: "삭제 전 리뷰 내용입니다."
 *                deletedAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2025-08-04T10:03:27.000Z"
 *      400:
 *        description: 잘못된 요청
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "삭제할 리뷰 ID가 올바르지 않습니다."
 *      401:
 *        description: 인증 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Access Token이 필요합니다."
 *      404:
 *        description: 리뷰를 찾을 수 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "해당 리뷰를 찾을 수 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 삭제에 실패했습니다."
 */
router.delete('/reviews/:reviewId', authenticateToken, reviewController.deleteReview);

/** 특정 유저의 전체 리뷰 조회
 * @swagger
 * /reviews/user/{userId}:
 *  get:
 *    summary: 특정 유저의 전체 리뷰 조회
 *    tags: [Review]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "검색할 유저의 고유 아이디"
 *         example: 1
 *    responses:
 *      200:
 *        description: 리뷰 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  reviewId:
 *                    type: integer
 *                  isbn:
 *                    type: string
 *                  rating:
 *                    type: number
 *                    format: float
 *                  content:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *      400:
 *        description: 잘못된 요청
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "userId가 올바르지 않습니다."
 *      401:
 *        description: 인증 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Access Token이 필요합니다."
 *      404:
 *        description: 해당 유저의 리뷰가 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "해당 유저의 리뷰가 존재하지 않습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 조회에 실패했습니다."
 */
router.get('/reviews/user/:userId', optionalAuthToken, reviewController.findReviewByUserId);

/** 특정 유저의 리뷰 개수 조회
 * @swagger
 * /reviews/count/{userId}:
 *  get:
 *    summary: 특정 유저의 리뷰 개수 조회
 *    tags: [Review]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "검색할 유저의 고유 아이디"
 *         example: 1
 *    responses:
 *      200:
 *        description: 리뷰 개수 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: integer
 *              example: 42
 *      400:
 *        description: 잘못된 요청
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "userId가 올바르지 않습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류로 리뷰 개수 조회에 실패했습니다."
 */
router.get('/reviews/count/:userId', reviewController.UserReviewCount);

/**
 * @swagger
 *
 * /reviews/{reviewId}:
 *   get:
 *     summary: 리뷰 아이디 검색
 *     description: "특정 유저가 등록한 북마크를 검색합니다."
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "검색할 리뷰의 고유 아이디"
 *         example: 1
 *     responses:
 *      200:
 *        description: 리뷰 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  reviewId:
 *                    type: integer
 *                  isbn:
 *                    type: string
 *                  rating:
 *                    type: number
 *                    format: float
 *                  content:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 */
router.get('/reviews/:reviewId', reviewController.findById);

/** ISBN으로 리뷰 정보와 연관된 좋아요 및 댓글 수 한번에 출력하기
 * @swagger
 * /reviews/search2/{isbn}:
 *  get:
 *    summary: aa
 *    tags: [Review]
 *    parameters:
 *      - name: isbn
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *        description: 책 ISBN 번호
 */
router.get('/reviews/search2/:isbn', reviewController.searchReviewsByISBN2);

/** reviewId로 리뷰 정보와 연관된 좋아요 및 댓글 수 한번에 출력하기
 * @swagger
 * /reviews/search3/{reviewId}:
 *  get:
 *    summary: aa
 *    tags: [Review]
 *    parameters:
 *      - name: reviewId
 *        in: query
 *        required: true
 *        schema:
 *          type: integer
 *        description: "검색할 유저의 고유 아이디"
 */
router.get('/reviews/search3/:reviewId', reviewController.searchReviewsByReviewId);

export default router;
