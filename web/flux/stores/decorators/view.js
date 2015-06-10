/* IT's better not to use this decorator at all, and move all view like methods to pure functions (and just memoize pure function)
 * -------------------------------------------------------------------------------------------------------------------------------
 * view decorator of class methods,
 * depends on object state params,
 * works like view in databases
 * memoizes 'function call result' until some depending state parameters changed
 * for example in store you have
 * state = {param1: immutable.Map({bla bla}), param2: immutable.BlaBla(), ... , paramN }
 * you can write store method
 * @view(['param1', 'param2'])
 * getSomething() {
 *   big long calculations
 * }
 *
 * getSomething memoizes cals to getSomething until param1 or param2 changed
 * without view you need to call something like update_() { 'big long calculations' } on every param1 or param2 in code changes,
 * you need to create additional state param for 'big long calculations result'
 */

import shallowEqual from 'react-pure-render/shallowEqual';

function hashCode_(str) {
  let hash = 0;
  let i;
  let chr;
  let len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function log2_(val) {
  return Math.log(val) / Math.LN2;
}

function memoize_(stateParams, options, this_) {
  return fn => {
    const {cacheSizePower, expireMs, maxItemsPerHash, cacheSize, stateHolder} = Object.assign({stateHolder: 'state', cacheSizePower: 8, expireMs: 24 * 60 * 60 * 1000, maxItemsPerHash: 4}, options);

    const cacheSizePowerCalc = Math.round((cacheSize && cacheSize > 2) ? log2_(cacheSize) : cacheSizePower);

    const cacheSizeCalc = Math.pow(2, cacheSizePowerCalc);
    const cache_ = new Array(cacheSizeCalc);
    const mask_ = cacheSizeCalc - 1;

    const peek = (hash, im) => {
      if (hash in cache_) {
        const hashArray = cache_[hash];
        const item = hashArray.find(v => v.im === im);
        if (item !== undefined) {
          const currDt = (new Date()).getTime();
          if (currDt - item.dt < expireMs) {
            const currentState = stateParams.reduce((memo, propName) => {
              memo[propName] = this_[stateHolder][propName];
              return memo;
            }, {});

            if (shallowEqual(currentState, item.state)) {
              return item;
            }
          }

          const index = hashArray.indexOf(item);
          hashArray.splice(index, 1);
        }
      }
    };

    const put = (hash, im, result) => {
      if (!(hash in cache_)) cache_[hash] = [];
      const hashArray = cache_[hash];
      const currDt = (new Date()).getTime();

      let item = peek(hash, im);

      if (item !== undefined) {
        item.dt = currDt;
        item.result = result;
        item.state = stateParams.reduce((memo, propName) => {
          memo[propName] = this_[stateHolder][propName];
          return memo;
        }, {});
        // пересортировать
        cache_[hash] = hashArray.sortBy(v => v.dt);
      } else {
        item = {
          dt: currDt,
          im: im,
          result: result,
          state: stateParams.reduce((memo, propName) => {
            memo[propName] = this_[stateHolder][propName];
            return memo;
          }, {})
        };

        if (hashArray.length >= maxItemsPerHash) {
          hashArray.shift(); // убрать самый старый элемент
        }
        hashArray.push(item);
      }
    };

    return (...args) => {
      const im = JSON.stringify(args);
      const hash = hashCode_(im.toString()) & mask_;

      const item = peek(hash, im);

      if (item !== undefined) { // есть в кеше вернем
        return item.result;
      }

      const r = fn.apply(null, args);
      put(hash, im, r);
      return r;
    };
  };
}

export default function view(stateParams, options) {
  return (target, key, descriptor) => {
    return {
      configurable: true,
      get() {
        let classMethod = (typeof descriptor.get !== 'function') ? descriptor.value : descriptor.get.call(this);

        if (typeof classMethod !== 'function') {
          throw new Error(`@view decorator can only be applied to methods not: ${typeof classMethod}`);
        }

        let classMethodBinded = classMethod.bind(this);
        let viewFn = memoize_(stateParams, options, this)(classMethodBinded); // serialize_(classMethodBinded, options);

        Object.defineProperty(this, key, {
          value: viewFn,
          configurable: true,
          writable: true
        });

        return viewFn;
      }
    };
  };
}
