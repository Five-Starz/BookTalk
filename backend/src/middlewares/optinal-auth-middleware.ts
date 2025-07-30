import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config';

/**
 * Access Token을 선택적으로 검증하는 미들웨어입니다.
 * 토큰이 없거나 유효하지 않아도 요청을 차단하지 않고 다음으로 진행합니다.
 * 토큰이 유효하면 req.user에 사용자 정보를 추가합니다.
 * @param req - 요청 객체
 * @param res - 응답 객체
 * @param next - 다음 미들웨어 함수
 */
export const optionalAuthToken = (req: Request, res: Response, next: NextFunction) => {
    // HttpOnly 쿠키 방식이라면:
    //const token = req.cookies.accessToken; // HttpOnly 쿠키에서 Access Token 가져오기
    // Bearer 헤더 방식이라면:
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // 토큰이 없으면 req.user를 설정하지 않고 다음으로 진행
        req.user = undefined; // 명시적으로 undefined로 설정하거나 그냥 없다고 처리
        return next();
    }

    // Access Token 검증
    jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            // 토큰이 유효하지 않아도 (만료 등) 오류를 반환하지 않고 다음으로 진행
            // 다만, req.user는 설정하지 않음
            console.warn('선택적 인증: JWT 검증 실패 (토큰 유효하지 않음):', err.name, err.message);
            req.user = undefined;
            return next();
        }
        // 검증된 사용자 정보를 요청 객체에 저장
        req.user = user as { userId: number; email: string; nickname: string };
        next(); // 다음 미들웨어 또는 라우트 핸들러로 진행
    });
};