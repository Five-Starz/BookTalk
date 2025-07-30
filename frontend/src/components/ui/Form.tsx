interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Form = () => {
  return (
    <div>

    </div>
  )
}

export const NicknameForm = ({ error, ...rest } :BaseInputProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor="nickname">닉네임</label>
      <input
        type="text"
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
        id="nickname"
        { ...rest }
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const EmailForm = ({ error, ...rest } :BaseInputProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='email'>이메일</label>
      <input
        id='email'
        type="email"
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
        { ...rest }
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
export const PasswordForm = ({ error, ...rest } :BaseInputProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='password'>비밀번호</label>
      <input
        id="password"
        type="password"
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
        { ...rest }
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
export const CheckPasswordForm = ({ error, ...rest } :BaseInputProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='password'>비밀번호 확인</label>
      <input
        id="password"
        type="password"
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
        { ...rest }
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}