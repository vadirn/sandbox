import { combineRoutes } from './helpers';

export const routes = combineRoutes(
  ['index', '/'],
  ['playground', '/playground'],
  ['playground-component', '/playground/:component']
);
