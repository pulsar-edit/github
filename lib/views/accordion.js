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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBY2NvcmRpb24iLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhdXRvYmluZCIsInN0YXRlIiwiZXhwYW5kZWQiLCJyZW5kZXIiLCJ0b2dnbGUiLCJyZW5kZXJIZWFkZXIiLCJyZW5kZXJDb250ZW50IiwibGVmdFRpdGxlIiwicmlnaHRUaXRsZSIsInJldmlld3NCdXR0b24iLCJpc0xvYWRpbmciLCJMb2FkaW5nIiwibG9hZGluZ0NvbXBvbmVudCIsInJlc3VsdHMiLCJsZW5ndGgiLCJFbXB0eSIsImVtcHR5Q29tcG9uZW50IiwiTW9yZSIsIm1vcmVDb21wb25lbnQiLCJtYXAiLCJpdGVtIiwiaW5kZXgiLCJrZXkiLCJ1bmRlZmluZWQiLCJvbkNsaWNrSXRlbSIsImNoaWxkcmVuIiwidG90YWwiLCJlIiwicHJldmVudERlZmF1bHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFN0YXRlIiwicHJldlN0YXRlIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJudW1iZXIiLCJib29sIiwiZnVuYyJdLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY29yZGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbGVmdFRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmlnaHRUaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXN1bHRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KS5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGxvYWRpbmdDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGVtcHR5Q29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBtb3JlQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZXZpZXdzQnV0dG9uOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNsaWNrSXRlbTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBsb2FkaW5nQ29tcG9uZW50OiAoKSA9PiBudWxsLFxuICAgIGVtcHR5Q29tcG9uZW50OiAoKSA9PiBudWxsLFxuICAgIG1vcmVDb21wb25lbnQ6ICgpID0+IG51bGwsXG4gICAgb25DbGlja0l0ZW06ICgpID0+IHt9LFxuICAgIHJldmlld3NCdXR0b246ICgpID0+IG51bGwsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3RvZ2dsZScpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGV4cGFuZGVkOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb25cIiBvcGVuPXt0aGlzLnN0YXRlLmV4cGFuZGVkfT5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLnRvZ2dsZX0+XG4gICAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29udGVudCgpfVxuICAgICAgICA8L21haW4+XG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhlYWRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLS1sZWZ0VGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sZWZ0VGl0bGV9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAge3RoaXMucHJvcHMucmlnaHRUaXRsZSAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi0tcmlnaHRUaXRsZVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucmlnaHRUaXRsZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnByb3BzLnJldmlld3NCdXR0b24oKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbnRlbnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNMb2FkaW5nKSB7XG4gICAgICBjb25zdCBMb2FkaW5nID0gdGhpcy5wcm9wcy5sb2FkaW5nQ29tcG9uZW50O1xuICAgICAgcmV0dXJuIDxMb2FkaW5nIC8+O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBFbXB0eSA9IHRoaXMucHJvcHMuZW1wdHlDb21wb25lbnQ7XG4gICAgICByZXR1cm4gPEVtcHR5IC8+O1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5leHBhbmRlZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgTW9yZSA9IHRoaXMucHJvcHMubW9yZUNvbXBvbmVudDtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLWxpc3RcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5yZXN1bHRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW0ua2V5ICE9PSB1bmRlZmluZWQgPyBpdGVtLmtleSA6IGluZGV4O1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb24tbGlzdEl0ZW1cIiBrZXk9e2tleX0gb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkNsaWNrSXRlbShpdGVtKX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW4oaXRlbSl9XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3VsPlxuICAgICAgICB7dGhpcy5wcm9wcy5yZXN1bHRzLmxlbmd0aCA8IHRoaXMucHJvcHMudG90YWwgJiYgPE1vcmUgLz59XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICB0b2dnbGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe2V4cGFuZGVkOiAhcHJldlN0YXRlLmV4cGFuZGVkfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUFvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFckIsTUFBTUEsU0FBUyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXVCckRDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQ1osSUFBQUMs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