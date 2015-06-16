import {INIT_EXAMPLE} from '../consts/example_action_types.js';

export function initExampleInfo({title, info, source, next, prev}) {
  return {
    type: INIT_EXAMPLE,
    title, info, source, next, prev
  };
}
