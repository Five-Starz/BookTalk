import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

// 환경 변수 검증 및 내보내기
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const PORT = process.env.PORT || 8000;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    console.error("환경 변수 JWT_ACCESS_SECRET 또는 JWT_REFRESH_SECRET이 설정되지 않았습니다.");
    process.exit(1);
}