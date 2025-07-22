import { prisma } from "../utils/prisma";
import { Users } from "@prisma/client";

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
  async createUser(name:string,email:string,password:string,nickname:string):Promise<Users>{
    return await prisma.users.create({
      data:{name,email,password,nickname}
    });
  };
};