
export function getMarkerHolderStyle(size, origin) {
  const left = -size.width * origin.x;
  const top = -size.height * origin.y;
  return {
    position: 'absolute',
    width: size.width,
    height: size.height,
    left: left,
    top: top,
    cursor: 'pointer'
  };
}

export function getMarkerStyle(size, origin) {
  const sizeOriginX = size.width * origin.x;
  const sizeOriginY = size.height * origin.y;

  return {
    position: 'absolute',
    width: size.width,
    height: size.height,
    left: 0,
    top: 0,
    willChange: 'transform', // it looks like this setting make firefox random marker movements smaller
    backgroundSize: `${size.width}px ${size.height}px`,
    backgroundRepeat: 'no-repeat',
    // transition: 'transform 0.25s ease',
    transition: 'transform 0.25s cubic-bezier(0.485, 1.650, 0.545, 0.835)',
    WebkitTransition: '-webkit-transform 0.25s cubic-bezier(0.485, 1.650, 0.545, 0.835)',
    transformOrigin: `${sizeOriginX}px ${sizeOriginY}px`,
    WebkitTransformOrigin: `${sizeOriginX}px ${sizeOriginY}px`
  };
}

const textStyle_ = {
  width: '100%',
  textAlign: 'center',
  marginTop: 10,
  fontWeight: 'bold',
  fontSize: '18px',
  color: 'black'
};

export function getMarkerTextStyle() {
  return textStyle_;
}
