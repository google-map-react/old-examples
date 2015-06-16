import resource from 'utils/resource.js';

import {memoize, serialize /*, isSkipError */} from 'async-decorators';

export default function createRemoteActions(url) {
  const resource_ = resource(url);

  return {
    @serialize({raiseSkipError: false}) // possible memory leak, check
    @memoize({expireMs: 1000 * 60 * 15})
    async query(params) {
      return await resource_
        .get(params);
    },

    @serialize({raiseSkipError: false})
    async save(params, obj) {
      return await resource_
        .save(params, obj);
    }
  };
}
