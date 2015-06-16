import {DEFAULT_ROUTE} from 'consts/router_action_types.js';

// this action updates router_store
export function updateRoute({routeName, routePath, routeParams, routeFullPath}) {
  return {
    type: DEFAULT_ROUTE,
    value: {routeName, routePath, routeParams, routeFullPath}
  };
}
