import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { setToken } from '../requests';

const STORAGE_KEY = 'loggedBloglistUser';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const json = window.localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  });

  useEffect(() => {
    setToken(user?.token ?? null);
  }, [user]);

  const login = useCallback((loggedUser) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated intentionally
export const useUser = () => useContext(UserContext);
