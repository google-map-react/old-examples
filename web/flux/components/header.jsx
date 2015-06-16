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
    className: PropTypes.string, // TODO bad style remove
    example: PropTypes.any.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    const {example} = this.props;

    return (
      <header className={cx(this.props.className, 'header')}>
        <div className="header-grid">
          <div className="header-grid__left">
            <Link style={example.get('prev') ? styleEmpty : styleHidden} href={example.get('prev')}>Prev Example</Link>
          </div>
          <div className="header-grid__center">
            (<span className="header-grid__center-info hint hint--html hint--bottom hint--success">
              <span>information</span>
              <div
                className="hint__content header-grid__center-info-hint"
                dangerouslySetInnerHTML={{__html: example.get('info')}} />
            </span>)
            <span className="header-grid__center-title">{example.get('title')}</span>
            (<a target="_blank" href={example.get('source')}>source</a>)
          </div>
          <div className="header-grid__right">
            <Link style={example.get('next') ? styleEmpty : styleHidden} href={example.get('next')}>Next Example</Link>
          </div>
        </div>
        <hr />
      </header>
    );
  }
}
