import React from 'react';

import { Routes, Route } from 'react-router-dom'; // Link는 Header로 이동
import './App.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

import Home from './pages/Home';
import MyPage, { ReviewCollection, Settings, WantReadList } from './pages/MyPage';
import Login from './pages/Login';
import Book from './pages/Book';
import ReviewList from './pages/ReviewList';
import SearchList from './pages/SearchList';
import ReviewDetail from './pages/ReviewDetail';
import WriteReview from './pages/WriteReview';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import UserPage from './pages/UserPage';


function App() {
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
          <Route path="/234" element={<ReviewList />} />
          <Route path="/2345" element={<ReviewDetail />} />
          <Route path="/reviews/:isbn" element={
            <ProtectedRoute>
              <WriteReview />
            </ProtectedRoute>
          } />

          {/* 중첩 라우터 설정 + 비로그인 접근 금지 */}
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
          <Route path='/user/:id' element={<UserPage />}>
            <Route path="reviews" element={<ReviewCollection />} />
            <Route path="wants" element={<WantReadList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>

      </main>
      <Footer />
    </div>
  );
}

export default App;