import { useEffect } from 'react';

import { Routes, Route } from 'react-router-dom'; // Link는 Header로 이동
import './App.css';
import axios from 'axios';
import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

import Home from './pages/Home';
import MyPage, { ReviewCollection, Settings, WantReadList } from './pages/MyPage';
import Login from './pages/Login';
import Book from './pages/Book';
import ReviewList from './pages/ReviewList';
import SearchList from './pages/SearchList';
import ReviewOne from './pages/ReviewOne';
import WriteReview from './pages/WriteReview';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import UserPage, { UserReviewCollection, UserWantReadList } from './pages/UserPage';
import EditReview from './pages/EditReview';


function App() {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  useEffect(() => {
    // ✅ 앱이 처음 로드될 때 한 번만 실행됩니다.
    const initializeUser = async () => {
      const accessToken = authStore.accessToken;

      if (accessToken) {
        try {
          // 토큰을 사용하여 보호된 엔드포인트에 요청
          const response = await axios.get('http://35.216.79.174:3000/auth/protected', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          // 응답에서 사용자 ID와 닉네임 추출
          // (서버 응답 구조에 맞게 수정 필요)
          const { userId, nickname } = response.data.user;

          // ✅ 1. 토큰이 유효하면 Zustand 유저 스토어 업데이트
          userStore.setUser({ userId, nickname });

          // ✅ 2. Auth 스토어도 최신 상태로 동기화 (선택사항, 하지만 권장)
          authStore.checkLogin();

        } catch (error) {
          // 토큰이 만료되었거나 유효하지 않은 경우
          console.error('로그인 정보 동기화 실패:', error);
          authStore.clearTokens();
          userStore.clearUser();
        }
      }
    };

    initializeUser();
  }, []); // ✅ 빈 배열을 넣어 한 번만 실행되도록 설정

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className='break-words'>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/user/:id" element={<UserPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/books/search" element={<SearchList />} />
          <Route path="/book/:isbn" element={<Book />} />
          <Route path="/book/:isbn/reviews" element={<ReviewList />} />
          <Route path="/review/:reviewId" element={<ReviewOne />} />
          <Route path="/reviews/:isbn" element={
            <ProtectedRoute>
              <WriteReview />
            </ProtectedRoute>
          } />
          <Route path="/edit/:reviewId" element={
            <ProtectedRoute>
              <EditReview />
            </ProtectedRoute>
          } />

          {/* MyPage 중첩 라우터 설정 + 비로그인 접근 금지 */}
          <Route path="/mypage" element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }>
            <Route path="reviews" element={<ReviewCollection />} />
            <Route path="wants" element={<WantReadList />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* UserPage 중첩 라우팅 설정 */}
          <Route path='/user/:userId' element={<UserPage />}>
            <Route path="reviews" element={<UserReviewCollection />} />
            <Route path="wants" element={<UserWantReadList />} />
          </Route>
        </Routes>

      </main>
      <Footer />
    </div>
  );
}

export default App;