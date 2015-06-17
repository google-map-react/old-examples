// promiseMiddleware (c)gaearon https://github.com/gaearon/redux/issues/99#issuecomment-112212639

export default function promiseMiddleware() {
  return (next) => (action) => {
    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST});
    return promise.then(
      (result) => next({ ...rest, type: SUCCESS, ...result}),
      (error) => next({ ...rest, error, type: FAILURE })
    );
  };
}
