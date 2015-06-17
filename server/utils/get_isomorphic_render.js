
let isomorphicRender_ = null;

export default function getIsomorphicRender(usePrerender) {
  if (!usePrerender) {
    return null;
  }

  if (isomorphicRender_) return isomorphicRender_;

  if (__DEV__) {
    isomorphicRender_ = require('../../build/prerender/main.js');
  } else {
    try {
      isomorphicRender_ = require('../../build/prerender/main.js');
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }
  return isomorphicRender_;
}
