import {
  createContext,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null);
  const timerRef = useRef(null);

  const notify = useCallback((message, type) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch({ type: 'SET', payload: { message, type } });
    timerRef.current = setTimeout(() => dispatch({ type: 'CLEAR' }), 5000);
  }, []);

  const value = useMemo(() => ({ notification, notify }), [notification, notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated intentionally
export const useNotification = () => useContext(NotificationContext);
