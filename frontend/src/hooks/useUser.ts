import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserNickname = (userId: number | undefined) => {
  const [ nickname, setNickname ] = useState('');

  useEffect(() => {
    // ✅ userId가 유효할 때만 API 요청
    if (userId === undefined) {
      setNickname(''); // 닉네임 초기화
      return;
    }

    const fetchUserInfo = async () => {
      try {
        // 유저 정보
        const res = await axios.get(`http://localhost:8000/auth/${userId}`);
        setNickname(res.data.nickname);
      } catch {
        setNickname('');
        return;
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { nickname };
};