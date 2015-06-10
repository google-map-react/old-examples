import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';
import cx from 'classnames';

import Link from 'components/link.jsx';

const styleHidden = {
  visibility: 'hidden'
};

const styleEmpty = {
};

export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    info: PropTypes.string,
    next: PropTypes.string,
    prev: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className={cx(this.props.className, 'header')}>
        <div className="header-grid">
          <div className="header-grid__left">
            <Link style={this.props.prev ? styleEmpty : styleHidden} href={this.props.prev}>Prev Example</Link>
          </div>
          <div className="header-grid__center">
            (<span className="header-grid__center-info hint hint--html hint--bottom hint--success">
              <span>information</span>
              <div
                className="hint__content header-grid__center-info-hint"
                dangerouslySetInnerHTML={{__html: this.props.info}} />
            </span>)
            <span className="header-grid__center-title">{this.props.title}</span>
            (<Link href={'/tmp/444'}>source</Link>)
          </div>
          <div className="header-grid__right">
            <Link style={this.props.next ? styleEmpty : styleHidden} href={this.props.next}>Next Example</Link>
          </div>
        </div>
        <hr />
      </header>
    );
  }
}
