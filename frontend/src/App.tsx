import React, {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom'; // Link는 Header로 이동
import './App.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import axios from 'axios';


import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Login from './pages/Login'
import Book from './pages/Book';
import ReviewList from './pages/ReviewList';
import SearchList from './pages/SearchList';
import ReviewDetail from './pages/ReviewDetail';
import WriteReview from './pages/WriteReview';
import SignUp from './pages/SignUp';
import { ThumbsUpbutton } from './components/ui/Button';

function App() {
  // 데이터 타입을 BookApiResponse 또는 null로 명확히 지정
  const [apiData, setApiData] = useState<unknown | null>(null);
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 에러 상태 추가
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // axios.get<BookApiResponse>를 사용하여 응답 데이터의 타입을 명시
        const response = await axios.get<unknown>('http://localhost:8000');
        setApiData(response.data);
        console.log('받아온 데이터:', response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.'); // 에러 발생 시 에러 상태 업데이트
        console.error('에러 발생:', err);
      } finally {
        setIsLoading(false); // 로딩 완료 (성공 또는 실패와 관계없이)
      }
    };

    fetchData();
  }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때 한 번만 실행
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className='break-words'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/123" element={<Book />} />
          <Route path="/234" element={<ReviewList />} />
          <Route path="/2345" element={<ReviewDetail />} />
          <Route path="/2346" element={<WriteReview />} />
          <Route path="/345" element={<SearchList />} />
        </Routes>
      </main>
        {/* 로딩 중일 때 메시지 표시 */}
        {isLoading && <p>데이터를 불러오는 중입니다...</p>}

        {/* 에러 발생 시 메시지 표시 */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 데이터가 있고, documents 배열이 비어있지 않을 때만 저자 정보 표시 */}
        {apiData && apiData.documents && apiData.documents.length > 0 ? (
          <div>
            <strong>첫 번째 책의 저자:</strong>
            <p>{apiData.documents[0].authors[0]}</p>
            {/* 만약 저자가 여러 명이라면, 아래처럼 배열을 문자열로 합쳐서 출력할 수 있습니다. */}
            {/* <p>모든 저자: {apiData.documents[0].authors.join(', ')}</p> */}
          </div>
        ) : (
          // 데이터가 없거나 documents 배열이 비어있을 때 (로딩 후)
          !isLoading && !error && <p>데이터를 찾을 수 없습니다.</p>
        )}
      <ThumbsUpbutton />
      <Footer />
    </div>
  );
}

export default App;