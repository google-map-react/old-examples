/*
 * prevents rerendering if parent rerenders but render func not changed
 */
import {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class PureRenderer extends Component {
  static propTypes = {
    render: PropTypes.func
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    const {render, ...other} = this.props;
    return render(other);
  }
}
