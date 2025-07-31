import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { NicknameForm, PasswordForm } from '../components/ui/Form';
import { CancelButton, ResignButton, UpdateButton } from '../components/ui/Button';
import axios from 'axios';

const emojiOptions = [
  '😁', '🤣', '😎', '😍', '😴'
]

const MyPage = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const [ nickname, setNickname ] = useState<string>('');
  const [ userId, setUserId ] = useState<number | null>(null);
  const [ reviewCount, setReviewCount ] = useState(0);
  const [ bookmarkCount, setBookmarkCount ] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. 유저 인증 정보 가져오기
        const authRes = await axios.get('http://localhost:8000/auth/protected', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });

        // 유저ID와 닉네임 가져오기
        const { userId, nickname } = authRes.data.user;
        setUserId(userId);
        setNickname(nickname);

        // 2. 리뷰 수 가져오기
        const reviews = await axios.get(`http://localhost:8000/reviews/count/${userId}`);
        setReviewCount(reviews.data);

        // 3. 보고싶어요 수 가져오기
        const bookmarks = await axios.get(`http://localhost:8000/bookmarks/count/${userId}`);
        setBookmarkCount(bookmarks.data);

      } catch {
        return;
      }
    }

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    setShowSelector((prev) => !prev);
  }

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowSelector(false);
  }

  return (
    <>
      <div className="flex flex-col items-center px-4 py-10 bg-white">
        {/* ✅ 유저 정보 카드 */}
        <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow overflow-hidden p-6 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className='relative mb-4'>
            <div
              onClick={handleProfileClick}
              className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-5xl cursor-pointer"
            >
              { selectedEmoji ?? '👤' }
            </div>
            {
              // 이모지 선택창
              showSelector && (
                <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white shadow-md p-4 rounded-lg z-20 sm:w-[288px] w-[95vw] max-w-xs">
                  <div className="grid grid-cols-5 gap-3">
                    {
                      emojiOptions.map((emoji, idx) => (
                        <button
                          key={idx}
                          className="w-12 h-12 rounded-full text-2xl flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          { emoji }
                        </button>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>

          {/* 유저 이름 */}
          <p className="text-xl font-bold mb-1">{ nickname }</p>

          {/* 회원 정보 수정 버튼 (선택사항) */}
          <Link to="/mypage/settings" className="text-sm text-gray-500 mb-4 hover:text-black">
            정보수정
          </Link>

          {/* 리뷰 수 + 보고싶어요 수 (가로 정렬) */}
          <div className="flex gap-12">
            <Link to="/mypage/reviews" className="text-center cursor-pointer hover:scale-105 transition">
              <p className="text-xl font-semibold">{ reviewCount }</p>
              <p className="text-sm text-gray-600">리뷰</p>
            </Link>

            <Link to="/mypage/wants" className="text-center cursor-pointer hover:scale-105 transition">
              <p className="text-xl font-semibold">{ bookmarkCount }</p>
              <p className="text-sm text-gray-600">보고싶어요</p>
            </Link>
          </div>
        </div>

        {/* ✅ 하위 페이지 콘텐츠 */}
        <div className="w-full max-w-4xl mt-4">
          <Outlet context={{ userId }} />
        </div>
      </div>
    </>
  )
}

export const ReviewCollection = () => {
  type Review = {
    reviewId: number;
    userId: number;
    isbn: string;
    content: string;
    count: number | null;
    rating: string;
    createdAt: string;
    updatedAt: string;
    // 아래 3개 추가!
    bookTitle?: string;
    likeCount?: number;
    commentCount?: number;
  };

  type OutletContextType = { userId: number | null }

  const { userId } = useOutletContext<OutletContextType>();
  const [ reviews, setReviews ] = useState<Review[]>([]);

  // 정렬 상태
  const [sortType, setSortType] = useState<'latest' | 'likes' | 'comments'>('latest');

  // 페이지 처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchReviewData = async () => {
      try {
        // 1. 리뷰 목록 불러오기
        const res = await axios.get(`http://localhost:8000/reviews/user/${userId}`);
        const reviews = res.data; // [{reviewId, isbn, ...}, ...]

        // 2. 각 리뷰에 필요한 추가 데이터
        const reviewWithExtras = await Promise.all(
          reviews.map(async (review: Review) => {
            // 책 정보
            let bookTitle = '';
            try {
              // 실제 API 경로/응답에 맞게 수정!
              const bookRes = await axios.get(`http://localhost:8000/books/search?query=${review.isbn}`);
              if (Array.isArray(bookRes.data) && bookRes.data.length > 0) {
                bookTitle = bookRes.data[0].title || '제목없음';
              } else {
                bookTitle = '제목없음';
              }
            } catch {
              bookTitle = '제목없음';
            }

            // 좋아요 수
            let likeCount = 0;
            try {
              const likeRes = await axios.post(`http://localhost:8000/likes/count`, { reviewId: review.reviewId });
              likeCount = likeRes.data || 0;
            } catch {
              likeCount = 0;
            }

            // 댓글 수
            let commentCount = 0;
            try {
              const commentRes = await axios.get(`http://localhost:8000/comment/review/count/${review.reviewId}`);
              console.log(commentRes.data)
              commentCount = Number(commentRes.data) || 0;
            } catch {
              commentCount = 0;
            }

            // 합친 데이터 반환
            return {
              ...review,
              bookTitle,
              likeCount,
              commentCount,
            };
          })
        );

        setReviews(reviewWithExtras.filter(Boolean)); // 혹시 undefined 방지

      } catch {
        setReviews([]);
      }
    };

  fetchReviewData();
  }, [userId]);

  // 정렬 함수
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === 'latest') {
      // 최신순
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortType === 'likes') {
      // 좋아요순 + 최신순(동일시)
      const likeDiff = (b.likeCount ?? 0) - (a.likeCount ?? 0);
      if (likeDiff !== 0) return likeDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortType === 'comments') {
      // 댓글순 + 최신순(동일시)
      const commentDiff = (b.commentCount ?? 0) - (a.commentCount ?? 0);
      if (commentDiff !== 0) return commentDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // 정렬된 리스트에서 현재 페이지에 해당하는 10개만 추출
  const pagedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  // 페이지 이동
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* 리뷰 리스트 */}
      <div className="space-y-2">
        {/* 🔽 정렬 셀렉트 */}
        <div className="flex justify-end mt-2">
          <select
            value={sortType}
            onChange={ (e) => setSortType(e.target.value as 'latest' | 'likes' | 'comments') }
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
            <option value="comments">댓글순</option>
          </select>
        </div>
        {/* 리뷰 목록 */}
        {
          reviews.length === 0 && (
            <div className="p-4 text-gray-500 flex justify-center items-center h-40">작성한 리뷰가 없습니다.</div>
          )
        }
        {
          pagedReviews.map((review) => (
            <div key={review.reviewId} className="bg-white rounded-lg border shadow p-5 mb-4 flex flex-col justify-between">
            {/* 책 제목 */}
              <div className="flex items-center mb-1">
                <h3 className="font-semibold text-lg">{review.bookTitle || '책 제목 불러오기'}</h3>
              </div>

              {/* 리뷰 내용 */}
              <div className="text-gray-700 mt-2 line-clamp-4 flex-1">
                {review.content}
              </div>

              {/* 하단: 좋아요, 댓글 + 버튼 */}
              <div className="flex items-center justify-between mt-4">
                {/* 왼쪽: 좋아요, 댓글 */}
                <div className="flex items-center text-sm text-gray-500 gap-6">
                  <span>좋아요 {review.likeCount ?? 0}</span>
                  <span>댓글 {review.commentCount ?? 0}</span>
                </div>
                {/* 오른쪽: 수정/삭제 */}
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 rounded text-sm border border-gray-300 hover:bg-gray-100"
                    onClick={() => navigate(`/write-review/${review.reviewId}`)}
                  >
                    수정
                  </button>
                  <button
                    className="px-2 py-1 rounded text-sm border border-red-400 text-red-500 hover:bg-red-50"
                    // onClick={() => handleDeleteReview(review.reviewId)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))
        }
        {/* 페이징 */}
        <div className="flex justify-center mt-8">
          <ul className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <li
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`cursor-pointer px-2 ${currentPage === idx + 1 ? 'text-orange-500 font-bold' : ''}`}
              >
                {idx + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export const WantReadList = () => {
  return (
    <>
      {/* 보고싶어요 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="bg-white border rounded shadow overflow-hidden">
            <img src="https://contents.kyobobook.co.kr/sih/fit-in/180x0/pdt/9791141611040.jpg" alt="책" className="w-full" />
            <div className="p-2">
              <h3 className="font-semibold text-sm">혼모노: 성애와 소설집</h3>
              <p className="text-xs text-gray-500">상하니</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const Settings = () => {
  return (
    <>
      {/* 유저 정보 수정 */}
      <div className="space-y-8">
        <div>
          <h2 className="font-semibold text-lg mb-2">회원 정보 수정</h2>
          <NicknameForm />
          <PasswordForm />
          <UpdateButton />
          <CancelButton />
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">회원 탈퇴</h2>
          <ResignButton />
        </div>
      </div>
    </>
  )
}

export default MyPage
