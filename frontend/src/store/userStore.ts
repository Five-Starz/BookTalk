import { create } from 'zustand';

interface UserState {
  userId: number | null;
  nickname: string;
  setUser: (user: { userId: number; nickname: string }) => void;
  setNickname: (nickname: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  nickname: '',
  setUser: ({ userId, nickname }) => set({ userId, nickname }),
  setNickname: (nickname) => set({ nickname }),
  clearUser: () => set({ userId: null, nickname: '' }),
}));
