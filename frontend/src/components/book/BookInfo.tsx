import React from 'react'
import type { BookDetail } from '../../types/BookType';
import { Link } from 'react-router-dom';
import { getPrimaryIsbn } from '../../utils/getPrimaryIsbn';

const BookInfo = ({ book }: { book: BookDetail }) => {

  if (!book) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        책 정보를 불러올 수 없습니다. (데이터 누락)
      </div>
    );
  }

  const finalIsbn = getPrimaryIsbn(book.isbn);

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className="flex justify-center md:block">
        <img
          className='roundedLg maxW-fit max-h-[240px] sm:max-h-[280px]'
          src={book.thumbnail}
          alt={book.title + " 표지"}
        />
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col justify-between lg:flex-row'>
          <div className='text-center md:text-justify'>
            <h2>{book.title}</h2>
            <p>{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
            <p className='text-sm year'>{book.publishedYear ? book.publishedYear : '연도 정보 없음'}</p>
          </div>
          <div className='flex justify-between gap-2 mt-4 lg:mt-0'>
            <button type='button' className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-heart-plus-icon lucide-heart-plus' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"/><path d="M15 15h6"/><path d="M18 12v6"/></svg>
              보고싶어요 {book.bookmarkCount ? '정보' : 0}
            </button>
            <div className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-star-icon lucide-star' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
              평점 {book.total_rating ? book.total_rating : 0}
            </div>
            <Link to={`/reviews/${finalIsbn}`} className="flex flex-col w-1/3 p-4 sm:w-[150px] items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='size-6 sm:size-8 lucide lucide-penLine-icon lucide-penLine' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
              리뷰작성
            </Link>
          </div>
        </div>
        <div className="w-full mt-4 text-gray-600">
            {book.description}...
          </div>
      </div>
    </div>
  );
};

export default BookInfo
