import { Request, Response, NextFunction } from 'express';  
import {AuthService} from '../services/auth-services'
const authService=new AuthService();
import { Users } from '@prisma/client';



export class AuthController{

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, nickname } = req.body;
      if (!name || !email || !password || !nickname) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
        const user = await authService.createUser(name, email, password, nickname);
        res.status(201).json({ message: 'User registered successfully', user: { userId: user.userId, email: user.email, nickname: user.nickname } });
    } catch (error) {
      next(error); // 에러 처리 미들웨어로 전달
    }
  }
/*
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const { accessToken, refreshToken } = await authService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: 'Logged in successfully', accessToken });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.cookies.refreshToken as string;
      if (!oldRefreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided.' });
      }

      const { accessToken, refreshToken } = await authService.refreshTokens(oldRefreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: 'Tokens refreshed successfully', accessToken });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user는 authenticateToken 미들웨어에서 설정됨
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'User not authenticated for logout.' });
      }
      const userId = req.user.userId;
      await authService.logout(userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
*/
};