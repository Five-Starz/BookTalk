import React from 'react'

interface UserProps {
  width: string;
}

const User: React.FC<UserProps> = ({width}) => {
  return (
    <div className='flex gap-2 items-center'>      
        <div className="avatar">
          <div className={`size-${width} rounded-full`}>
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        <p className='text-[#888]'>닉네임</p>
    </div>
  )
}

export default User
