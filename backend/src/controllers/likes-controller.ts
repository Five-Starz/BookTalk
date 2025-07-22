import { LikesService } from "../services/likes-services";
const likesService=new LikesService();

export class LikesController{
  
  async findByUserAndReview(userId:number, reviewId:number):Promise<boolean>{
    return await likesService.findByUserAndReview(userId,reviewId)
  }

  async create(userId:number, reviewId:number){
    await likesService.create(userId,reviewId)
  }

  async delete(userId:number, reviewId:number){
    await likesService.delete(userId,reviewId)
  }
  
  async countByReviewId(reviewId:number){
    await likesService.countByReviewId(reviewId)
  }
}
