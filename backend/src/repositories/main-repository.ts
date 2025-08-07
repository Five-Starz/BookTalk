import { Books, Reviews } from '@prisma/client';
import { prisma } from '../utils/prisma';
class MainRepository {
  // 1. 좋아요 수가 많은 리뷰
  async fetchMostLiked3Reviews(): Promise<Reviews | null> {
    // 1-1. 좋아요테이블에서 리뷰별 좋아요개수를 그룹화, 내림차순 정렬, 상위 1개 가져옴
    const result = await prisma.likes.groupBy({
      by: ['reviewId'], // 리뷰ID별로 그룹화
      _count: {
        reviewId: true, // 각 그룹(리뷰) 내에서 reviewId 값이 몇 개 있는지(좋아요 개수) 세기
      },
      orderBy: {
        _count: {
          reviewId: 'desc', // 좋아요 개수 기준 내림차순 정렬 (많은 순)
        },
      },
      take: 3, // 상위 3개 결과만 가져오기
    });

    // 1-2. 결과가 없으면 null 반환 (좋아요가 하나도 없는 경우)
    const mostLiked = result[0];
    if (!mostLiked) return null;

    // 1-3. 가장 좋아요 많은 리뷰ID를 이용해 실제 리뷰 정보 조회 후 반환
    return await prisma.reviews.findUnique({
      where: {
        reviewId: mostLiked.reviewId,
      },
    });
  }

  // 2. 오늘의 랜덤 리뷰 1개
  async fetchRandomReview(): Promise<Reviews[] | Reviews | undefined> {
    const reviews = await prisma.reviews.findMany();
    if (reviews.length === 0) return undefined;

    //1개만 반환할 때
    const randomIndex = Math.floor(Math.random() * reviews.length);
    return reviews[randomIndex];
  }

  // 3. 리뷰 수가 많은 책 (hot 10)
  async fetchMostReviewedBooks(): Promise<Books[]> {
    return await prisma.books.findMany({
      orderBy: {
        reviews: {
          _count: 'desc', // _count : 관계 필드의 개수(연결된 레코드 수)를 구할 때 쓰는 전용 예약키워드
        },
      },
      take: 10,
    });
  }

  // 4. 평점이 좋은 책 (good 10)
  async fetchTopRatedBooks(): Promise<Books[]> {
    const booksByRatingDesc = await prisma.books.findMany({
      where: {
        totalRating: { gt: 0 }, // 평균평점 > 0
      },
      include: {
        // 관련된 다른 테이블의 정보를 함께 가져오고 싶을때 사용
        _count: {
          // 관계가 있는 테이블에 대해, 몇 개가 연결되어있는지 세어줌 : 리뷰 수(_count)
          select: { reviews: true }, // reviews필드의 개수(리뷰개수) 가져옴 : 각 책마다 연결된 reviews가 몇개인지 계산
        },
      },
      orderBy: { totalRating: 'desc' },
    });

    const top10BooksWithAtLeast2Reviews = booksByRatingDesc // 리뷰 수가 2개 이상인 책만 필터링
      .filter((book) => book._count.reviews >= 2)
      .slice(0, 10); // 상위 10개만 자름

    return top10BooksWithAtLeast2Reviews;
  }

  // 5. 보고싶어요 수가 많은 책 (want 10)
  async fetchMostWishedBooks(): Promise<Books[]> {
    return await prisma.books.findMany({
      where: {
        bookmarkCount: {
          gt: 0, // 0보다 큰 것만
        },
      },
      orderBy: { bookmarkCount: 'desc' },
      take: 10,
    });
  }
}
export default MainRepository;
