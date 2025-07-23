import { User } from '@prisma/client'; // 유저 타입 정의 방식에 따라 바꿔도 됨

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // 필요한 속성 더 추가 가능
      };
    }
  }
}
