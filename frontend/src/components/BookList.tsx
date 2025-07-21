import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // 모듈 임포트
import type { Swiper as SwiperClass } from 'swiper'; // Swiper 인스턴스에 대한 타입 임포트
import '../../node_modules/swiper/swiper.css'

interface MySwiperProps {
  slides: string[];
}

const BookList: React.FC<MySwiperProps> = ({ slides })  => {
  return (
    <div>
      <h3>제목</h3>
      <Swiper
        modules={[Navigation]} // 사용할 모듈 지정
        spaceBetween={20} // 슬라이드 간의 간격
        slidesPerView={5} // 한 번에 보여줄 슬라이드 개수
        navigation={true} // 좌우 화살표 표시
        loop={false} // 무한 반복
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper: SwiperClass) => console.log(swiper)}
      >
        {slides.map((slide, index) => (
          <div>
            <SwiperSlide key={index}>
              <img src={slide} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </SwiperSlide>
            <h4>책 제목</h4>
            <p>저자명</p>
          </div>
        ))}
      </Swiper>
    </div>
  )
}

export default BookList
