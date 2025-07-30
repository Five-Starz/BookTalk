import { Navigate } from 'react-router-dom';

// ProtectedRoute 컴포넌트는 로그인 상태를 확인하고, 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트합니다.
// 로그인 상태가 아닌 경우, 로그인 페이지로 이동시키고, 로그인 상태인 경우 자식 컴포넌트를 렌더링합니다.
// 이 컴포넌트는 주로 라우팅 설정에서 사용되어, 특정 페이지에 접근하기 전에 로그인 상태를 확인하는 용도로 사용됩니다.
// 예를 들어, 마이페이지나 게시글 작성 페이지 등 로그인한 사용자만 접근할 수 있는 페이지에 적용됩니다.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
    // replace가 있으면 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 돌아지 않도록 함 (불필요한 리다이렉션 반복 방지)
  }

  return <>{ children }</>;
};

export default ProtectedRoute;