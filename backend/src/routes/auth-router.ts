import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { AuthController } from '../controllers/auth-controller'
const authController=new AuthController();
import { LikesController } from '../controllers/likes-controller';
const likesController=new LikesController();


/**
 * @swagger
 *
 * /signup:
 *  post:
 *    summary: 회원 가입
 *    description: "POST 방식으로 유저를 등록한다."
 *    tags: [auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: "이름"
 *              email:
 *                type: string
 *                description: "이메일"
 *              password:
 *                type: string
 *                description: "비밀번호"
 *              nickname:
 *                type: string
 *                description: "닉네임"
 *      responses:
 *        200:
 *          description: 회원가입 성공
 */
router.post('/signup',authController.signUp);

/*
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
*/

export default router 