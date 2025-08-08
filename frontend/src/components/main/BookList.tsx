import React, {useRef} from 'react';
import { Link } from 'react-router-dom';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { use10List } from '../../hooks/useMain';

import type { BookDetail } from '../../types/BookType'; // 'Book'도 함께 임포트합니다.

export const Good10 = () => {
  const { apiData, isLoading, error } = use10List('good');
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const prev1Ref = useRef(null);
  const next1Ref = useRef(null);

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
      <h2 className='mb-4'>Good10</h2>
      <div className='mySwiper-wrap relative'>
        <Swiper
          style={{
            '--swiper-navigation-color': '#000',
          } as React.CSSProperties}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          breakpoints={{
            375: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            500: {
              slidesPerView: 3,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30
            }
          }}
          loop={true}
          watchSlidesProgress={true}
          navigation={{ prevEl: prev1Ref.current, nextEl: next1Ref.current}}
          modules={[Navigation]}
          className="mySwiper"
        >
          {goodBooks.map((book: BookDetail, index) => { // Book 인터페이스를 사용하여 타입 안전성 확보
            // const finalIsbn = getPrimaryIsbn(book.isbn);
            return (
              <SwiperSlide key={index}>
                <Link key={book.isbn} to={`/book/${book.isbn}`}>
                  {/* 순위 추가 */}
                  {index+1 === 1 ? (
                    <h3 className='absolute top-0 left-0 bg-orange-300 rounded-full w-[2.5rem] h-[2.5rem] p-1'>{index+1}</h3>
                  ) : (
                    <h4 className='absolute top-0 left-0 bg-white rounded-full w-[2rem] h-[2rem] p-1'>{index+1}</h4>
                  )}
                  <img className='relative object-cover max-h-[200px] md:min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title.length > 18 ? (book.title.slice(0,18)+'...'): book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
        <div className="swiper-navigation">
          <button className='swiper_prev swiper-button-prev goodPrev' ref={prev1Ref}></button>
          <button className='swiper_next swiper-button-next goodNext' ref={next1Ref}></button>
        </div>
      </div>
    </div>
  );
}

export const Want10 = () => {
  const { apiData, isLoading, error } = use10List('want');
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const prev2Ref = useRef(null);
  const next2Ref = useRef(null);

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
      <h2 className='mb-4'>Want10</h2>
      <div className='mySwiper-wrap relative'>
        <Swiper
          style={{
            '--swiper-navigation-color': '#000',
          } as React.CSSProperties}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          breakpoints={{
            375: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            500: {
              slidesPerView: 3,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30
            }
          }}
          loop={true}
          watchSlidesProgress={true}
          navigation={{ prevEl: prev2Ref.current, nextEl: next2Ref.current}}
          modules={[Navigation]}
          className="mySwiper"
        >
          {wantBooks.map((book: BookDetail, index) => { // Book 인터페이스를 사용하여 타입 안전성 확보
            return (
              <SwiperSlide>
                <Link key={book.isbn} to={`/book/${book.isbn}`}>
                  {/* 순위 추가 */}
                  {index+1 === 1 ? (
                    <h3 className='absolute top-0 left-0 bg-orange-300 rounded-full w-[2.5rem] h-[2.5rem] p-1'>{index+1}</h3>
                  ) : (
                    <h4 className='absolute top-0 left-0 bg-white rounded-full w-[2rem] h-[2rem] p-1'>{index+1}</h4>
                  )}
                  <img className='object-cover max-h-[200px] md:min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title.length > 18 ? (book.title.slice(0,18)+'...'): book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
        <div className="swiper-navigation">
          <button className='swiper_prev swiper-button-prev goodPrev' ref={prev2Ref}></button>
          <button className='swiper_next swiper-button-next goodNext' ref={next2Ref}></button>
        </div>
      </div>
    </div>
  );
}