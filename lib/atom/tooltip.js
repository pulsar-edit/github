"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const VERBATIM_OPTION_PROPS = ['title', 'html', 'placement', 'trigger', 'keyBindingCommand', 'keyBindingTarget'];
const OPTION_PROPS = [...VERBATIM_OPTION_PROPS, 'tooltips', 'className', 'showDelay', 'hideDelay'];

class Tooltip extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    this.refSub = new _eventKit.Disposable();
    this.tipSub = new _eventKit.Disposable();
    this.domNode = null;

    if (this.props.children !== undefined) {
      this.domNode = document.createElement('div');
      this.domNode.className = 'react-atom-tooltip';
    }

    this.lastTooltipProps = {};
  }

  componentDidMount() {
    this.setupTooltip();
  }

  render() {
    if (this.props.children !== undefined) {
      return _reactDom.default.createPortal(this.props.children, this.domNode);
    } else {
      return null;
    }
  }

  componentDidUpdate() {
    if (this.shouldRecreateTooltip()) {
      this.refSub.dispose();
      this.tipSub.dispose();
      this.setupTooltip();
    }
  }

  componentWillUnmount() {
    this.refSub.dispose();
    this.tipSub.dispose();
  }

  getTooltipProps() {
    const p = {};

    for (const key of OPTION_PROPS) {
      p[key] = this.props[key];
    }

    return p;
  }

  shouldRecreateTooltip() {
    return OPTION_PROPS.some(key => this.lastTooltipProps[key] !== this.props[key]);
  }

  setupTooltip() {
    this.lastTooltipProps = this.getTooltipProps();
    const options = {};
    VERBATIM_OPTION_PROPS.forEach(key => {
      if (this.props[key] !== undefined) {
        options[key] = this.props[key];
      }
    });

    if (this.props.className !== undefined) {
      options.class = this.props.className;
    }

    if (this.props.showDelay !== undefined || this.props.hideDelay !== undefined) {
      const delayDefaults = (this.props.trigger === 'hover' || this.props.trigger === undefined) && {
        show: 1000,
        hide: 100
      } || {
        show: 0,
        hide: 0
      };
      options.delay = {
        show: this.props.showDelay !== undefined ? this.props.showDelay : delayDefaults.show,
        hide: this.props.hideDelay !== undefined ? this.props.hideDelay : delayDefaults.hide
      };
    }

    if (this.props.children !== undefined) {
      options.item = (0, _helpers.createItem)(this.domNode, this.props.itemHolder);
    }

    this.refSub = this.props.target.observe(t => {
      this.tipSub.dispose();
      this.tipSub = this.props.manager.add(t, options);
      const h = this.props.tooltipHolder;

      if (h) {
        h.setter(this.tipSub);
      }
    });
  }

}

exports.default = Tooltip;

_defineProperty(Tooltip, "propTypes", {
  manager: _propTypes.default.object.isRequired,
  target: _propTypes2.RefHolderPropType.isRequired,
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  html: _propTypes.default.bool,
  className: _propTypes.default.string,
  placement: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  trigger: _propTypes.default.oneOf(['hover', 'click', 'focus', 'manual']),
  showDelay: _propTypes.default.number,
  hideDelay: _propTypes.default.number,
  keyBindingCommand: _propTypes.default.string,
  keyBindingTarget: _propTypes.default.element,
  children: _propTypes.default.element,
  itemHolder: _propTypes2.RefHolderPropType,
  tooltipHolder: _propTypes2.RefHolderPropType
});

_defineProperty(Tooltip, "defaultProps", {
  getItemComponent: () => {}
});