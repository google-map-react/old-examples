import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';

import PureRenderer from 'components/controls/pure_renderer/pure_renderer.jsx';

export default class MainMapLayout extends Component {
  static propTypes = {
    renderMap: PropTypes.func,
    renderTable: PropTypes.func,
    layout: PropTypes.string
  };

  static defaultProps = {
    layout: 'left'
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.layout === 'left') {
      return (
        <div style={{height: '100%', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: '62%', height: '100%'}}>
            <PureRenderer render={this.props.renderMap} />
          </div>
          <div style={{position: 'absolute', right: 0, top: 0, width: '38%', height: '100%'}}>
            <PureRenderer render={this.props.renderTable} />
          </div>
        </div>
      );
    }

    return (
      <div style={{height: '100%', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: '38%', height: '100%'}}>
          <PureRenderer render={this.props.renderTable} />
        </div>
        <div style={{position: 'absolute', right: 0, top: 0, width: '62%', height: '100%'}}>
          <PureRenderer render={this.props.renderMap} />
        </div>
      </div>
    );
  }
}
