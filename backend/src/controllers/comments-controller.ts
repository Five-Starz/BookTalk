import { Comments } from "@prisma/client";
import { CommentsServices } from "../services/comments-servieces";
const commentsServices=new CommentsServices();

export class CommentsController{

  async findById(commentId:number):Promise<Comments|null>{
      return await commentsServices.findById(commentId)
    }
    
  async creatComment(userId:number,reviewId:number,content:string,parentId?:number):Promise<Comments>{
    return await commentsServices.creatComment(userId,reviewId,content,parentId)
  }

  async findByReviewId(reviewId:number){
    await commentsServices.findByReviewId(reviewId)
  }

  async updateComment(commentId:number,content:string){
    await commentsServices.updateComment(commentId,content)
  }

  async deleteComment(commentId:number){
    await commentsServices.deleteComment(commentId)
  }
};