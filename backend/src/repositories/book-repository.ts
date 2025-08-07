import { Books } from '@prisma/client';
import { prisma } from '../utils/prisma';
class BookRepository {
  // 1. DB에 존재하는 책인지 확인 -> 없다면 DB에 저장
  async ensureBookExists(data: {
    isbn: string;
    title: string;
    authors: string | string[];
    publisher: string;
    publishedYear: number;
    thumbnail: string;
    description: string;
    rating?: number;
    content: string;
    userId: number;
  }) {
    const authorsString: string = Array.isArray(data.authors)
      ? data.authors.join(', ')
      : data.authors;

    // 공백이 있다면 isbn-13만 잘라내기(공백제거)
    const slicedISBN = data.isbn.includes(' ') ? data.isbn.split(' ')[1] : data.isbn;
    // 만약 공백없이 isbn 하나만 들어오는 경우 undefined 저장될 수 있어 옵셔널체이닝(??) 처리

    // prisma에 저장할 데이터 객체
    const bookData = {
      isbn: slicedISBN,
      title: data.title,
      authors: authorsString,
      publisher: data.publisher,
      publishedYear: data.publishedYear,
      thumbnail: data.thumbnail,
      description: data.description,
      totalRating: data.rating ?? null, // rating이 없으면 null로 저장
    };
    const book = await prisma.books.findUnique({
      where: { isbn: slicedISBN },
    });

    if (!book) {
      // 책이 Books테이블에 없다면 DB에 저장
      await prisma.books.create({
        data: bookData,
      });
    }
    return slicedISBN; // 잘라낸 isbn 돌려줘야 review-repository 에서도 쓴다.
  }

  // 2. 책 정보로 리뷰조회할 대상 책 객체 조회
  async getBookInfo(isbn: string): Promise<Books | null> {
    const bookInfo: Books | null = await prisma.books.findUnique({
      where: { isbn }, // DB 내 책 조회
    });

    if (!bookInfo) {
      throw new Error(`해당 ISBN(${isbn})에 해당하는 책이 존재하지 않습니다.`);
    }

    return bookInfo;
  }

  // 3. 평균평점 조회를 위해
  async getAllRatingsByBook(isbn: string): Promise<number[] | null> {
    const reviews = await prisma.reviews.findMany({
      where: { isbn },
      select: { rating: true }, // rating만 가져옴
    });

    if (reviews.length === 0) return null;

    // Decimal -> Number로 변환
    const ratings = reviews.map((review) => Number(review.rating));

    return ratings;
  }

  // 4. 랜덤 도서 조회
  async getRandomBooks(): Promise<Books[] | null> {
    // 모든 책들의 ISBN만 배열로 가져옴
    const allBooksISBN = await prisma.books.findMany({
      select: { isbn: true },
    });

    // ISBN배열들 랜덤으로 정렬(순서 섞기)
    const shuffled = allBooksISBN.sort(() => Math.random() - 0.5);

    // 15개 ISBN만 꺼낸 배열
    const selectedISBNs = shuffled.slice(0, 15).map((book) => book.isbn);

    // 선택된 ISBN 15개로 책 다시 조회
    const randomBooks = await prisma.books.findMany({
      where: {
        isbn: {
          in: selectedISBNs,
        },
      },
    });

    return randomBooks;
  }
}

export default BookRepository;
