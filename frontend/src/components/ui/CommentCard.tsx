import React from 'react';
import type { Comment } from '../../types/CommentTypes'
import User from './User'; // 유저 닉네임을 표시하는 User 컴포넌트
import { Link } from 'react-router-dom';

interface CommentCardProps {
  comment: Comment;
  currentUserId: number | null; // ✅ 로그인하지 않은 경우를 위해 null을 허용
  isLoggedIn: boolean; // ✅ 로그인 상태를 나타내는 props 추가
  onEdit: (commentId: number, newContent: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (parentId: number) => void; // 대댓글 작성 기능 (선택 사항)
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUserId,
  isLoggedIn,
  onEdit,
  onDelete,
  onReply,
}) => {
  const isMyComment = comment.userId === currentUserId;

  return (
    <div className={`p-3 rounded-lg mb-2 ${comment.parentId ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <Link to={`/user/${comment.users.userId}`}><User nickname={comment.users.nickname} width='6' /></Link>
        <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className="text-gray-800">{comment.content}</p>

      {isLoggedIn && (
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
      </div>)}

      {/* 대댓글이 있다면 재귀적으로 CommentItem 렌더링 */}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;