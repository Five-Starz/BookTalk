import bcrypt from 'bcrypt';
import {AuthRepository} from '../repositories/auth-repository';
const authRepository=new AuthRepository();
import { Users } from '@prisma/client';

export class AuthService{
  
  async findbyEmail(email:string):Promise<Users|null> {
    return authRepository.findbyEmail(email);
  };
  
  async findbyNickname(nickname:string):Promise<Users|null> {
    return authRepository.findbyEmail(nickname);
  };

  async createUser(name:string,email:string,password:string,nickname:string):Promise<Users>{
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return authRepository.createUser(name,email,hashedPassword,nickname);
  };
/*
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await authRepository.findbyEmail(email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    const accessToken = generateAccessToken({ userId: user.userId, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.userId });
    

    //Refresh Token 저장/업데이트
    await tokenRepository.createOrUpdateToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid refresh token.');
    }

    const storedToken = await tokenRepository.findByUserId(decoded.userId);
    if (!storedToken || storedToken.refreshToken !== oldRefreshToken) {
      // 탈취된 토큰이거나 유효하지 않은 경우, 해당 사용자의 모든 토큰 무효화 (보안 강화)
      if (storedToken) {
        await tokenRepository.deleteToken(decoded.userId);
      }
      throw new Error('Refresh token not found or invalid. Please log in again.');
    }

    const user = await tokenRepository.findByUserId(decoded.userId);
    if (!user) {
      await tokenRepository.deleteToken(decoded.userId); // 사용자가 없는 경우 토큰도 삭제
      throw new Error('User not found.');
    }

    const newAccessToken = generateAccessToken({ userId: user.userId});
    const newRefreshToken = generateRefreshToken({ userId: user.userId });

    await tokenRepository.createOrUpdateToken(user.userId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: number): Promise<void> {
    await tokenRepository.deleteToken(userId);
  }
    */
}; 