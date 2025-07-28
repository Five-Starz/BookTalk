interface EmailFormProps {
  value: string;
  onChange: (value: string) => void;
}

interface PasswordFormProps {
  value: string;
  onChange: (value: string) => void;
}


export const Form = () => {
  return (
    <div>

    </div>
  )
}

export const NicknameForm = () => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor="nickname">닉네임</label>
      <input
        type="text"
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
        id="nickname"
      />
    </div>
  )
}

export const EmailForm = ({ value, onChange } :EmailFormProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='email'>이메일</label>
      <input
        id='email'
        type="email"
        value={ value }
        onChange={ (e) => onChange(e.target.value) }
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
      />
    </div>
  )
}
export const PasswordForm = ({ value, onChange } :PasswordFormProps) => {
  return (
    <div className="relative border-b">
      <label className="absolute top-3 left-4 text-gray-600 text-xs" htmlFor='password'>비밀번호</label>
      <input
        id="password"
        type="password"
        value={ value }
        onChange={ (e) => onChange(e.target.value) }
        className="w-full px-4 pt-8 pb-1 bg-white text-black rounded-md text-base outline-none border-none"
      />
    </div>
  )
}
