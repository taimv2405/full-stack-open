import { create } from 'zustand';
import { getUser, saveUser, removeUser } from '../services/persistentUser';

const useUserStore = create((set) => {
  return {
    user: getUser(),
    actions: {
      login: (loggedUser) => {
        saveUser(loggedUser);
        set(() => ({ user: loggedUser }));
      },
      logout: () => {
        removeUser();
        set(() => ({ user: null }));
      },
    },
  };
});

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
export const getUserToken = () => useUserStore.getState().user?.token ?? null;
