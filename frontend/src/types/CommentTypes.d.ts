export interface UseRevCommentFormProps {
  initialIsbn: string; // 초기 ISBN (useParams에서 가져온 값)
}

export interface UseRevCommentFormResult {
  formData: RevCommentSubmitData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export interface RevCommentSubmitData {
  userId: number;
  reviewId: number;
  parentId?: number;
  content: string;
}