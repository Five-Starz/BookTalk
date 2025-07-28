import { prisma } from '../utils/prisma';
import { Reviews } from "@prisma/client";
class ReviewRepository {
  // 리뷰 중복 여부 체크
  async hasReviewByUser(userId: number, isbn:string): Promise<boolean> {
    const existing = await prisma.reviews.findFirst({
      where: { userId, isbn },
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
}
export default ReviewRepository