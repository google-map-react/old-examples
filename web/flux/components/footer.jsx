import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';
import cx from 'classnames';

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
            <a target="_blank" href="https://github.com/istarkov">@ IVAN STARKOV</a>
          </div>
          <div className="page-footer__right">
            <a target="_blank" href={'https://github.com/istarkov/google-map-react'}>GOOGLE-MAP-REACT README</a>
          </div>
        </div>
      </footer>
    );
  }
}
