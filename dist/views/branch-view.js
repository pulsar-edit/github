"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BranchView extends _react.default.Component {
  render() {
    const classNames = (0, _classnames.default)('github-branch', 'inline-block', {
      'github-branch-detached': this.props.currentBranch.isDetached()
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classNames,
      ref: this.props.refRoot
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "icon icon-git-branch"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "branch-label"
    }, this.props.currentBranch.getName()));
  }

}

exports.default = BranchView;

_defineProperty(BranchView, "propTypes", {
  currentBranch: _propTypes2.BranchPropType.isRequired,
  refRoot: _propTypes.default.func
});

_defineProperty(BranchView, "defaultProps", {
  refRoot: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9icmFuY2gtdmlldy5qcyJdLCJuYW1lcyI6WyJCcmFuY2hWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjbGFzc05hbWVzIiwicHJvcHMiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsInJlZlJvb3QiLCJnZXROYW1lIiwiQnJhbmNoUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxVQUFOLFNBQXlCQyxlQUFNQyxTQUEvQixDQUF5QztBQVV0REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsVUFBVSxHQUFHLHlCQUNqQixlQURpQixFQUNBLGNBREEsRUFDZ0I7QUFBQyxnQ0FBMEIsS0FBS0MsS0FBTCxDQUFXQyxhQUFYLENBQXlCQyxVQUF6QjtBQUEzQixLQURoQixDQUFuQjtBQUlBLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUVILFVBQWhCO0FBQTRCLE1BQUEsR0FBRyxFQUFFLEtBQUtDLEtBQUwsQ0FBV0c7QUFBNUMsb0JBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixNQURGLGVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUFnQyxLQUFLSCxLQUFMLENBQVdDLGFBQVgsQ0FBeUJHLE9BQXpCLEVBQWhDLENBRkYsQ0FERjtBQU1EOztBQXJCcUQ7Ozs7Z0JBQW5DVCxVLGVBQ0E7QUFDakJNLEVBQUFBLGFBQWEsRUFBRUksMkJBQWVDLFVBRGI7QUFFakJILEVBQUFBLE9BQU8sRUFBRUksbUJBQVVDO0FBRkYsQzs7Z0JBREFiLFUsa0JBTUc7QUFDcEJRLEVBQUFBLE9BQU8sRUFBRSxNQUFNLENBQUU7QUFERyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7QnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuY2hWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZlJvb3Q6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICByZWZSb290OiAoKSA9PiB7fSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3goXG4gICAgICAnZ2l0aHViLWJyYW5jaCcsICdpbmxpbmUtYmxvY2snLCB7J2dpdGh1Yi1icmFuY2gtZGV0YWNoZWQnOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzfSByZWY9e3RoaXMucHJvcHMucmVmUm9vdH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1naXQtYnJhbmNoXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmNoLWxhYmVsXCI+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19