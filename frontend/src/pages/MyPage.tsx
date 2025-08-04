import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { NicknameForm, PasswordForm } from '../components/ui/Form';
import { CancelButton, ResignButton, UpdateButton } from '../components/ui/Button';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';

const emojiOptions = [
  '😁', '🤣', '😎', '😍', '😴'
]

const MyPage = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  // const [ nickname, setNickname ] = useState<string>('');
  const nickname = useUserStore(state => state.nickname);
  const setUser = useUserStore(state => state.setUser);

  // const [ userId, setUserId ] = useState<number | null>(null);
  const userId = useUserStore(state => state.userId);

  const [ reviewCount, setReviewCount ] = useState(0);
  const [ bookmarkCount, setBookmarkCount ] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. 유저 인증 정보 가져오기
        const authRes = await axios.get('http://localhost:8000/auth/protected', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const { userId } = authRes.data.user;

        // 2. 최신 프로필(닉네임 등)은 별도 fetch
        const profileRes = await axios.get(`http://localhost:8000/auth/${userId}`);
        // profileRes.data.comments[0] 구조라면...
        const profile = Array.isArray(profileRes.data.comments) ? profileRes.data.comments[0] : profileRes.data;
        const { nickname } = profile;

        setUser({ userId, nickname }); // zustand에 최신값 저장

        // 유저ID와 닉네임 가져오기
        // const { userId, nickname } = authRes.data.user;
        // setUserId(userId);
        // setNickname(nickname);
        setUser({ userId, nickname }); // zustand에 저장

        // 2. 리뷰 수 가져오기
        const reviews = await axios.get(`http://localhost:8000/reviews/count/${userId}`);
        setReviewCount(reviews.data);

        // 3. 보고싶어요 수 가져오기
        const bookmarks = await axios.get(`http://localhost:8000/bookmarks/${userId}`);
        setBookmarkCount(Array.isArray(bookmarks.data) ? bookmarks.data.length : 0);
      } catch {
        return;
      }
    }

    fetchUserData();
  }, [setUser]);

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
          <Outlet context={{ userId, setReviewCount }} />
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

  type OutletContextType = { userId: number | null; setReviewCount: React.Dispatch<React.SetStateAction<number>> }

  const { userId, setReviewCount } = useOutletContext<OutletContextType>();
  const [ reviews, setReviews ] = useState<Review[]>([]);

  // 정렬 상태
  const [sortType, setSortType] = useState<'latest' | 'likes' | 'comments'>('latest');

  // 로딩 상태
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  // 페이지 처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 모달창 open
  const [modalOpen, setModalOpen] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchReviewData = async () => {
      setIsLoading(true);
      try {
        // 1. 리뷰 목록 불러오기
        const res = await axios.get(`http://localhost:8000/reviews/user/${userId}`);
        const reviews = res.data;

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
      } finally {
        setIsLoading(false);
      }
    };

  fetchReviewData();
  }, [userId]);

  // 삭제 버튼 클릭 시 모달 오픈
  const openDeleteModal = (reviewId: number) => {
    setTargetReviewId(reviewId);
    setModalOpen(true);
  };

  // 모달 취소/바깥 클릭
  const handleCancelDelete = () => {
    setModalOpen(false);
    setTargetReviewId(null);
  };

  // 모달에서 삭제 확정
  const handleConfirmDelete = async () => {
    if (!targetReviewId) return;
    try {
      await axios.delete(`http://localhost:8000/reviews/${targetReviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setReviews((prev) => prev.filter((r) => r.reviewId !== targetReviewId));
      setReviewCount((prev) => prev - 1);
      setModalOpen(false);
    } catch {
      alert('리뷰 삭제에 실패했습니다.');
      setModalOpen(false);
    }
  };

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

  // 로딩 상태 처리
  if (isLoading) {
    return <div className="p-4 text-gray-500 flex justify-center items-center h-40">리뷰를 불러오는 중입니다...</div>
  }

  // 리뷰가 없을 경우
  if (reviews.length === 0) {
    return <div className="p-4 text-gray-500 flex justify-center items-center h-40">작성한 리뷰가 없습니다.</div>
  }

  console.log(reviews)

  return (
    <>
      {/* 리뷰 리스트 */}
      <div className="space-y-2">
        {/* 🔽 정렬 셀렉트 */}
        {
          reviews.length === 0 ? null : (
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
          )
        }
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
                <h3 className="font-semibold text-lg cursor-pointer" onClick={() => navigate(`/book/${review.isbn}`)}>{review.bookTitle || '책 제목 불러오기'}</h3>
              </div>

              {/* 리뷰 내용 */}
              <div className="text-gray-700 mt-2 line-clamp-4 flex-1 cursor-pointer" onClick={() => navigate(`/2345`)}>
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
                    onClick={() => navigate(`/reviews/${review.reviewId}`)}
                  >
                    수정
                  </button>
                  <button
                    className="px-2 py-1 rounded text-sm border border-red-400 text-red-500 hover:bg-red-50"
                    onClick={() => openDeleteModal(review.reviewId)}
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

      {/* 모달은 컴포넌트 return 가장 하단에 한 번만 작성 (리스트 반복 X) */}
      {
        modalOpen && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-40"
            onClick={handleCancelDelete}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-sm"
              onClick={e => e.stopPropagation()} // 모달 내용 클릭시 닫힘 방지
            >
              <h2 className="text-lg font-bold mb-3">리뷰 삭제</h2>
              <div className="mb-6">정말 이 리뷰를 삭제하시겠습니까?</div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleCancelDelete}
                >
                  취소
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleConfirmDelete}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export const WantReadList = () => {
  type BookItem = {
    isbn: string;
    createdAt: string;
    //
    title?: string;
    authors?: string;
    thumbnail?: string;
  };

  type OutletContextType = { userId: number | null }
  const { userId } = useOutletContext<OutletContextType>();

  const [ bookmarks, setBookmarks ] = useState<BookItem[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    const fetchBookmarkData = async () => {
      try {
        // 1. 북마크(보고싶어요) 리스트 호출
        const res = await axios.get(`http://localhost:8000/bookmarks/${userId}`);
        const bookmarkList = Array.isArray(res.data) ? res.data : [];

        // 2. 각 책의 상세정보(제목, 저자, 썸네일 등) 가져오기
        const bookDetails = await Promise.all(
          bookmarkList.map(async (item: BookItem) => {
            try {
              // Book API로 도서 정보 조회
              const bookRes = await axios.get(`http://localhost:8000/books/search?query=${item.isbn}`);
              const bookInfo = Array.isArray(bookRes.data) ? bookRes.data[0] : bookRes.data;
              return {
                ...item,
                title: bookInfo?.title || "",
                authors: bookInfo?.authors || "",
                thumbnail: bookInfo?.thumbnail || "",
              };
            } catch {
              return { ...item, title: "", authors: "", thumbnail: "" }
            }
          })
        );
        setBookmarks(bookDetails);
      } catch {
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookmarkData();
  }, [userId]);

  if (isLoading) {
    return <div className="p-6 text-gray-400 text-center">불러오는 중...</div>;
  }

  if (!bookmarks.length) {
    return <div className="p-6 text-gray-400 text-center">보고싶어요를 누른 책이 없습니다.</div>
  }

  return (
    <>
      {/* 보고싶어요 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
          bookmarks.map((book, idx) => (
            <Link
              to={`/book/${book.isbn}`}
              key={book.isbn + idx}
              className='bg-white border rounded shadow overflow-hidden'
            >
              <img src={ book.thumbnail } alt={ book.title } className='w-full h-[180px] object-cover'/>
              <div className="p-2">
                <h3 className="font-semibold text-sm truncate">{book.title || "제목없음"}</h3>
                <p className="text-xs text-gray-500 truncate">{book.authors}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </>
  )
}

export const Settings = () => {
  const updateSchema = z.object({
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상이어야 합니다.")
      .max(10, "닉네임은 10자 이하여야 합니다.")
      .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.")
      .refine(val => !/\s/.test(val), "닉네임에 공백을 포함할 수 없습니다.")
      .optional()
      .or(z.literal("")), // 빈 문자열 허용

    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(20, "비밀번호는 20자 이하여야 합니다.")
      .refine(val => !/\s/.test(val), "비밀번호에 공백을 포함할 수 없습니다.")
      .optional()
      .or(z.literal("")), // 빈 문자열 허용
  })
  .refine(data => data.nickname || data.password, {
    message: "닉네임 또는 비밀번호 중 하나 이상 입력해주세요.",
  });

  type UpdateFormData = {
    nickname?: string;
    password?: string;
  };

  const { nickname, userId, clearUser, setUser } = useUserStore(); // setNickname
  const { accessToken, clearTokens } = useAuthStore();

  const [ msg, setMsg ] = useState('');
  const [ errMsg, setErrMsg ] = useState('');

  // 탈퇴 모달
  const [ resignModalOpen, setResignModalOpen ] = useState(false);

  // RHF 셋업
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      nickname: nickname ?? "",
      password: "",
    },
    mode: "onBlur"
  });

  // 수정 요청
  const onValid = async (data: UpdateFormData) => {
    setMsg("");
    setErrMsg('');
    try {
      // 빈 문자열은 서버에 보내지 않음
      const sendData: UpdateFormData = {};
      if (data.nickname && data.nickname !== nickname) sendData.nickname = data.nickname;
      if (data.password) sendData.password = data.password;

      if (!Object.keys(sendData).length) {
        setErrMsg("변경사항이 없습니다.");
        return;
      }

      await axios.post(
        "http://localhost:8000/auth/passupdate",
        sendData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (sendData.nickname) {
        // [1] 닉네임만 zustand에서 바꾸지 말고,
        // [2] 서버에서 최신 정보 받아오기!
        // 토큰에서 userId만 가져옴
        const authRes = await axios.get('http://localhost:8000/auth/protected', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { userId } = authRes.data.user;

        // 최신 프로필 fetch
        const profileRes = await axios.get(`http://localhost:8000/auth/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const profile = Array.isArray(profileRes.data.comments) ? profileRes.data.comments[0] : profileRes.data;
        setUser({ userId, nickname: profile.nickname });
      }

      // 닉네임 변경 시 전역 업데이트
      // if (sendData.nickname) {
      //   setNickname(sendData.nickname);
      // }

      setMsg("회원 정보가 수정되었습니다.");
      setErrMsg('');
      reset({ nickname: sendData.nickname ?? nickname, password: "" });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrMsg(err.response.data.message);
        setMsg('');
      }
    }
  };

  // 폼 리셋(취소)
  const handleCancel = () => {
    reset({ nickname: nickname ?? "", password: "" });
    setMsg("");
    setErrMsg('');
  };

  // 탈퇴
  // const handleResign = async () => {
  //   if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;
  //   try {
  //     await axios.delete(`http://localhost:8000/auth/del/${userId}`, {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });
  //     clearTokens();
  //     clearUser();
  //     window.location.href = "/";
  //   } catch {
  //     alert("탈퇴에 실패했습니다.");
  //   }
  // };

  // 모달 내 취소/확인 함수
  const handleCancelResign = () => {
    setResignModalOpen(false);
  }

  const handleConfirmResign = async () => {
    try {
      await axios.delete(`http://localhost:8000/auth/del/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      clearTokens();
      clearUser();
      window.location.href = "/";
    } catch {
      alert("탈퇴에 실패했습니다.");
    }
  };

  return (
    <>
      {/* 유저 정보 수정 */}
      <div className="space-y-8">
        <form onSubmit={ handleSubmit(onValid) }>
          <h2 className="font-semibold text-lg mb-2">회원 정보 수정</h2>
          <NicknameForm { ...register("nickname") } error={errors.nickname?.message}/>
          <PasswordForm { ...register("password") } error={errors.password?.message}/>
          <UpdateButton />
          <CancelButton onClick={ handleCancel } />
          {
            msg
              ? <div className="mt-2 text-center text-green-600 text-sm">{ msg }</div>
              : errMsg
                ? <div className="mt-2 text-center text-red-500 text-sm">{ errMsg }</div>
                : null
          }
        </form>

        <div>
          <h2 className="font-semibold text-lg mb-2">회원 탈퇴</h2>
          <ResignButton onClick={() => setResignModalOpen(true)}/>
        </div>
      </div>
      {/* 탈퇴 모달 */}
      {
        resignModalOpen && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-40"
            onClick={handleCancelResign}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-sm"
              onClick={e => e.stopPropagation()} // 모달 내용 클릭시 닫힘 방지
            >
              <h2 className="text-lg font-bold mb-3">회원 탈퇴</h2>
              <div className="mb-6">정말로 탈퇴하시겠습니까?</div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleCancelResign}
                >
                  취소
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleConfirmResign}
                >
                  탈퇴
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default MyPage