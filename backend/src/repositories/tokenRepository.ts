/*
import { prisma } from '../utils/prisma';
import { Token } from '@prisma/client'; // Prisma가 생성한 Token 타입 임포트

export class TokenRepository {
  async findByUserId(userId: number): Promise<Token | null> {
    return prisma.token.findUnique({
      where: { userId },
    });
  }

  async createOrUpdateToken(userId: number, refreshToken: string): Promise<Token> {
    return prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }

  async deleteToken(userId: number): Promise<void> {
    // 토큰이 존재하지 않을 경우 에러를 던지지 않도록 처리 (선택 사항)
    await prisma.token.delete({
      where: { userId },
    }).catch(error => {
      if (error.code === 'P2025') { // Record to delete does not exist
        console.warn(`Attempted to delete non-existent token for userId: ${userId}`);
      } else {
        throw error;
      }
    });
  }
}
*/