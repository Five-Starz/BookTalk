/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import type { ReviewDetail } from '../types/ReviewType';
import type { ReviewSubmitData, UseReviewFormProps, UseReviewFormResult } from '../types/ReviewType'; // 제출용 리뷰 데이터 타입 임포트
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



export const useReviewForm = ({ initialIsbn, bookData }: UseReviewFormProps): UseReviewFormResult => {
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
    content: ''
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
      setSubmitError("모든 필수 정보를 입력하고 평점을 1-5 사이로 설정해주세요.");
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

      // ✅ axios.post의 세 번째 인자로 headers 객체를 정확히 전달했는지 확인합니다.
      const response = await axios.post('http://localhost:8000/reviews', formData, {
        headers: headers
      });

      console.log('리뷰 작성 성공:', response.data);
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
        // ✅ 리뷰 상세 정보를 가져오는 API 엔드포인트에 맞게 수정
        const response = await axios.get<ReviewDetail>(`http://localhost:8000/reviews/${reviewId}`);
        
        // ✅ 응답 데이터 디코딩 (필요한 필드만)
        const rawReview = response.data;
        console.log(rawReview)
        setReviewData(rawReview);
      } catch (err) {
        console.error('리뷰 상세 정보 불러오기 에러:', err);
        setErrorReview('리뷰 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  return { reviewData, isLoadingReview, errorReview };
};



export const useRevCommentForm = ({ reviewId, userId }: UseRevCommentFormProps): UseRevCommentFormResult => {

  const [formData, setFormData] = useState<RevCommentSubmitData>({
    reviewId: reviewId || '',
    parentId: '',
    userId: userId,
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.reviewId || !formData.content ) {
      setSubmitError("내용을 입력해 주세요");
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

      // ✅ axios.post의 세 번째 인자로 headers 객체를 정확히 전달했는지 확인합니다.
      const response = await axios.post(`http://localhost:8000/comment/review/${reviewId}`, formData, {
        headers: headers
      });
      console.log('댓글 작성 성공:', response.data);
      setSubmitSuccess(true);

    } catch (error) {
      console.error('댓글 작성 실패:', error);
      if (axios.isAxiosError(error)) {
        setSubmitError(error.response?.data?.message || "댓글 작성 중 오류가 발생했습니다.");
      } else {
        setSubmitError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
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
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [errorComments, setErrorComments] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingComments(true);
      setErrorComments(null);

      if (reviewId === undefined) {
        setComments([]);
        setIsLoadingComments(false);
        return;
      }

      try {
        // ✅ 댓글 API 엔드포인트는 reviewId에 따라 다를 수 있습니다.
        const response = await axios.get(`http://localhost:8000/comment/review/${reviewId}`);
        

        // ✅ 계층 구조로 변환
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

    fetchComments();
  }, [reviewId]);

  return { comments, isLoadingComments, errorComments };
};