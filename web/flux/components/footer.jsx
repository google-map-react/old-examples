import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';
import cx from 'classnames';

import Link from 'components/link.jsx';

export default class Footer extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className={cx(this.props.className, 'page-footer-holder')}>
        <hr/>
        <div className="page-footer">
          <div className="page-footer__left">
            <a href="https://github.com/istarkov">@ IVAN STARKOV</a>
          </div>
          <div className="page-footer__right">
            <Link href={'/tmp/eee'}>GOOGLE MAP README</Link>
          </div>
        </div>
      </footer>
    );
  }
}
