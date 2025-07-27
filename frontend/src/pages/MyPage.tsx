import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { NicknameForm, PasswordForm } from '../components/ui/Form';
import { CancelButton, ResignButton, UpdateButton } from '../components/ui/Button';

const emojiOptions = [
  '😁', '🤣', '😎', '😍', '😴'
]

const MyPage = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const handleProfileClick = () => {
    setShowSelector((prev) => !prev);
  }

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowSelector(false);
  }

  return (
    <>
      <div className="flex flex-col items-center px-4 py-10 bg-white">
        {/* ✅ 유저 정보 카드 */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow overflow-hidden p-6 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className='relative mb-4'>
            <div
              onClick={handleProfileClick}
              className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-5xl cursor-pointer"
            >
              { selectedEmoji ?? '👤' }
            </div>
            {
              // 이모지 선택창
              showSelector && (
                <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white shadow-md p-4 rounded-lg z-20 w-[288px] sm:w-[288px] w-[95vw] max-w-xs">
                  <div className="grid grid-cols-5 gap-3">
                    {
                      emojiOptions.map((emoji, idx) => (
                        <button
                          key={idx}
                          className="w-12 h-12 rounded-full text-2xl flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          { emoji }
                        </button>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>

          {/* 유저 이름 */}
          <p className="text-xl font-bold mb-1">유저이름</p>

          {/* 회원 정보 수정 버튼 (선택사항) */}
          <Link to="/mypage/settings" className="text-sm text-gray-500 mb-4 hover:text-black">
            정보수정
          </Link>

          {/* 리뷰 수 + 보고싶어요 수 (가로 정렬) */}
          <div className="flex gap-12">
            <Link to="/mypage/reviews" className="text-center cursor-pointer hover:scale-105 transition">
              <p className="text-xl font-semibold">1255</p>
              <p className="text-sm text-gray-600">리뷰</p>
            </Link>

            <Link to="/mypage/wants" className="text-center cursor-pointer hover:scale-105 transition">
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
    <>
      {/* 리뷰 리스트 */}
      <div className="space-y-2">
        {/* 🔽 정렬 셀렉트 */}
        <div className="flex justify-end mt-2">
          <select
            // value={sortType}
            // onChange={(e) => setSortType(e.target.value as 'latest' | 'likes')}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>
        {/* 리뷰 목록 */}
        <div className="p-4 bg-gray-50 border rounded shadow">
          <h2 className="font-semibold">해리포터(책 제목)</h2>
          <p className="text-sm text-gray-700 mt-2">
            유기적 연결을 신경 쓰지 않고 대강 나열한 에피소드...
          </p>
        </div>
        {/* 페이징 */}
        <div className="flex justify-center mt-8">
          <ul className="flex gap-2">
            <li className="text-orange-500 font-bold">1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export const WantReadList = () => {
  return (
    <>
      {/* 보고싶어요 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="bg-white border rounded shadow overflow-hidden">
            <img src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg" alt="책" className="w-full" />
            <div className="p-2">
              <h3 className="font-semibold text-sm">혼모노: 성애와 소설집</h3>
              <p className="text-xs text-gray-500">상하니</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const Settings = () => {
  return (
    <>
      {/* 유저 정보 수정 */}
      <div className="space-y-8">
        <div>
          <h2 className="font-semibold text-lg mb-2">회원 정보 수정</h2>
          <NicknameForm />
          <PasswordForm />
          <UpdateButton />
          <CancelButton />
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">회원 탈퇴</h2>
          <ResignButton />
        </div>
      </div>
    </>
  )
}

export default MyPage
