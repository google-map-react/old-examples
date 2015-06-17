
export default function cacheMiddleware(seconds) {
  return (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + seconds);
    return next();
  };
}
