import { Books } from "@prisma/client";
import { prisma } from "../utils/prisma"
class BookRepository {
  // 1. DB에 존재하는 책인지 확인
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

  // 2. 책 정보로 리뷰조회할 대상 책 객체 조회
  async getBookInfo(isbn: string): Promise<Books | null>{
    const bookInfo: Books | null = await prisma.books.findUnique({
      where: { isbn: isbn },
    });

    if (!bookInfo) {
      throw new Error(`해당 ISBN(${isbn})에 해당하는 책이 존재하지 않습니다.`);
    }

    return bookInfo;
  }
}

export default BookRepository