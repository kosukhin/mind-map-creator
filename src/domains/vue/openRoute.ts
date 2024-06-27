import { useRouter } from 'vue-router';

export const openRoute = (routeUrl: string) => {
  const router = useRouter();
  return router.push(routeUrl);
};
