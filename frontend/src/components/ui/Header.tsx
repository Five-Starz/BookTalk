import React from 'react'
import { Link } from 'react-router-dom'
// import { useState } from 'react'

const Header = () => {
  // const [count, setCount] = useState(0)
  return (
    <nav style={{ marginBottom: '1rem', padding: '1rem'}}>
      <Link to="/" className='logo'><h1>BOOKTALK</h1></Link>
      {/* 필요한 다른 링크들을 여기에 추가하세요 */}
    </nav>
  )
}

export default Header
