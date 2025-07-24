import React from 'react'

interface ReviewCardProps {
  width: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({width}) => {
  return (
    <div className={`w-${width} bg-gray-100 rounded p-2`}>
      ddd
    </div>
  )
}

export default ReviewCard
