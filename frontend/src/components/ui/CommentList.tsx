import React from 'react';
import axios from 'axios';
import { useComments, useRevCommentForm } from '../../hooks/useReview';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import CommentCard from './CommentCard';

interface CommentListProps {
  reviewId: number;
}

const CommentList: React.FC<CommentListProps> = ({ reviewId }) => {
  const { comments, isLoadingComments, refetch } = useComments(reviewId);

  // ✅ 1. Zustand 스토어에서 전역 상태 가져오기
  const { isLoggedIn, accessToken } = useAuthStore();
  const { userId } = useUserStore();
  console.log(isLoggedIn, userId)

  // ✅ 댓글 폼 훅 사용
  const {
    formData,
    handleChange,
    setReplyToComment,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useRevCommentForm({ reviewId, userId: userId || 0, refetch });

  const handleEditComment = (commentId: number, newContent: string) => {
    // 여기에 댓글 수정 API 호출 로직 구현
    console.log(`댓글 수정: ${commentId}, 내용: ${newContent}`);
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`http://localhost:8000/comment/${commentId}`,{
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      refetch();
    } catch(e) {
      console.log(e)
      alert("댓글 삭제 실패했습니다.");
    }
  };

  const handleReply = (parentId: number) => {
    // 대댓글 작성 폼을 띄우거나, 특정 UI 상태를 변경하는 로직
    console.log(`대댓글 작성: 부모 ${parentId}`);
  };

  if (isLoadingComments) {
    return <div className="p-4 text-center">댓글을 불러오는 중입니다...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">댓글 {comments.length}</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={isLoggedIn ? "댓글을 남겨주세요." : "로그인 후 댓글을 남길 수 있습니다."}
          value={formData.content}
          onChange={handleChange}
          disabled={isSubmitting || !isLoggedIn}
          rows={3}
        ></textarea>
        {submitError && <p className="text-red-500 text-sm mt-1">{submitError}</p>}
        {submitSuccess && <p className="text-green-500 text-sm mt-1">댓글이 성공적으로 작성되었습니다!</p>}
        <div className="flex justify-end gap-2 mt-2">
          {formData.parentId !== null && ( // 대댓글 모드일 때만 '취소' 버튼 표시
            <button
              type="button"
              className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
              onClick={() => setReplyToComment(null)} // parentId 초기화
              disabled={isSubmitting}
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isSubmitting || !isLoggedIn || formData.content.trim() === ''}
          >
            {isSubmitting ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-600">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentCard
              key={comment.commentId}
              comment={comment}
              currentUserId={userId}
              isLoggedIn={isLoggedIn}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;