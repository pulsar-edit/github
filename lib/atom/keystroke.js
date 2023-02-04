"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _underscorePlus = require("underscore-plus");
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Keystroke extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'didChangeTarget');
    this.sub = new _eventKit.Disposable();
    this.state = {
      keybinding: null
    };
  }
  componentDidMount() {
    this.observeTarget();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.refTarget !== prevProps.refTarget) {
      this.observeTarget();
    } else if (this.props.command !== prevProps.command) {
      this.didChangeTarget(this.props.refTarget.getOr(null));
    }
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
  render() {
    if (!this.state.keybinding) {
      return null;
    }
    return _react.default.createElement("span", {
      className: "keystroke"
    }, (0, _underscorePlus.humanizeKeystroke)(this.state.keybinding.keystrokes));
  }
  observeTarget() {
    this.sub.dispose();
    if (this.props.refTarget) {
      this.sub = this.props.refTarget.observe(this.didChangeTarget);
    } else {
      this.didChangeTarget(null);
    }
  }
  didChangeTarget(target) {
    const [keybinding] = this.props.keymaps.findKeyBindings({
      command: this.props.command,
      target
    });
    this.setState({
      keybinding
    });
  }
}
exports.default = Keystroke;
_defineProperty(Keystroke, "propTypes", {
  keymaps: _propTypes.default.shape({
    findKeyBindings: _propTypes.default.func.isRequired
  }).isRequired,
  command: _propTypes.default.string.isRequired,
  refTarget: _propTypes2.RefHolderPropType
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJLZXlzdHJva2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhdXRvYmluZCIsInN1YiIsIkRpc3Bvc2FibGUiLCJzdGF0ZSIsImtleWJpbmRpbmciLCJjb21wb25lbnREaWRNb3VudCIsIm9ic2VydmVUYXJnZXQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJyZWZUYXJnZXQiLCJjb21tYW5kIiwiZGlkQ2hhbmdlVGFyZ2V0IiwiZ2V0T3IiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJyZW5kZXIiLCJodW1hbml6ZUtleXN0cm9rZSIsImtleXN0cm9rZXMiLCJvYnNlcnZlIiwidGFyZ2V0Iiwia2V5bWFwcyIsImZpbmRLZXlCaW5kaW5ncyIsInNldFN0YXRlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIlJlZkhvbGRlclByb3BUeXBlIl0sInNvdXJjZXMiOlsia2V5c3Ryb2tlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtodW1hbml6ZUtleXN0cm9rZX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5c3Ryb2tlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZmluZEtleUJpbmRpbmdzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHJlZlRhcmdldDogUmVmSG9sZGVyUHJvcFR5cGUsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnZGlkQ2hhbmdlVGFyZ2V0Jyk7XG5cbiAgICB0aGlzLnN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtrZXliaW5kaW5nOiBudWxsfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMub2JzZXJ2ZVRhcmdldCgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmVGFyZ2V0ICE9PSBwcmV2UHJvcHMucmVmVGFyZ2V0KSB7XG4gICAgICB0aGlzLm9ic2VydmVUYXJnZXQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY29tbWFuZCAhPT0gcHJldlByb3BzLmNvbW1hbmQpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlVGFyZ2V0KHRoaXMucHJvcHMucmVmVGFyZ2V0LmdldE9yKG51bGwpKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmtleWJpbmRpbmcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJrZXlzdHJva2VcIj57aHVtYW5pemVLZXlzdHJva2UodGhpcy5zdGF0ZS5rZXliaW5kaW5nLmtleXN0cm9rZXMpfTwvc3Bhbj47XG4gIH1cblxuICBvYnNlcnZlVGFyZ2V0KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWZUYXJnZXQpIHtcbiAgICAgIHRoaXMuc3ViID0gdGhpcy5wcm9wcy5yZWZUYXJnZXQub2JzZXJ2ZSh0aGlzLmRpZENoYW5nZVRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlVGFyZ2V0KG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGRpZENoYW5nZVRhcmdldCh0YXJnZXQpIHtcbiAgICBjb25zdCBba2V5YmluZGluZ10gPSB0aGlzLnByb3BzLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKHtcbiAgICAgIGNvbW1hbmQ6IHRoaXMucHJvcHMuY29tbWFuZCxcbiAgICAgIHRhcmdldCxcbiAgICB9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtrZXliaW5kaW5nfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQWdEO0FBQUE7QUFBQTtBQUFBO0FBRWpDLE1BQU1BLFNBQVMsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFTckRDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQ1osSUFBQUMsaUJBQVEsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUM7SUFFakMsSUFBSSxDQUFDQyxHQUFHLEdBQUcsSUFBSUMsb0JBQVUsRUFBRTtJQUMzQixJQUFJLENBQUNDLEtBQUssR0FBRztNQUFDQyxVQUFVLEVBQUU7SUFBSSxDQUFDO0VBQ2pDO0VBRUFDLGlCQUFpQixHQUFHO0lBQ2xCLElBQUksQ0FBQ0MsYUFBYSxFQUFFO0VBQ3RCO0VBRUFDLGtCQUFrQixDQUFDQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUN2QyxJQUFJLElBQUksQ0FBQ1YsS0FBSyxDQUFDVyxTQUFTLEtBQUtGLFNBQVMsQ0FBQ0UsU0FBUyxFQUFFO01BQ2hELElBQUksQ0FBQ0osYUFBYSxFQUFFO0lBQ3RCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQ1AsS0FBSyxDQUFDWSxPQUFPLEtBQUtILFNBQVMsQ0FBQ0csT0FBTyxFQUFFO01BQ25ELElBQUksQ0FBQ0MsZUFBZSxDQUFDLElBQUksQ0FBQ2IsS0FBSyxDQUFDVyxTQUFTLENBQUNHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RDtFQUNGO0VBRUFDLG9CQUFvQixHQUFHO0lBQ3JCLElBQUksQ0FBQ2IsR0FBRyxDQUFDYyxPQUFPLEVBQUU7RUFDcEI7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQ2IsS0FBSyxDQUFDQyxVQUFVLEVBQUU7TUFDMUIsT0FBTyxJQUFJO0lBQ2I7SUFFQSxPQUFPO01BQU0sU0FBUyxFQUFDO0lBQVcsR0FBRSxJQUFBYSxpQ0FBaUIsRUFBQyxJQUFJLENBQUNkLEtBQUssQ0FBQ0MsVUFBVSxDQUFDYyxVQUFVLENBQUMsQ0FBUTtFQUNqRztFQUVBWixhQUFhLEdBQUc7SUFDZCxJQUFJLENBQUNMLEdBQUcsQ0FBQ2MsT0FBTyxFQUFFO0lBQ2xCLElBQUksSUFBSSxDQUFDaEIsS0FBSyxDQUFDVyxTQUFTLEVBQUU7TUFDeEIsSUFBSSxDQUFDVCxHQUFHLEdBQUcsSUFBSSxDQUFDRixLQUFLLENBQUNXLFNBQVMsQ0FBQ1MsT0FBTyxDQUFDLElBQUksQ0FBQ1AsZUFBZSxDQUFDO0lBQy9ELENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ0EsZUFBZSxDQUFDLElBQUksQ0FBQztJQUM1QjtFQUNGO0VBRUFBLGVBQWUsQ0FBQ1EsTUFBTSxFQUFFO0lBQ3RCLE1BQU0sQ0FBQ2hCLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQ0wsS0FBSyxDQUFDc0IsT0FBTyxDQUFDQyxlQUFlLENBQUM7TUFDdERYLE9BQU8sRUFBRSxJQUFJLENBQUNaLEtBQUssQ0FBQ1ksT0FBTztNQUMzQlM7SUFDRixDQUFDLENBQUM7SUFDRixJQUFJLENBQUNHLFFBQVEsQ0FBQztNQUFDbkI7SUFBVSxDQUFDLENBQUM7RUFDN0I7QUFDRjtBQUFDO0FBQUEsZ0JBekRvQlQsU0FBUyxlQUNUO0VBQ2pCMEIsT0FBTyxFQUFFRyxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDdkJILGVBQWUsRUFBRUUsa0JBQVMsQ0FBQ0UsSUFBSSxDQUFDQztFQUNsQyxDQUFDLENBQUMsQ0FBQ0EsVUFBVTtFQUNiaEIsT0FBTyxFQUFFYSxrQkFBUyxDQUFDSSxNQUFNLENBQUNELFVBQVU7RUFDcENqQixTQUFTLEVBQUVtQjtBQUNiLENBQUMifQ==