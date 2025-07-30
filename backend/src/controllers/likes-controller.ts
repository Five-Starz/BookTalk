import { Request, Response, NextFunction } from 'express';  
import { LikesService } from "../services/likes-services";
const likesService=new LikesService();

export class LikesController{
  
  //이건 지워도 될듯한
  async findByUserAndReview(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = parseInt(req.body.userId, 10);
    const reviewId = parseInt(req.body.reviewId, 10);
    return res.status(200).json(await likesService.findByUserAndReview(userId,reviewId));
  }

  async create(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = req.user!.userId;
    const reviewId = parseInt(req.body.reviewId, 10);
    const isLike=await likesService.findByUserAndReview(userId,reviewId)
    if(isLike)
      return res.status(400).json({message:"이미 좋아요를 눌렀습니다"});
    const createLike=await likesService.create(userId,reviewId);
    if(createLike)
      return res.status(200).json(createLike);
    else
      return res.status(400).json({message:"생성 실패"});
  }

  async delete(req: Request, res: Response, next: NextFunction){
    const userId = req.user!.userId;
    const reviewId = parseInt(req.body.reviewId, 10);
    const del=await likesService.delete(userId,reviewId);
    if(del)
      res.status(200).json({message:"삭제성공"})
    else
      res.status(400).json({message:"삭제실패"})

  }
  
  async countByReviewId(req: Request, res: Response, next: NextFunction):Promise<any>{
    const reviewId = parseInt(req.body.reviewId, 10);
    //return await likesService.countByReviewId(reviewId);
    res.status(200).json(await likesService.countByReviewId(reviewId));
  }
}