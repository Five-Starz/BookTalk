import express, {Request,Response,Router} from 'express';
const router:Router=express.Router()
import { AuthController } from '../controllers/auth-controller'
const authController=new AuthController()

router.get('/register', (req:Request,res:Response)=>{
  
  authController.signUp('테스트5','테스트5','테스트5','테스트5')
});


export default router 