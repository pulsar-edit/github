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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL2tleXN0cm9rZS5qcyJdLCJuYW1lcyI6WyJLZXlzdHJva2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdWIiLCJEaXNwb3NhYmxlIiwic3RhdGUiLCJrZXliaW5kaW5nIiwiY29tcG9uZW50RGlkTW91bnQiLCJvYnNlcnZlVGFyZ2V0IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwicmVmVGFyZ2V0IiwiY29tbWFuZCIsImRpZENoYW5nZVRhcmdldCIsImdldE9yIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyIiwia2V5c3Ryb2tlcyIsIm9ic2VydmUiLCJ0YXJnZXQiLCJrZXltYXBzIiwiZmluZEtleUJpbmRpbmdzIiwic2V0U3RhdGUiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsU0FBTixTQUF3QkMsZUFBTUMsU0FBOUIsQ0FBd0M7QUFTckRDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSwyQkFBUyxJQUFULEVBQWUsaUJBQWY7QUFFQSxTQUFLQyxHQUFMLEdBQVcsSUFBSUMsb0JBQUosRUFBWDtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUFDQyxNQUFBQSxVQUFVLEVBQUU7QUFBYixLQUFiO0FBQ0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFNBQUtDLGFBQUw7QUFDRDs7QUFFREMsRUFBQUEsa0JBQWtCLENBQUNDLFNBQUQsRUFBWUMsU0FBWixFQUF1QjtBQUN2QyxRQUFJLEtBQUtULEtBQUwsQ0FBV1UsU0FBWCxLQUF5QkYsU0FBUyxDQUFDRSxTQUF2QyxFQUFrRDtBQUNoRCxXQUFLSixhQUFMO0FBQ0QsS0FGRCxNQUVPLElBQUksS0FBS04sS0FBTCxDQUFXVyxPQUFYLEtBQXVCSCxTQUFTLENBQUNHLE9BQXJDLEVBQThDO0FBQ25ELFdBQUtDLGVBQUwsQ0FBcUIsS0FBS1osS0FBTCxDQUFXVSxTQUFYLENBQXFCRyxLQUFyQixDQUEyQixJQUEzQixDQUFyQjtBQUNEO0FBQ0Y7O0FBRURDLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtiLEdBQUwsQ0FBU2MsT0FBVDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJLENBQUMsS0FBS2IsS0FBTCxDQUFXQyxVQUFoQixFQUE0QjtBQUMxQixhQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFPO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBNkIsdUNBQWtCLEtBQUtELEtBQUwsQ0FBV0MsVUFBWCxDQUFzQmEsVUFBeEMsQ0FBN0IsQ0FBUDtBQUNEOztBQUVEWCxFQUFBQSxhQUFhLEdBQUc7QUFDZCxTQUFLTCxHQUFMLENBQVNjLE9BQVQ7O0FBQ0EsUUFBSSxLQUFLZixLQUFMLENBQVdVLFNBQWYsRUFBMEI7QUFDeEIsV0FBS1QsR0FBTCxHQUFXLEtBQUtELEtBQUwsQ0FBV1UsU0FBWCxDQUFxQlEsT0FBckIsQ0FBNkIsS0FBS04sZUFBbEMsQ0FBWDtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtBLGVBQUwsQ0FBcUIsSUFBckI7QUFDRDtBQUNGOztBQUVEQSxFQUFBQSxlQUFlLENBQUNPLE1BQUQsRUFBUztBQUN0QixVQUFNLENBQUNmLFVBQUQsSUFBZSxLQUFLSixLQUFMLENBQVdvQixPQUFYLENBQW1CQyxlQUFuQixDQUFtQztBQUN0RFYsTUFBQUEsT0FBTyxFQUFFLEtBQUtYLEtBQUwsQ0FBV1csT0FEa0M7QUFFdERRLE1BQUFBO0FBRnNELEtBQW5DLENBQXJCO0FBSUEsU0FBS0csUUFBTCxDQUFjO0FBQUNsQixNQUFBQTtBQUFELEtBQWQ7QUFDRDs7QUF4RG9EOzs7O2dCQUFsQ1IsUyxlQUNBO0FBQ2pCd0IsRUFBQUEsT0FBTyxFQUFFRyxtQkFBVUMsS0FBVixDQUFnQjtBQUN2QkgsSUFBQUEsZUFBZSxFQUFFRSxtQkFBVUUsSUFBVixDQUFlQztBQURULEdBQWhCLEVBRU5BLFVBSGM7QUFJakJmLEVBQUFBLE9BQU8sRUFBRVksbUJBQVVJLE1BQVYsQ0FBaUJELFVBSlQ7QUFLakJoQixFQUFBQSxTQUFTLEVBQUVrQjtBQUxNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7aHVtYW5pemVLZXlzdHJva2V9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQge0Rpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleXN0cm9rZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAga2V5bWFwczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGZpbmRLZXlCaW5kaW5nczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZWZUYXJnZXQ6IFJlZkhvbGRlclByb3BUeXBlLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2RpZENoYW5nZVRhcmdldCcpO1xuXG4gICAgdGhpcy5zdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3RhdGUgPSB7a2V5YmluZGluZzogbnVsbH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm9ic2VydmVUYXJnZXQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGlmICh0aGlzLnByb3BzLnJlZlRhcmdldCAhPT0gcHJldlByb3BzLnJlZlRhcmdldCkge1xuICAgICAgdGhpcy5vYnNlcnZlVGFyZ2V0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmNvbW1hbmQgIT09IHByZXZQcm9wcy5jb21tYW5kKSB7XG4gICAgICB0aGlzLmRpZENoYW5nZVRhcmdldCh0aGlzLnByb3BzLnJlZlRhcmdldC5nZXRPcihudWxsKSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5rZXliaW5kaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwia2V5c3Ryb2tlXCI+e2h1bWFuaXplS2V5c3Ryb2tlKHRoaXMuc3RhdGUua2V5YmluZGluZy5rZXlzdHJva2VzKX08L3NwYW4+O1xuICB9XG5cbiAgb2JzZXJ2ZVRhcmdldCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmVGFyZ2V0KSB7XG4gICAgICB0aGlzLnN1YiA9IHRoaXMucHJvcHMucmVmVGFyZ2V0Lm9ic2VydmUodGhpcy5kaWRDaGFuZ2VUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpZENoYW5nZVRhcmdldChudWxsKTtcbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VUYXJnZXQodGFyZ2V0KSB7XG4gICAgY29uc3QgW2tleWJpbmRpbmddID0gdGhpcy5wcm9wcy5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyh7XG4gICAgICBjb21tYW5kOiB0aGlzLnByb3BzLmNvbW1hbmQsXG4gICAgICB0YXJnZXQsXG4gICAgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7a2V5YmluZGluZ30pO1xuICB9XG59XG4iXX0=