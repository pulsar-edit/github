"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * `Panel` renders a React component into an Atom panel. Specify the location via the `location` prop, and any
 * additional options to the `addXPanel` method in the `options` prop.
 *
 * You can get the underlying Atom panel via `getPanel()`, but you should consider controlling the panel via React and
 * the Panel component instead.
 */
class Panel extends _react.default.Component {
  constructor(props) {
    super(props);
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.panel = null;
    this.didCloseItem = false;
    this.domNode = document.createElement('div');
    this.domNode.className = 'react-atom-panel';
  }

  componentDidMount() {
    this.setupPanel();
  }

  render() {
    return _reactDom.default.createPortal(this.props.children, this.domNode);
  }

  setupPanel() {
    if (this.panel) {
      return;
    } // "left" => "Left"


    const location = this.props.location.substr(0, 1).toUpperCase() + this.props.location.substr(1);
    const methodName = `add${location}Panel`;
    const item = (0, _helpers.createItem)(this.domNode, this.props.itemHolder);

    const options = _objectSpread({}, this.props.options, {
      item
    });

    this.panel = this.props.workspace[methodName](options);
    this.subscriptions.add(this.panel.onDidDestroy(() => {
      this.didCloseItem = true;
      this.props.onDidClosePanel(this.panel);
    }));
  }

  componentWillUnmount() {
    this.subscriptions.dispose();

    if (this.panel) {
      this.panel.destroy();
    }
  }

  getPanel() {
    return this.panel;
  }

}

exports.default = Panel;

_defineProperty(Panel, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  location: _propTypes.default.oneOf(['top', 'bottom', 'left', 'right', 'header', 'footer', 'modal']).isRequired,
  children: _propTypes.default.element.isRequired,
  options: _propTypes.default.object,
  onDidClosePanel: _propTypes.default.func,
  itemHolder: _propTypes2.RefHolderPropType
});

_defineProperty(Panel, "defaultProps", {
  options: {},
  onDidClosePanel: panel => {}
});