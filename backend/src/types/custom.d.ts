// Express Request 객체에 사용자 정보를 추가하기 위한 확장
declare namespace Express {
    export interface Request {
        user?: {
            userId: number;
            email: string;
            nickname: string;
        };
    }
}
