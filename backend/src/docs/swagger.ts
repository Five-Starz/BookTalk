import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '별이 다섯개 - BookTalk API',
      version: '1.0.0',
      description: '우리 팀 프로젝트의 Swagger 명세서',
    },
    servers: [
      {
        url: 'http://localhost:8000', // 백엔드 주소
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // 경로는 실제 라우터 코드 위치에 맞게 조정
};
