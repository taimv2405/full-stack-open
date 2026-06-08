import { create } from 'zustand';

const useNotificationStore = create((set, get) => {
  let timerId = null;
  return {
    notification: null,
    actions: {
      notify: (message, type) => {
        if (timerId) clearTimeout(timerId);
        set(() => ({ notification: { message, type } }));
        timerId = setTimeout(() => {
          set(() => ({ notification: null }));
          timerId = null;
        }, 5000);
      },
      notifyError: (error) => {
        const message = error.response?.data?.error ?? 'Something went wrong';
        console.error(message);
        get().actions.notify(message, 'error');
      },
    },
  };
});

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
