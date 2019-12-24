import { ParseError, assert } from 'errors';

/**
 * Returns an object, representing querystring
 * @param {string} querystring
 * @returns {Object}
 */
export function parseQuerystring(querystring) {
  return querystring
    .slice(1)
    .split('&')
    .reduce((result, item) => {
      const queryItem = item.split('=');
      const nextResult = result;
      const key = decodeURIComponent(queryItem[0]);
      let value = null;
      if (queryItem[1]) {
        value = decodeURIComponent(queryItem[1]);
      }
      if (key.length > 0) {
        nextResult[key] = value || key;
      }
      return nextResult;
    }, {});
}

/**
 * Returns an array of pathname parts
 * @param {string} pathname
 * @returns {Array}
 */
export function splitPathname(pathname) {
  let uri = decodeURIComponent(pathname);
  if (uri[0] === '/') {
    uri = uri.substr(1);
  }
  if (uri[uri.length - 1] === '/') {
    uri = uri.slice(0, -1);
  }
  return uri.split('/');
}

/**
 * Tries to parse provided pathname using provided route.
 * Returns parsed data or throws ParseError if route cannot be matched
 *
 * @param {spring} pathname
 * @param {spring} routestring
 */
export function parsePathname(pathname, routestring) {
  const routeComponentArray = splitPathname(routestring);
  const pathComponentArray = splitPathname(pathname);

  assert(
    routeComponentArray.length === pathComponentArray.length,
    new ParseError()
  );

  const returnValue = {};

  for (let i = 0; i < routeComponentArray.length; i += 1) {
    const routeComponent = routeComponentArray[i];
    const pathComponent = pathComponentArray[i];
    if (routeComponent.startsWith(':')) {
      returnValue[routeComponent.slice(1)] = pathComponent;
    } else {
      assert(routeComponent === pathComponent, new ParseError());
    }
  }

  return returnValue;
}

/**
 * Returns a querystring from an object representation
 * @param {Object} query
 * @returns {string}
 */
export function serializeQuery(query) {
  const keys = Object.keys(query);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .reduce((accum, key) => {
      accum += `${key}=${query[key]}&`;
      return accum;
    }, '?')
    .slice(0, -1);
}

/**
 * Returns a pathname from an object representations and route
 * @param {Object} path
 * @param {string} routestring
 * @returns {string}
 */
export function serializePath(path, routestring) {
  const routeComponentArray = splitPathname(routestring);
  let returnValue = '';
  for (let routeComponent of routeComponentArray) {
    if (routeComponent.startsWith(':')) {
      const key = routeComponent.slice(1);
      assert(path[key] !== undefined, new ParseError());
      returnValue += `/${path[key]}`;
    } else {
      returnValue += `/${routeComponent}`;
    }
  }
  return returnValue;
}

export function combineRoutes(...routeTupleArray) {
  const routes = {};
  const names = {};
  for (const [name, route] of routeTupleArray) {
    routes[route] = name;
    names[name] = route;
  }
  return { routes, names };
}
