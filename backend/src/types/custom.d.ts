import 'express';   // 이거 반드시 있어야 타입 병합됨
// Express Request 객체에 사용자 정보를 추가하기 위한 확장
declare global {
    namespace Express {
    export interface Request {
        user?: {
            userId: number;
            email: string;
            nickname: string;
        };
    }
}
}
