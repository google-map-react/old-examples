import React from 'react/addons';

import AppFlux from 'utils/appflux.js';
import {FluxComponent} from 'flummox/addons/react';

import Main from 'components/main.jsx';

export default function render(options, callback) {
  return new AppFlux(options, (err, {flux, serializedData}) => {
    if (err) {
      setImmediate(() => callback(err, {}));
      return;
    }

    const component = (
      <FluxComponent
        flux={flux}
        connectToStores={{
          route: (store) => ({
            routeName: store.getRouteName(),
            routePath: store.getRoutePath(),
            routeFullPath: store.getRouteFullPath(),
            routeParams: store.getRouteParams()
          })
        }}>
          <Main />
      </FluxComponent>
    );
    setImmediate(() => callback(null, {component, serializedData}));
  });
}
