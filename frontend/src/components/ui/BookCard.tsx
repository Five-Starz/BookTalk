import React from 'react'
import type { BookCardProps } from '../../types/BookType';

const BookCard: React.FC<BookCardProps> = ({book}) => {
  return (
    <>
      {book.thumbnail ? (<img
        className='rounded-lg w-full h-[240px]' // w-full로 부모 너비에 맞춤
        src={book.thumbnail}
        alt={book.title} />)
      : (<div className='flex items-center h-[240px] text-center'>썸네일 없음</div>)}
      <h4 className='mt-3 text-lg font-semibold text-center truncate w-full'>{book.title.length > 18 ? (book.title.slice(0,18)+'...'): book.title}</h4> {/* 텍스트 중앙 정렬 및 넘치는 텍스트 처리 */}
      <p className='mt-0.5 text-gray-600 text-center truncate w-full'>{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
    </>
  )
}

export default BookCard
