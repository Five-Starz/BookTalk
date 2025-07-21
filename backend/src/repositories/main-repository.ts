import { prisma } from '../utils/prisma';

export class MainRepository {
  // 1. 좋아요 수가 많은 리뷰
  static async fetchMostLikedReviews() {
    return await prisma.reviews.findMany({
      orderBy: { likes: 'desc' },
      take: 10,
    });
  };

  // 2. 오늘의 랜덤 리뷰
  static async fetchRandomReview() {
    const reviews = await prisma.reviews.findMany();
    const randomIndex = Math.floor(Math.random() * reviews.length);
    return reviews[randomIndex];
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  static async fetchMostReviewedBooks() {
    return await prisma.books.findMany({
      orderBy: { reviewCount: 'desc' },
      take: 10,
    });
  };

  // 4. 평점이 좋은 책 (good 10)
  static async fetchTopRatedBooks() {
    return await prisma.books.findMany({
      orderBy: { averageRating: 'desc' },
      take: 10,
    });
  };

  // 5. 보고싶어요 수가 많은 책 (want 10)
  static async fetchMostWishedBooks() {
    return await prisma.books.findMany({
      orderBy: { wishCount: 'desc' },
      take: 10,
    });
  };
}