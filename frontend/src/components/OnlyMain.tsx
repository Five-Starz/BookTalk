import React from 'react'
import BestReview from './main/BestReview'
import RandomReview from './main/RandomReview'
import Hot10 from './main/Hot10'

const OnlyMain = () => {
  return (
    <div>
      <>
        <BestReview />
        <RandomReview />
      </>
      <Hot10 />
    </div>
  )
}

export default OnlyMain
