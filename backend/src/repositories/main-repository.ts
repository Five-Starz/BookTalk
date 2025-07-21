import { Books, Reviews } from '@prisma/client';
import { prisma } from '../utils/prisma';

class MainRepository {
  // 1. 좋아요 수가 많은 리뷰 1개
  async fetchMostLikedReviews(): Promise<Reviews | null> {
    return await prisma.reviews.findFirst({
      orderBy: { count: 'desc' },
    });
  };

  // 2. 오늘의 랜덤 리뷰 1개
  async fetchRandomReview(): Promise<Reviews | undefined> {
    const reviews = await prisma.reviews.findMany();
    if (reviews.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * reviews.length);
    return reviews[randomIndex];
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  async fetchMostReviewedBooks(): Promise<Books[]> {
    return await prisma.books.findMany({
      orderBy: {
        reviews: {
          _count: 'desc', // _count : 관계 필드의 개수(연결된 레코드 수)를 구할 때 쓰는 전용 예약키워드
        }
      },
      take: 10,
    });
  };

  // 4. 평점이 좋은 책 (good 10)
  async fetchTopRatedBooks(): Promise<Books[]> {
    return await prisma.books.findMany({
      orderBy: { totalRating: 'desc' },
      take: 10,
    });
  };

  // // 5. 보고싶어요 수가 많은 책 (want 10) - DB에 컬럼 아직 없음. 만들어야함
  // async fetchMostWishedBooks(): Promise<Books[]> {
  //   return await prisma.books.findMany({
  //     orderBy: { 안만들어짐??: 'desc' },
  //     take: 10,
  //   });
  // };
}
export default MainRepository