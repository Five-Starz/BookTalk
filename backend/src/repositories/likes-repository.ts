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
    });
  };

  //해당 리뷰에 좋아요를 누른 사람들만 가져옴(아직 미완)
  async findByReviewIdForUserId(reviewId:number){
    return await prisma.likes.findMany({
      where:{reviewId},
      select:{userId:true}
    });
    /* 
    //이 부분은 리뷰 컨트롤러가 생기면 거기서 넣어야 함
    //방식 : findByReviewIdForUserId을 실행해서 userId를 받아오고 리뷰 테이블에 userId가 있는 것만 찾은 뒤 5개든 뭐든 랜덤으로 가져오기
    // 랜덤으로 요소 교환
    for (let i = reviewIdNum.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reviewIdNum[i], reviewIdNum[j]] = [reviewIdNum[j], reviewIdNum[i]]; 
    };

    return reviewIdNum.slice(0, 5); //0~5까지 돌려줌
    */
  };
};