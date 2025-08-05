import User from './User';
import type { ReviewCardProps } from '../../types/ReviewType';
import { useUserNickname } from '../../hooks/useUser'
import { Link } from 'react-router-dom';
// import { useReviewDetails } from '../../hooks/useReview'; // useReviewDetails 훅 임포트
// import { useParams } from 'react-router-dom';

const ReviewCard = ({review}: ReviewCardProps ) => {
  // const { reviewId: reviewIdParam } = useParams<{ reviewId: string }>();
  // const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : undefined;
  const { nickname } = useUserNickname(review?.userId);

  return (
    <div className={`w-full bg-[#F6F6F6] roundedLg p-4`}>
      <div className='flex flex-col gap-3'>
        <Link to={`/user/${review.userId}`}>
          <User nickname={nickname} width='6' />
        </Link>
        <span className='block w-full h-[1px] bg-[#ddd]' />
        <div className="min-h-30 md:min-h-50 text-overflow">
          <p>{review.content}</p>
        </div>
        <span className='block w-full h-[1px] bg-[#ddd]' />
        <div className='flex gap-3'>
          <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='size-5 lucide lucide-thumbs-up-icon lucide-thumbs-up'><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
            {review.likeCount}
          </button>
          <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='size-5 lucide-message-square-icon lucide-message-square'><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {review.commentCount}
          </button>
        </div>
      </div>
    </div>
  )
}



export default ReviewCard
