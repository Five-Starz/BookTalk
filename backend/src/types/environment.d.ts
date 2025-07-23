// 이 파일은 TypeScript가 process.env에 사용자 정의 환경 변수가 있음을 인식하도록 합니다.
declare namespace NodeJS {
  interface ProcessEnv {
    KAKAO_API_KEY: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
  }
}