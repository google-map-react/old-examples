import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';
// import cx from 'classnames';
import Header from './header.jsx';
import Footer from './footer.jsx';

export default class Page extends Component {
  static propTypes = {
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-view">
        <Header className="main-view__row" {...this.props} />
        <main className="main-view__row main-view__row--expanded">
          {this.props.children}
        </main>
        <Footer className="main-view__row" />
      </div>
    );
  }
}
