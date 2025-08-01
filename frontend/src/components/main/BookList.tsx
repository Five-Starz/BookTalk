import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { use10List } from '../../hooks/useMain';

import type { BookDetail } from '../../types/BookType'; // 'Book'도 함께 임포트합니다.

export const Good10 = () => {
  const { apiData, isLoading, error } = use10List('good');

    // 로딩, 에러, 데이터 없음 상태 처리
    if (isLoading) {
      return <div className="p-4 text-center">평점이 높은 책 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!apiData || !apiData.books || apiData.books.length === 0) {
      return <div className="p-4 text-center">평점이 높은 책 데이터를 찾을 수 없습니다.</div>;
    }

    const goodBooks = apiData.books;


  return (
    <div className="slider-container w-full">
      <h2 className='mb-4'>BookList</h2>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        slidesPerView={5}
        
        loop={true}
        navigation={true}
        watchSlidesProgress={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {goodBooks.map((book: BookDetail) => { // Book 인터페이스를 사용하여 타입 안전성 확보
          // const finalIsbn = getPrimaryIsbn(book.isbn);
          return (
            <SwiperSlide>
              <Link key={book.isbn} to={`/book/${book.isbn}`}>
                {/* 메인 슬라이더 이미지: book.thumbnail 사용 */}
                <img className='min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  );
}

export const Want10 = () => {
  const { apiData, isLoading, error } = use10List('want');

    // 로딩, 에러, 데이터 없음 상태 처리
    if (isLoading) {
      return <div className="p-4 text-center">보고 싶어요 수가 많은 책 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!apiData || !apiData.books || apiData.books.length === 0) {
      return <div className="p-4 text-center">보고 싶어요 수가 많은 책 데이터를 찾을 수 없습니다.</div>;
    }

    const wantBooks = apiData.books;


  return (
    <div className="slider-container w-full">
      <h2 className='mb-4'>BookList</h2>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        slidesPerView={5}
        loop={true}
        navigation={true}
        watchSlidesProgress={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {wantBooks.map((book: BookDetail) => { // Book 인터페이스를 사용하여 타입 안전성 확보
          return (
            <SwiperSlide>
              <Link key={book.isbn} to={`/book/${book.isbn}`}>
                {/* 메인 슬라이더 이미지: book.thumbnail 사용 */}
                <img className='min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  );
}