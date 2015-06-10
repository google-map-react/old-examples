const raf = (typeof window !== 'undefined') && (window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((cb) => { return window.setTimeout(cb, 1000 / 60); }));

const easing = require('utils/easing');

export default function(deltaT, from, to, easeName, callback) {
  const dtStart = (new Date()).getTime();
  const easingFn = easing[easeName];
  let canRun = true;

  const runner = () => {
    const t = Math.min(((new Date()).getTime() - dtStart) / deltaT, 1);
    const x = easingFn(t, from, to);
    if (canRun && callback(x, t)) {
      if (t < 1) {
        if (raf) raf(runner);
      }
    }
  };

  if (raf) {
    raf(runner);
  } else {
    runner();
  }

  return () => {
    canRun = false;
  };
}
