import { Comments } from '@prisma/client';
import {CommentsRepository} from '../repositories/comments-repository';
const commentsRepository=new CommentsRepository();

export class CommentsServices{

  async findById(commentId:number):Promise<Comments|null>{
    return await commentsRepository.findById(commentId)
  };
  
  async creatComment(userId:number,reviewId:number,content:string,parentId?:number):Promise<Comments>{
    return await commentsRepository.creatComment(userId,reviewId,content,parentId)
  };

  async findByReviewId(reviewId:number){
    await commentsRepository.findByReviewId(reviewId)
  };

  async updateComment(commentId:number,content:string){
    await commentsRepository.updateComment(commentId,content)
  };

  async deleteComment(commentId:number){
    await commentsRepository.deleteComment(commentId)
  };
};