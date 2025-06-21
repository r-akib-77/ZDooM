import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

export const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser, // Fetch the authenticated user data
        retry: false, // for authz
    });

    return {
        authUser: authUser.data?.user,
        isLoading: authUser.isLoading,
        error: authUser.error,
    };
}


