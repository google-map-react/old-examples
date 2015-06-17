import {INIT_EXAMPLE} from '../consts/example_action_types.js';

// to emulate server async call
function getDataAsync(ms = 0, data = null) {
  return new Promise(r => setTimeout(() => r(data), ms));
}

export function initExampleInfo({title, info, source, next, prev}) {
  const K_EMUL_ASYNC_TIMEOUT_MS = 100;

  return {
    types: [null, INIT_EXAMPLE, null],
    promise: getDataAsync(K_EMUL_ASYNC_TIMEOUT_MS, {
      title, info, source, next, prev
    }) // .then(r => (console.log('initExampleInfo received', r), r))
  };
}
