import createPage from './create_page.js';

export default function createPageJsRouter(serverPath) {
  const page = createPage();

  return {
    gotoRoute: page,

    router(userRoutes, initialRouteDispatch, routeAction) {
      Object.keys(userRoutes).forEach(routeName => {
        const routePath = userRoutes[routeName];
        page(routePath, (routeContext/*, next*/) => {
          const routeParams = Object.assign({}, routeContext.params);
          const routeFullPath = routeContext.pathname;
          routeAction({routeName, routePath, routeParams, routeFullPath});
        });
      });

      // (__DEV__ && typeof window !== 'undefined') easier to test server rendering on the client
      if (serverPath === undefined || serverPath === null || (__DEV__ && typeof window !== 'undefined')) {
        page.start({dispatch: initialRouteDispatch, click: false});
      } else {
        page.start({dispatch: false, popstate: false, click: false});
        if (initialRouteDispatch) {
          page(serverPath);
        }
      }
    }
  };
}

