/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import type { ReviewDetail } from '../types/ReviewType';
import type { ReviewSubmitData, UseReviewFormProps, UseReviewFormResult, UseEditReviewFormProps, UseEditReviewFormResult, ReviewEditedData } from '../types/ReviewType'; // 제출용 리뷰 데이터 타입 임포트
import type { RevCommentSubmitData, UseRevCommentFormProps, UseRevCommentFormResult } from '../types/CommentTypes'
import type { Comment } from '../types/CommentTypes';
import { FaStar } from 'react-icons/fa'
import { getPrimaryIsbn } from "../utils/getPrimaryIsbn";
// import { decodeHtml } from '../utils/decodeHtml';

import '../index.css'

interface RatingStarProps {
  // `ratingIndex`는 현재 선택된(저장된) 평점 점수를 나타냅니다.
  ratingIndex: number;
  // `setRatingIndex`는 부모 컴포넌트의 평점 상태를 업데이트하는 함수입니다.
  setRatingIndex: (newRating: number) => void;
}

export const RatingStar: React.FC<RatingStarProps> = ({ ratingIndex, setRatingIndex }) => {
  // `isHover`는 마우스 오버 상태를 로컬에서 관리하여 별점 아이콘의 시각적 효과를 제어합니다.
  const [, setIsHover] = useState<boolean[]>([false, false, false, false, false]);

  // `displayScore`는 마우스 오버 시 일시적으로 보여줄 평점 점수를 추적합니다.
  // 마우스가 별점 영역을 벗어나면 `ratingIndex` (실제 저장된 점수)로 되돌아갑니다.
  const [displayScore, setDisplayScore] = useState<number>(ratingIndex);

  // `ratingIndex`가 변경될 때마다 `displayScore`를 업데이트하고, `isHover` 상태도 초기화합니다.
  useEffect(() => {
    setDisplayScore(ratingIndex);
    const initialHoverState = Array(5).fill(false);
    for (let i = 0; i < ratingIndex; i++) {
      initialHoverState[i] = true;
    }
    setIsHover(initialHoverState);
  }, [ratingIndex]);

  // 마우스 오버 시 (별점 hover 효과)
  const handleMouseOver = (index: number) => {
    const newHoverState = Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      newHoverState[i] = true;
    }
    setIsHover(newHoverState);
    setDisplayScore(index + 1); // 마우스 오버 중인 별점까지의 점수를 임시로 표시
  };

  // 마우스 아웃 시 (hover 효과 제거, 실제 저장된 점수로 돌아감)
  const handleMouseOut = () => {
    const newHoverState = Array(5).fill(false);
    for (let i = 0; i < ratingIndex; i++) { // 실제 `ratingIndex`에 따라 채움
      newHoverState[i] = true;
    }
    setIsHover(newHoverState);
    setDisplayScore(ratingIndex); // 실제 `ratingIndex`로 돌아감
  };

  // 클릭 시 (실제 점수 저장)
  const handleOnClick = (index: number) => {
    // `setRatingIndex` 함수를 호출하여 부모 컴포넌트의 상태를 업데이트합니다.
    setRatingIndex(index + 1); // 클릭한 별점의 인덱스에 1을 더하여 실제 점수로 저장
  };

  return(
    <div className="rating-container flex items-center"> {/* flex와 items-center 추가 */}
        {[0,1,2,3,4].map((element, index) => (
            <FaStar
                // `isHover` 배열을 사용하여 마우스 오버 효과를 제어하거나,
                // `displayScore`를 사용하여 현재 보여줄 별점 개수를 제어할 수 있습니다.
                // 여기서는 `displayScore`를 기준으로 active/inactive를 결정하는 것이 더 직관적입니다.
                className={element < displayScore ? "rating-star-over" : "rating-star-out"} // Tailwind CSS 클래스로 변경 예시
                // Tailwind CSS 클래스를 사용하지 않는다면, `isHover[element] ? "rating-star-over" : "rating-star-out"` 유지
                key={index}
                size={35} // 크기를 35로 통일
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
                onClick={() => handleOnClick(index)}
            />
        ))}
    </div>
  );
};



export const useReviewForm = ({ initialIsbn, bookData, userId }: UseReviewFormProps): UseReviewFormResult => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ReviewSubmitData>({
    isbn: initialIsbn || '',
    title: '',
    authors: '',
    publisher: '',
    publishedYear: 0,
    thumbnail: '',
    description: '',
    rating: 0,
    content: '',
    userId: userId
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 책 정보가 로드되면 폼 데이터를 초기화
  useEffect(() => {
    if (bookData) {
      setFormData(prevData => ({
        ...prevData,
        isbn: bookData.isbn,
        title: bookData.title,
        authors: Array.isArray(bookData.authors) ? bookData.authors.join(', ') : bookData.authors,
        publisher: bookData.publisher,
        publishedYear: bookData.publishedYear,
        thumbnail: bookData.thumbnail,
        description: bookData.description,
      }));
    }
  }, [bookData]);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'rating' || name === 'publishedYear' ? Number(value) : value
    }));
  };

  // 평점 변경 핸들러 (RatingSection과 연결)
  const handleRatingChange = (newRating: number) => {
    setFormData(prevData => ({
      ...prevData,
      rating: newRating
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.isbn || !formData.content || formData.rating < 1 || formData.rating > 5) {
      setSubmitError("모든 필수 정보를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {};

      await axios.post('https://booktalk-server.shop/reviews', formData, { // const response =
        headers: headers
      });

      setSubmitSuccess(true);
      const finalIsbn = getPrimaryIsbn(formData.isbn); // isbn 13자리 처리
      navigate(`/book/${finalIsbn}`); // 해당 책 상세 페이지로 이동

    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      if (axios.isAxiosError(error)) {
        setSubmitError(error.response?.data?.message || "리뷰 작성 중 오류가 발생했습니다.");
      } else {
        setSubmitError("알 수 없는 오류가 발생했습니다.");
      }
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleRatingChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  };
};


export const useEditReviewForm = ({ existingReview }: UseEditReviewFormProps): UseEditReviewFormResult => {
  const navigate = useNavigate();

  // 폼 초기 상태: 기존 리뷰 데이터로 채워 넣기
  const [formData, setFormData] = useState<{ rating: number; content: string }>({
    rating: Number(existingReview?.rating) || 0,
    content: existingReview?.content || '' // ✅ 기존 리뷰 내용으로 초기화
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 기존 리뷰 데이터가 비동기적으로 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: Number(existingReview.rating),
        content: existingReview.content // ✅ 기존 리뷰 내용으로 업데이트
      });
    }
  }, [existingReview]);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  // 평점 변경 핸들러
  const handleRatingChange = (newRating: number) => {
    setFormData(prevData => ({
      ...prevData,
      rating: newRating
    }));
  };

  // ✅ 폼 제출 핸들러 (수정 로직)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!existingReview || !formData.content || formData.rating < 1 || formData.rating > 5) {
      setSubmitError("모든 필수 정보를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const updateData: ReviewEditedData = {
        rating: formData.rating,
        content: formData.content,
        userId: existingReview.userId // 기존 리뷰의 userId를 사용
      };

      // ✅ axios.put으로 리뷰 수정 API 호출
      // 백엔드 API 엔드포인트에 맞게 수정: reviews/{reviewId}
      await axios.patch(`https://booktalk-server.shop/reviews/${existingReview.reviewId}`, updateData, { // const response =
        headers: headers
      });

      setSubmitSuccess(true);

      navigate(`/mypage/reviews`);

    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      if (axios.isAxiosError(error)) {
        setSubmitError(error.response?.data?.message || "리뷰 수정 중 오류가 발생했습니다.");
      } else {
        setSubmitError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleRatingChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  };
};



interface UseReviewDetailsResult {
  reviewData: ReviewDetail | null;
  isLoadingReview: boolean;
  errorReview: string | null;
}

export const useReviewDetails = (reviewId: number | undefined): UseReviewDetailsResult => {
  const [reviewData, setReviewData] = useState<ReviewDetail | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);
  const [errorReview, setErrorReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoadingReview(true);
      setErrorReview(null);
      setReviewData(null); // 데이터 초기화

      if (reviewId === undefined) {
        setIsLoadingReview(false);
        return;
      }

      try {
        const response2 = await axios.get<ReviewDetail>(`https://booktalk-server.shop/reviews/search3/${reviewId}`);
        setReviewData(response2.data);
        // ✅ 리뷰 상세 정보를 가져오는 API 엔드포인트에 맞게 수정
        // const response = await axios.get<ReviewDetail>(`https://booktalk-server.shop/reviews/${reviewId}`);
        // const requestUrl=`https://booktalk-server.shop/comment/review/count/${reviewId}`;
        // const responseComment=await axios.get(requestUrl);
        // const responseLikeCount = await axios.post(`https://booktalk-server.shop/likes/count`, {
        //    reviewId: `${reviewId}`
        //   });
        //   response.data.likeCount=responseLikeCount.data;
        // // ✅ 응답 데이터 디코딩 (필요한 필드만)
        // const rawReview = response.data;
        // rawReview.commentCount=responseComment.data;
        // setReviewData(rawReview);
        // ✅ 수정: 데이터 로딩 성공 후 로딩 상태를 false로 변경
        setIsLoadingReview(false);
      } catch (err) {
        console.error('리뷰 상세 정보 불러오기 에러:', err);
        setErrorReview('리뷰 정보를 불러오는 데 실패했습니다.');
        setIsLoadingReview(false);
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  return { reviewData, isLoadingReview, errorReview };
};



export const useRevCommentForm = ({ reviewId, userId, refetch }: UseRevCommentFormProps): UseRevCommentFormResult => {

  const [formData, setFormData] = useState<RevCommentSubmitData>({
    reviewId: reviewId, // ✅ reviewId는 prop으로 받은 그대로 사용 (number 타입 유지)
    parentId: null,    // ✅ parentId는 초기값을 null로 설정 (number | null 타입 유지)
    userId: userId,    // ✅ userId는 prop으로 받은 그대로 사용
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
    setSubmitError(null); // 입력 시 에러 메시지 초기화
    setSubmitSuccess(false); // 입력 시 성공 메시지 초기화
  };

  // 대댓글 대상 설정 핸들러
  const setReplyToComment = (parentId: number | null) => {
    setFormData(prev => ({ ...prev, parentId: parentId, content: '' })); // 대댓글 모드 진입 시 내용 초기화
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ 댓글 내용 유효성 검사 (공백만 있는 경우도 포함)
    if (!formData.content.trim()) {
      setSubmitError("댓글 내용을 입력해 주세요.");
      return;
    }

    // ✅ userId 유효성 검사 (로그인 상태 확인)
    // userId가 0이거나 null/undefined일 경우 로그인 필요 메시지
    if (!userId) { // userId가 0이거나 null/undefined인 경우
        setSubmitError("로그인이 필요합니다.");
        return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {};

      // ✅ 백엔드 creatComment 함수 시그니처에 맞춰 명시적으로 데이터 전송
      // creatComment(userId:number, reviewId:number, content:string, parentId?:number|null)
      await axios.post( // const response =
        `https://booktalk-server.shop/comment/add`, // ✅ 기존 URL 유지
        {
          userId: formData.userId,
          reviewId: formData.reviewId,
          content: formData.content.trim(), // 공백 제거 후 전송
          parentId: formData.parentId // null 또는 number
        },
        { headers: headers }
      );

      setSubmitSuccess(true);
      setFormData(prev => ({ // 댓글 작성 성공 후 폼 초기화
        ...prev,
        content: '',
        parentId: null // 대댓글 모드 해제
      }));

      refetch();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      if (axios.isAxiosError(error)) {
        // 서버에서 반환하는 에러 메시지가 있다면 사용
        setSubmitError(error.response?.data?.message || "댓글 작성 중 오류가 발생했습니다.");
        // HTTP 상태 코드에 따른 추가 처리 (예: 401 Unauthorized)
        if (error.response?.status === 401) {
            setSubmitError("로그인이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.");
            // 필요하다면 로그아웃 처리 또는 로그인 페이지로 리다이렉트 로직 추가
        }
      } else {
        setSubmitError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange, // ✅ handleChange 함수를 반환 객체에 추가
    setReplyToComment, // ✅ setReplyToComment 함수를 반환 객체에 추가
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess
  };
};


interface UseCommentsResult {
  comments: Comment[];
  isLoadingComments: boolean;
  errorComments: string | null;
  commentCount:number;
  refetch: () => void;
}

function nestComments(comments: Comment[]): Comment[] {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // 1단계: 모든 댓글을 Map에 저장하고 replies 배열 초기화
  comments.forEach(comment => {
    commentMap.set(comment.commentId, { ...comment, replies: [] });
  });

  // 2단계: parentId에 따라 댓글을 부모의 replies에 추가하거나 rootComments에 추가
  comments.forEach(comment => {
    const currentComment = commentMap.get(comment.commentId)!;
    if (currentComment.parentId !== null) {
      const parentComment = commentMap.get(currentComment.parentId);
      if (parentComment) {
        parentComment.replies!.push(currentComment);
      } else {
        // 부모 댓글이 없는 경우 (예: 부모가 삭제됨), 루트 댓글로 처리
        rootComments.push(currentComment);
      }
    } else {
      rootComments.push(currentComment);
    }
  });

  // 3단계: 댓글들을 정렬 (예: commentId 오름차순 또는 createdAt 오름차순)
  rootComments.forEach(comment => {
    if (comment.replies) {
      comment.replies.sort((a, b) => a.commentId - b.commentId); // 또는 createdAt으로 정렬
    }
  });
  rootComments.sort((a, b) => a.commentId - b.commentId); // 루트 댓글 정렬

  return rootComments;
}

export const useComments = (reviewId: number): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [errorComments, setErrorComments] = useState<string | null>(null);
  const [commentCount,setCommentCount]=useState<number>(0)
  // ✅ 데이터를 불러오는 로직을 별도의 함수로 분리
  const fetchComments = async () => {

    if (reviewId === undefined) {
      setComments([]);
      setIsLoadingComments(false);
      return;
    }

    try {
      setIsLoadingComments(true);
      const response = await axios.get(`https://booktalk-server.shop/comment/review/${reviewId}`);
      const responseComment=await axios.get(`https://booktalk-server.shop/comment/review/count/${reviewId}`);
      setCommentCount(responseComment.data);
      const nestedComments = nestComments(response.data);
      setComments(nestedComments);
    } catch (err) {
      console.error('댓글 불러오기 에러:', err);
      setErrorComments('댓글을 불러오는 데 실패했습니다.');
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  // ✅ refetch 함수를 반환 객체에 추가
  return { comments, isLoadingComments, errorComments,commentCount, refetch: fetchComments };
};