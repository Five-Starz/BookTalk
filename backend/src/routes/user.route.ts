import express,{Request,Response, Router} from 'express'
//import { User } from '../types/user'

const router:Router = express.Router()

router.get('/',(req:Request,res:Response)=>{
  const users:string[]=['alice','Bob','Charlie']
  res.json({users})  
})

router.post('/',(req:Request,res:Response)=>{
  const {name}=req.body as {name:string} //body 값에 뭐가 있는지 모르므로 이렇게 설정함
  // const newUser:User={
  //   id:1,
  //   name:"test",
  //   email:"test@test.com"
  // }
  
  if(!name){
    return res.status(400).json({msg:"Name is required"})
  } 
  res.status(201).json({msg:`User ${name} port`})
})


export default router