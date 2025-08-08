// import './types/custom';  // nodemon 정상 사용 위해, 타입 병합만 유도함 (JS로 빌드 안됨)
// import { prisma } from './utils/prisma'; // Prisma 클라이언트 임포트
// import { PrismaClient } from '@prisma/client';

import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
//swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './docs/swagger'; // 옵션만 따로 불러옴

import mainRouter from './routes/main-router'; // 메인페이지 라우터
import bookRouter from './routes/book-router';
import reviewRouter from './routes/review-router'
import authRouter from './routes/auth-router';
import likesRouter from './routes/likes-router';
import commentRouter from './routes/comment-router';
import bookmakrsRouter from './routes/bookmark-router'
import axios from 'axios';

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const PORT = process.env.PORT || 8000;

// 모든 출처를 허용하는 방법 (개발 단계에서만 권장)
app.use(cors({
  origin: 'http://localhost:5173',   // ✅ React 앱 주소 정확히 명시
  credentials: true                  // ✅ 쿠키 허용
}));
// 미들웨어 및 라우터
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use('/', [authRouter, reviewRouter, mainRouter, bookRouter, likesRouter, commentRouter,bookmakrsRouter]);
// --- 전역 오류 처리 미들웨어 ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('서버 오류가 발생했습니다.');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//kakaoApi
app.get('/', async (req: Request, res: Response) => {
  console.log('클라이언트 요청 수신');

  // Kakao API 요청을 위한 옵션 설정
  // Axios는 'headers'와 'params'를 별도로 관리하여 더 직관적입니다.
  const kakaoApiUrl = 'https://dapi.kakao.com/v3/search/book';
  const kakaoApiKey = process.env.KAKAO_API_KEY;

  let title: String = 'title';
  let query: String = '강아지';
  let size: Number = 5;

  try {
    // Axios를 사용하여 Kakao API에 GET 요청을 보냅니다.
    // 'params'는 쿼리 스트링(qs)을 대체합니다.
    // 'headers'는 동일하게 사용됩니다.
    const kakaoApiResponse = await axios.get(kakaoApiUrl, {
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`, // 템플릿 리터럴을 사용하여 키 삽입
      },
      params: {
        target: `${title}`,
        query: `${query}`,
        size: `${size}`,
      },
    });

    // Kakao API로부터 받은 응답의 HTTP 상태 코드 출력
    console.log(`Kakao API 응답 상태 코드: ${kakaoApiResponse.status}`);

    // Axios는 응답 본문을 자동으로 JSON 객체로 파싱하여 'data' 속성에 넣어줍니다.
    // 따라서 별도로 JSON.parse()를 호출할 필요가 없습니다.
    const parsedBody = kakaoApiResponse.data;

    // 파싱된 데이터를 클라이언트에게 JSON 형태로 응답합니다.
    // 여기서 사용되는 'res'는 Express.js의 응답 객체입니다.
    res.json(parsedBody);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 요청 중 오류가 발생한 경우 (네트워크 오류, Kakao API의 2xx가 아닌 응답 등)
      console.error('Kakao API 요청 중 오류 발생:', error.message);

      // Axios 오류 객체는 응답이 있을 경우 'error.response'에 해당 정보를 담고 있습니다.
      if (error.response) {
        // Kakao API가 오류 상태 코드 (예: 400, 401, 500)를 반환한 경우
        console.error('Kakao API 응답 오류:', error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data); // Kakao API의 오류 응답을 그대로 클라이언트에게 전달
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못한 경우 (예: 네트워크 문제)
        console.error('응답을 받지 못했습니다:', error.request);
        res.status(500).send('Kakao API로부터 응답을 받지 못했습니다. 네트워크 연결을 확인하세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('Axios 요청 설정 오류:', error.message);
        res.status(500).send('서버에서 Kakao API 요청을 설정하는 중 오류가 발생했습니다.');
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running ${PORT} port`);
});

// // 더미데이터 넣고 review-router.ts에서 확인해보기
// async function main() {
//   // 유저 생성
//   const user = await prisma.users.create({
//     data: {
//       name: '리뷰작성 테스트2',
//       email: 'review2@test.com',
//       password: '1234',
//       nickname: '리뷰작성 테스트유저2',
//     },
//   });

//   // 책 생성
//   const book = await prisma.books.create({
//     data: {
//       isbn: '8936475649 9788936475642',
//       title: '아몬드 1(큰글자도서)',
//       authors:  '손원평' ,
//       publisher: '창비',
//       thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6124896%3Ftimestamp%3D20231124183256',
//       description: '영화와도 같은 강렬한 사건과 매혹적인 문체로 시선을 사로잡는 한국형 영 어덜트 소설 『아몬드』. 타인의 감정에 무감각해진 공감 불능인 이 시대에 큰 울림을 감 불능인 이 시대에 큰 울림을 주는 이 작품은 감정을 느끼지 못하는 한 소년의 특별한 성장을 그리고 있다. 감정을 느끼는 데 어려움을 겪는 열여 를 간직한 곤이, 그와 반대로 맑 섯 살 소년 선윤재와 어두운 상처를 간직한 곤이, 그와 반대로 맑은 감성을 지닌 도라와 윤재를 돕고 싶어 하는 심 박사 사이에서 펼쳐지는 이야기가 우리로 하여금 타인의 감정을 이해한다는',
//       publishedYear: 2018,
//       totalRating: 0
//   }
//   });

//   // 리뷰 여러 개 생성
//   await prisma.reviews.createMany({
//     data: [
//       {
//         userId: user.userId,
//         isbn: book.isbn,
//         content: '좋은 책이에요!',
//         count: 5,
//         rating: 4,
//       },
//       {
//         userId: user.userId,
//         isbn: book.isbn,
//         content: '그냥 그래요.',
//         count: 3,
//         rating: 2,
//       },
//     ],
//   });

//   console.log('🌱 Seed data inserted!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
