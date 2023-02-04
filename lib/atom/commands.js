"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Commands extends _react.default.Component {
  render() {
    const {
      registry,
      target
    } = this.props;
    return _react.default.createElement("div", null, _react.default.Children.map(this.props.children, child => {
      return child ? _react.default.cloneElement(child, {
        registry,
        target
      }) : null;
    }));
  }
}
exports.default = Commands;
_defineProperty(Commands, "propTypes", {
  registry: _propTypes.default.object.isRequired,
  target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.DOMNodePropType, _propTypes2.RefHolderPropType]).isRequired,
  children: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.arrayOf(_propTypes.default.element)]).isRequired
});
class Command extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    this.subTarget = new _eventKit.Disposable();
    this.subCommand = new _eventKit.Disposable();
  }
  componentDidMount() {
    this.observeTarget(this.props);
  }
  componentWillReceiveProps(newProps) {
    if (['registry', 'target', 'command', 'callback'].some(p => newProps[p] !== this.props[p])) {
      this.observeTarget(newProps);
    }
  }
  componentWillUnmount() {
    this.subTarget.dispose();
    this.subCommand.dispose();
  }
  observeTarget(props) {
    this.subTarget.dispose();
    this.subTarget = _refHolder.default.on(props.target).observe(t => this.registerCommand(t, props));
  }
  registerCommand(target, {
    registry,
    command,
    callback
  }) {
    this.subCommand.dispose();
    this.subCommand = registry.add(target, command, callback);
  }
  render() {
    return null;
  }
}
exports.Command = Command;
_defineProperty(Command, "propTypes", {
  registry: _propTypes.default.object,
  target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.DOMNodePropType, _propTypes2.RefHolderPropType]),
  command: _propTypes.default.string.isRequired,
  callback: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21tYW5kcyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVnaXN0cnkiLCJ0YXJnZXQiLCJwcm9wcyIsIkNoaWxkcmVuIiwibWFwIiwiY2hpbGRyZW4iLCJjaGlsZCIsImNsb25lRWxlbWVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJzdHJpbmciLCJET01Ob2RlUHJvcFR5cGUiLCJSZWZIb2xkZXJQcm9wVHlwZSIsImVsZW1lbnQiLCJhcnJheU9mIiwiQ29tbWFuZCIsImNvbnN0cnVjdG9yIiwiY29udGV4dCIsInN1YlRhcmdldCIsIkRpc3Bvc2FibGUiLCJzdWJDb21tYW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJvYnNlcnZlVGFyZ2V0IiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5ld1Byb3BzIiwic29tZSIsInAiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJSZWZIb2xkZXIiLCJvbiIsIm9ic2VydmUiLCJ0IiwicmVnaXN0ZXJDb21tYW5kIiwiY29tbWFuZCIsImNhbGxiYWNrIiwiYWRkIiwiZnVuYyJdLCJzb3VyY2VzIjpbImNvbW1hbmRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge0RPTU5vZGVQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZWdpc3RyeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRhcmdldDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgRE9NTm9kZVByb3BUeXBlLFxuICAgICAgUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuZWxlbWVudCxcbiAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5lbGVtZW50KSxcbiAgICBdKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtyZWdpc3RyeSwgdGFyZ2V0fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAodGhpcy5wcm9wcy5jaGlsZHJlbiwgY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiBjaGlsZCA/IFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwge3JlZ2lzdHJ5LCB0YXJnZXR9KSA6IG51bGw7XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVnaXN0cnk6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdGFyZ2V0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBET01Ob2RlUHJvcFR5cGUsXG4gICAgICBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgICBdKSxcbiAgICBjb21tYW5kOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2FsbGJhY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICB0aGlzLnN1YlRhcmdldCA9IG5ldyBEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJDb21tYW5kID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMub2JzZXJ2ZVRhcmdldCh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICBpZiAoWydyZWdpc3RyeScsICd0YXJnZXQnLCAnY29tbWFuZCcsICdjYWxsYmFjayddLnNvbWUocCA9PiBuZXdQcm9wc1twXSAhPT0gdGhpcy5wcm9wc1twXSkpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZVRhcmdldChuZXdQcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJUYXJnZXQuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3ViQ29tbWFuZC5kaXNwb3NlKCk7XG4gIH1cblxuICBvYnNlcnZlVGFyZ2V0KHByb3BzKSB7XG4gICAgdGhpcy5zdWJUYXJnZXQuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3ViVGFyZ2V0ID0gUmVmSG9sZGVyLm9uKHByb3BzLnRhcmdldCkub2JzZXJ2ZSh0ID0+IHRoaXMucmVnaXN0ZXJDb21tYW5kKHQsIHByb3BzKSk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmQodGFyZ2V0LCB7cmVnaXN0cnksIGNvbW1hbmQsIGNhbGxiYWNrfSkge1xuICAgIHRoaXMuc3ViQ29tbWFuZC5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJDb21tYW5kID0gcmVnaXN0cnkuYWRkKHRhcmdldCwgY29tbWFuZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBNkM7QUFBQTtB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