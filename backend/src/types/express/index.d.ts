import { User } from '@prisma/client'; // 유저 타입 정의 방식에 따라 바꿔도 됨

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      // name?: string; // 필요 시 확장
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
