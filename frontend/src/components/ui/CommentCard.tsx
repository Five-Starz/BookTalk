// CommentCard.tsx
import React from 'react';
import type { Comment } from '../../types/CommentTypes';
import User from './User';
import { Link } from 'react-router-dom';

interface CommentCardProps {
  comment: Comment;
  currentUserId: number | null;
  isLoggedIn: boolean;
  onEdit: (commentId: number, newContent: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (parentId: number) => void;
  
  // ✅ 추가: 수정 관련 props
  editingCommentId: number | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  handleCancelEdit: () => void;
  handleEditComment: (commentId: number) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUserId,
  isLoggedIn,
  onEdit,
  onDelete,
  onReply,
  
  // ✅ 추가: 수정 관련 props
  editingCommentId,
  editedContent,
  setEditedContent,
  handleCancelEdit,
  handleEditComment,
}) => {
  const isMyComment = comment.userId === currentUserId;
  const isDeleted = comment.status === 'DELETED'; 
  
  // ✅ 수정 중인 댓글인지 확인
  const isEditing = editingCommentId === comment.commentId;

return (
    <div className={`p-3 mb-3 ${comment.parentId ? 'bg-gray-50 rounded-lg' : 'bg-white border-b border-[#eee]'}`}>
      
      {/* ✅ 수정: isEditing 조건에 따라 내부 내용을 분기 처리 */}
      {isEditing ? (
        // ✅ 수정 폼
        <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
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
        // ✅ 일반 댓글 카드 내용
        <>
          <div className="flex justify-between items-center mb-2">
            <Link to={`/user/${comment.users.userId}`}><User nickname={comment.users.nickname} width='6' /></Link>
            <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-800">{isDeleted ? <span className="text-gray-500 italic">삭제된 댓글입니다.</span> : comment.content}</p>

          {isLoggedIn && !isDeleted && (
            <div className="flex justify-end gap-2 mt-2 text-sm">
              {isMyComment && (
                <>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => onEdit(comment.commentId, comment.content)}
                  >
                    수정
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onDelete(comment.commentId)}
                  >
                    삭제
                  </button>
                </>
              )}
              {comment.parentId === null && (
                <button
                  className="text-gray-600 hover:underline"
                  onClick={() => onReply(comment.commentId)}
                >
                  답글
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ✅ 대댓글 목록은 항상 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentCard
              key={reply.commentId}
              comment={reply}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              // 재귀 호출 시 수정 관련 props 전달
              editingCommentId={editingCommentId}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              handleCancelEdit={handleCancelEdit}
              handleEditComment={handleEditComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;