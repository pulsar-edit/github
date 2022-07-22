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
    return /*#__PURE__*/_react.default.createElement("details", {
      className: "github-Accordion",
      open: this.state.expanded
    }, /*#__PURE__*/_react.default.createElement("summary", {
      className: "github-Accordion-header",
      onClick: this.toggle
    }, this.renderHeader()), /*#__PURE__*/_react.default.createElement("main", {
      className: "github-Accordion-content"
    }, this.renderContent()));
  }

  renderHeader() {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Accordion--leftTitle"
    }, this.props.leftTitle), this.props.rightTitle && /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Accordion--rightTitle"
    }, this.props.rightTitle), this.props.reviewsButton());
  }

  renderContent() {
    if (this.props.isLoading) {
      const Loading = this.props.loadingComponent;
      return /*#__PURE__*/_react.default.createElement(Loading, null);
    }

    if (this.props.results.length === 0) {
      const Empty = this.props.emptyComponent;
      return /*#__PURE__*/_react.default.createElement(Empty, null);
    }

    if (!this.state.expanded) {
      return null;
    }

    const More = this.props.moreComponent;
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("ul", {
      className: "github-Accordion-list"
    }, this.props.results.map((item, index) => {
      const key = item.key !== undefined ? item.key : index;
      return /*#__PURE__*/_react.default.createElement("li", {
        className: "github-Accordion-listItem",
        key: key,
        onClick: () => this.props.onClickItem(item)
      }, this.props.children(item));
    })), this.props.results.length < this.props.total && /*#__PURE__*/_react.default.createElement(More, null));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9hY2NvcmRpb24uanMiXSwibmFtZXMiOlsiQWNjb3JkaW9uIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJleHBhbmRlZCIsInJlbmRlciIsInRvZ2dsZSIsInJlbmRlckhlYWRlciIsInJlbmRlckNvbnRlbnQiLCJsZWZ0VGl0bGUiLCJyaWdodFRpdGxlIiwicmV2aWV3c0J1dHRvbiIsImlzTG9hZGluZyIsIkxvYWRpbmciLCJsb2FkaW5nQ29tcG9uZW50IiwicmVzdWx0cyIsImxlbmd0aCIsIkVtcHR5IiwiZW1wdHlDb21wb25lbnQiLCJNb3JlIiwibW9yZUNvbXBvbmVudCIsIm1hcCIsIml0ZW0iLCJpbmRleCIsImtleSIsInVuZGVmaW5lZCIsIm9uQ2xpY2tJdGVtIiwiY2hpbGRyZW4iLCJ0b3RhbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImFueSIsIm51bWJlciIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxTQUFOLFNBQXdCQyxlQUFNQyxTQUE5QixDQUF3QztBQXVCckRDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSwyQkFBUyxJQUFULEVBQWUsUUFBZjtBQUVBLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxRQUFRLEVBQUU7QUFEQyxLQUFiO0FBR0Q7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFO0FBQVMsTUFBQSxTQUFTLEVBQUMsa0JBQW5CO0FBQXNDLE1BQUEsSUFBSSxFQUFFLEtBQUtGLEtBQUwsQ0FBV0M7QUFBdkQsb0JBQ0U7QUFBUyxNQUFBLFNBQVMsRUFBQyx5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TFQ7QUFNakJ2QixFQUFBQSxnQkFBZ0IsRUFBRXFCLG1CQUFVTyxJQU5YO0FBT2pCeEIsRUFBQUEsY0FBYyxFQUFFaUIsbUJBQVVPLElBUFQ7QUFRakJ0QixFQUFBQSxhQUFhLEVBQUVlLG1CQUFVTyxJQVJSO0FBU2pCL0IsRUFBQUEsYUFBYSxFQUFFd0IsbUJBQVVPLElBVFI7QUFVakJoQixFQUFBQSxXQUFXLEVBQUVTLG1CQUFVTyxJQVZOO0FBV2pCZixFQUFBQSxRQUFRLEVBQUVRLG1CQUFVTyxJQUFWLENBQWVMO0FBWFIsQzs7Z0JBREF2QyxTLGtCQWVHO0FBQ3BCZ0IsRUFBQUEsZ0JBQWdCLEVBQUUsTUFBTSxJQURKO0FBRXBCSSxFQUFBQSxjQUFjLEVBQUUsTUFBTSxJQUZGO0FBR3BCRSxFQUFBQSxhQUFhLEVBQUUsTUFBTSxJQUhEO0FBSXBCTSxFQUFBQSxXQUFXLEVBQUUsTUFBTSxDQUFFLENBSkQ7QUFLcEJmLEVBQUFBLGFBQWEsRUFBRSxNQUFNO0FBTEQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjb3JkaW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBsZWZ0VGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByaWdodFRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlc3VsdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgdG90YWw6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbG9hZGluZ0NvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZW1wdHlDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIG1vcmVDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIHJldmlld3NCdXR0b246IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uQ2xpY2tJdGVtOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGxvYWRpbmdDb21wb25lbnQ6ICgpID0+IG51bGwsXG4gICAgZW1wdHlDb21wb25lbnQ6ICgpID0+IG51bGwsXG4gICAgbW9yZUNvbXBvbmVudDogKCkgPT4gbnVsbCxcbiAgICBvbkNsaWNrSXRlbTogKCkgPT4ge30sXG4gICAgcmV2aWV3c0J1dHRvbjogKCkgPT4gbnVsbCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAndG9nZ2xlJyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXhwYW5kZWQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvblwiIG9wZW49e3RoaXMuc3RhdGUuZXhwYW5kZWR9PlxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLWhlYWRlclwiIG9uQ2xpY2s9e3RoaXMudG9nZ2xlfT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoKX1cbiAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLWNvbnRlbnRcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb250ZW50KCl9XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb24tLWxlZnRUaXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxlZnRUaXRsZX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICB7dGhpcy5wcm9wcy5yaWdodFRpdGxlICYmIChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQWNjb3JkaW9uLS1yaWdodFRpdGxlXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yaWdodFRpdGxlfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMucHJvcHMucmV2aWV3c0J1dHRvbigpfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29udGVudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcpIHtcbiAgICAgIGNvbnN0IExvYWRpbmcgPSB0aGlzLnByb3BzLmxvYWRpbmdDb21wb25lbnQ7XG4gICAgICByZXR1cm4gPExvYWRpbmcgLz47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMucmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IEVtcHR5ID0gdGhpcy5wcm9wcy5lbXB0eUNvbXBvbmVudDtcbiAgICAgIHJldHVybiA8RW1wdHkgLz47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmV4cGFuZGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBNb3JlID0gdGhpcy5wcm9wcy5tb3JlQ29tcG9uZW50O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdpdGh1Yi1BY2NvcmRpb24tbGlzdFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlc3VsdHMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5rZXkgIT09IHVuZGVmaW5lZCA/IGl0ZW0ua2V5IDogaW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2l0aHViLUFjY29yZGlvbi1saXN0SXRlbVwiIGtleT17a2V5fSBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQ2xpY2tJdGVtKGl0ZW0pfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbihpdGVtKX1cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIHt0aGlzLnByb3BzLnJlc3VsdHMubGVuZ3RoIDwgdGhpcy5wcm9wcy50b3RhbCAmJiA8TW9yZSAvPn1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHRvZ2dsZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7ZXhwYW5kZWQ6ICFwcmV2U3RhdGUuZXhwYW5kZWR9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==