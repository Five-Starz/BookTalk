import React, {useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { use10List } from '../../hooks/useMain';

import type { BookDetail } from '../../types/BookType'; // 'Book'도 함께 임포트합니다.

export const Hot10 = () => {
  const { apiData, isLoading, error } = use10List('hot');

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

    // 로딩, 에러, 데이터 없음 상태 처리
    if (isLoading) {
      return <div className="p-4">리뷰가 많은 책 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!apiData || !apiData.books || apiData.books.length === 0) {
      return <div className="p-4">리뷰가 많은 책 데이터를 찾을 수 없습니다.</div>;
    }

const handleMainSlideChange = (swiper: SwiperClass) => {
    if (thumbsSwiper && thumbsSwiper.params) {
      const currentMainRealIndex = swiper.realIndex; // 메인 슬라이더의 실제 인덱스 (0-8)
      const totalSlides = swiper.slides.length; // 실제 총 슬라이드 개수 (9)

      let targetThumbsRealIndex;

      // mySwiper2가 9번 슬라이드(인덱스 8)를 보여줄 때, mySwiper는 0, 1, 2를 보여주도록 함
      if (currentMainRealIndex === totalSlides - 1) { // 메인 슬라이더가 마지막 슬라이드(인덱스 8)에 있는 경우
        targetThumbsRealIndex = 0; // 썸네일의 첫 번째 세트를 보여주도록 강제
      } else {
        // 그렇지 않으면, 현재 메인 슬라이더 다음 슬라이드를 보여줌
        targetThumbsRealIndex = currentMainRealIndex + 1;
      }

      setTimeout(() => {
          // 루프 모드에서 정확한 realIndex 탐색을 위해 slideToLoop 사용
          thumbsSwiper.slideToLoop(targetThumbsRealIndex);
      }, 0);
    }
  };
  return (
    <div>
      <h2 className='mb-4'>Hot10</h2>
      <div className='mySwiper2-wrap relative flex items-center justify-between lg:gap-8'>
        <Swiper
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          // onSlideChange 이벤트 핸들러 추가
          onSlideChange={handleMainSlideChange}
          loop={true}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current}}
          modules={[Navigation, Thumbs]}
          className="mySwiper2 w-full lg:w-[70%]"
        >
          {apiData.books.map((book: BookDetail, index) => ( // Book 인터페이스를 사용하여 타입 안전성 확보
            <SwiperSlide> {/* key는 고유한 값으로 설정 (isbn이 적합) */}
              <Link key={book.isbn} to={`/book/${book.isbn}`}>
                <div className="relative flex flex-col gap-4 items-center md:flex-row md:gap-0 md:justify-between">
                  {/* 순위 추가 */}
                  {index+1 === 1 ? (
                    <h3 className='absolute top-[-5px] left-[-5px] flex justify-center items-center bg-orange-600 rounded-full w-[2.5rem] h-[2.5rem] text-white z-10'>{index+1}</h3>
                  ) : (
                    <h4 className='absolute top-[-5px] left-[-5px] flex justify-center items-center bg-gray-200 rounded-full w-[2rem] h-[2rem] z-10'>{index+1}</h4>
                  )}
                  <img className='h-[200px] md:min-h-[300px] rounded-xl' src={book.thumbnail} alt={book.title} />
                  <div className="bg-orange-200 w-full md:w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">
                    <h2 className="mb-4">{book.title}</h2>
                    {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                    <p className="author text-sm mb-10">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                    {/* TODO: 여기에 실제 리뷰 내용이나 요약 등을 추가할 수 있습니다. */}
                    <p>{book.description.substring(0, 100)}...</p> {/* 예시: contents 일부 표시 */}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-navigation">
          <button className='swiper_prev swiper-button-prev' ref={prevRef}></button>
          <button className='swiper_next swiper-button-next' ref={nextRef}></button>
        </div>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={3}
          loop={true}
          watchSlidesProgress={true}
          modules={[Navigation, Thumbs]}
          className="mySwiper w-[30%] !hidden lg:!block"
        >
          {apiData.books.map((book: BookDetail) => ( // 썸네일 슬라이더 이미지: book.thumbnail 사용
            <SwiperSlide key={book.isbn + "-thumb"}> {/* 썸네일도 고유한 key가 필요 */}
              <img className='max-h-[150px] rounded-lg' src={book.thumbnail} alt={book.title + " thumbnail"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}


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
          watchSlidesProgress={true}
          navigation={{ prevEl: prev1Ref.current, nextEl: next1Ref.current}}
          modules={[Navigation]}
          className="mySwiper"
        >
          {goodBooks.map((book: BookDetail, index) => { // Book 인터페이스를 사용하여 타입 안전성 확보
            return (
              <SwiperSlide key={index}>
                <Link key={book.isbn} to={`/book/${book.isbn}`}>
                  {/* 순위 추가 */}
                  {index+1 === 1 ? (
                    <h3 className='absolute top-[-5px] left-[-5px] flex items-center justify-center bg-orange-300 rounded-full w-[2.5rem] h-[2.5rem] p-1 z-10'>{index+1}</h3>
                  ) : (
                    <h4 className='absolute top-[-5px] left-[-5px] flex items-center justify-center bg-white rounded-full w-[2rem] h-[2rem] p-1 z-10'>{index+1}</h4>
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
    console.log(wantBooks)

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
          watchSlidesProgress={true}
          navigation={{ prevEl: prev2Ref.current, nextEl: next2Ref.current}}
          modules={[Navigation]}
          className="mySwiper"
        >
          {wantBooks.map((book: BookDetail, index) => { // Book 인터페이스를 사용하여 타입 안전성 확보
            return (
              <SwiperSlide key={index}>
                <Link key={book.isbn} to={`/book/${book.isbn}`}>
                  {/* 순위 추가 */}
                  {index+1 === 1 ? (
                    <h3 className='absolute top-[-5px] left-[-5px] flex items-center justify-center bg-orange-300 rounded-full w-[2.5rem] h-[2.5rem] p-1 z-10'>{index+1}</h3>
                  ) : (
                    <h4 className='absolute top-[-5px] left-[-5px] flex items-center justify-center bg-white rounded-full w-[2rem] h-[2rem] p-1 z-10'>{index+1}</h4>
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
          <button className='swiper_prev swiper-button-prev goodPrev' ref={prev2Ref}></button>
          <button className='swiper_next swiper-button-next goodNext' ref={next2Ref}></button>
        </div>
      </div>
    </div>
  );
}