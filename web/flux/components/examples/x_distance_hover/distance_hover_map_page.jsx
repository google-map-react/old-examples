/*
 * GoogleMap distance hover usage example
 */
import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import MyGreatPlaceWithStick from './my_great_place_with_stick.jsx';

import {K_CIRCLE_SIZE, K_STICK_SIZE} from './my_great_place_with_hover_styles.js';

export default class DistanceHoverMapPage extends Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    greatPlaceCoords: PropTypes.any
  };

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    greatPlaceCoords: {lat: 59.9695413, lng: 30.382844}
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  _distanceToMouse = (markerPos, mousePos, markerProps) => {
    const x = markerPos.x;
    // because of marker non symmetric,
    // we transform it central point to measure distance from marker circle center
    // you can change distance function to any other distance measure
    const y = markerPos.y - K_STICK_SIZE - K_CIRCLE_SIZE / 2;

    // and i want that hover probability on markers with text === 'A' be greater than others
    // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
    // another way is to decrease distance for 'A' marker
    // this is really visible on small zoom values or if there are a lot of markers on the map
    const distanceKoef = markerProps.text !== 'A' ? 1.5 : 1;

    // it's just a simple example, you can tweak distance function as you wish
    return distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
  }

  render() {
    return (
       <GoogleMap
        // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
        center={this.props.center}
        zoom={this.props.zoom}
        // instead of css hover (which sometimes is bad for map markers) (bad means inability to hover on markers placed under other markers)
        // you can use internal GoogleMap component hover algorithm
        // hoverDistance - is is the threshold value for distanceToMouse function,
        // marker gets $hover=true property if it has minimal distanceToMouse(...args) result
        // and distanceToMouse(...args) < hoverDistance
        hoverDistance={K_CIRCLE_SIZE / 2}
        distanceToMouse={this._distanceToMouse}
        >
        <MyGreatPlaceWithStick lat={59.955413} lng={30.337844} text={'A'} zIndex={2} /* Kreyser Avrora */ />
        <MyGreatPlaceWithStick {...this.props.greatPlaceCoords} text={'B'} zIndex={1} /* place near Kreyser Avrora */ />
      </GoogleMap>
    );
  }
}
