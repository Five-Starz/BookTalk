import { prisma } from "../utils/prisma";
import { Users,Token } from "@prisma/client";

export class AuthRepository{

  //가입 이메일 검사
  async findbyEmail(email:string):Promise<Users|null>{
    return await prisma.users.findFirst({
      where:{email}
    });
  };

  //가입 닉네임 검사
  async findbyNickname(nickname:string):Promise<Users|null>{
    return await prisma.users.findFirst({
      where:{nickname}
    });
  };

  //아이디 검색
  async findById(userId: number): Promise<Users | null> {
    return prisma.users.findUnique({
      where: { userId },
    });
  }

  //회원 등록
  async createUser(email:string,password:string,nickname:string):Promise<Users>{
    return await prisma.users.create({
      data:{email,password,nickname}
    });
  };

  /**
   * Refresh Token을 데이터베이스에 저장 또는 업데이트
   * @param userId - 사용자 ID
   * @param refreshToken - Refresh Token 문자열
   * @returns 저장/업데이트된 Token 객체
   */
  async upsertRefreshToken(userId: number, refreshToken: string): Promise<Token> {
      return prisma.token.upsert({
          where: { userId },
          update: { refreshToken },
          create: { userId, refreshToken },
      }) as Promise<Token>;
  };

  /**
   * userId로 Refresh Token 찾기
   * @param userId - 사용자 ID
   * @returns Token | null
   */
  async findRefreshTokenByUserId(userId: number): Promise<Token | null> {
      return prisma.token.findUnique({
          where: { userId },
      }) as Promise<Token | null>;
  }

  /**
   * userId로 Refresh Token 삭제 (로그아웃 시)
   * @param userId - 사용자 ID
   */
  async deleteRefreshToken(userId: number): Promise<void> {
      await prisma.token.delete({
          where: { userId },
      });
  }

  async editInfo(userId:number,nickname?:string,password?:string){
    await prisma.users.update({
        where:{userId},
        data:{nickname,password}  
      });
  };
  
  async findUserProfile(userId: number){
    return prisma.users.findUnique({
      where: { userId },
      select:{
        userId:true,
        nickname:true
      }
    });
  }
};