import React from 'react'
import User from '../ui/User'
import {useMainReviews} from '../../hooks/useMain'
import { Link } from 'react-router-dom';

const RandomReview = () => {
  const { reviews, isLoadingReviews, errorReviews } = useMainReviews('random');
  console.log(reviews)

    // 로딩, 에러, 데이터 없음 상태 처리
    if (!isLoadingReviews) {
      return <div className="p-4 text-center">랜덤 리뷰 데이터를 불러오는 중입니다...</div>;
    }

    if (errorReviews) {
      return <div className="p-4 text-center text-red-500">{errorReviews}</div>;
    }

    if (!reviews || reviews.length === 0) {
      return <div className="p-4 text-center">랜덤 리뷰 데이터를 찾을 수 없습니다.</div>;
    }

  return (
    <Link key={reviews[0].reviewId}
      to={`/review/${reviews[0].reviewId}`}
      state={{ reviewData: reviews[0] }}
      className='lg:w-2/5 lg:justify-between'>    
      <div className='flex flex-col w-full rounded-lg p-4 gap-10 bg-[#D8D5AF]'>
        <h2>오늘의 랜덤 리뷰</h2>
        <p className='text-center px-4'>{reviews[0].content}</p>
        <div className='flex gap-4 justify-center'>
          <User width='6' />
        </div>
      </div>
    </Link>
  )
}

export default RandomReview
