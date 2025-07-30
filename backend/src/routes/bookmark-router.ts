import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { BookmakrsController } from '../controllers/bookmark-controller';
const bookmakrsController=new BookmakrsController();
import { authenticateToken } from '../middlewares/auth-middleware';
//여긴 테스트용으로 만든 라우터임 나중에 위치 수정 필요


/**
 * @swagger
 *
 * /bookmarks:
 *  post:
 *    summary: 보고싶어요 등록
 *    description: "POST 방식으로 좋아요를 등록한다."
 *    tags: [bookmarks]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              isbn:
 *                type: string
 *                description: "책 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/bookmarks',authenticateToken,bookmakrsController.create)


/**
 * @swagger
 *
 * /bookmarks/find:
 *  post:
 *    summary: 보고싶어요를 이미 눌렀는지 확인
 *    description: "POST 방식으로 보고싶어요 등록 여부 확인"
 *    tags: [bookmarks]
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
 *              isbn:
 *                type: string
 *                description: "책 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/bookmarks/find',bookmakrsController.findByUserAndIsbn)

/**
 * @swagger
 *
 * /bookmarks/del:
 *  post:
 *    summary: 보고싶어요를 삭제
 *    description: "POST 방식으로 보고싶어요 삭제"
 *    tags: [bookmarks]
 *    security:
 *      - bearerAuth: []  # Access Token 보안 스키마 적용
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              isbn:
 *                type: string
 *                description: "책 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/bookmarks/del',authenticateToken,bookmakrsController.delete)

/**
 * @swagger
 *
 * /bookmarks/count:
 *  post:
 *    summary: 해당 책의 보고싶어요 숫자 검색
 *    description: "POST 방식으로 보고싶어요 숫자 검색"
 *    tags: [bookmarks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              isbn:
 *                type: string
 *                description: "책 아이디"
 *    responses:
 *      200:
 *       description: 검색 결과 반환 성공
 */
router.post('/bookmarks/count',bookmakrsController.countByIsbn)

export default router 