import express, {Request,Response,Router} from 'express';
const router:Router=express.Router();
import { AuthController } from '../controllers/auth-controller'
const authController=new AuthController();
import { LikesController } from '../controllers/likes-controller';
const likesController=new LikesController();
import { authenticateToken } from '../middlewares/auth-middleware';

/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description: 사용자 인증 및 권한 부여 관련 API
 */


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 새 사용자 등록 (회원가입)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자의 고유 이메일 주소
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 사용자의 비밀번호 (최소 6자)
 *                 example: strongpassword123
 *               nickname:
 *                 type: string
 *                 description: 사용자의 고유 닉네임
 *                 example: newuser_nick
 *     responses:
 *       201:
 *         description: 회원가입 및 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 응답 메시지
 *                   example: 회원가입 및 로그인 성공
 *                 accessToken:
 *                   type: string
 *                   description: Access Token
 *                   example: eyJhbGciOi...
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh Token
 *                   example: eyJhbGciOi...
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: 사용자 고유 ID
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: 사용자 이메일
 *                       example: newuser@example.com
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                       example: newuser_nick
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 모든 필드를 입력해주세요.
 *       409:
 *         description: 이메일 또는 닉네임 중복
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               emailConflict:
 *                 value:
 *                   message: 이미 사용 중인 이메일입니다.
 *               nicknameConflict:
 *                 value:
 *                   message: 이미 사용 중인 닉네임입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입 중 오류가 발생했습니다.
 */
router.post('/auth/signup',authController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 등록된 사용자 이메일
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 사용자의 비밀번호
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 accessToken:
 *                   type: string
 *                   example: "access_token_example"
 *                 refreshToken:
 *                   type: string
 *                   example: "refresh_token_example"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: test@example.com
 *                     nickname:
 *                       type: string
 *                       example: testuser
 *       400:
 *         description: 이메일 또는 비밀번호 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일과 비밀번호를 입력해주세요.
 *       401:
 *         description: 유효하지 않은 인증 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 유효하지 않은 이메일 또는 비밀번호입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 중 오류가 발생했습니다.
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Access Token 갱신
 *     tags: [Auth]
 *     security:
 *       - refreshToken: []
 *     requestBody:
 *       description: Refresh Token은 Authorization 헤더에 Bearer 스키마로 전송됩니다.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           format: 'Bearer <refreshToken>'
 *         required: true
 *         description: 'Refresh Token (Bearer <refreshToken> 형식)'
 *         example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODIyNDQwMCwiZXhwIjoxNjc4ODQ5MjAwfQ.another_signature'
 *     responses:
 *       200:
 *         description: Access Token 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Token 갱신 성공
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5pY2tuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2NzgyMjgxMDAsImV4cCI6MTY3ODI0NjEwMH0.new_signature"
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODIyODEwMCwiZXhwIjoxNjc4ODQ5NjAwfQ.new_another_signature"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: test@example.com
 *                     nickname:
 *                       type: string
 *                       example: testuser
 *       401:
 *         description: Refresh Token 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh Token이 필요합니다.
 *       403:
 *         description: 유효하지 않거나 만료된 Refresh Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 유효하지 않거나 만료된 Refresh Token입니다.
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Token 갱신 중 오류가 발생했습니다.
 */
router.post('/auth/refresh', authController.refreshAccessToken);

// 사용자 로그아웃
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     tags: [Auth]
 *     security:
 *       - refreshToken: []
 *     requestBody:
 *       description: Refresh Token은 Authorization 헤더에 Bearer 스키마로 전송됩니다.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           format: 'Bearer <refreshToken>'
 *         required: true
 *         description: 'Refresh Token (Bearer <refreshToken> 형식)'
 *         example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODIyNDQwMCwiZXhwIjoxNjc4ODQ5MjAwfQ.another_signature'
 *     responses:
 *       200:
 *         description: 로그아웃 성공 또는 이미 로그아웃됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               success:
 *                 value: { message: '로그아웃 성공' }
 *               alreadyLoggedOut:
 *                 value: { message: '이미 로그아웃되었습니다.' }
 *               tokenError:
 *                 value: { message: '로그아웃 처리 완료 (토큰 오류 발생 가능성 있음)' }
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그아웃 중 오류가 발생했습니다.
 */
router.post('/auth/logout', authController.logout);

// 보호된 경로 (Access Token 필요)
/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: 보호된 경로 접근 (Access Token 필요)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # Access Token 보안 스키마 적용
 *     responses:
 *       200:
 *         description: 보호된 정보에 성공적으로 접근함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 보호된 정보에 접근했습니다.
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: 사용자 고유 ID
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: 사용자 이메일
 *                       example: test@example.com
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                       example: testuser
 *                 data:
 *                   type: string
 *                   example: 이것은 민감한 데이터입니다!
 *       401:
 *         description: Access Token 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Token이 필요합니다.
 *       403:
 *         description: Access Token이 유효하지 않거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Token이 유효하지 않거나 만료되었습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 오류가 발생했습니다.
 */
router.get('/auth/protected', authenticateToken, authController.protectedRoute);

/**
 * @swagger
 * /auth/passupdate:
 *   post:
 *     summary: 회원정보 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # Access Token 보안 스키마 적용
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - password
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 사용자의 닉네임 (2자 이상)
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 사용자의 비밀번호 (최소 8자)
 *                 example: 12345678
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
 *       409:
 *         description: 동일 닉 사용
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '이미 사용 중인 닉네임입니다.'
 *       500:
 *         description: 내부 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '서버 오류가 발생했습니다.'
 */ 
router.post('/auth/passupdate',authenticateToken,authController.editInfo);


/**
 * @swagger
 *
 * /auth/{userId}:
 *   get:
 *     summary: 유저 프로필 검색
 *     description: "특정 유저가 등록한 프로필을 검색합니다."
 *     tags: [Auth]
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
 *                       nickname:
 *                         type: string
 *                         example: "테스트유저"
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
router.get('/auth/:userId', authController.findUserProfile);


 /**
   * @swagger
   *
   * /auth/del/{userId}:
   *   delete:
   *     summary: 유저 삭제
   *     description: "특정 유저를 삭제합니다."
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []  # Access Token 보안 스키마 적용
   *     responses:
   *       200:
   *         description: 유저 삭제 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: '유저 삭제 성공'
   */
  router.delete('/auth/del/:userId',authenticateToken,authController.deleteUser)

export default router 