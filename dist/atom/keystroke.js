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

    return /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL2tleXN0cm9rZS5qcyJdLCJuYW1lcyI6WyJLZXlzdHJva2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdWIiLCJEaXNwb3NhYmxlIiwic3RhdGUiLCJrZXliaW5kaW5nIiwiY29tcG9uZW50RGlkTW91bnQiLCJvYnNlcnZlVGFyZ2V0IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwicmVmVGFyZ2V0IiwiY29tbWFuZCIsImRpZENoYW5nZVRhcmdldCIsImdldE9yIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyIiwia2V5c3Ryb2tlcyIsIm9ic2VydmUiLCJ0YXJnZXQiLCJrZXltYXBzIiwiZmluZEtleUJpbmRpbmdzIiwic2V0U3RhdGUiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsU0FBTixTQUF3QkMsZUFBTUMsU0FBOUIsQ0FBd0M7QUFTckRDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSwyQkFBUyxJQUFULEVBQWUsaUJBQWY7QUFFQSxTQUFLQyxHQUFMLEdBQVcsSUFBSUMsb0JBQUosRUFBWDtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUFDQyxNQUFBQSxVQUFVLEVBQUU7QUFBYixLQUFiO0FBQ0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFNBQUtDLGFBQUw7QUFDRDs7QUFFREMsRUFBQUEsa0JBQWtCLENBQUNDLFNBQUQsRUFBWUMsU0FBWixFQUF1QjtBQUN2QyxRQUFJLEtBQUtULEtBQUwsQ0FBV1UsU0FBWCxLQUF5QkYsU0FBUyxDQUFDRSxTQUF2QyxFQUFrRDtBQUNoRCxXQUFLSixhQUFMO0FBQ0QsS0FGRCxNQUVPLElBQUksS0FBS04sS0FBTCxDQUFXVyxPQUFYLEtBQXVCSCxTQUFTLENBQUNHLE9BQXJDLEVBQThDO0FBQ25ELFdBQUtDLGVBQUwsQ0FBcUIsS0FBS1osS0FBTCxDQUFXVSxTQUFYLENBQXFCRyxLQUFyQixDQUEyQixJQUEzQixDQUFyQjtBQUNEO0FBQ0Y7O0FBRURDLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtiLEdBQUwsQ0FBU2MsT0FBVDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJLENBQUMsS0FBS2IsS0FBTCxDQUFXQyxVQUFoQixFQUE0QjtBQUMxQixhQUFPLElBQVA7QUFDRDs7QUFFRCx3QkFBTztBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQTZCLHVDQUFrQixLQUFLRCxLQUFMLENBQVdDLFVBQVgsQ0FBc0JhLFVBQXhDLENBQTdCLENBQVA7QUFDRDs7QUFFRFgsRUFBQUEsYUFBYSxHQUFHO0FBQ2QsU0FBS0wsR0FBTCxDQUFTYyxPQUFUOztBQUNBLFFBQUksS0FBS2YsS0FBTCxDQUFXVSxTQUFmLEVBQTBCO0FBQ3hCLFdBQUtULEdBQUwsR0FBVyxLQUFLRCxLQUFMLENBQVdVLFNBQVgsQ0FBcUJRLE9BQXJCLENBQTZCLEtBQUtOLGVBQWxDLENBQVg7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLQSxlQUFMLENBQXFCLElBQXJCO0FBQ0Q7QUFDRjs7QUFFREEsRUFBQUEsZUFBZSxDQUFDTyxNQUFELEVBQVM7QUFDdEIsVUFBTSxDQUFDZixVQUFELElBQWUsS0FBS0osS0FBTCxDQUFXb0IsT0FBWCxDQUFtQkMsZUFBbkIsQ0FBbUM7QUFDdERWLE1BQUFBLE9BQU8sRUFBRSxLQUFLWCxLQUFMLENBQVdXLE9BRGtDO0FBRXREUSxNQUFBQTtBQUZzRCxLQUFuQyxDQUFyQjtBQUlBLFNBQUtHLFFBQUwsQ0FBYztBQUFDbEIsTUFBQUE7QUFBRCxLQUFkO0FBQ0Q7O0FBeERvRDs7OztnQkFBbENSLFMsZUFDQTtBQUNqQndCLEVBQUFBLE9BQU8sRUFBRUcsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDdkJILElBQUFBLGVBQWUsRUFBRUUsbUJBQVVFLElBQVYsQ0FBZUM7QUFEVCxHQUFoQixFQUVOQSxVQUhjO0FBSWpCZixFQUFBQSxPQUFPLEVBQUVZLG1CQUFVSSxNQUFWLENBQWlCRCxVQUpUO0FBS2pCaEIsRUFBQUEsU0FBUyxFQUFFa0I7QUFMTSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2h1bWFuaXplS2V5c3Ryb2tlfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7UmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlzdHJva2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGtleW1hcHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBmaW5kS2V5QmluZGluZ3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVmVGFyZ2V0OiBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdkaWRDaGFuZ2VUYXJnZXQnKTtcblxuICAgIHRoaXMuc3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN0YXRlID0ge2tleWJpbmRpbmc6IG51bGx9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5vYnNlcnZlVGFyZ2V0KCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWZUYXJnZXQgIT09IHByZXZQcm9wcy5yZWZUYXJnZXQpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZVRhcmdldCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jb21tYW5kICE9PSBwcmV2UHJvcHMuY29tbWFuZCkge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VUYXJnZXQodGhpcy5wcm9wcy5yZWZUYXJnZXQuZ2V0T3IobnVsbCkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUua2V5YmluZGluZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cImtleXN0cm9rZVwiPntodW1hbml6ZUtleXN0cm9rZSh0aGlzLnN0YXRlLmtleWJpbmRpbmcua2V5c3Ryb2tlcyl9PC9zcGFuPjtcbiAgfVxuXG4gIG9ic2VydmVUYXJnZXQoKSB7XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICAgIGlmICh0aGlzLnByb3BzLnJlZlRhcmdldCkge1xuICAgICAgdGhpcy5zdWIgPSB0aGlzLnByb3BzLnJlZlRhcmdldC5vYnNlcnZlKHRoaXMuZGlkQ2hhbmdlVGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VUYXJnZXQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZGlkQ2hhbmdlVGFyZ2V0KHRhcmdldCkge1xuICAgIGNvbnN0IFtrZXliaW5kaW5nXSA9IHRoaXMucHJvcHMua2V5bWFwcy5maW5kS2V5QmluZGluZ3Moe1xuICAgICAgY29tbWFuZDogdGhpcy5wcm9wcy5jb21tYW5kLFxuICAgICAgdGFyZ2V0LFxuICAgIH0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe2tleWJpbmRpbmd9KTtcbiAgfVxufVxuIl19