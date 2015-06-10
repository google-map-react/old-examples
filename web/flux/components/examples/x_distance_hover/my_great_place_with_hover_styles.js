const K_CIRCLE_SIZE = 30;
const K_STICK_SIZE = 10;
const K_STICK_WIDTH = 3;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE + K_STICK_SIZE,
  left: -K_CIRCLE_SIZE / 2,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE)
};

const greatPlaceCircleStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  border: '3px solid #f44336',
  borderRadius: K_CIRCLE_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 12,
  fontWeight: 'bold',
  padding: 0,
  cursor: 'pointer',
  boxShadow: '0 0 0 1px white'
};


const greatPlaceCircleStyleHover = {
  ...greatPlaceCircleStyle,
  border: '3px solid #3f51b5',
  color: '#f44336'
};

const greatPlaceStickStyleShadow = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2,
  top: K_CIRCLE_SIZE,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#f44336',
  boxShadow: '0 0 0 1px white'
};


const greatPlaceStickStyle = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2,
  top: K_CIRCLE_SIZE,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#f44336'
};

const greatPlaceStickStyleHover = {
  ...greatPlaceStickStyle,
  backgroundColor: '#3f51b5'
};


export {
  greatPlaceStyle,
  greatPlaceCircleStyle, greatPlaceCircleStyleHover,
  greatPlaceStickStyle, greatPlaceStickStyleHover, greatPlaceStickStyleShadow,
  K_CIRCLE_SIZE, K_STICK_SIZE};
