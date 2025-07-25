import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { LikesController } from '../controllers/likes-controller';
const likesController=new LikesController();
//여긴 테스트용으로 만든 라우터임 나중에 위치 수정 필요


/**
 * @swagger
 *
 * /likes:
 *  post:
 *    summary: 좋아요 등록
 *    description: "POST 방식으로 좋아요를 등록한다."
 *    tags: [likes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *                description: "유저 아이디"
 *              reviewId:
 *                type: integer
 *                description: "리뷰 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/likes',likesController.create)


/**
 * @swagger
 *
 * /likes/find:
 *  post:
 *    summary: 좋아요를 이미 눌렀는지 확인
 *    description: "POST 방식으로 좋아요 등록 여부 확인"
 *    tags: [likes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *                description: "유저 아이디"
 *              reviewId:
 *                type: integer
 *                description: "리뷰 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/likes/find',likesController.findByUserAndReview)

/**
 * @swagger
 *
 * /likes/del:
 *  post:
 *    summary: 좋아요를 삭제
 *    description: "POST 방식으로 좋아요 삭제"
 *    tags: [likes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *                description: "유저 아이디"
 *              reviewId:
 *                type: integer
 *                description: "리뷰 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/likes/del',likesController.delete)

/**
 * @swagger
 *
 * /likes/count:
 *  post:
 *    summary: 해당 리뷰의 좋아요 숫자 검색
 *    description: "POST 방식으로 좋아요 숫자 검색"
 *    tags: [likes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              reviewId:
 *                type: integer
 *                description: "리뷰 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/likes/count',likesController.countByReviewId)

export default router 