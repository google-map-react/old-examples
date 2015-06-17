import pick from 'lodash.pick';
import isString from 'lodash.isstring';
import isFunction from 'lodash.isfunction';

import {createRedux, createDispatcher, composeStores} from 'redux';
import thunkMiddleware from 'redux/lib/middleware/thunk';

import multiActionMiddleware from 'middlewares/multi_action_middleware.js';
import callFnMiddleware from 'middlewares/call_fn_middleware.js';
import promiseMiddleware from 'middlewares/promise_middleware';

import createPageJsRouter from 'utils/pagejs/create_page_js_router.js';
import {SWITCH_LINK} from 'consts/link_action_types.js';
import * as stores from 'stores/index';

const store = composeStores(stores);

export default function initRedux({initialState, serverPath, userRoutesActions}) {
  return new Promise((resolve, reject) => {
    const {gotoRoute, router} = createPageJsRouter(serverPath);

    const isServerCall = serverPath !== undefined && serverPath !== null;
    const routePathes = pick(userRoutesActions, isString);
    const initialRouteDispatch = !initialState || isServerCall; // call or not initial route

    // Create a Dispatcher function for your composite Store:
    const dispatcher = createDispatcher(
      store,
      getState => [
        thunkMiddleware(getState),
        multiActionMiddleware({wait: isServerCall}), // wait multiple actions to complete or not
        promiseMiddleware(),
        callFnMiddleware(action => (action && action.type === SWITCH_LINK && gotoRoute(action.url))) // helper for <Link /> component
      ]
    );

    const redux = createRedux(dispatcher, initialState);

    // bind route changes on changeRoute action
    router(routePathes, initialRouteDispatch, (...args) => {
      const dispatchResult = redux.dispatch(userRoutesActions.changeRoute(...args));
      // resolve on server after all actions in userRoutesActions.changeRoute resolved
      if (isServerCall) {
        if (!dispatchResult || !isFunction(dispatchResult.then)) {
          reject(new Error('dispatchResult must be promise on server'));
        }

        if (dispatchResult && isFunction(dispatchResult.then)) {
          dispatchResult.then(
            () => resolve(redux), // result is'n needed it's just to be sure all actions done
            err => reject(err)
          );
        }
      }
    });

    if (!isServerCall) {
      resolve(redux);
    }
  });
}
