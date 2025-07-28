import React, { useState, useRef } from "react";
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';

const Hot10 = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

const handleMainSlideChange = (swiper: SwiperClass) => {
    if (thumbsSwiper && thumbsSwiper.params) {
      const currentMainRealIndex = swiper.realIndex; // 메인 슬라이더의 실제 인덱스 (0-8)
      const totalSlides = swiper.slides.length; // 실제 총 슬라이드 개수 (9)

      let targetThumbsRealIndex;

      // 고객님의 특정 로직:
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
          console.log(`Main RealIndex: ${currentMainRealIndex}, Thumbs sliding to real index: ${targetThumbsRealIndex}`);
      }, 0);
    }
  };
  return (
    <div className='flex items-center justify-between gap-8'>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        // onSlideChange 이벤트 핸들러 추가
        onSlideChange={handleMainSlideChange}      
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="mySwiper2 w-full lg:w-[70%]"
      >
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788936439743.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788998441012.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791194413394.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791141602376.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791170612759.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791199311206.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex justify-between">
            <img className='max-h-[300px] rounded-xl' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791198754080.jpg" />
            <div className="bg-orange-200 w-[calc(100%-230px)] rounded-xl rounded-bl-none p-6">리뷰</div>
          </div>
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper w-[30%] !hidden lg:!block"
      >
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788936439743.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9788998441012.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791194413394.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791141602376.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791170612759.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791199311206.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img className='max-h-[150px] rounded-lg' src="https://contents.kyobobook.co.kr/sih/fit-in/300x0/pdt/9791198754080.jpg" />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Hot10
