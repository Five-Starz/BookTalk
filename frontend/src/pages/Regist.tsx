import React from 'react'

const Regist = () => {
  return (
    <>
      <div className="min-h-[80vh] pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">회원 가입</h1>
        {/* 회원가입 폼 */}
        <form className="w-full max-w-md space-y-4">
          {/* 닉네임 */}
          <div className="relative border-b">
            <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor="nickname">닉네임</label>
            <input
              type="text"
              className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
              id="nickname"
            />
          </div>

          {/* 이메일 */}
          <div className="relative border-b">
            <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='email'>이메일</label>
            <input
              id='email'
              type="email"
              className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
            />
          </div>

          {/* 비밀번호 */}
          <div className="relative border-b">
            <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='password'>비밀번호</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
            />
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-neutral text-white rounded-md py-6 text-sm hover:bg-gray-700 transition mt-6"
          >
            가입 완료
          </button>
        </form>
      </div>
    </>
  )
}

export default Regist
