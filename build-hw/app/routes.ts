export const routes = {
  home: () => import('./pages/home'),
  about: () => import('./pages/about'),
};

export type RouteName = keyof typeof routes;

export function loadRoute(name: RouteName) {
  return routes[name]();
}
