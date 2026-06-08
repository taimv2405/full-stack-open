import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/users';

const USERS_KEY = ['users'];

export const useUsers = () => {
  const result = useQuery({
    queryKey: USERS_KEY,
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    users: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};
