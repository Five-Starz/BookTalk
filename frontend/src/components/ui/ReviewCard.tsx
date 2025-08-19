import User from './User';
import type { ReviewCardProps } from '../../types/ReviewType';
import { useUserNickname } from '../../hooks/useUser'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
// import { useReviewDetails } from '../../hooks/useReview'; // useReviewDetails 훅 임포트
// import { useParams } from 'react-router-dom';

const ReviewCard = ({review}: ReviewCardProps ) => {
  // const { reviewId: reviewIdParam } = useParams<{ reviewId: string }>();
  // const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : undefined;
  const { nickname } = useUserNickname(review?.userId);

  // 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review._count.likes || 0);

  // userId 가져오기 (Zustand 등)
  const userId = useUserStore((state) => state.userId);
  const token = useAuthStore((state) => state.accessToken);

  // 1. 내가 좋아요 눌렀는지 확인
  useEffect(() => {
    const checkLiked = async () => {
      if (!userId) return;
      const res = await fetch("http://35.216.79.174:3000/likes/find", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `userId=${userId}&reviewId=${review.reviewId}`,
      });
      const data = await res.json();
      setIsLiked(data === true);
    };
    checkLiked();
  }, [userId, review.reviewId]);

  // 2. 좋아요 버튼 토글 핸들러
  const handleLike = async () => {
    if (!userId) {
      alert("로그인이 필요합니다");
      return;
    }
    if (isLiked) {
      // 해제
      await fetch("http://35.216.79.174:3000/likes/del", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: `reviewId=${review.reviewId}`,
      });
      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      // 등록
      await fetch("http://35.216.79.174:3000/likes", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: `reviewId=${review.reviewId}`,
      });
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

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
          <button type="button" onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-5 lucide lucide-thumbs-up-icon lucide-thumbs-up ${isLiked ? 'text-red-500' : ''}`}
              // Tailwind에서 색상을 직접 쓰고 싶으면 className이 아니라 style 속성을 사용해야 합니다!
              // className={`... ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}를 쓰면서 style삭제 or 스타일을 강제 적용을 희망하면 지금처럼 사용
              style={!isLiked ? { color: '#888' } : undefined}
              >
                <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
            { likeCount }
          </button>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className='size-5 lucide-message-square-icon lucide-message-square'><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {review._count.comments}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard