"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Accordion extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'toggle');
    this.state = {
      expanded: true
    };
  }

  render() {
    return _react.default.createElement("details", {
      className: "github-Accordion",
      open: this.state.expanded
    }, _react.default.createElement("summary", {
      className: "github-Accordion-header",
      onClick: this.toggle
    }, this.renderHeader()), _react.default.createElement("main", {
      className: "github-Accordion-content"
    }, this.renderContent()));
  }

  renderHeader() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("span", {
      className: "github-Accordion--leftTitle"
    }, this.props.leftTitle), this.props.rightTitle && _react.default.createElement("span", {
      className: "github-Accordion--rightTitle"
    }, this.props.rightTitle), this.props.reviewsButton());
  }

  renderContent() {
    if (this.props.isLoading) {
      const Loading = this.props.loadingComponent;
      return _react.default.createElement(Loading, null);
    }

    if (this.props.results.length === 0) {
      const Empty = this.props.emptyComponent;
      return _react.default.createElement(Empty, null);
    }

    if (!this.state.expanded) {
      return null;
    }

    const More = this.props.moreComponent;
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("ul", {
      className: "github-Accordion-list"
    }, this.props.results.map((item, index) => {
      const key = item.key !== undefined ? item.key : index;
      return _react.default.createElement("li", {
        className: "github-Accordion-listItem",
        key: key,
        onClick: () => this.props.onClickItem(item)
      }, this.props.children(item));
    })), this.props.results.length < this.props.total && _react.default.createElement(More, null));
  }

  toggle(e) {
    e.preventDefault();
    return new Promise(resolve => {
      this.setState(prevState => ({
        expanded: !prevState.expanded
      }), resolve);
    });
  }

}

exports.default = Accordion;

_defineProperty(Accordion, "propTypes", {
  leftTitle: _propTypes.default.string.isRequired,
  rightTitle: _propTypes.default.string,
  results: _propTypes.default.arrayOf(_propTypes.default.any).isRequired,
  total: _propTypes.default.number.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  loadingComponent: _propTypes.default.func,
  emptyComponent: _propTypes.default.func,
  moreComponent: _propTypes.default.func,
  reviewsButton: _propTypes.default.func,
  onClickItem: _propTypes.default.func,
  children: _propTypes.default.func.isRequired
});

_defineProperty(Accordion, "defaultProps", {
  loadingComponent: () => null,
  emptyComponent: () => null,
  moreComponent: () => null,
  onClickItem: () => {},
  reviewsButton: () => null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9hY2NvcmRpb24uanMiXSwibmFtZXMiOlsiQWNjb3JkaW9uIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJleHBhbmRlZCIsInJlbmRlciIsInRvZ2dsZSIsInJlbmRlckhlYWRlciIsInJlbmRlckNvbnRlbnQiLCJsZWZ0VGl0bGUiLCJyaWdodFRpdGxlIiwicmV2aWV3c0J1dHRvbiIsImlzTG9hZGluZyIsIkxvYWRpbmciLCJsb2FkaW5nQ29tcG9uZW50IiwicmVzdWx0cyIsImxlbmd0aCIsIkVtcHR5IiwiZW1wdHlDb21wb25lbnQiLCJNb3JlIiwibW9yZUNvbXBvbmVudCIsIm1hcCIsIml0ZW0iLCJpbmRleCIsImtleSIsInVuZGVmaW5lZCIsIm9uQ2xpY2tJdGVtIiwiY2hpbGRyZW4iLCJ0b3RhbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImFueSIsIm51bWJlciIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxTQUFOLFNBQXdCQyxlQUFNQyxTQUE5QixDQUF3QztBQXVCckRDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSwyQkFBUyxJQUFULEVBQWUsUUFBZjtBQUVBLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxRQUFRLEVBQUU7QUFEQyxLQUFiO0FBR0Q7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0U7QUFBUyxNQUFBLFNBQVMsRUFBQyxrQkFBbkI7QUFBc0MsTUFBQSxJQUFJLEVBQUUsS0FBS0YsS0FBTCxDQUFXQztBQUF2RCxPQUNFO0FBQVMsTUFBQSxTQUFTLEVBQUMseUJB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RUFBQUEsZ0JBQWdCLEVBQUVxQixtQkFBVU8sSUFOWDtBQU9qQnhCLEVBQUFBLGNBQWMsRUFBRWlCLG1CQUFVTyxJQVBUO0FBUWpCdEIsRUFBQUEsYUFBYSxFQUFFZSxtQkFBVU8sSUFSUjtBQVNqQi9CLEVBQUFBLGFBQWEsRUFBRXdCLG1CQUFVTyxJQVRSO0FBVWpCaEIsRUFBQUEsV0FBVyxFQUFFUyxtQkFBVU8sSUFWTjtBQVdqQmYsRUFBQUEsUUFBUSxFQUFFUSxtQkFBVU8sSUFBVixDQUFlTDtBQVhSLEM7O2dCQURBdkMsUyxrQkFlRztBQUNwQmdCLEVBQUFBLGdCQUFnQixFQUFFLE1BQU0sSUFESjtBQUVwQkksRUFBQUEsY0FBYyxFQUFFLE1BQU0sSUFGRjtBQUdwQkUsRUFBQUEsYUFBYSxFQUFFLE1BQU0sSUFIRDtBQUlwQk0sRUFBQUEsV0FBVyxFQUFFLE1BQU0sQ0FBRSxDQUpEO0FBS3BCZixFQUFBQSxhQUFhLEVBQUUsTUFBTTtBQUxELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY29yZGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbGVmdFRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmlnaHRUaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXN1bHRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KS5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGxvYWRpbmdDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGVtcHR5Q29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBtb3JlQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZXZpZXdzQnV0dG9uOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNsaWNrSXRlbTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBsb2FkaW5nQ29tcG9uZW50OiAoKSA9PiBudWxsLFxuICAgIGVtcHR5Q29tcG9uZW50OiAoKSA9PiBudWxsLFxuICAgIG1vcmVDb21wb25lbnQ6ICgpID0+IG51bGwsXG4gICAgb25DbGlja0l0ZW06ICgpID0+IHt9LFxuICAgIHJldmlld3NCdXR0b246ICgpID0+IG51bGwsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3RvZ2dsZScpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGV4cGFuZGVkOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb25cIiBvcGVuPXt0aGlzLnN0YXRlLmV4cGFuZGVkfT5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLnRvZ2dsZX0+XG4gICAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29udGVudCgpfVxuICAgICAgICA8L21haW4+XG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhlYWRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLS1sZWZ0VGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sZWZ0VGl0bGV9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAge3RoaXMucHJvcHMucmlnaHRUaXRsZSAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi0tcmlnaHRUaXRsZVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucmlnaHRUaXRsZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnByb3BzLnJldmlld3NCdXR0b24oKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbnRlbnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNMb2FkaW5nKSB7XG4gICAgICBjb25zdCBMb2FkaW5nID0gdGhpcy5wcm9wcy5sb2FkaW5nQ29tcG9uZW50O1xuICAgICAgcmV0dXJuIDxMb2FkaW5nIC8+O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBFbXB0eSA9IHRoaXMucHJvcHMuZW1wdHlDb21wb25lbnQ7XG4gICAgICByZXR1cm4gPEVtcHR5IC8+O1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5leHBhbmRlZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgTW9yZSA9IHRoaXMucHJvcHMubW9yZUNvbXBvbmVudDtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLWxpc3RcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5yZXN1bHRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW0ua2V5ICE9PSB1bmRlZmluZWQgPyBpdGVtLmtleSA6IGluZGV4O1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb24tbGlzdEl0ZW1cIiBrZXk9e2tleX0gb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkNsaWNrSXRlbShpdGVtKX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW4oaXRlbSl9XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3VsPlxuICAgICAgICB7dGhpcy5wcm9wcy5yZXN1bHRzLmxlbmd0aCA8IHRoaXMucHJvcHMudG90YWwgJiYgPE1vcmUgLz59XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICB0b2dnbGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe2V4cGFuZGVkOiAhcHJldlN0YXRlLmV4cGFuZGVkfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=