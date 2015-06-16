import {DEFAULT_ROUTE} from 'consts/router_action_types';

function defaultRouterState() {
  return {
    routeName: '',
    routePath: '',
    routeFullPath: '',
    routeParams: {}
  };
}

export default function router(state = defaultRouterState(), action) {
  switch (action.type) {
    case DEFAULT_ROUTE:
      return {...state, ...action.value};
    default:
      return state;
  }
}
