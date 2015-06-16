import {Provider, Connector} from 'redux/react';

import initRedux from './init_redux.js';
import * as userRoutesActions from 'actions/user_routes.js';

import Main from 'components/main.jsx';

// this function called on client and on server
export default function render({React, ...args}) {
  return initRedux({userRoutesActions, ...args})
    .then(
      redux => ({
        component:
          <Provider redux={redux}>
            {() =>
              <Connector select={state => state.router.toJS()}>
                {(router) =>
                  <Main {...router} />}
              </Connector>
            }
          </Provider>,
        initialState: redux.getState()
      }),

      err => {
        console.error(err);
        throw err;
      }
    );
}
