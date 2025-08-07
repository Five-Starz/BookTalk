// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import { Books } from '@prisma/client';
import axios from 'axios'; // Node.js 서버에서 외부 API 호출할 때 필요
import BookRepository from '../repositories/book-repository';
const bookRepository = new BookRepository();

class BookService {
  private KAKAO_API_URL = 'https://dapi.kakao.com/v3/search/book';
  private KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  // 1. Kakao API에 도서 검색
  async searchBooksByQuery(query: string): Promise<Books | null> {
    const encodedQuery = encodeURIComponent(query); // URL에 넣기 안전한 문자열로 바꿈

    const response = await axios.get(`${this.KAKAO_API_URL}?query=${encodedQuery}`, {
      headers: {
        Authorization: `KakaoAK ${this.KAKAO_API_KEY}`,
      },
      params: {
        target: 'title', // 검색 필드 제한: title(제목)
        query: `${encodedQuery}`, // 검색을 원하는 질의어
        size: 50, // 한 페이지에 보여질 문서 수: 50개
      },
    });

    // API 응답 중 프론트에 필요한 정보만 필터링해서 반환
    const books = response.data.documents.map((book: any) => ({
      isbn: book.isbn,
      title: book.title, // 책 제목
      authors: book.authors, // 저자명
      publisher: book.publisher, // 출판사명
      thumbnail: book.thumbnail, // 썸네일
      description: book.contents, // 책 설명
      publishedYear: book.datetime ? parseInt(book.datetime?.slice(0, 4), 10) : null, // 출간연도
    }));
    return books; // 결과 반환
  }

  // 2. 도서 별 평균평점 계산
  async getAverageRatingByBook(
    isbn: string
  ): Promise<{ avgRating: number | null; reviewCount: number } | null> {
    let rating: number[] | null = await bookRepository.getAllRatingsByBook(isbn); // 전체 점수 받아와

    // 리뷰가 없어서 평점이 없으면 평균평점 제공 불가
    if (!rating || rating.length === 0) return null;
    // 리뷰 1개일때는 {평균평점 null, 리뷰개수} 는 반환
    if (rating.length < 2) {
      return { avgRating: null, reviewCount: rating.length };
    }

    // 평균 계산
    let sumRating = rating.reduce((sum, cur) => sum + cur, 0);
    const avgRating = parseFloat((sumRating / rating.length).toFixed(2));

    return { avgRating, reviewCount: rating.length };
  }

  // 2. DB에 도서 검색
  async searchBookByISBN(isbn: string): Promise<Books | null> {
    return await bookRepository.getBookInfo(isbn);
  }

  // 랜덤 도서 조회
  async getRandomBooks(): Promise<Books[] | null> {
    return await bookRepository.getRandomBooks();
  }
}
export default BookService;
