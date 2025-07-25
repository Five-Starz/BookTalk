import React from 'react'
import BookInfo from '../components/BookInfo'
import BookCard from '../components/ui/BookCard'
import ReviewCard from '../components/ui/ReviewCard'

const Book = () => {
  return (
    <div className='m-auto flex flex-col gap-12 md:gap-24'>
      <BookInfo />
      <div>
        <div className='flex justify-between mb-3 md:mb-6'>
          <h2>리뷰들</h2>
          <button>더보기</button>
        </div>
        <div className='hidden justify-between flex-wrap gap-2 lg:flex'>
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
          <ReviewCard width='[calc(33.3%-6px)]' />
        </div>
        <div className='hidden justify-between flex-wrap gap-2 sm:flex lg:hidden'>
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
        </div>
        <div className='flex justify-between flex-wrap gap-2 sm:hidden'>
          <ReviewCard width='[calc(50%-4px)]' />
          <ReviewCard width='[calc(50%-4px)]' />
        </div>
      </div>
      <div>
        <h2 className='mb-3 md:mb-6'>이런 책은 어떠세요?</h2>
        <div className='justify-between gap-2 hidden md:flex'>
          <BookCard width='1/5' />
          <BookCard width='1/5' />
          <BookCard width='1/5' />
          <BookCard width='1/5' />
          <BookCard width='1/5' />
        </div>
        <div className="flex justify-between gap-2 md:hidden">
          <BookCard width='1/3' />
          <BookCard width='1/3' />
          <BookCard width='1/3' />
        </div>
      </div>
    </div>
  )
}

export default Book
