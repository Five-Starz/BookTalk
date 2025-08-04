import { prisma } from '../utils/prisma';
import { Reviews } from "@prisma/client";
class ReviewRepository {
  // 리뷰 중복 여부 체크
  async hasUserReviewedBook(userId: number,isbn: string) {
    const isDuplicated = await prisma.reviews.findFirst({
      where: { userId, isbn },
    });
    return !!isDuplicated;  // 반환값이 boolean일 때는 !!를 붙여줘야 한다.
  }


  // userId가 작성한 reviewId가 있는지 검증(없을시 수정, 삭제 불가)
  async hasReviewByUser(reviewId:number, userId: number): Promise<boolean> {
    const existing = await prisma.reviews.findFirst({
      where: { userId, reviewId },
    });
    return !!existing;  // 반환값이 boolean일 때는 !!를 붙여줘야 한다.
  }

  // 리뷰 등록
  async createReview(data: {
    isbn: string;
    rating: number;
    content: string;
    userId: number;
  }) {
    return await prisma.reviews.create({
      data: {
        isbn: data.isbn,
        rating: data.rating,
        content: data.content,
        userId: data.userId,
      },
    });
  }

  // 특정 책의 리뷰 조회
  async searchReviewsByISBN(isbn: string): Promise<Reviews[]> {
    return await prisma.reviews.findMany({
      where: { isbn: isbn },
    });
  }

  // 특정 사용자의 특정 책 reviewId 가져오기
  async getReviewIdByUserIdAndISBN(userId: number): Promise<number | undefined> {
    const reviewId = await prisma.reviews.findFirst({
      where: { userId },
    });
    if (reviewId == null) {
      console.log('[review-repository error] reviewId가 null임');
    }
    return reviewId?.reviewId;
  }

  // 리뷰 수정
  async updateReview(reviewId: number, data: {
    rating: number;
    content: string;
    userId: number;
  }) {
    return await prisma.reviews.update({
      where: { reviewId },
      data: {
        rating: data.rating,
        content: data.content,
        userId: data.userId,
      },
    });
  }

  // 리뷰 삭제
  async deleteReview(reviewId: number, userId: number) {
    return await prisma.reviews.delete({
      where: { reviewId, userId },
    });
  }


  async findReviewByUserId(userId:number):Promise<Reviews[]>{
    return await prisma.reviews.findMany({
      where:{userId}
    })
  };

  async UserReviewCount(userId:number){
    return await prisma.reviews.count({
      where:{userId}
    });
  };

  async findById(reviewId:number){
    return await prisma.reviews.findUnique({
      where:{reviewId}
    });
  };
} 
  
export default ReviewRepository