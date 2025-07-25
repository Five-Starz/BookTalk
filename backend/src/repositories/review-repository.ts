import { prisma } from '../utils/prisma';
class ReviewRepository {

  // DB에 존재하는 책인지 확인
  async ensureBookExists(data: {
    isbn: string;
    title: string;
    authors: string | string[];
    publisher: string;
    publishedYear: number;
    thumbnail: string;
    description: string;    
    rating: number;
    content: string;
    userId: number;
  }) {
    const authorsString: string = Array.isArray(data.authors) ? data.authors.join(', ') : data.authors;

    // prisma에 저장할 데이터 객체
    const bookData = {
      isbn: data.isbn,
      title: data.title,
      authors: authorsString,
      publisher: data.publisher,
      publishedYear: data.publishedYear,
      thumbnail: data.thumbnail,
      description: data.description,
      totalRating: data.rating,
    };
    const book = await prisma.books.findUnique({
      where: { isbn: data.isbn },
    });

    if (!book) {  // 책이 Books테이블에 없다면 DB에 저장
      await prisma.books.create({
        data: bookData,
      });
    }
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
}
export default ReviewRepository