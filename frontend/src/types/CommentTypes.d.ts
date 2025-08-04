export interface RevCommentSubmitData {
  reviewId: number;
  parentId: number | null; // 부모 댓글 ID (대댓글이 아니면 null)
  userId: number; // 댓글 작성 유저 ID
  content: string; // 댓글 내용
}

export interface UseRevCommentFormProps {
  reviewId: number; // 댓글을 달 리뷰의 ID (필수)
  userId: number; // 현재 로그인한 유저의 ID (임시, 실제로는 인증 컨텍스트에서 가져오는 것이 좋음)
  refetch: () => void;
}

export interface UseRevCommentFormResult {
  formData: RevCommentSubmitData;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // content 변경
  setReplyToComment: (parentId: number | null) => void; // 대댓글 시 parentId 설정
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export interface CommentUser {
  userId: number;
  nickname: string;
}

export interface Comment {
  commentId: number;
  userId: number; // 댓글 작성자의 userId
  reviewId: number;
  content: string;
  status: string; // 'active', 'deleted' 등 댓글 상태
  parentId: number | null; // 대댓글인 경우 부모 댓글의 commentId, 아니면 null
  users: CommentUser; // 댓글 작성자의 정보 (닉네임 포함)
  createdAt: string; // 댓글 생성 시간 (예시)
  updatedAt: string; // 댓글 수정 시간 (예시)
  replies?: Comment[]; // 대댓글을 위한 재귀적 타입
}