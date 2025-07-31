import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

/**
 * ProtectedRoute 컴포넌트 (early return 스타일)
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // 인증 체크 완료 여부
  const [authChecked, setAuthChecked] = useState(false);
  // 인증 성공 여부
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1. 로컬스토리지에서 토큰 꺼내오기
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      // 2. accessToken이 없으면 → 비로그인 상태 → 즉시 인증 실패 처리 & 종료
      if (!accessToken) {
        if (isMounted) {
          useAuthStore.getState().clearTokens();
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        return;
      }

      // 3. accessToken으로 서버 인증 시도
      try {
        await axios.get('http://localhost:8000/auth/protected', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (isMounted) {
          setIsAuthenticated(true);
          setAuthChecked(true);
        }
        return;
      } catch (err) {
        // 4. accessToken 만료/위조가 아닌 모든 네트워크/서버 에러는 즉시 로그아웃
        if (
          !axios.isAxiosError(err) ||
          !err.response ||
          !(err.response.status === 401 || err.response.status === 403)
        ) {
          if (isMounted) {
            useAuthStore.getState().clearTokens();
            setIsAuthenticated(false);
            setAuthChecked(true);
          }
          return;
        }
      }

      // 5. accessToken 만료/위조(401/403)일 경우 → refreshToken 필요
      if (!refreshToken) {
        // refreshToken도 없으면 로그아웃 처리
        if (isMounted) {
          useAuthStore.getState().clearTokens();
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        return;
      }

      // 6. refreshToken으로 accessToken 재발급 시도
      try {
        const res = await axios.post(
          'http://localhost:8000/auth/refresh',
          {}, // body 필요 없을 때는 빈 객체
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );
        // 새 토큰 저장 (반드시 Zustand store)
        useAuthStore.getState().setTokens(res.data.accessToken, res.data.refreshToken);

        // 7. 재발급 받은 accessToken으로 다시 인증 시도
        try {
          await axios.get('http://localhost:8000/auth/protected', {
            headers: { Authorization: `Bearer ${res.data.accessToken}` },
          });
          // 인증 성공: 보호 페이지 진입 허용
          if (isMounted) {
            setIsAuthenticated(true);
            setAuthChecked(true);
          }
          return;
        } catch {
          // 8. 새 accessToken도 인증 실패 → 토큰 모두 삭제 후 로그아웃
          if (isMounted) {
            useAuthStore.getState().clearTokens();
            setIsAuthenticated(false);
            setAuthChecked(true);
          }
          return;
        }
      } catch {
        // 9. refreshToken으로도 재발급 실패 → 토큰 모두 삭제 후 로그아웃
        if (isMounted) {
          useAuthStore.getState().clearTokens();
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        return;
      }
    };

    // 최초 마운트 시 인증 체크 함수 실행
    checkAuth();

    // 언마운트 방지(비동기 setState 방지)
    return () => {
      isMounted = false;
    };
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;