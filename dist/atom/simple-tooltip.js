"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SimpleTooltip extends _react.default.Component {
  componentDidMount() {
    this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
      title: () => this.props.title
    });
  }

  componentWillUnmount() {
    this.disposable.dispose();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.disposable.dispose();
      this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
        title: () => this.props.title
      });
    }
  }

  render() {
    const child = _react.default.Children.only(this.props.children);

    return _react.default.cloneElement(child, {
      ref: e => {
        this.child = e;
      }
    });
  }

}

exports.default = SimpleTooltip;

_defineProperty(SimpleTooltip, "propTypes", {
  tooltips: _propTypes.default.object.isRequired,
  children: _propTypes.default.node.isRequired,
  title: _propTypes.default.string.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL3NpbXBsZS10b29sdGlwLmpzIl0sIm5hbWVzIjpbIlNpbXBsZVRvb2x0aXAiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbXBvbmVudERpZE1vdW50IiwiZGlzcG9zYWJsZSIsInByb3BzIiwidG9vbHRpcHMiLCJhZGQiLCJSZWFjdERPTSIsImZpbmRET01Ob2RlIiwiY2hpbGQiLCJ0aXRsZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInJlbmRlciIsIkNoaWxkcmVuIiwib25seSIsImNoaWxkcmVuIiwiY2xvbmVFbGVtZW50IiwicmVmIiwiZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJub2RlIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGFBQU4sU0FBNEJDLGVBQU1DLFNBQWxDLENBQTRDO0FBT3pEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLQyxVQUFMLEdBQWtCLEtBQUtDLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQkMsR0FBcEIsQ0FBd0JDLGtCQUFTQyxXQUFULENBQXFCLEtBQUtDLEtBQTFCLENBQXhCLEVBQTBEO0FBQUNDLE1BQUFBLEtBQUssRUFBRSxNQUFNLEtBQUtOLEtBQUwsQ0FBV007QUFBekIsS0FBMUQsQ0FBbEI7QUFDRDs7QUFFREMsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckIsU0FBS1IsVUFBTCxDQUFnQlMsT0FBaEI7QUFDRDs7QUFFREMsRUFBQUEsa0JBQWtCLENBQUNDLFNBQUQsRUFBWTtBQUM1QixRQUFJQSxTQUFTLENBQUNKLEtBQVYsS0FBb0IsS0FBS04sS0FBTCxDQUFXTSxLQUFuQyxFQUEwQztBQUN4QyxXQUFLUCxVQUFMLENBQWdCUyxPQUFoQjtBQUNBLFdBQUtULFVBQUwsR0FBa0IsS0FBS0MsS0FBTCxDQUFXQyxRQUFYLENBQW9CQyxHQUFwQixDQUF3QkMsa0JBQVNDLFdBQVQsQ0FBcUIsS0FBS0MsS0FBMUIsQ0FBeEIsRUFBMEQ7QUFBQ0MsUUFBQUEsS0FBSyxFQUFFLE1BQU0sS0FBS04sS0FBTCxDQUFXTTtBQUF6QixPQUExRCxDQUFsQjtBQUNEO0FBQ0Y7O0FBRURLLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1OLEtBQUssR0FBR1QsZUFBTWdCLFFBQU4sQ0FBZUMsSUFBZixDQUFvQixLQUFLYixLQUFMLENBQVdjLFFBQS9CLENBQWQ7O0FBQ0EsV0FBT2xCLGVBQU1tQixZQUFOLENBQW1CVixLQUFuQixFQUEwQjtBQUFDVyxNQUFBQSxHQUFHLEVBQUVDLENBQUMsSUFBSTtBQUFFLGFBQUtaLEtBQUwsR0FBYVksQ0FBYjtBQUFpQjtBQUE5QixLQUExQixDQUFQO0FBQ0Q7O0FBekJ3RDs7OztnQkFBdEN0QixhLGVBQ0E7QUFDakJNLEVBQUFBLFFBQVEsRUFBRWlCLG1CQUFVQyxNQUFWLENBQWlCQyxVQURWO0FBRWpCTixFQUFBQSxRQUFRLEVBQUVJLG1CQUFVRyxJQUFWLENBQWVELFVBRlI7QUFHakJkLEVBQUFBLEtBQUssRUFBRVksbUJBQVVJLE1BQVYsQ0FBaUJGO0FBSFAsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZVRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMudG9vbHRpcHMuYWRkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMuY2hpbGQpLCB7dGl0bGU6ICgpID0+IHRoaXMucHJvcHMudGl0bGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHByZXZQcm9wcy50aXRsZSAhPT0gdGhpcy5wcm9wcy50aXRsZSkge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMudG9vbHRpcHMuYWRkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMuY2hpbGQpLCB7dGl0bGU6ICgpID0+IHRoaXMucHJvcHMudGl0bGV9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY2hpbGQgPSBSZWFjdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHtyZWY6IGUgPT4geyB0aGlzLmNoaWxkID0gZTsgfX0pO1xuICB9XG59XG4iXX0=