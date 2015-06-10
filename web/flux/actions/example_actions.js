import { Actions } from 'flummox';

export default class ExampleActions extends Actions {
  constructor() {
    super();
  }

  initExampleInfo({title, info, source, next, prev}) {
    return {title, info, source, next, prev};
  }
}
