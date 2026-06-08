import { create } from 'zustand';

const STORAGE_KEY = 'loggedBloglistUser';

const useUserStore = create((set) => {
  const json = window.localStorage.getItem(STORAGE_KEY);
  const storedUser = json ? JSON.parse(json) : null;
  return {
    user: storedUser,
    actions: {
      login: (loggedUser) => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
        set(() => ({ user: loggedUser }));
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        set(() => ({ user: null }));
      },
    },
  };
});

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
export const getUserToken = () => useUserStore.getState().user?.token ?? null;
