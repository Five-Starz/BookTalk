import bcrypt from 'bcrypt';
import {AuthRepository} from '../repositories/auth-repository';
const authRepository=new AuthRepository();
import { Users,Token } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config'

// JWT Access Token 페이로드 인터페이스
interface AccessTokenPayload {
    userId: number;
    email: string;
    nickname: string;
}

// JWT Refresh Token 페이로드 인터페이스
interface RefreshTokenPayload {
    userId: number;
}

export class AuthService{ 
  
  async findbyEmail(email:string):Promise<Users|null> {
    return authRepository.findbyEmail(email);
  };
  
  async findbyNickname(nickname:string):Promise<Users|null> {
    return authRepository.findbyEmail(nickname);
  };

  async createUser(email:string,password:string,nickname:string):Promise<Users>{
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return authRepository.createUser(email,hashedPassword,nickname);
  };



  /**
   * Access Token과 Refresh Token을 생성합니다.
   * @param user - 토큰에 포함할 사용자 정보
   * @returns {{accessToken: string, refreshToken: string}} 생성된 토큰들
   */
  private generateTokens(user: { userId: number; email: string; nickname: string }) {
      const accessToken = jwt.sign(
          { userId: user.userId, email: user.email, nickname: user.nickname } as AccessTokenPayload,
          JWT_ACCESS_SECRET,
          { expiresIn: '1h' } // 1시간 유효
      );

      const refreshToken = jwt.sign(
          { userId: user.userId } as RefreshTokenPayload,
          JWT_REFRESH_SECRET,
          { expiresIn: '7d' } // 7일 유효
      );

      return { accessToken, refreshToken };
  }

  /**
   * 사용자 등록 (회원가입)
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @param nickname - 사용자 닉네임
   * @returns {{accessToken: string, refreshToken: string, user: object}} 생성된 토큰 및 사용자 정보
   * @throws Error (이메일/닉네임 중복, 기타 오류)
   */
  async signup(email: string, password: string, nickname: string) {
      // 이메일 또는 닉네임 중복 확인
      const existingUserByEmail = await authRepository.findbyEmail(email);
      if (existingUserByEmail) {
          throw new Error('이미 사용 중인 이메일입니다.');
      }
      const existingUserByNickname = await authRepository.findbyNickname(nickname);
      if (existingUserByNickname) {
          throw new Error('이미 사용 중인 닉네임입니다.');
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);

      // 새 사용자 생성email:string,password:string,nickname:string
      const newUser = await authRepository.createUser(
          email,
          hashedPassword,
          nickname,
      );

      // Access Token 및 Refresh Token 생성
      const { accessToken, refreshToken } = this.generateTokens(newUser);

      // Refresh Token을 데이터베이스에 저장
      await authRepository.upsertRefreshToken(newUser.userId, refreshToken);

      // 비밀번호를 제외한 사용자 정보 반환
      const { password: _, ...userWithoutPassword } = newUser;
      return { accessToken, refreshToken, user: userWithoutPassword };
  }

  /**
   * 사용자 로그인
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @returns {{accessToken: string, refreshToken: string, user: object}} 생성된 토큰 및 사용자 정보
   * @throws Error (인증 실패, 사용자 없음)
   */
  async login(email: string, password: string) {
      const user = await authRepository.findbyEmail(email);

      if (!user) {
          throw new Error('유효하지 않은 이메일 또는 비밀번호입니다.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password as string); // password가 항상 string임을 가정

      if (!isPasswordValid) {
          throw new Error('유효하지 않은 이메일 또는 비밀번호입니다.');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);
      await authRepository.upsertRefreshToken(user.userId, refreshToken);

      const { password: _, ...userWithoutPassword } = user;
      return { accessToken, refreshToken, user: userWithoutPassword };
  }

  /**
   * Access Token 갱신
   * @param oldRefreshToken - 클라이언트가 보낸 Refresh Token
   * @returns {{accessToken: string, refreshToken: string, user: object}} 새 토큰 및 사용자 정보
   * @throws Error (유효하지 않거나 만료된 Refresh Token, 사용자 없음)
   */
  async refreshAccessToken(oldRefreshToken: string) {
      let decoded: RefreshTokenPayload;
      try {
          decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET) as RefreshTokenPayload;
      } catch (error: any) {
          if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
              throw new Error('Refresh Token이 유효하지 않거나 만료되었습니다.');
          }
          throw new Error('Refresh Token 검증 중 오류가 발생했습니다.');
      }

      const storedToken = await authRepository.findRefreshTokenByUserId(decoded.userId);

      if (!storedToken || storedToken.refreshToken !== oldRefreshToken) {
          throw new Error('유효하지 않거나 만료된 Refresh Token입니다.');
      }

      const user = await authRepository.findById(decoded.userId);
      if (!user) {
          throw new Error('사용자를 찾을 수 없습니다.');
      }

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);
      await authRepository.upsertRefreshToken(user.userId, newRefreshToken);

      const { password: _, ...userWithoutPassword } = user;
      return { accessToken, refreshToken: newRefreshToken, user: userWithoutPassword };
  }
  
  /**
   * 사용자 로그아웃
   * @param refreshToken - 클라이언트가 보낸 Refresh Token
   * @throws Error (토큰 검증 오류)
   */
  async logout(refreshToken: string) {
      let decoded: RefreshTokenPayload;
      try {
          decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as RefreshTokenPayload;
      } catch (error: any) {
          // 토큰이 유효하지 않거나 만료되었어도 로그아웃 처리 (데이터베이스에서 삭제 시도)
          console.warn('로그아웃 시 Refresh Token 검증 오류:', error.message);
          return;
      }

      // 데이터베이스에서 Refresh Token 삭제 시도
      try {
          await authRepository.deleteRefreshToken(decoded.userId);
      } catch (dbError: any) {
          console.error('데이터베이스에서 Refresh Token 삭제 중 오류:', dbError);
      }
  }

  async editInfo(userId:number,nickname?:string,password?:string){
    let existingUserByNickname:Users|null=null;
    let hashedPassword:string|undefined;

    if(nickname)
      existingUserByNickname = await authRepository.findbyNickname(nickname);
      
    //existingUserByNickname이 존재할 때 userId값이 동일하다면 동일 닉네임을 쓴다는 뜻
    //userId값이 동일하지 않다면 중복 닉네임 
    if (existingUserByNickname && existingUserByNickname.userId!==userId)
      throw new Error('이미 사용 중인 닉네임입니다.');      
    else if(existingUserByNickname && existingUserByNickname.userId===userId)
      nickname=undefined; //동일 닉을 설정했다 : 닉네임 수정 안하겠다는 의미

    if(!password)
      hashedPassword=undefined;
    else
      hashedPassword = await bcrypt.hash(password, 10);  

    return await authRepository.editInfo(userId,nickname,hashedPassword);
  }

  async findUserProfile(userId: number){
    return await authRepository.findUserProfile(userId);
  };

  async deleteUser(userId:number){
    return await authRepository.deletUser(userId);
  };
}; 