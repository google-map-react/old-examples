
export function customDistanceToMouse(pt, mousePos, markerProps) {
  const K_SCALE_NORMAL = 0.65;

  const K_MARKER_HEIGHT = 60;
  // marker is more tall at top, so calc distance to some point at marker top
  const K_MARKER_WEIGHT_PT = K_MARKER_HEIGHT * 0.7;
  // distance to markers depends on scale so hover on big markers is more probable
  const scale = markerProps.scale;
  const x = pt.x;
  const y = pt.y - K_MARKER_WEIGHT_PT * scale;

  const scaleNormalized = Math.min(scale / K_SCALE_NORMAL, 1);
  const K_MIN_DIST_MIN_KOEF = 0.6;

  const distKoef = 1 + scaleNormalized * (K_MIN_DIST_MIN_KOEF - 1);
  return distKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
}
