import React from 'react'

const BookInfo = () => {
  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className="flex justify-center md:block">
        <img
          className='rounded-lg max-w-fit max-h-[240px] sm:max-h-[280px]'
          src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg"
          alt="책 표지" />
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col justify-between lg:flex-row'>
          <div className='text-center md:text-justify'>
            <h2>책 이름</h2>
            <p>저자명</p>
            <p className='text-gray-400'>2024</p>
          </div>
          <div className='flex justify-between gap-2 mt-4 lg:mt-0'>
            <button type='button' className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-heart-plus-icon lucide-heart-plus' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"/><path d="M15 15h6"/><path d="M18 12v6"/></svg>
              보고싶어요 1000
            </button>
            <button type='button' className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-star-icon lucide-star' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
              평점 4.8
            </button>
            <button type='button' className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-pen-line-icon lucide-pen-line' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
              리뷰작성
            </button>
          </div>
        </div>
        <div className="w-full mt-4 text-gray-600">
          문학동네시인선 238번으로 최백규의 『여름은 사랑의 천사』를 펴낸다. 첫 시집 『네가 울어서 꽃은 진다』(창비, 2022)를 펴낸 2022년에 알라딘에서 진행한 ‘한국문학의 얼굴들’ 시 부문 1위에 선정되며 신인으로서는 눈에 띄는 약진을 보인 시인 최백규의 반가운 두번째 시집이다.<br />
          첫 시집 『네가 울어서 꽃은 진다』에서 시인이 불우한 청춘의 한 시절을 특유의 아름다운 목소리로 풀어냈다면, 『여름은 사랑의 천사』에서는 ‘너’라는 시적 대상과 함께한 ‘여름’이라는 계절의 속성, 그것과 닮은 뜨거운 사랑의 모습들을 더욱 호소력 짙은 감성으로 그려낸다.<br />
          또한 유년, 가족, 노동, 생활의 이력 등에 대한 시인의 자전적인 면모가 담긴 시를 읽는 기쁨도 크다. 『여름은 사랑의 천사』는 사랑과 청춘, 이별과 그리움, 가난과 허무, 그리고 슬픔과 정념이 넘실거리는 여름의 한복판으로 독자를 데려가는 그야말로 ‘여름 시집’이다.
          </div>
      </div>
    </div>
  )
}

export default BookInfo
