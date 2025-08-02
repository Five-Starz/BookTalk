import { Request, Response, NextFunction } from 'express';  
import { Comments } from "@prisma/client";
import { CommentsServices } from "../services/comments-servieces";
const commentsServices=new CommentsServices();
export class CommentsController{

  async findById(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId=parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
    console.error('유효하지 않은 userId 형식:', req.params.userId);
    return res.status(400).json({ message: '유효하지 않은 userId 형식입니다.' });
  }
    const userComments= await commentsServices.findById(userId);
    if(userComments.length>0)
      return res.status(200).json(userComments);
    else
      return res.status(404).json({message:"해당 유저의 댓글이 존재하지 않습니다."});
  }
    
  async creatComment(req: Request, res: Response, next: NextFunction):Promise<any>{
    const {content}=req.body;
    //const userId=parseInt(req.body.userId, 10);
    const userId = req.user!.userId;
    const reviewId=parseInt(req.body.reviewId, 10);
    let parentId: number | null = null;
    // req.body.parentId가 존재하고 빈 문자열이 아닌 경우에만 파싱 시도
    if(req.body.parentId !== undefined && req.body.parentId !== null && req.body.parentId !== '')
      parentId=parseInt(req.body.parentId, 10);    
    const creatComment=await commentsServices.creatComment(userId,reviewId,content,parentId);
    if(creatComment)
      return res.status(200).json(creatComment);
    else
      return res.status(404).json({message:"등록 실패"});
  };

  async findByReviewId(req: Request, res: Response, next: NextFunction){
    const reviewId=parseInt(req.params.reviewId, 10);
    const reviewComments=await commentsServices.findByReviewId(reviewId);
    if(reviewComments.length>0)
      return res.status(200).json(reviewComments);
    else
      return res.status(404).json({message:"해당 리뷰에 댓글이 존재하지 않습니다."});
  };

  async updateComment(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = req.user!.userId; //Non-null assertion operator : null 값이 아님을 확신
    const commentId=parseInt(req.body.commentId, 10);
    const {content}=req.body;    
    const updateComment=await commentsServices.updateComment(userId,commentId,content);
    if(updateComment)
      return res.status(200).json(updateComment);
    else
      return res.status(404).json({message:"수정 실패"});
  };

  //삭제 상태 변경
  async deleteComment(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = req.user!.userId; 
    const commentId=parseInt(req.params.commentId, 10);
    const deleteComment=await commentsServices.deleteComment(userId,commentId); 
    if(!deleteComment)
      return res.status(404).json({message:"삭제 실패"});
    else      
      return res.status(200).json({message:"삭제 성공"});
  };

  //실제 삭제
  async deleteComment2(req: Request, res: Response, next: NextFunction):Promise<any>{
    const commentId=parseInt(req.params.commentId, 10);
    const deleteComment=await commentsServices.deleteComment2(commentId); 
    if(!deleteComment)
      return res.status(404).json({message:"삭제 실패"});
    else      
      return res.status(200).json({message:"삭제 성공"});
  };

  async countReviewComment(req: Request, res: Response, next: NextFunction){
    const reviewId=parseInt(req.params.reviewId,10);
    return res.status(200).json(await commentsServices.countReviewComment(reviewId));
  }
};