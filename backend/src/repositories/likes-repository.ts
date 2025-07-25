import { Likes } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class LikesRepository{

  //특정 리뷰에 좋아요 누른 특정 사용자 검색 (존재하면 T 아니면 F)
  async findByUserAndReview(userId:number, reviewId:number):Promise<boolean>{    
    return await prisma.likes.findUnique({
      where:
        {userId_reviewId:{userId,reviewId}
      }}) 
      ? true : false;
  };

  //근데 한번 눌렀으면 또 못누르게 설정을 해야하는데 findByUserAndReview검색 후에 없으면 생성되도록 설정해야 함
  async create(userId:number, reviewId:number):Promise<Likes>{
    return await prisma.likes.create({
      data:{userId,reviewId}
    });
  };
  
  async delete(userId:number, reviewId:number):Promise<boolean>{
    const deleteLike=await prisma.likes.delete({
      where:{
        userId_reviewId:{
          userId,reviewId
        }
      }
    });
    if(deleteLike)
      return true
    else
      return false
  };  

  //특정 리뷰 좋아요 개수
  async countByReviewId(reviewId:number):Promise<number>{
    return await prisma.likes.count({
      where: {
        reviewId
      }
    })
  };
};