import immutable from 'immutable';

function isImmutable(x) {
  if (x && x.hashCode && typeof x.hashCode === 'function' &&
    x.equals && typeof x.equals === 'function') {
    return true;
  }
  return false;
}

export function serialize(state) {
  let res = {};
  for (let key in state) {
    if (!state.hasOwnProperty(key)) continue;
    const obj = state[key];
    if (isImmutable(obj)) {
      res[key] = {
        __immutable__: true,
        value: obj.toJSON()
      };
    } else {
      res[key] = obj;
    }
  }

  return JSON.stringify(res);
}

export function deserialize(val) {
  const dObj = JSON.parse(val);
  const state = {};
  for (let key in dObj) {
    if (!dObj.hasOwnProperty(key)) continue;
    const obj = dObj[key];
    if (obj && obj.__immutable__ === true) {
      state[key] = immutable.fromJS(obj.value);
    } else {
      state[key] = obj;
    }
  }

  return state;
}
