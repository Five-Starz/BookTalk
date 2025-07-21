import {AuthService} from '../services/auth-services'
const authService=new AuthService();
import { UsersDto } from '../dtos/dtos'


export class AuthController{
  // async signUp(req:Request,res:Response){
  //   const {name,email,password,nickname}=req.body
  //   AuthService.createUser()
  // }
   async signUp(name:string,email:string,password:string,nickname:string):Promise<UsersDto>{
    return await authService.createUser(name,email,password,nickname)
  };
};