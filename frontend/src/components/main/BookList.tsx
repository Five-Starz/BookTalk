import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import axios from 'axios';

import type { BookApiResponse, BookDetail } from '../../types/BookType'; // 'Book'도 함께 임포트합니다.

export const Good10 = () => {
  const [apiData, setApiData] = useState<BookApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 백엔드 API 엔드포인트를 '리뷰가 많은 책'에 맞게 조정해야 합니다.
        // 예: 'http://localhost:8000/api/books/top-reviews'
        // 백엔드에서 이 엔드포인트를 통해 리뷰가 많은 책 데이터를 제공해야 합니다.
        const response = await axios.get('http://localhost:8000/books/good');
        setApiData(response.data);
        console.log('Good10 받아온 데이터:', response.data.documents);
      } catch (err) {
        setError('리뷰가 많은 책 데이터를 불러오는 데 실패했습니다.');
        console.error('Good10 API 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

    // 로딩, 에러, 데이터 없음 상태 처리
    if (isLoading) {
      return <div className="p-4 text-center">평점이 높은 책 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!apiData || !apiData.documents || apiData.documents.length === 0) {
      return <div className="p-4 text-center">평점이 높은 책 데이터를 찾을 수 없습니다.</div>;
    }

    const goodBooks = apiData.documents;


  return (
    <div className="slider-container w-full">
      <h2>BookList</h2>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        slidesPerView={5}
        loop={true}
        navigation={true}
        watchSlidesProgress={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {goodBooks.map((book: BookDetail) => ( // Book 인터페이스를 사용하여 타입 안전성 확보
          <Link key={book.isbn} to={`/book/${book.isbn}`}>
            <SwiperSlide key={book.isbn}> {/* key는 고유한 값으로 설정 (isbn이 적합) */}
                {/* 메인 슬라이더 이미지: book.thumbnail 사용 */}
                <img className='min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{book.authors.join(', ')}</p>
            </SwiperSlide>
          </Link>
        ))}
      </Swiper>
    </div>
  );
}

export const Want10 = () => {
  const [apiData, setApiData] = useState<BookApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 백엔드 API 엔드포인트를 '리뷰가 많은 책'에 맞게 조정해야 합니다.
        // 예: 'http://localhost:8000/api/books/top-reviews'
        // 백엔드에서 이 엔드포인트를 통해 리뷰가 많은 책 데이터를 제공해야 합니다.
        const response = await axios.get('http://localhost:8000/books/want');
        setApiData(response.data);
        console.log('Want10 받아온 데이터:', response.data.documents);
      } catch (err) {
        setError('리뷰가 많은 책 데이터를 불러오는 데 실패했습니다.');
        console.error('Want10 API 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

    // 로딩, 에러, 데이터 없음 상태 처리
    if (isLoading) {
      return <div className="p-4 text-center">보고 싶어요 수가 많은 책 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!apiData || !apiData.documents || apiData.documents.length === 0) {
      return <div className="p-4 text-center">보고 싶어요 수가 많은 책 데이터를 찾을 수 없습니다.</div>;
    }

    const wantBooks = apiData.documents;


  return (
    <div className="slider-container w-full">
      <h2>BookList</h2>
      <Swiper
        style={{
          '--swiper-navigation-color': '#000',
        } as React.CSSProperties}
        slidesPerView={5}
        loop={true}
        navigation={true}
        watchSlidesProgress={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {wantBooks.map((book: BookDetail) => ( // Book 인터페이스를 사용하여 타입 안전성 확보
          <Link key={book.isbn} to={`/book/${book.isbn}`}>
            <SwiperSlide key={book.isbn}> {/* key는 고유한 값으로 설정 (isbn이 적합) */}
                {/* 메인 슬라이더 이미지: book.thumbnail 사용 */}
                <img className='min-h-[280px] rounded-xl mb-4' src={book.thumbnail} alt={book.title} />
                  <h4 className="mb-4">{book.title}</h4>
                  {/* authors가 string[]이므로 join으로 문자열로 변환 */}
                  <p className="text-sm mb-10">{book.authors.join(', ')}</p>
            </SwiperSlide>
          </Link>
        ))}
      </Swiper>
    </div>
  );
}