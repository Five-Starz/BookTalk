import React from 'react'

const BookCard = ({width}) => {
  return (
    <div className={`w-${width}`}>
        <img className='rounded-lg w-full' src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg"/>
        <h4 className='mt-3'>책 이름</h4>
        <p className='mt-1.5'>저자명</p>
    </div>
  )
}

export default BookCard
