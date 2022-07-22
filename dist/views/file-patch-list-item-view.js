"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilePatchListItemView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refItem = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable(this.refItem.observe(item => this.props.registerItemElement(this.props.filePatch, item)));
  }

  render() {
    const _this$props = this.props,
          {
      filePatch,
      selected
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["filePatch", "selected"]);

    delete others.registerItemElement;
    const status = _helpers.classNameForStatus[filePatch.status];
    const className = selected ? 'is-selected' : '';
    return /*#__PURE__*/_react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-FilePatchListView-item is-${status} ${className}`
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${status} status-${status}`
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, filePatch.filePath));
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

}

exports.default = FilePatchListItemView;

_defineProperty(FilePatchListItemView, "propTypes", {
  filePatch: _propTypes2.FilePatchItemPropType.isRequired,
  selected: _propTypes.default.bool.isRequired,
  registerItemElement: _propTypes.default.func
});

_defineProperty(FilePatchListItemView, "defaultProps", {
  registerItemElement: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9maWxlLXBhdGNoLWxpc3QtaXRlbS12aWV3LmpzIl0sIm5hbWVzIjpbIkZpbGVQYXRjaExpc3RJdGVtVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZkl0ZW0iLCJSZWZIb2xkZXIiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsIm9ic2VydmUiLCJpdGVtIiwicmVnaXN0ZXJJdGVtRWxlbWVudCIsImZpbGVQYXRjaCIsInJlbmRlciIsInNlbGVjdGVkIiwib3RoZXJzIiwic3RhdHVzIiwiY2xhc3NOYW1lRm9yU3RhdHVzIiwiY2xhc3NOYW1lIiwic2V0dGVyIiwiZmlsZVBhdGgiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwiYm9vbCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBV2pFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBRUEsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGtCQUFKLEVBQWY7QUFDQSxTQUFLQyxJQUFMLEdBQVksSUFBSUMsNkJBQUosQ0FDVixLQUFLSCxPQUFMLENBQWFJLE9BQWIsQ0FBcUJDLElBQUksSUFBSSxLQUFLTixLQUFMLENBQVdPLG1CQUFYLENBQStCLEtBQUtQLEtBQUwsQ0FBV1EsU0FBMUMsRUFBcURGLElBQXJELENBQTdCLENBRFUsQ0FBWjtBQUdEOztBQUVERyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFBeUMsS0FBS1QsS0FBOUM7QUFBQSxVQUFNO0FBQUNRLE1BQUFBLFNBQUQ7QUFBWUUsTUFBQUE7QUFBWixLQUFOO0FBQUEsVUFBK0JDLE1BQS9COztBQUNBLFdBQU9BLE1BQU0sQ0FBQ0osbUJBQWQ7QUFDQSxVQUFNSyxNQUFNLEdBQUdDLDRCQUFtQkwsU0FBUyxDQUFDSSxNQUE3QixDQUFmO0FBQ0EsVUFBTUUsU0FBUyxHQUFHSixRQUFRLEdBQUcsYUFBSCxHQUFtQixFQUE3QztBQUVBLHdCQUNFO0FBQUssTUFBQSxHQUFHLEVBQUUsS0FBS1QsT0FBTCxDQUFhYztBQUF2QixPQUFtQ0osTUFBbkM7QUFBMkMsTUFBQSxTQUFTLEVBQUcsb0NBQW1DQyxNQUFPLElBQUdFLFNBQVU7QUFBOUcscUJBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBRyxnREFBK0NGLE1BQU8sV0FBVUEsTUFBTztBQUF6RixNQURGLGVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUFpREosU0FBUyxDQUFDUSxRQUEzRCxDQUZGLENBREY7QUFNRDs7QUFFREMsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckIsU0FBS2QsSUFBTCxDQUFVZSxPQUFWO0FBQ0Q7O0FBcENnRTs7OztnQkFBOUN0QixxQixlQUNBO0FBQ2pCWSxFQUFBQSxTQUFTLEVBQUVXLGtDQUFzQkMsVUFEaEI7QUFFakJWLEVBQUFBLFFBQVEsRUFBRVcsbUJBQVVDLElBQVYsQ0FBZUYsVUFGUjtBQUdqQmIsRUFBQUEsbUJBQW1CLEVBQUVjLG1CQUFVRTtBQUhkLEM7O2dCQURBM0IscUIsa0JBT0c7QUFDcEJXLEVBQUFBLG1CQUFtQixFQUFFLE1BQU0sQ0FBRTtBQURULEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtGaWxlUGF0Y2hJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjbGFzc05hbWVGb3JTdGF0dXN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVQYXRjaExpc3RJdGVtVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZmlsZVBhdGNoOiBGaWxlUGF0Y2hJdGVtUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByZWdpc3Rlckl0ZW1FbGVtZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgcmVnaXN0ZXJJdGVtRWxlbWVudDogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmSXRlbSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucmVmSXRlbS5vYnNlcnZlKGl0ZW0gPT4gdGhpcy5wcm9wcy5yZWdpc3Rlckl0ZW1FbGVtZW50KHRoaXMucHJvcHMuZmlsZVBhdGNoLCBpdGVtKSksXG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGNoLCBzZWxlY3RlZCwgLi4ub3RoZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgZGVsZXRlIG90aGVycy5yZWdpc3Rlckl0ZW1FbGVtZW50O1xuICAgIGNvbnN0IHN0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1tmaWxlUGF0Y2guc3RhdHVzXTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBzZWxlY3RlZCA/ICdpcy1zZWxlY3RlZCcgOiAnJztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj17dGhpcy5yZWZJdGVtLnNldHRlcn0gey4uLm90aGVyc30gY2xhc3NOYW1lPXtgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWl0ZW0gaXMtJHtzdGF0dXN9ICR7Y2xhc3NOYW1lfWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke3N0YXR1c30gc3RhdHVzLSR7c3RhdHVzfWB9IC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1wYXRoXCI+e2ZpbGVQYXRjaC5maWxlUGF0aH08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19