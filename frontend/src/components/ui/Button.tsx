import { useState } from "react"

export const SignupButton = () => {
  return (
    <>
      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="w-full bg-black hover:bg-neutral-800 text-white rounded-md py-6 text-sm cursor-pointer transition mt-6"
      >
        가입 완료
      </button>
    </>
  )
}

export const LoginButton = () => {
  return (
    <>
      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-full bg-black hover:bg-neutral-800 text-white rounded-md py-6 text-sm cursor-pointer transition mt-6"
      >
        로그인
      </button>
    </>
  )
}

export const LogoutButton = () => {
  return (
    <>
      {/* 로그아웃 버튼 */}
      <button
        type="button"
        className="w-full bg-black hover:bg-neutral-800 text-white rounded-md py-6 text-sm cursor-pointer transition mt-6"
      >
        로그아웃
      </button>
    </>
  )
}

export const CancelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <>
      {/* 취소 버튼 */}
      <button
        type="button"
        className="w-full bg-gray-200 hover:bg-gray-300 text-black rounded-md py-2 text-sm cursor-pointer transition mt-2"
        { ...props }
      >
        취소
      </button>
    </>
  )
}

export const UpdateButton = () => {
  return (
    <>
      {/* 수정 버튼 */}
      <button
        type="submit"
        className="w-full bg-black hover:bg-neutral-800 text-white rounded-md py-2 text-sm cursor-pointer transition mt-6"
      >
        수정
      </button>
    </>
  )
}

export const ResignButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return(
    <>
      {/* 탈퇴 버튼 */}
      <button
        type="button"
        className="w-full border text-red-500 hover:font-semibold hover:bg-red-50 rounded-md py-2 text-sm cursor-pointer mt-1"
        { ...props }
      >
        회원 탈퇴
      </button>
    </>
  )
}

export const ThumbsUpbutton = () => {
  const [ liked, setLiked ] = useState(false);
  const toggleLike = () => setLiked(prev => !prev);

  return (
    <>
      {/* 좋아요 버튼 */}
      <button
        className="active:scale-90 transition-transform duration-150 ease-out flex items-center justify-center"
        aria-label="좋아요"
        onClick={toggleLike}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors duration-150 ${liked ? 'text-red-500' : 'text-black'}`}
          viewBox="0 0 24 24"
          fill="none"
        >
        <path
          d="M7.99997 20H17.1919C17.9865 20 18.7058 19.5296 19.0243 18.8016L21.8323 12.3833C21.9429 12.1305 22 11.8576 22 11.5816V11C22 9.89543 21.1045 9 20 9H13.5L14.7066 4.5757C14.8772 3.95023 14.5826 3.2913 14.0027 3.00136V3.00136C13.4204 2.7102 12.7134 2.87256 12.3164 3.3886L8.41472 8.46082C8.14579 8.81044 7.99997 9.23915 7.99997 9.68024V20ZM7.99997 20H2V10H7.99997V20Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"/>

        </svg>
      </button>
    </>
  )
}