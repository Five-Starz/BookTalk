import { Request, Response, NextFunction } from 'express';  
import {AuthService} from '../services/auth-services'
const authService=new AuthService();
import { Users } from '@prisma/client';



export class AuthController{

  async signUp(req: Request, res: Response, next: NextFunction) {
  
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // const user = await authService.createUser(name, email, password, nickname);
    // res.status(201).json({ message: 'User registered successfully', user: { userId: user.userId, email: user.email, nickname: user.nickname } });

    try {
      const { accessToken, refreshToken, user } = await authService.signup(email, password, nickname);
      res.status(201).json({
          message: '회원가입 및 로그인 성공',
          accessToken,
          refreshToken,
          user,
      });
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      if (error.message.includes('이미 사용 중인')) {
          return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
  }

  /**
   * 사용자 로그인 핸들러
   * POST /auth/login
   */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    try {
        const { accessToken, refreshToken, user } = await authService.login(email, password);
        res.status(200).json({
            message: '로그인 성공',
            accessToken,
            refreshToken,
            user,
        });
    } catch (error: any) {
        console.error('로그인 오류:', error);
        if (error.message.includes('유효하지 않은')) {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
}

  /**
   * Access Token 갱신 핸들러
   * POST /auth/refresh
   */
  async refreshAccessToken(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token이 필요합니다.' });
    }

    try {
        const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({
            message: 'Access Token 갱신 성공',
            accessToken,
            refreshToken: newRefreshToken,
            user,
        });
    } catch (error: any) {
        console.error('Refresh Token 갱신 오류:', error);
        if (error.message.includes('유효하지 않거나 만료된')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('사용자를 찾을 수 없습니다')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Access Token 갱신 중 오류가 발생했습니다.' });
    }
}

  /**
   * 사용자 로그아웃 핸들러
   * POST /auth/logout
   */
  async logout(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(200).json({ message: '이미 로그아웃되었습니다.' });
    }

    try {
        await authService.logout(refreshToken);
        res.status(200).json({ message: '로그아웃 성공' });
    } catch (error: any) {
        console.error('로그아웃 오류:', error);
        // Refresh Token이 유효하지 않거나 만료되었어도 클라이언트에게 성공 메시지 (클라이언트가 토큰을 삭제하도록)
        res.status(200).json({ message: '로그아웃 처리 완료 (토큰 오류 발생 가능성 있음)' });
    }
}

  /**
   * 보호된 경로 접근 핸들러
   * GET /protected
   */
  protectedRoute(req: Request, res: Response) {
    // authenticateToken 미들웨어를 통과했으므로 req.user에 사용자 정보가 있습니다.
    res.status(200).json({
        message: '보호된 정보에 접근했습니다.',
        user: req.user,
        data: '이것은 민감한 데이터입니다!',
    });
  }

  async editInfo(req: Request, res: Response){
    const userId=req.user!.userId;
    let nickname = req.body.nickname as string | undefined;
    let password = req.body.password as string | undefined;  
    console.log(typeof nickname)
    if (typeof nickname === 'string'){
      if(nickname.trim() === '')
        nickname=undefined;      
    }
    if(typeof password === 'string'){
      if(password.trim() === '')
          password=undefined;
    }
    
    try {
        await authService.editInfo(userId, nickname, password);        
        res.status(200).json({ message: "회원정보 수정 성공" });
    } catch (error: any) { 
        if (error.message === '이미 사용 중인 닉네임입니다.') {
            return res.status(409).json({ message: error.message });
        }
        console.error("회원정보 수정 중 오류 발생:", error); // 에러 로그
        return res.status(500).json({ message: "회원정보 수정 중 서버 오류가 발생했습니다." });
    }
  };

  async findUserProfile(req: Request, res: Response){
    const userId=parseInt(req.params.userId,10);
    res.status(200).json(await authService.findUserProfile(userId));
  };
};