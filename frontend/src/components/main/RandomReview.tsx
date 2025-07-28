import React from 'react'
import User from '../ui/User'

const RandomReview = () => {
  return (
    <div className='flex flex-col w-full rounded-lg p-4 gap-10 bg-[#D8D5AF] lg:w-2/5 lg:justify-between'>
      <h2>오늘의 랜덤 리뷰</h2>
      <p className='text-overflow px-4'>datadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatatdatadatatdadatat</p>
      <div className='flex gap-4 justify-center'>
        <User width='6' />
      </div>
    </div>
  )
}

export default RandomReview
