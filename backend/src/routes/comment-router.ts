import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { CommentsController } from '../controllers/comments-controller';
const commentsController=new CommentsController();
//여긴 테스트용으로 만든 라우터임 나중에 위치 수정 필요
import { CommentsRepository } from '../repositories/comments-repository';
const comment=new CommentsRepository()

/**
 * @swagger
 *
 * /comment/id/{userId}:
 *   get:
 *     summary: 유저 댓글 검색
 *     description: "특정 유저가 등록한 댓글을 검색합니다."
 *     tags: [Comment]
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
 *                       commentId:
 *                         type: integer
 *                         example: 101
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       reviewId:
 *                         type: integer
 *                         example: 10
 *                       content:
 *                         type: string
 *                         example: "첫 번째 유저 1의 댓글입니다."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-23T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-23T10:00:00Z"
 *                       parentId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
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
router.get('/comment/id/:userId', commentsController.findById);


/**
 * @swagger
 *
 * /comment/add:
 *   post:
 *     summary: 댓글 등록
 *     description: "리뷰에 댓글 등록 (parentId는 대댓글을 달고 싶은 commentId를 입력하면 됨)"
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: "유저 아이디"
 *                 example: 1
 *               reviewId:
 *                 type: integer
 *                 description: "리뷰 아이디"
 *                 example: 10
 *               content:
 *                 type: string
 *                 description: "댓글 내용"
 *                 example: "정말 유익한 리뷰입니다!"
 *               parentId:
 *                 type: integer
 *                 description: "대댓글 넣을 아이디"
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: 댓글 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '댓글 생성 성공'
 *                 comment:
 *                   type: object
 *                   properties:
 *                     commentId:
 *                       type: integer
 *                       example: 1234
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     reviewId:
 *                       type: integer
 *                       example: 10
 *                     content:
 *                       type: string
 *                       example: "정말 유익한 리뷰입니다!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-23T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-23T10:00:00Z"
 *                     parentId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: 필수 필드 누락 또는 유효하지 않은 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'content, userId, 또는 reviewId가 누락되었거나 유효하지 않습니다.'
 */
router.post('/comment/add',commentsController.creatComment)



/**
 * @swagger
 *
 * /comment/review/{reviewId}:
 *   get:
 *     summary: 리뷰 댓글 검색
 *     description: "특정 리뷰에 등록된 모든 댓글을 검색합니다."
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "댓글을 검색할 리뷰의 아이디"
 *         example: 10
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
 *                       commentId:
 *                         type: integer
 *                         example: 101
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       reviewId:
 *                         type: integer
 *                         example: 10
 *                       content:
 *                         type: string
 *                         example: "리뷰 10의 첫 번째 댓글"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-23T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-23T10:00:00Z"
 *                       parentId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       400:
 *         description: 유효하지 않은 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '유효하지 않은 reviewId 형식입니다.'
 */
router.get('/comment/review/:reviewId',commentsController.findByReviewId)

/**
 * @swagger
 *
 * /comment/update:
 *   put:
 *     summary: 댓글 수정
 *     description: "댓글 내용을 수정합니다."
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: integer
 *                 description: "수정할 댓글의 아이디"
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: "수정할 댓글 내용"
 *                 example: "수정된 댓글 내용입니다."
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '댓글 수정 성공'
 *                 comment:
 *                   type: object
 *                   properties:
 *                     commentId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     reviewId:
 *                       type: integer
 *                       example: 10
 *                     content:
 *                       type: string
 *                       example: "수정된 댓글 내용입니다."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-23T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-23T10:00:00Z"
 *                     parentId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: 필수 필드 누락 또는 유효하지 않은 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'commentId 또는 content가 누락되었거나 유효하지 않습니다.'
 *       404:
 *         description: 댓글을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '댓글을 찾을 수 없습니다.'
 */
router.put('/comment/update',commentsController.updateComment)

  /**
   * @swagger
   *
   * /comment/{commentId}:
   *   delete:
   *     summary: 댓글 삭제
   *     description: "특정 댓글을 삭제합니다. (현재 기준으론 대댓글까지 삭제됨)"
   *     tags: [Comment]
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: integer
   *         required: true
   *         description: "삭제할 댓글의 아이디"
   *         example: 1
   *     responses:
   *       200:
   *         description: 댓글 삭제 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: '댓글 삭제 성공'
   *                 comment:
   *                   type: object
   *                   properties:
   *                     commentId:
   *                       type: integer
   *                       example: 1
   *                     userId:
   *                       type: integer
   *                       example: 1
   *                     reviewId:
   *                       type: integer
   *                       example: 10
   *                     content:
   *                       type: string
   *                       example: "삭제된 댓글 내용입니다."
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-07-23T10:00:00Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-07-23T10:00:00Z"
   *                     parentId:
   *                       type: integer
   *                       nullable: true
   *                       example: null
   *       400:
   *         description: 유효하지 않은 요청 파라미터
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: '유효하지 않은 commentId 형식입니다.'
   *       404:
   *         description: 댓글을 찾을 수 없음
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: '댓글을 찾을 수 없습니다.'
   */
  router.delete('/comment/:commentId',commentsController.deleteComment)

export default router   