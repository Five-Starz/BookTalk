import { Request, Response, NextFunction } from 'express';  
import { Comments } from "@prisma/client";
import { CommentsServices } from "../services/comments-servieces";
const commentsServices=new CommentsServices();
export class CommentsController{

  async findById(req: Request, res: Response, next: NextFunction):Promise<Comments|null>{
    console.log(req.params.userid)
      const userId=parseInt(req.params.userid, 10);
      return await commentsServices.findById(userId)
    }
    
  async creatComment(req: Request, res: Response, next: NextFunction):Promise<Comments>{
    const {content}=req.body;
    const userId=parseInt(req.body.userId, 10);
    const reviewId=parseInt(req.body.reviewId, 10);
    let parentId: number | null = null;
    // req.body.parentId가 존재하고 빈 문자열이 아닌 경우에만 파싱 시도
    if(req.body.parentId !== undefined && req.body.parentId !== null && req.body.parentId !== '')
      parentId=parseInt(req.body.parentId, 10);    
    return await commentsServices.creatComment(userId,reviewId,content,parentId)
  }

  async findByReviewId(req: Request, res: Response, next: NextFunction){
    const reviewId=parseInt(req.params.reviewId, 10);
    await commentsServices.findByReviewId(reviewId)
  }

  async updateComment(req: Request, res: Response, next: NextFunction){
    const commentId=parseInt(req.body.commentId, 10);
    const {content}=req.body;    
    await commentsServices.updateComment(commentId,content)
  }

  async deleteComment(req: Request, res: Response, next: NextFunction){
    const commentId=parseInt(req.params.commentId, 10);
    await commentsServices.deleteComment(commentId)
  }
};