import dotenv from 'dotenv';
dotenv.config();

import express,{Request,Response} from 'express';
import userRouter from './routes/user.route';
import mainRouter from './routes/main-router' // 메인페이지 라우터
import axios from 'axios';


const app=express();
const PORT=process.env.PORT || 8000;

app.use(express.json());
app.use('/users',userRouter);


// let kakaoOptions = {
//   url: 'https://dapi.kakao.com/v3/search/book?target=title',  // target에 해당하는 것을 적기
//   method: 'GET',
//   headers: {
//     'Authorization': 'KakaoAK 54cf8e502eb7f2205d37646cafc2272c'
//   },
//   qs: {
//     query : '강아지',     // 현재 책으로 검색할 것이라 책 제목을 적었다.
//     size:5
//   },
//   encoding: 'UTF-8',
//   }


//kakaoApi
app.get('/',async (req:Request,res:Response)=>{
  console.log("클라이언트 요청 수신");

  // Kakao API 요청을 위한 옵션 설정
  // Axios는 'headers'와 'params'를 별도로 관리하여 더 직관적입니다.
  const kakaoApiUrl = 'https://dapi.kakao.com/v3/search/book';
  const kakaoApiKey = process.env.KAKAO_API_KEY;

  let title:String='title';
  let query:String='강아지';
  let size:Number=5;

  try {
    // Axios를 사용하여 Kakao API에 GET 요청을 보냅니다.
    // 'params'는 쿼리 스트링(qs)을 대체합니다.
    // 'headers'는 동일하게 사용됩니다.
    const kakaoApiResponse = await axios.get(kakaoApiUrl, {
      headers: {
        'Authorization': `KakaoAK ${kakaoApiKey}` // 템플릿 리터럴을 사용하여 키 삽입
      },
      params: {
        target: `${title}`,
        query: `${query}`,
        size: `${size}`
      }
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
})

app.listen(PORT,()=>{
  console.log(`Server running ${PORT} port`);
})