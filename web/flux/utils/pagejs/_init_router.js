
export default function initRouter(page, userRoutes, startPath, initialRouteDispatch, routeAction) {
  Object.keys(userRoutes).forEach(routeName => {
    const routePath = userRoutes[routeName];
    page(routePath, (routeContext/*, next*/) => {
      const routeParams = Object.assign({}, routeContext.params);
      routeAction({routeName, routePath, routeParams});
    });
  });

  if (startPath === undefined || startPath === null) {
    page.start({dispatch: initialRouteDispatch, click: false});
  } else {
    page.start({dispatch: false, popstate: false, click: false});
    page(startPath);
  }
}
