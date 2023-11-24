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