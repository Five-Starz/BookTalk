// [역할] 메인페이지 관련된 작업을 하는 API 라우터
// : 요청 라우팅만 담당. 각 경로를 controller 함수에 연결만 함.
// [연결] ./src/utils/index.ts에서 '/main' 경로에 등록되어 동작함

import express, { Router } from 'express';
import MainController from '../controllers/main-controller'
const mainController = new MainController();

const router:Router = express.Router();

// 1. 좋아요 수가 많은 리뷰
router.get('/reviews/liked', mainController.getMostLikedReviews);

// 2. 오늘의 랜덤 리뷰
router.get('/reviews/random', mainController.getRandomReviewOfTheDay);

// 3. 리뷰 수가 많은 책 (hot 10)
router.get('/books/hot', mainController.getMostReviewed10Books);

// 4. 평점이 좋은 책 (good 10)
router.get('/books/good', mainController.getHighestRated10Books);

// // 5. 보고싶어요 수가 많은 책 (want 10)
// router.get('/books/want', mainController.getMostWished10Books);

export default router