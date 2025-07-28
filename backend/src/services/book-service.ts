// 서비스 = 요청에 대한 처리 파일
// 처리 흐름, 트랜잭션
import { Books } from '@prisma/client';
import axios from 'axios';  // Node.js 서버에서 외부 API 호출할 때 필요
// import BookRepository from '../repositories/book-repository'
// const bookRepository = new BookRepository();

class BookService {
  private KAKAO_API_URL = 'https://dapi.kakao.com/v3/search/book';
  private KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  // 1. 도서 검색
  async searchBooksByQuery(query: string): Promise<Books | null> {
    const encodedQuery = encodeURIComponent(query); // URL에 넣기 안전한 문자열로 바꿈

    const response = await axios.get(`${this.KAKAO_API_URL}?query=${encodedQuery}`, {
      headers: {
        Authorization: `KakaoAK ${this.KAKAO_API_KEY}`,
      },
    });

    // API 응답 중 프론트에 필요한 정보만 필터링해서 반환
    const books = response.data.documents.map((book:any) => ({
      isbn: book.isbn,
      title: book.title,  // 책 제목
      authors: book.authors,  // 저자명
      publisher: book.publisher,  // 출판사명
      thumbnail: book.thumbnail,  // 썸네일
      description: book.contents, // 책 설명
      publishedYear: book.datetime ? parseInt(book.datetime?.slice(0,4), 10): null  // 출간연도
    }));
    return books; // 결과 반환
  }
}
export default BookService