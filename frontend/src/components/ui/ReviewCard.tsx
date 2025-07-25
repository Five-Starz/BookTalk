import React from 'react'

interface ReviewCardProps {
  width: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({width}) => {
  return (
    <div className={`size-${width} bg-gray-100 rounded p-2`}>
      <div className='flex'>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
