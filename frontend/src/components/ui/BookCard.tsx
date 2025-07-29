import React from 'react'
import type { Book } from '../../types/Book';

interface BookCardProps {
  book: Book; // 책 데이터 전체를 받을 prop 추가
  width: string; // '1/3', 'full', '80', 'px-10' 등 Tailwind 클래스 문자열을 받음
}

const BookCard: React.FC<BookCardProps> = ({book, width}) => {
  return (
    <div className={`w-${width}`}><img 
        className='rounded-lg w-full h-auto object-cover' // w-full로 부모 너비에 맞춤
        src={book.thumbnail} 
        alt={book.title} 
      />
      <h4 className='mt-3 text-lg font-semibold text-center truncate w-full'>{book.title}</h4> {/* 텍스트 중앙 정렬 및 넘치는 텍스트 처리 */}
      <p className='mt-0.5 text-gray-600 text-center truncate w-full'>{book.authors.join(', ')}</p>
    </div>
  )
}

export default BookCard
