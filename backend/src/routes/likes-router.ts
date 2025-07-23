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
 *    tags: [auth]
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
 */
router.post('/likes',likesController.create)

export default router 