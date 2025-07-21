import {AuthRepository} from '../repositories/auth-repository'
const authRepository=new AuthRepository();
import { UsersDto } from "../dtos/dtos"



export class AuthService{
  
  async findbyEmail(email:string):Promise<UsersDto|null> {
    return authRepository.findbyEmail(email);
  };
  
  async findbyNickname(nickname:string):Promise<UsersDto|null> {
    return authRepository.findbyEmail(nickname);
  };

  async createUser(name:string,email:string,password:string,nickname:string):Promise<UsersDto>{
    return authRepository.createUser(name,email,password,nickname);
  };
}; 