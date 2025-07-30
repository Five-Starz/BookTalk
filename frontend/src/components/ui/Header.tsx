import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  // Zustand에서 로그인 상태 및 토큰 삭제 액션 가져오기
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const removeTokens = useAuthStore((state) => state.clearTokens);

  // useNavigate 훅을 사용하여 페이지 이동
  const navigate = useNavigate();

  // 로그아웃 버튼 클릭 시 전역 상태/로컬스토리지 모두 반영
  const handleLogout = () => {
    removeTokens(); // Zustand 상태(및 localStorage)에서 토큰 제거 및 isLoggedIn false로
    navigate('/');  // 홈으로 이동
  };

  // 헤더 컴포넌트는 페이지 상단에 위치하며, 사이트 로고와 검색창, 마이페이지 및 로그인 링크를 포함합니다.
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white px-4 sm:px-8 py-4 shadow-sm">
        {/* bg-white px-4 sm:px-8 py-4 shadow-sm */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 왼쪽 로고 */}
          <Link to="/">
            <h1>
              BOOK
              <span className="text-orange-500">T</span>
              ALK
            </h1>
          </Link>

          {/* 오른쪽 영역: 검색창 + 마이페이지 + 로그인 + 회원가입 + 로그아웃 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* 검색창 */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full sm:w-72">
              <input
                type="text"
                placeholder="Search..."
                className="outline-none border-none w-full text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                className="text-gray-600 hover:text-black active:scale-90 transition-transform duration-100"
                aria-label="검색">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* 로그인 여부에 따른 조건부 렌더링 */}
            {
              isLoggedIn ? (
                <>
                  {/* 마이페이지 */}
                  <Link
                    to="/mypage"
                    className="text-sm text-gray-700 hover:text-black whitespace-nowrap"
                  >
                    마이페이지
                  </Link>
                  {/* 로그아웃 버튼 */}
                  <button
                    onClick={handleLogout}
                    className="bg-black hover:bg-neutral-800 text-white rounded-md px-4 py-2 text-sm cursor-pointer transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                // 로그인 및 회원가입 링크
                <>
                  {/* 로그인 버튼 : 버튼이라기 보다는 로그인 링크 */}
                  <Link
                    to="/login"
                    className="bg-neutral text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition whitespace-nowrap"
                  >
                    로그인
                  </Link>
                  {/* 회원가입 버튼 : 버튼이라기 보다는 회원가입 링크 */}
                  <Link
                    to="/signup"
                    className="bg-neutral text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition whitespace-nowrap"
                  >
                    회원가입
                  </Link>
                </>
              )
            }
          </div>
        </div>
      </header>
      {/* header fixed로 인해서 wrapper div 추가 */}
      <div className="h-[105px]" />
    </>
  )
}

export default Header
