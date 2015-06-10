// TODO replace fluxComponentDecorator with import {connect} from 'flummox/connect'
import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default function fluxComponentDecorator(fluxComponentProps) {
  return DecoratedComponent => class FluxComponentDecorator extends Component {

    static displayName = (DecoratedComponent.displayName || DecoratedComponent.name || 'Component');

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props, context) {
      super(props, context);
    }

    render() {
      return (
        <FluxComponent {...fluxComponentProps}>
          <DecoratedComponent {...this.props} />
        </FluxComponent>
      );
    }
  };
}
