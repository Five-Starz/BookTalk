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

  async updateComment(commentId:number,content:string):Promise<Comments>{
    return await commentsRepository.updateComment(commentId,content);
  };

  async deleteComment(commentId:number):Promise<boolean>{
    return await commentsRepository.deleteComment(commentId);
  };
};