import {INIT_EXAMPLE} from 'consts/example_action_types.js';

function defaultExampleState() {
  return { title: '', info: '', source: '', next: '', prev: ''};
}

export default function example(state = defaultExampleState(), action) {
  switch (action.type) {
    case INIT_EXAMPLE:
      return {...state, ...action.value};
    default:
      return state;
  }
}
