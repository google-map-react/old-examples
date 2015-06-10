import { Store } from 'flummox';
import { Map } from 'immutable';

import {serialize, deserialize} from './utils/serialize.js';

export default class RouteStore extends Store {
  state = {
    routeName: '',
    routePath: '',
    routeFullPath: '',
    routeParams: new Map()
  };

  static serialize = serialize;
  static deserialize = deserialize;

  constructor({ routeActions }) {
    super();

    this.register(routeActions.defaultRoute, this._onDefaultRoute);
  }

  _onDefaultRoute({routeName, routePath, routeContext, routeParams}) {
    const routeFullPath = routeContext.pathname;
    if (routeFullPath !== this.state.routeFullPath) {
      this.setState({routeName, routeParams: new Map(routeParams), routePath, routeFullPath});
    }
  }

  getRouteName() {
    return this.state.routeName;
  }

  getRoutePath() {
    return this.state.routePath;
  }

  getRouteFullPath() {
    return this.state.routeFullPath;
  }

  getRouteParams() {
    return this.state.routeParams;
  }
}
