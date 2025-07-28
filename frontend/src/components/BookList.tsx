import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// https://velog.io/@owlsuri/React-slick-Custom 참고할 것

function BookList() {
  return (
    <div className="slider-container w-full">
      <h2>BookList</h2>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        slidesPerView={5}
        loop={true}
        watchSlidesProgress={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788936439743.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788998441012.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791194413394.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791141602376.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791170612759.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791199311206.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[280px] rounded-lg mb-4' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791198754080.jpg" />
          <h4>책제목</h4>
          <p>저자명</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default BookList;