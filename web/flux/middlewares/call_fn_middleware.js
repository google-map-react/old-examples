
export default function callFnMiddleware(callFn) {
  return (next) =>
    (action) => (
      callFn(action),
      next(action)
  );
}
