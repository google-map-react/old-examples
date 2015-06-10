import { Actions } from 'flummox';
import resource from 'utils/resource.js';

import {memoize, serialize /*, isSkipError */} from 'async-decorators';

export default class RemoteActions extends Actions {
  constructor(url) {
    super();
    this.resource = resource(url);
  }

  @serialize({raiseSkipError: false}) // possible memory leak, check
  @memoize({expireMs: 1000 * 60 * 15})
  async query(params) {
    return await this.resource
      .get(params);
  }

  @serialize({raiseSkipError: false})
  async save(params, obj) {
    return await this.resource
      .save(params, obj);
  }
}
