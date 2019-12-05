import { combineRoutes, route } from './helpers';

export const routes = combineRoutes(
  route('/', () => {}),
  route(['/playground', '/playground/:component'], () => {})
);
