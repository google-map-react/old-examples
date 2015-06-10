const K_ROUTE_HANDLER_IDX = 0;

export default function initRouter(routes, routeNames, {pageRouter, startPath, dispatch}, callback) {
  let initializeGuard = false;

  if (!initializeGuard) {
    const path2Name = Object.keys(routeNames).reduce((m, key) => {
      m[routeNames[key]] = key;
      return m;
    }, {});

    initializeGuard = true;
    Object.keys(routes).forEach(routePath => {
      const actions = routes[routePath];
      if (typeof (routePath) === 'string' && typeof (actions[K_ROUTE_HANDLER_IDX]) === 'function') {
        pageRouter(routePath, (routeContext, next) => {
          const routeName = path2Name[routePath];
          const actionResults = actions.map(action => action({routeName, routePath, routeContext, routeParams: Object.assign({}, routeContext.params)}));

          Promise.all(actionResults)
            .then(() => {
              if (callback) { // все прогрузились можно что то оповестить
                callback();
              }
            })
            .catch(e => {
              throw e; // подумать тут
            });
        });
      } else {
        throw new Error('bad types for route ', actions);
      }
    });

    pageRouter('*', (routeContext, next) => {
      callback(new Error('Router path not found'));
      routeContext.handled = false;
    });
  }

  if (!startPath) {
    pageRouter.start({dispatch: dispatch, click: false});
  } else {
    pageRouter.start({dispatch: false, popstate: false, click: false});
    pageRouter(startPath);
  }
}
