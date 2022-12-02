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
    return _react.default.createElement("div", {
      className: classNames,
      ref: this.props.refRoot
    }, _react.default.createElement("span", {
      className: "icon icon-git-branch"
    }), _react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9icmFuY2gtdmlldy5qcyJdLCJuYW1lcyI6WyJCcmFuY2hWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjbGFzc05hbWVzIiwicHJvcHMiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsInJlZlJvb3QiLCJnZXROYW1lIiwiQnJhbmNoUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxVQUFOLFNBQXlCQyxlQUFNQyxTQUEvQixDQUF5QztBQVV0REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsVUFBVSxHQUFHLHlCQUNqQixlQURpQixFQUNBLGNBREEsRUFDZ0I7QUFBQyxnQ0FBMEIsS0FBS0MsS0FBTCxDQUFXQyxhQUFYLENBQXlCQyxVQUF6QjtBQUEzQixLQURoQixDQUFuQjtBQUlBLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBRUgsVUFBaEI7QUFBNEIsTUFBQSxHQUFHLEVBQUUsS0FBS0MsS0FBTCxDQUFXRztBQUE1QyxPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsTUFERixFQUVFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBZ0MsS0FBS0gsS0FBTCxDQUFXQyxhQUFYLENBQXlCRyxPQUF6QixFQUFoQyxDQUZGLENBREY7QUFNRDs7QUFyQnFEOzs7O2dCQUFuQ1QsVSxlQUNBO0FBQ2pCTSxFQUFBQSxhQUFhLEVBQUVJLDJCQUFlQyxVQURiO0FBRWpCSCxFQUFBQSxPQUFPLEVBQUVJLG1CQUFVQztBQUZGLEM7O2dCQURBYixVLGtCQU1HO0FBQ3BCUSxFQUFBQSxPQUFPLEVBQUUsTUFBTSxDQUFFO0FBREcsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQge0JyYW5jaFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJhbmNoVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZWZSb290OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgcmVmUm9vdDogKCkgPT4ge30sXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IGN4KFxuICAgICAgJ2dpdGh1Yi1icmFuY2gnLCAnaW5saW5lLWJsb2NrJywgeydnaXRodWItYnJhbmNoLWRldGFjaGVkJzogdGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKX0sXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lc30gcmVmPXt0aGlzLnByb3BzLnJlZlJvb3R9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tZ2l0LWJyYW5jaFwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJyYW5jaC1sYWJlbFwiPnt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==