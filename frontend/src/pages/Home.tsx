// src/pages/Home.tsx
import React from 'react';
import BestReview from '../components/main/BestReview';
import RandomReview from '../components/main/RandomReview';
import Hot10 from '../components/main/Hot10';
import BookList from '../components/BookList';

const Home = () => {
  return (
    <div className='flex flex-col gap-12 md:gap-20 pt-[105px] pb-[200px]'>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />
      <div className='flex flex-col gap-4 lg:flex-row'>
        <BestReview />
        <RandomReview />
      </div>
      <Hot10 />
      <BookList />
      <BookList />


<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    </div>
  );
};

export default Home;