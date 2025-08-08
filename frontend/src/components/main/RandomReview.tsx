import User from '../ui/User'
import {useMainReviews} from '../../hooks/useMain'
import { useUserNickname } from '../../hooks/useUser';
import { Link } from 'react-router-dom';

const RandomReview = () => {
  const { reviews, isLoadingReviews, errorReviews } = useMainReviews('random');

  // ✅ reviews 배열이 비어있지 않으면 첫 번째 리뷰의 userId를, 아니면 undefined를 사용
  const userId = reviews && reviews.length > 0 ? reviews[0].userId : undefined;

  // ✅ userId가 있을 때만 훅을 호출하도록 수정 (hooks는 조건부로 호출하면 안 되므로,
  //    userId를 인자로 넘겨주고 훅 내부에서 유효성을 검사하는 것이 올바른 패턴입니다)
  const { nickname } = useUserNickname(userId);


  // 로딩, 에러, 데이터 없음 상태 처리
  if (!isLoadingReviews) {
    return <div className="p-4 text-center">랜덤 리뷰 데이터를 불러오는 중입니다...</div>;
  }

  if (errorReviews) {
    return <div className="p-4 text-center text-red-500">{errorReviews}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="p-4 text-center">랜덤 리뷰 데이터를 찾을 수 없습니다.</div>;
  }

  // const thumbnailUrl = reviews[0].book.thumbnail;

  return (
    <Link key={reviews[0].reviewId}
      to={`/review/${reviews[0].reviewId}`}
      state={{ reviewData: reviews[0] }}
      className='lg:w-2/5 relative'>
      {/* <div
      className='absolute inset-0 z-0 bg-cover bg-center rounded-lg lg:h-[320px]'
      style={{
        backgroundImage: `url(${thumbnailUrl})`,
        filter: 'blur(5px)', // ✅ CSS filter 속성으로 블러 효과 적용
      }}
    ></div> */}
      <div className='relative flex flex-col justify-between w-full bg-orange-300 gap-10 rounded-lg p-4 z-10 lg:min-h-[320px]'>
        <h2>오늘의 랜덤 리뷰</h2>
        <p className='text-center px-4'>{reviews[0].content}</p>
        <div className='flex gap-4 justify-center'>
          <User nickname={nickname} width='6' />
        </div>
      </div>
    </Link>
  )
}

export default RandomReview
