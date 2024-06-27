import { useRouter } from '@/composables/useRouter';

export const openRoute = (routeUrl: string) => {
  const router = useRouter();
  return router.push(routeUrl);
};
