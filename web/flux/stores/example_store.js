import {INIT_EXAMPLE} from 'consts/example_action_types.js';
import {Map} from 'immutable';

function defaultExampleState() {
  return new Map({ title: '', info: '', source: '', next: '', prev: ''});
}

export default function example(state = defaultExampleState(), {type: exampleActionType, title, info, source, next, prev}) {
  switch (exampleActionType) {
    case INIT_EXAMPLE:
      return state.merge({title, info, source, next, prev});
    default:
      return state;
  }
}
