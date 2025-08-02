import { Comments } from '@prisma/client';
import {CommentsRepository} from '../repositories/comments-repository';
const commentsRepository=new CommentsRepository();

export class CommentsServices{

  async findById(userId:number):Promise<Comments[]>{
    return await commentsRepository.findById(userId);
  };
  
  async creatComment(userId:number,reviewId:number,content:string,parentId:number|null):Promise<Comments>{
    return await commentsRepository.creatComment(userId,reviewId,content,parentId);
  };

  async findByReviewId(reviewId:number):Promise<Comments[]>{
    console.log('ser')
    return await commentsRepository.findByReviewId(reviewId);
  };

  async updateComment(userId:number,commentId:number,content:string):Promise<Comments>{
    return await commentsRepository.updateComment(userId,commentId,content);
  };

  //삭제 상태 변경
  async deleteComment(userId:number,commentId:number):Promise<boolean>{
    return await commentsRepository.deleteComment(userId,commentId);
  };

  //실제 삭제
  async deleteComment2(commentId:number):Promise<boolean>{
    return await commentsRepository.deleteComment2(commentId);
  };
  async countReviewComment(reviewId:number){
    return commentsRepository.countReviewComment(reviewId);
  }
};