import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '별이 다섯개 - BookTalk API',
      version: '1.0.0',
      description: '우리 팀 프로젝트의 Swagger 명세서',
    },
    tags: [{ name: 'Review', description: '리뷰 관련 API' }],
    servers: [
      {
        url: 'http://35.216.79.174:3000/', // 백엔드 주소
      },
    ],
    components: {
      securitySchemes: {
        // 보안 스키마 정의: 이 이름(bearerAuth, refreshToken)이 라우트에서 사용됩니다.
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // JWT 토큰 사용 명시
          description:
            'Access Token (Bearer) : 특이사항 Bearer가 기본적으로 적혀 있어서 엑세스 토큰만 입력하면 됨',
        },
        refreshToken: {
          type: 'apiKey', // Refresh Token을 헤더로 보내는 방식 (API Key 타입)
          in: 'header',
          name: 'Authorization', // Refresh Token이 Authorization 헤더에 담겨 전송됨
          description:
            'Refresh Token (Bearer) : 특이사항 Bearer 기본적으로 안적혀 있어서 Bearer 리프레시 토큰을 같이 입력해야 함',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // 경로는 실제 라우터 코드 위치에 맞게 조정
};
