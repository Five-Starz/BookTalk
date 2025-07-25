import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config';

/**
 * Access Token을 검증하는 미들웨어입니다.
 * 보호된 경로에 접근하기 전에 사용됩니다.
 * @param req - 요청 객체
 * @param res - 응답 객체
 * @param next - 다음 미들웨어 함수
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // 요청 헤더에서 Access Token 가져오기 (Bearer 스키마)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // 토큰이 없는 경우 401 Unauthorized 응답
        return res.status(401).json({ message: 'Access Token이 필요합니다.' });
    }

    // Access Token 검증
    jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            // 토큰이 유효하지 않은 경우 403 Forbidden 응답
            // 토큰 만료 시에도 여기에 걸림
            console.error('JWT 검증 실패:', err.name, err.message);
            return res.status(403).json({ message: 'Access Token이 유효하지 않거나 만료되었습니다.' });
        }
        // 검증된 사용자 정보를 요청 객체에 저장 (custom.d.ts에 정의된 타입 사용)
        req.user = user as { userId: number; email: string; nickname: string };
        next(); // 다음 미들웨어 또는 라우트 핸들러로 진행
    });
};