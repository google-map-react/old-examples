import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {routeNames} from 'create_routes.js';
import {examples} from 'consts/example_defs.js';

import {FluxComponent} from 'flummox/addons/react';

import MainMapPage from './examples/x_main/main_map_page.jsx';
import SimpleMapPage from './examples/x_simple/simple_map_page.jsx';
import SimpleHoverMapPage from './examples/x_simple_hover/simple_hover_map_page.jsx';
import DistanceHoverMapPage from './examples/x_distance_hover/distance_hover_map_page.jsx';
import EventsMapPage from './examples/x_events/events_map_page.jsx';

import Page from './page.jsx';

export default class Main extends Component {
  static propTypes = {
    routeName: PropTypes.string,
    routePath: PropTypes.string,
    routeFullPath: PropTypes.string,
    routeParams: PropTypes.any
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  _selectExample(exampleName, props) {
    switch (exampleName) {
      case examples.main:
        return (
          <MainMapPage />
        );

      case examples.balderdash:
        return (
          <MainMapPage layout="R" />
        );

      case examples.simple:
        return (
          <SimpleMapPage />
        );

      case examples.simple_hover:
        return (
          <SimpleHoverMapPage />
        );

      case examples.distance_hover:
        return (
          <DistanceHoverMapPage />
        );
      case examples.events:
        return (
          <EventsMapPage />
        );
      default:
        return (
          <div>
            <h3>404 example not found</h3>
            <div>{this._renderPathProps(props)}</div>
          </div>
        );
    }
  }

  _renderMain(props) {
    switch (props.routePath) {
      case routeNames.K_DEFAULT_ROUTE:
        return (
          <div>K_DEFAULT_ROUTE</div>
        );
      case routeNames.K_MAP_ROUTE:
        return this._selectExample(props.routeParams.get('example'), props);
      default:
        return (
          <div>
            <h3>404 page not found</h3>
            <div>{this._renderPathProps(props)}</div>
          </div>
        );
    }
  }

  _renderPathProps(props) {
    return (
      <div>routeName: {props.routeName}, routePath: {props.routePath}, routeFullPath: {props.routeFullPath}, routeParams: {props.routeParams.toString()}</div>
    );
  }

  render() {
    const main = this._renderMain(this.props);

    return (
      <FluxComponent connectToStores={{
        example: (store) => ({...store.getExampleInfo()})}}>
        <Page>
          {main}
        </Page>
      </FluxComponent>
    );
  }
}
