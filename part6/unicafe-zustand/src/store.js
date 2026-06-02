import { create } from 'zustand';

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    increaseGood: () => set((state) => ({ good: state.good + 1 })),
    increaseNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    increaseBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));

export const useGood = () => useFeedbackStore((s) => s.good);
export const useNeutral = () => useFeedbackStore((s) => s.neutral);
export const useBad = () => useFeedbackStore((s) => s.bad);
export const useFeedbackActions = () => useFeedbackStore((s) => s.actions);
