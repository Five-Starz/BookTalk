import React from 'react'

const BestReview = () => {
  return (
    <div className='flex flex-col lg:w-3/5 gap-4'>
      <div className="flex gap-4">
        <img
          className='rounded-lg max-w-fit max-h-[180px] sm:max-h-[320px]'
          src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg"
          alt="책 표지" />
        <div className='rounded-lg border border-[#FFA100] p-4'>
          <h3>책 제목</h3>
          <p className='text-overflow'>ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</p>
        </div>
      </div>
      <div className='flex flex-col gap-4 md:flex-row md:justify-between'>
        <div className="card card-side w-full md:w-[calc(50%-6px)] bg-gray-200 h-20">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              alt="Movie" />
          </figure>
          <div className='p-2 text-overflow'>
            <h3>New movie is released!</h3>
            <p>Click the button to watch on Jetflix app.</p>
          </div>
        </div>
        <div className="card card-side w-full md:w-[calc(50%-6px)] bg-gray-200 h-20">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              alt="Movie" />
          </figure>
          <div className='p-2 text-overflow'>
            <h3>New movie is released!</h3>
            <p>Click the button to watch on Jetflix app.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestReview
