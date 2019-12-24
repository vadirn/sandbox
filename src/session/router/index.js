import { observable, derived } from 'observable';
import { routes } from './routes';
import { parsePathname, parseQuerystring } from './helpers';
import { ParseError, assert } from 'errors';

const history = observable({
  url: new URL(window.location.href),
  type: 'push',
});

export const location = derived(history, ({ url, type }) => {
  const routeArray = Object.keys(routes.routes);
  for (let route of routeArray) {
    try {
      const path = parsePathname(url.pathname, route);
      const query = parseQuerystring(url.search);
      return { path, query, name: routes.routes[route], type };
    } catch (err) {
      assert(err instanceof ParseError, err);
    }
  }
});

window.addEventListener('popstate', () => {
  const url = new URL(window.location.href);
  history.set({ url, type: 'pop' });
});

// function push(urlString) {
//   const url = new URL(urlString, window.location.origin);
//   window.history.pushState(null, null, url);
//   history.set({
//     url,
//     type: 'push',
//   });
// }

// function replace(urlString) {
//   const url = new URL(urlString, window.location.origin);
//   window.history.replaceState(null, null, url);
//   history.set({
//     url,
//     type: 'replace',
//   });
// }
