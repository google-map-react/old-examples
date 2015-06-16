import {DEFAULT_ROUTE} from 'consts/router_action_types';
import {Map} from 'immutable';

function defaultRouterState() {
  return new Map({
    routeName: '',
    routePath: '',
    routeFullPath: '',
    routeParams: {}
  });
}

// TODO remove constants like as here https://gist.github.com/skevy/8a4ffc3cfdaf5fd68739
// but wait for some ready library or think myself
export default function router(state = defaultRouterState(), {type: routerActionType, routeName, routePath, routeParams, routeFullPath}) {
  switch (routerActionType) {
    case DEFAULT_ROUTE:
      // no need for immutable and no need for merge, just for fun
      return state.merge({routeName, routePath, routeParams, routeFullPath});
    default:
      return state;
  }
}
