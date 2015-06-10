/*
 * Marker example
 */

import React, {PropTypes, Component} from 'react/addons';
import cx from 'classnames';

import controllable from 'react-controllables';

import shouldPureComponentUpdate from 'react-pure-render/function';
import {getHintBottomOffsetClass, getHintBaloonVerticalPosClass, getHintBaloonHorizontalPosStyle} from '../helpers/balloon_pos.js';
import {getMarkerHolderStyle, getMarkerStyle, getMarkerTextStyle} from '../helpers/marker_styles.js';

const K_HINT_HTML_DEFAULT_Z_INDEX = 1000000;
const K_SCALE_HOVER = 1;
const K_SCALE_TABLE_HOVER = 1;
const K_SCALE_NORMAL = 0.65;
const K_MIN_CONTRAST = 0.4;


function calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, imageStyle) {
  const contrast = K_MIN_CONTRAST + (1 - K_MIN_CONTRAST) * Math.min(scale / K_SCALE_NORMAL, 1);

  return {
    transform: `scale(${scale} , ${scale})`,
    WebkitTransform: `scale(${scale} , ${scale})`,
    filter: `contrast(${contrast})`,
    WebkitFilter: `contrast(${contrast})`,
    ...markerStyle,
    ...zIndexStyle,
    ...imageStyle
  };
}

function calcMarkerTextStyle(scale, markerTextStyle) {
  const K_MAX_COLOR_VALUE = 0;
  const K_MIN_COLOR_VALUE = 8;
  const colorV = Math.ceil(K_MIN_COLOR_VALUE + (K_MAX_COLOR_VALUE - K_MIN_COLOR_VALUE) * Math.min(scale / K_SCALE_NORMAL, 1));
  const colorHex = colorV.toString(16);
  const colorHTML = `#${colorHex}${colorHex}${colorHex}`;

  return {
    ...markerTextStyle,
    color: colorHTML
  };
}

export {K_SCALE_NORMAL};

@controllable(['hoverState', 'showBallonState'])
export default class MapMarker extends Component {
  static propTypes = {
    $hover: PropTypes.bool,
    $dimensionKey: PropTypes.any,
    $getDimensions: PropTypes.func,
    $geoService: PropTypes.any,
    $onMouseAllow: PropTypes.func,

    marker: PropTypes.any,
    hoveredAtTable: PropTypes.bool,
    scale: PropTypes.number,
    showBallon: PropTypes.bool,
    onCloseClick: PropTypes.func,
    showBallonState: PropTypes.bool.isRequired,
    onShowBallonStateChange: PropTypes.func.isRequired,

    // animation helpers
    hoverState: PropTypes.bool.isRequired,
    onHoverStateChange: PropTypes.func.isRequired,

    size: PropTypes.any,
    origin: PropTypes.any,
    imageClass: PropTypes.string,
    image: PropTypes.string,
    withText: PropTypes.bool,
    hintType: PropTypes.string
  };

  static defaultProps = {
    scale: K_SCALE_NORMAL,
    hoverState: false,
    showBallonState: false,
    withText: false,
    size: {width: 62, height: 60},
    origin: {x: 15 / 62, y: 1},
    imageClass: 'map-marker__marker--big',
    hintType: 'hint--info'
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.alive = true;
  }

  _onShowBallonStateChange = (...args) => {
    if (!this.alive) return;
    this.props.onShowBallonStateChange(...args);
  }

  _onHoverStateChange = (...args) => {
    if (!this.alive) return;
    this.props.onHoverStateChange(...args);
  }

  _onMouseEnterContent = (/*e*/) => {
    this.props.$onMouseAllow(false); // disable mouse move hovers
  }

  _onMouseLeaveContent = (/*e*/) => {
    this.props.$onMouseAllow(true); // enable mouse move hovers
  }

  _onCloseClick = () => {
    if (this.props.onCloseClick) {
      this.props.onCloseClick();
    }
  }

  componentWillUnmount() {
    // if (this.props.onCloseClick) {
    //   this.props.onCloseClick();
    // }
    this.alive = false;
  }

  // no optimizations at all
  render() {
    // TODO add http://schema.org/docs/gs.html
    let scale = this.props.$hover || this.props.showBallon ? K_SCALE_HOVER : this.props.scale;
    scale = this.props.hoveredAtTable ? K_SCALE_TABLE_HOVER : scale;

    const markerHolderStyle = getMarkerHolderStyle(this.props.size, this.props.origin);
    const markerStyle = getMarkerStyle(this.props.size, this.props.origin);

    const zIndexStyle = {
      zIndex: Math.round(scale * 10000) - (this.props.showBallon ? 20 : 0) + (this.props.$hover ? K_HINT_HTML_DEFAULT_Z_INDEX : 0) // balloon
    };

    const textStyleDef = getMarkerTextStyle();
    const textStyle = calcMarkerTextStyle(scale, textStyleDef);

    const showHint = this.props.hoverState || this.props.showBallonState; // || this.props.hoveredAtTable;

    // baloon position calc
    const mapWidth = this.props.$geoService.getWidth();
    const mapHeight = this.props.$geoService.getHeight();
    const markerDim = this.props.$getDimensions(this.props.$dimensionKey);

    const hintBaloonHorizontalPosStyle = getHintBaloonHorizontalPosStyle(markerDim.x, this.props.size.width, this.props.origin.x, mapWidth);
    const hintBaloonVerticalPosClass = getHintBaloonVerticalPosClass(markerDim.y, mapHeight);

    const hintBalloonBottomOffsetClass = getHintBottomOffsetClass(this.props.size.width, this.props.origin.x);

    // set baloon position at first and then animate (it must be some lib for react animations)
    const noTransClass = this.props.$hover === true && this.props.hoverState !== true ? 'hint--notrans' : '';
    const noTransBalloonClass = this.props.showBallon === true && this.props.showBallonState !== true ? 'hint--notrans' : '';

    const imageClass = this.props.image ? '' : this.props.imageClass;
    const imageStyle = this.props.image ? {
      backgroundImage: `url(${this.props.image})`
    } : null;

    const styleMarkerMarker = calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, imageStyle);

    // css hints library https://github.com/istarkov/html-hint
    return (
      <div
        style={markerHolderStyle}
        className={cx('map-marker hint hint--html',
          this.props.hintType,
          hintBalloonBottomOffsetClass,
          noTransClass, noTransBalloonClass, hintBaloonVerticalPosClass,
          this.props.showBallon ? 'hint--balloon' : '',
          showHint ? 'hint--always' : 'hint--hidden')}>
        <div
          style={styleMarkerMarker}
          className={cx('map-marker__marker', imageClass)}>
          {this.props.withText ?
            <div style={textStyle}>
            {this.props.marker.get('number')}
            </div>
            :
            <div/>}
        </div>
        <div
          style={hintBaloonHorizontalPosStyle}
          className={cx('hint__content map-marker-hint', this.props.showBallon ? '' : 'noevents')}
          onMouseEnter={this._onMouseEnterContent}
          onMouseLeave={this._onMouseLeaveContent}>
          <div
            onClick={this._onCloseClick}
            className={cx('map-marker-hint__close-button', this.props.showBallon ? 'map-marker-hint__close-button--visible' : '')}>
            close
          </div>

          <div className="map-marker-hint__title">
            <strong>{this.props.marker.get('title')}</strong>
          </div>
          <div className="map-marker-hint__address">
            {this.props.marker.get('address')}
          </div>

          <div className={cx('map-marker-hint__content', this.props.showBallon ? 'map-marker-hint__content--visible' : '')}>
            {this.props.marker.get('description')}
          </div>

          <div>
            <a className={cx('map-marker-hint__ap-link', this.props.showBallon ? 'map-marker-hint__ap-link--hidden' : '')}>Click to view more info</a>
          </div>

        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    const K_TRANS_DELAY = 30;

    if (prevProps.$hover !== this.props.$hover) {
      setTimeout(() => this._onHoverStateChange(this.props.$hover), K_TRANS_DELAY);
    }

    if (prevProps.showBallon !== this.props.showBallon) {
      setTimeout(() => this._onShowBallonStateChange(this.props.showBallon), K_TRANS_DELAY);
    }
  }
}
