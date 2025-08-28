 // src/pages/Home.tsx
import BestReview from '../components/main/BestReview';
import RandomReview from '../components/main/RandomReview';
import { Hot10, Good10, Want10 } from '../components/main/BookList';

const Home = () => {
  return (
    <div className='flex flex-col gap-12 md:gap-20 pt-[105px] pb-[10%] md:pb-[200px]'>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />
      <div className='flex flex-col gap-4 lg:flex-row'>
        <BestReview />
        <RandomReview />
      </div>
      <Hot10 />
      <Good10 />
      <Want10 />


<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    </div>
  );
};

export default Home;