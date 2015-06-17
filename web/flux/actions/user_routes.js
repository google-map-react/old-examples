import sc from '../consts/index.js';

import {MULTI_ACTION} from '../consts/multi_action_types.js';

import exampleDefs, {examples} from '../consts/example_defs.js';

// import any action creators you need to call on onRouteChange
import { initExampleInfo } from './example_actions.js';
import { updateRoute } from './router_actions.js';

// -----------------------------------------------------------------------
// ROUTING TABLE AND CONSTANTS -------------------------------------------
// -----------------------------------------------------------------------
// call multiple action creators on route match
// look at middlewares/multi_action_middleware.js

export const K_DEFAULT_ROUTE = sc.K_SERVER_PATH + '/';
export const K_MAP_ROUTE = sc.K_SERVER_PATH + '/map/:example/:zoom?';
export const K_NO_ROUTE = '*';

const routes_ = {
  [K_DEFAULT_ROUTE]: [
    (arg) => (console.log(arg), {}) // eslint-disable-line no-console
  ],

  [K_MAP_ROUTE]: [
    ({routeParams}) => initExampleInfo({title: '', info: '', source: '', next: '', prev: '', ...exampleDefs[routeParams.example]})
  ],

  [K_NO_ROUTE]: [
    () => ({/*init a big red alert store about route not found*/}) // eslint-disable-line no-console
  ]
};

// onRouteChange calback is just an this action (use any router you like, TODO add @koistya hashchange router)
// params for K_MAP_ROUTE = '/map/:example/:zoom?' and real route `/map/simple` will be
// {routeName: "K_MAP_ROUTE", routePath: "/map/:example/:zoom?",
//  routeParams: {example: "simple", zoom: undefined}, routeFullPath: "/map/simple"}
export function changeRoute({routeName, routePath, routeParams, routeFullPath}) {
  if (routePath in routes_) {
    return {
      type: MULTI_ACTION,
      params: {routeName, routePath, routeParams, routeFullPath},
      actions: [...routes_[routePath], updateRoute]
    };
  }

  // TODO return updateRoute and add 404
  throw new Error('Unknown route');
}
