import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useComments, useRevCommentForm } from '../../hooks/useReview';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import User from './User';
import CommentCard from './CommentCard';

interface CommentListProps {
  reviewId: number;
}

const CommentList: React.FC<CommentListProps> = ({ reviewId }) => {
  const { comments, isLoadingComments, refetch } = useComments(reviewId);

  // ✅ 1. Zustand 스토어에서 전역 상태 가져오기
  const { isLoggedIn, accessToken } = useAuthStore();
  const { userId } = useUserStore();

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

  // ✅ 1. 수정 상태 관리를 위한 state 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  // ✅ 2. 댓글 수정 시작 핸들러
  const handleStartEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  // ✅ 3. 댓글 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleEditComment = async (commentId: number) => {
    if (!editedContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/comment/update`,
        { commentId: commentId, content: editedContent }, // ✅ body 객체 형식으로 전달
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEditingCommentId(null); // 수정 폼 닫기
      setEditedContent('');
      refetch(); // 수정 후 댓글 목록 다시 불러오기
    } catch(e) {
      console.error(e);
      alert("댓글 수정 실패했습니다.");
    }
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
      <h3 className="text-xl font-bold mb-4">댓글 {comments.filter(comment => comment.status === 'NORMAL').length}</h3>
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
        {submitSuccess}
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
            <div key={comment.commentId}>
              {/* ✅ 5. 수정 중인 댓글인 경우와 아닌 경우를 조건부 렌더링 */}
              {editingCommentId === comment.commentId ? (
                // ✅ 수정 폼
                <div className="p-4 mb-4">
                  <User nickname={comment.users.nickname} width='6' />
                  <textarea
                    className="w-full mt-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
                      onClick={handleCancelEdit}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => handleEditComment(comment.commentId)}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ 일반 댓글 카드 (기존 CommentCard 사용)
                <CommentCard
                  key={comment.commentId}
                  comment={comment}
                  currentUserId={userId}
                  isLoggedIn={isLoggedIn}
                  onEdit={handleStartEdit} // ✅ 수정 시작 핸들러 연결
                  onDelete={handleDeleteComment}
                  onReply={handleReply}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;