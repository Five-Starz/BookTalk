import { Link, Outlet } from 'react-router-dom'

const UserPage = () => {
  const id = 1;
  return (
    <>
      <div className="flex flex-col items-center px-4 py-10 bg-white">
        {/* ✅ 유저 정보 카드 */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow overflow-hidden p-6 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className='relative mb-4'>
            <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-5xl cursor-pointer">
              👤
            </div>
          </div>

          {/* 유저 이름 */}
          <p className="text-xl font-bold mb-1">유저이름</p>

          {/* 리뷰 수 + 보고싶어요 수 (가로 정렬) */}
          <div className="flex gap-12">
            <Link to={`/user/${id}/reviews`} className="text-center cursor-pointer hover:scale-105 transition">
              <p className="text-xl font-semibold">1255</p>
              <p className="text-sm text-gray-600">리뷰</p>
            </Link>

            <Link to={`/user/${id}/wants`} className="text-center cursor-pointer hover:scale-105 transition">
              <p className="text-xl font-semibold">1255</p>
              <p className="text-sm text-gray-600">보고싶어요</p>
            </Link>
          </div>
        </div>

        {/* ✅ 하위 페이지 콘텐츠 */}
        <div className="w-full max-w-4xl mt-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}


export const ReviewCollection = () => {
  return (
    <div>
      <h2>Review Collection</h2>
      {/* 여기에 리뷰 컬렉션 관련 콘텐츠를 추가하세요 */}
    </div>
  )
}

export const WantReadList = () => {
  return (
    <div>
      <h2>Want Read List</h2>
      {/* 여기에 보고싶어요 리스트 관련 콘텐츠를 추가하세요 */}
    </div>
  )
}

export default UserPage
