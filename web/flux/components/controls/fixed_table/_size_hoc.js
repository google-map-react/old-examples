'use strict';
var React = require('react/addons');

var SizeHoc = (Component) => {
  const SizeHocComponent = React.createClass({
    componentDidMount() {
      this._update();
      window.addEventListener('resize', this._onResize, false);
    },

    componentWillUnmount() {
      window.removeEventListener('resize', this._onResize);
    },

    _onResize() {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._update, 16);
    },

    _update() {
      if (this.isMounted()) {
        const node = this.component.getDOMNode();
        this.setState({
          width: node.offsetWidth,
          height: node.offsetHeight
        });
      }
    },


    render() {
      return <Component ref={v => this.component = v} {...this.props} {...this.state} />;
    }
  });
  return SizeHocComponent;
};


module.exports = SizeHoc;
