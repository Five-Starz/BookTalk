import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { BookmakrsController } from '../controllers/bookmark-controller';
const bookmakrsController=new BookmakrsController();
import { authenticateToken } from '../middlewares/auth-middleware';
//여긴 테스트용으로 만든 라우터임 나중에 위치 수정 필요

/**
 * @swagger
 * tags:
 *  - name: Bookmarks
 *    description: 보고싶어요 관련 API
 */

/**
 * @swagger
 *
 * /bookmarks/{userId}:
 *   get:
 *     summary: 유저 북마크 검색
 *     description: "특정 유저가 등록한 북마크를 검색합니다."
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "검색할 유저의 고유 아이디"
 *         example: 1
 *     responses:
 *       200:
 *         description: 검색 결과 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '검색 결과 반환 성공'
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       isbn:
 *                         type: string
 *                         example: "123459123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-23T10:00:00Z"
 *       400:
 *         description: 유효하지 않은 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '유효하지 않은 userId 형식입니다.'
 */
router.get('/bookmarks/:userId',bookmakrsController.findById);

/** 보고싶어요 등록
 * @swagger
 *
 * /bookmarks:
 *  post:
 *    summary: 보고싶어요 등록
 *    description: "POST 방식으로 좋아요를 등록한다."
 *    tags: [Bookmarks]
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

/** 보고싶어요를 이미 눌렀는지 확인
 * @swagger
 *
 * /bookmarks/find:
 *  post:
 *    summary: 보고싶어요를 이미 눌렀는지 확인
 *    description: "POST 방식으로 보고싶어요 등록 여부 확인"
 *    tags: [Bookmarks]
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

/** 보고싶어요를 삭제
 * @swagger
 *
 * /bookmarks/del:
 *  post:
 *    summary: 보고싶어요를 삭제
 *    description: "POST 방식으로 보고싶어요 삭제"
 *    tags: [Bookmarks]
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

/** 해당 책의 보고싶어요 숫자 검색
 * @swagger
 *
 * /bookmarks/count:
 *  post:
 *    summary: 해당 책의 보고싶어요 숫자 검색
 *    description: "POST 방식으로 보고싶어요 숫자 검색"
 *    tags: [Bookmarks]
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