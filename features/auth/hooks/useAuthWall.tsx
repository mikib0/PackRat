import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { usePathname, useRouter } from 'expo-router';

export function useAuthWall(copy: string) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const route = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace({
        pathname: '/auth',
        params: {
          returnTo: route,
          signInCopy: copy || 'Sign in to unlock cloud sync and access all features',
        },
      });
    }
  }, [isAuthenticated]);
}
