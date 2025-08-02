import React from 'react'
import User from '../ui/User';
import {useMainReviews} from '../../hooks/useMain'
import { Link } from 'react-router-dom';

const BestReview = () => {
  const { reviews, isLoadingReviews, errorReviews } = useMainReviews('liked');

    // 로딩, 에러, 데이터 없음 상태 처리
    if (!isLoadingReviews) {
      return <div className="p-4 text-center">베스트 리뷰 데이터를 불러오는 중입니다...</div>;
    }

    if (errorReviews) {
      return <div className="p-4 text-center text-red-500">{errorReviews}</div>;
    }

    if (!reviews || reviews.length === 0) {
      return <div className="p-4 text-center">베스트 리뷰 데이터를 찾을 수 없습니다.</div>;
    }

  return (
    <div className='flex flex-col lg:w-3/5 gap-4'>
      {reviews && reviews.length > 0 && (
        <>
          {/* 첫 번째 리뷰의 책 정보를 사용 */}
          <Link key={reviews[0].reviewId}
            to={`/review/${reviews[0].reviewId}`}
            state={{ reviewData: reviews[0] }}
            >
            <div className="flex gap-4">
              <img
                className='rounded-lg max-w-fit min-h-[320px]'
                src={reviews[0].book.thumbnail} // ✅ 훅에서 가져온 책 이미지 사용
                alt={reviews[0].book.title} // ✅ 훅에서 가져온 책 제목 사용
              />
              <div className='flex-grow rounded-lg border border-[#FFA100] p-4'>
                <h3 className='mb-4'>{reviews[0].book.title}</h3> {/* ✅ 책 제목 사용 */}
                <User width='6' />
                <p className='text-overflow mt-4'>{reviews[0].content}</p> {/* ✅ 리뷰 내용 사용 */}
              </div>
            </div>
          </Link>

          {/* 나머지 리뷰들은 여기에 매핑하여 표시 */}
          <div className='flex flex-col gap-4 md:flex-row md:justify-between'>
            {reviews.slice(1, 3).map((review, index) => (
              <Link key={review.reviewId}
                to={`/review/${reviews[index].reviewId}`}
                state={{ reviewData: reviews[index] }}
              >
                <div className="card card-side w-full md:w-[calc(50%-6px)] bg-gray-200 h-20">
                <figure>
                  <img
                    src={review.book.thumbnail} // ✅ 책 이미지 사용
                    alt={review.book.title} /> {/* ✅ 책 제목 사용 */}
                </figure>
                <div className='p-2 text-overflow'>
                  <h3>{review.book.title}</h3> {/* ✅ 책 제목 사용 */}
                  <p>{review.content}</p> {/* ✅ 리뷰 내용 사용 */}
                </div>
              </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BestReview
