import { Store } from 'flummox';
// import { Map } from 'immutable';

import {serialize, deserialize} from './utils/serialize.js';

export default class ExampleStore extends Store {
  state = {
    title: '',
    info: '',
    source: '',
    next: '',
    prev: ''
  };

  static serialize = serialize;
  static deserialize = deserialize;

  constructor({ exampleActions }) {
    super();
    this.register(exampleActions.initExampleInfo, this._onInitExampleInfo);
  }

  _onInitExampleInfo({title, info, source, next, prev}) {
    this.setState({title, info, source, next, prev});
  }

  getExampleInfo() {
    return this.state;
  }
}
