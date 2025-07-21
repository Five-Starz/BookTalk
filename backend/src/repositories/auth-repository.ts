import { prisma } from "../utils/prisma";
import { UsersDto } from "../dtos/dtos";

export class AuthRepository{

  //가입 이메일 검사
  async findbyEmail(email:string):Promise<UsersDto|null>{
    return await prisma.users.findFirst({
      where:{email}
    });
  };

  //가입 닉네임 검사
  async findbyNickname(nickname:string):Promise<UsersDto|null>{
    return await prisma.users.findFirst({
      where:{nickname}
    });
  };

  //회원 등록
  async createUser(name:string,email:string,password:string,nickname:string):Promise<UsersDto>{
    return await prisma.users.create({
      data:{name,email,password,nickname}
    });
  };
};