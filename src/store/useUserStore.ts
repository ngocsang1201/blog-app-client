import { create } from 'zustand';
import { User } from '~/models';

interface UserState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {} as User,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
