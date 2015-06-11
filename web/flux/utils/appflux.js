import { Flummox } from 'flummox';
import createRouteActions from 'actions/route_actions.js';
import RouteStore from 'stores/route_store.js';

import initFlux from 'initflux.js';

import createRoutes, {routeNames} from 'create_routes.js';
import initRouter from 'utils/router.js';

import createPage from './router/router.js'; // vision media router lib

export default class AppFlux extends Flummox {
  constructor({startPath, serialize, dispatch, serializedData}, callback) {
    super();

    const pageRouter = createPage(); // pagejs роутер
    const routeActions = this.createActions('route', createRouteActions(pageRouter));

    this.createStore('route', RouteStore, { routeActions });

    const actions = initFlux(this);

    // wait for https://github.com/rackt/react-router/pull/1158 non jsx features,
    const routes = createRoutes(Object.assign({routeActions}, actions));

    let initRouterError = null;

    // -----------------------------------------------------------------------------------------------------------------------
    // вот эта часть роутерозависима, при смене роутера initRouter надо переписать частично
    initRouter(routes, routeNames, {pageRouter, startPath, dispatch}, (err) => {
      initRouterError = err;
      if (err) {
        callback(err, {});
        return;
      }

      if (serialize) { // все акшены отработали
        setTimeout(() => // TODO: убрать потом
          callback(null, {flux: this, serializedData: this.serialize()}), 0); // дожидаемся на сервере что все action отработали и шлем колбек
      }
    });

    if (initRouterError && !serialize) {
      callback(initRouterError, {}); // произошла ошибка при инициализации роутов, например нет роута
      return;
    }

    if (serializedData) { // заполнить сторы данными
      this.deserialize(serializedData);
    }

    if (!serialize) {
      callback(null, {flux: this}); // нет смысла ждать когда все акшены отрабатоют на клиенте можно сразу рендерить
    }
  }
}
