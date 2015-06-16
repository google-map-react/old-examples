import {MULTI_ACTION} from 'consts/multi_action_types.js';
import isArray from 'lodash.isarray';

export default function multiActionMiddleware({wait}) {
  return next =>
    action => {
      if (action && action.type === MULTI_ACTION) {
        if (!isArray(action.actions)) {
          throw new Error('action of type MULTI_ACTION must contain actions property of Array type.');
        }

        const actionResults = action.actions.map(a => a(action.params));
        if (wait) {
          return Promise.all(actionResults.map(act => (act && act.promise) || act)) // support promise middleware interface
            .then(
              resolvedActions => {
                resolvedActions.forEach(rAction => next(rAction));
              },
              err => {
                throw new Error(err);
              }
            );
        }

        return actionResults.map(a => next(a));
      }

      return next(action);
    };
}
