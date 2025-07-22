import { LikesRepository } from "../repositories/likes-repository";
const likesRepository=new LikesRepository();

export class LikesService{

  async findByUserAndReview(userId:number, reviewId:number):Promise<boolean>{
    return await likesRepository.findByUserAndReview(userId,reviewId)
  }
  async create(userId:number, reviewId:number){
    await likesRepository.create(userId,reviewId)
  }
  async delete(userId:number, reviewId:number){
    await likesRepository.delete(userId,reviewId)
  }
  async countByReviewId(reviewId:number){
    await likesRepository.countByReviewId(reviewId)
  }

};
