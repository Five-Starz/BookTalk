// [역할] 메인페이지 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/main' 경로에 등록되어 동작함

import express, { Router } from 'express';
import MainController from '../controllers/main-controller';
const mainController = new MainController();

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Main
 *    description: 메인페이지 관련 API
 */

/** 좋아요 수가 많은 리뷰 3개 조회
 * @swagger
 * /main/reviews/liked:
 *  get:
 *    summary: 좋아요 수가 많은 리뷰 3개 조회
 *    tags: [Main]
 *    responses:
 *      200:
 *        description: 좋아요 수가 많은 리뷰 3개 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *      404:
 *        description: 리뷰가 존재하지 않음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "좋아요 수가 많은 리뷰가 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "좋아요 리뷰 조회 중 서버 오류 발생"
 */
router.get('/main/reviews/liked', mainController.getMostLikedReviews);

/** 오늘의 랜덤 리뷰 1개 조회
 * @swagger
 * /main/reviews/random:
 *  get:
 *    summary: 오늘의 랜덤 리뷰 1개 조회
 *    tags: [Main]
 *    responses:
 *      200:
 *        description: 오늘의 랜덤 리뷰 1개 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      404:
 *        description: 오늘의 랜덤 리뷰가 존재하지 않음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "오늘의 랜덤 리뷰가 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "랜덤 리뷰 조회 중 서버 오류 발생"
 */
router.get('/main/reviews/random', mainController.getRandomReviewOfTheDay);

/** 리뷰 수가 많은 책 (hot 10) 조회
 * @swagger
 * /main/books/hot:
 *  get:
 *    summary: 리뷰 수가 많은 책 (hot 10) 조회
 *    tags: [Main]
 *    responses:
 *      200:
 *        description: 리뷰 수가 많은 책 (hot 10) 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *      404:
 *        description: 리뷰가 많은 책이 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "리뷰 수가 많은 책이 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "hot 책 조회 중 서버 오류 발생"
 */
router.get('/main/books/hot', mainController.getMostReviewed10Books);

/** 평점이 좋은 책 (good 10) 조회
 * @swagger
 * /main/books/good:
 *  get:
 *    summary: 평점이 좋은 책 (good 10) 조회
 *    tags: [Main]
 *    responses:
 *      200:
 *        description: 평점이 좋은 책 (good 10) 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *      404:
 *        description: 평점이 높은 책이 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "평점이 높은 책이 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "good 책 조회 중 서버 오류 발생"
 */
router.get('/main/books/good', mainController.getHighestRated10Books);

/** 보고싶어요 수가 많은 책 (want 10) 조회
 * @swagger
 * /main/books/want:
 *  get:
 *    summary: 보고싶어요 수가 많은 책 (want 10) 조회
 *    tags: [Main]
 *    responses:
 *      200:
 *        description: 보고싶어요 수가 많은 책 (want 10) 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *      404:
 *        description: 보고싶어요 수가 많은 책이 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "보고싶어요 수가 많은 책이 없습니다."
 *      500:
 *        description: 서버 내부 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "want 책 조회 중 서버 오류 발생"
 */
router.get('/main/books/want', mainController.getMostWished10Books);

export default router;
