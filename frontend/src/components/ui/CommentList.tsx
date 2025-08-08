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
  const { comments, isLoadingComments, commentCount,refetch } = useComments(reviewId);

  // Zustand 스토어에서 전역 상태 가져오기
  const { isLoggedIn, accessToken } = useAuthStore();
  const { userId, nickname } = useUserStore();

  // 댓글 폼 훅 사용
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useRevCommentForm({ reviewId, userId: userId || 0, refetch });

  // 수정 상태 관리를 위한 state 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  // 대댓글 작성 폼 상태
  const [replyToParentId, setReplyToParentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  // 댓글 수정 시작 핸들러
  const handleStartEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  // 댓글 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  // 댓글 수정 핸들러
  const handleEditComment = async (commentId: number) => {
    if (!editedContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.put(
        `https://booktalk-server.onrender.com/comment/update`,
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

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`https://booktalk-server.onrender.com/comment/${commentId}`,{
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      refetch();
    } catch {
      // console.log(e)
      alert("댓글 삭제 실패했습니다.");
    }
  };


  // 대댓글 작성 핸들러
  const handleReply = (parentId: number) => {
    setReplyToParentId(parentId);
    setReplyContent('');
  };

  // 대댓글 폼 제출 핸들러 (새로 추가)
  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyContent.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
    }
    if (!userId) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        await axios.post(
            `https://booktalk-server.onrender.com/comment/add`,
            {
                userId: userId,
                reviewId: reviewId,
                content: replyContent.trim(),
                parentId: parentId,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setReplyToParentId(null); // 폼 닫기
        setReplyContent('');
        refetch();
    } catch(error) {
        console.error('대댓글 작성 실패:', error);
        alert("대댓글 작성에 실패했습니다.");
    }
  };

  // 대댓글 폼 취소 핸들러
  const handleReplyCancel = () => {
      setReplyToParentId(null);
      setReplyContent('');
  };


  if (isLoadingComments) {
    return <div className="p-4 text-center">댓글을 불러오는 중입니다...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">댓글 {commentCount}</h3>
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
            <CommentCard
              comment={comment}
              currentUserId={userId}
              isLoggedIn={isLoggedIn}
              onEdit={handleStartEdit}
              onDelete={handleDeleteComment}
              onReply={handleReply}
              // ✅ 수정 관련 props 전달
              editingCommentId={editingCommentId}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              handleCancelEdit={handleCancelEdit}
              handleEditComment={handleEditComment}
            />
            {/* ✅ 대댓글 작성 폼은 이곳에 렌더링되도록 유지 */}
            {replyToParentId === comment.commentId && (
              <form
                  onSubmit={(e) => handleReplySubmit(e, comment.commentId)}
                  className="p-4 rounded-lg bg-gray-50 my-4"
              >
                    <div className="mb-2">
                      <User nickname={nickname} width='6' />
                    </div>
                    <textarea
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="답글을 남겨주세요."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
                        onClick={handleReplyCancel}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm"
                        disabled={!replyContent.trim()}
                      >
                        답글 작성
                      </button>
                    </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;