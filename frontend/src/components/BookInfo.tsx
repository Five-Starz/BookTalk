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
        <div className='flex-wrap justify-between md:flex'>
          <div className='text-center md:text-justify'>
            <h2>책 이름</h2>
            <p>저자명</p>
            <p className='text-gray-400'>2024</p>
          </div>
          <div className='flex justify-between text-center gap-2 mt-4 lg:mt-0'>
            <button type='button' className="w-1/3 sm:w-[150px]">
              보고싶어요 1000
            </button>
            <button type='button' className="w-1/3 sm:w-[150px]">
              평점 4.8
            </button>
            <button type='button' className="w-1/3 sm:w-[150px]">
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
