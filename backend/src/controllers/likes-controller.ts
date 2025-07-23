import { Request, Response, NextFunction } from 'express';  
import { LikesService } from "../services/likes-services";
const likesService=new LikesService();

export class LikesController{
  
  async findByUserAndReview(userId:number, reviewId:number):Promise<boolean>{
    return await likesService.findByUserAndReview(userId,reviewId)
  }

  async create(req: Request, res: Response, next: NextFunction){
    const userId = parseInt(req.body.userId, 10);
    const reviewId = parseInt(req.body.reviewId, 10);
    await likesService.create(userId,reviewId);
  }

  async delete(req: Request, res: Response, next: NextFunction){
    const userId = parseInt(req.body.userId, 10);
    const reviewId = parseInt(req.body.reviewId, 10);
    await likesService.delete(userId,reviewId);
  }
  
  async countByReviewId(req: Request, res: Response, next: NextFunction){
    const reviewId = parseInt(req.body.reviewId, 10);
    await likesService.countByReviewId(reviewId);
  }
}