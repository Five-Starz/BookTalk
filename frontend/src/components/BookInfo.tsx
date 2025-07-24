import React from 'react'
import BookCard from './ui/BookCard'

const BookInfo = () => {
  return (
    <div className="m-auto w-[calc(80%)] flex flex-col">
      <div className='flex gap-4'>
        <img className='rounded-lg min-h-[180px]' src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg"/>
        <div className='flex flex-1 flex-wrap justify-between'>
          <div className='flex flex-col'>
            <h3>책 이름</h3>
            <p>저자명</p>
            <p className='text-gray-400'>2024</p>
          </div>
          <div className='flex justify-between text-center'>
            <div className="w-[150px]">
              보고싶어요 1000
            </div>
            <div className="w-[150px]">
              평점 4.8
            </div>
            <div className="w-[150px]">
              리뷰작성
            </div>
          </div>
          <div className="w-full text-gray-600">
            문학동네시인선 238번으로 최백규의 『여름은 사랑의 천사』를 펴낸다. 첫 시집 『네가 울어서 꽃은 진다』(창비, 2022)를 펴낸 2022년에 알라딘에서 진행한 ‘한국문학의 얼굴들’ 시 부문 1위에 선정되며 신인으로서는 눈에 띄는 약진을 보인 시인 최백규의 반가운 두번째 시집이다.<br />
            첫 시집 『네가 울어서 꽃은 진다』에서 시인이 불우한 청춘의 한 시절을 특유의 아름다운 목소리로 풀어냈다면, 『여름은 사랑의 천사』에서는 ‘너’라는 시적 대상과 함께한 ‘여름’이라는 계절의 속성, 그것과 닮은 뜨거운 사랑의 모습들을 더욱 호소력 짙은 감성으로 그려낸다.<br />
            또한 유년, 가족, 노동, 생활의 이력 등에 대한 시인의 자전적인 면모가 담긴 시를 읽는 기쁨도 크다. 『여름은 사랑의 천사』는 사랑과 청춘, 이별과 그리움, 가난과 허무, 그리고 슬픔과 정념이 넘실거리는 여름의 한복판으로 독자를 데려가는 그야말로 ‘여름 시집’이다.
            또한 유년, 가족, 노동, 생활의 이력 등에 대한 시인의 자전적인 면모가 담긴 시를 읽는 기쁨도 크다. 『여름은 사랑의 천사』는 사랑과 청춘, 이별과 그리움, 가난과 허무, 그리고 슬픔과 정념이 넘실거리는 여름의 한복판으로 독자를 데려가는 그야말로 ‘여름 시집’이다.
          </div>
        </div>
      </div>
      <div className='mt-24'>
        <h2>이런 책은 어떠세요?</h2>
      </div>
      <div className='mt-24'>
        <h2>이런 책은 어떠세요?</h2>
        <div className='flex mt-6'>
          <BookCard width={1/5} />
          <BookCard width={1/5} />
          <BookCard width={1/5} />
          <BookCard width={1/5} />
          <BookCard width={1/5} />
        </div>
      </div>
    </div>
  )
}

export default BookInfo
