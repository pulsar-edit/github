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
    return _react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-FilePatchListView-item is-${status} ${className}`
    }), _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${status} status-${status}`
    }), _react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9maWxlLXBhdGNoLWxpc3QtaXRlbS12aWV3LmpzIl0sIm5hbWVzIjpbIkZpbGVQYXRjaExpc3RJdGVtVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZkl0ZW0iLCJSZWZIb2xkZXIiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsIm9ic2VydmUiLCJpdGVtIiwicmVnaXN0ZXJJdGVtRWxlbWVudCIsImZpbGVQYXRjaCIsInJlbmRlciIsInNlbGVjdGVkIiwib3RoZXJzIiwic3RhdHVzIiwiY2xhc3NOYW1lRm9yU3RhdHVzIiwiY2xhc3NOYW1lIiwic2V0dGVyIiwiZmlsZVBhdGgiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwiYm9vbCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBV2pFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBRUEsU0FBS0MsT0FBTCxHQUFlLElBQUlDLGtCQUFKLEVBQWY7QUFDQSxTQUFLQyxJQUFMLEdBQVksSUFBSUMsNkJBQUosQ0FDVixLQUFLSCxPQUFMLENBQWFJLE9BQWIsQ0FBcUJDLElBQUksSUFBSSxLQUFLTixLQUFMLENBQVdPLG1CQUFYLENBQStCLEtBQUtQLEtBQUwsQ0FBV1EsU0FBMUMsRUFBcURGLElBQXJELENBQTdCLENBRFUsQ0FBWjtBQUdEOztBQUVERyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFBeUMsS0FBS1QsS0FBOUM7QUFBQSxVQUFNO0FBQUNRLE1BQUFBLFNBQUQ7QUFBWUUsTUFBQUE7QUFBWixLQUFOO0FBQUEsVUFBK0JDLE1BQS9COztBQUNBLFdBQU9BLE1BQU0sQ0FBQ0osbUJBQWQ7QUFDQSxVQUFNSyxNQUFNLEdBQUdDLDRCQUFtQkwsU0FBUyxDQUFDSSxNQUE3QixDQUFmO0FBQ0EsVUFBTUUsU0FBUyxHQUFHSixRQUFRLEdBQUcsYUFBSCxHQUFtQixFQUE3QztBQUVBLFdBQ0U7QUFBSyxNQUFBLEdBQUcsRUFBRSxLQUFLVCxPQUFMLENBQWFjO0FBQXZCLE9BQW1DSixNQUFuQztBQUEyQyxNQUFBLFNBQVMsRUFBRyxvQ0FBbUNDLE1BQU8sSUFBR0UsU0FBVTtBQUE5RyxRQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUcsZ0RBQStDRixNQUFPLFdBQVVBLE1BQU87QUFBekYsTUFERixFQUVFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBaURKLFNBQVMsQ0FBQ1EsUUFBM0QsQ0FGRixDQURGO0FBTUQ7O0FBRURDLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtkLElBQUwsQ0FBVWUsT0FBVjtBQUNEOztBQXBDZ0U7Ozs7Z0JBQTlDdEIscUIsZUFDQTtBQUNqQlksRUFBQUEsU0FBUyxFQUFFVyxrQ0FBc0JDLFVBRGhCO0FBRWpCVixFQUFBQSxRQUFRLEVBQUVXLG1CQUFVQyxJQUFWLENBQWVGLFVBRlI7QUFHakJiLEVBQUFBLG1CQUFtQixFQUFFYyxtQkFBVUU7QUFIZCxDOztnQkFEQTNCLHFCLGtCQU9HO0FBQ3BCVyxFQUFBQSxtQkFBbUIsRUFBRSxNQUFNLENBQUU7QUFEVCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7RmlsZVBhdGNoSXRlbVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7Y2xhc3NOYW1lRm9yU3RhdHVzfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUGF0Y2hMaXN0SXRlbVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGZpbGVQYXRjaDogRmlsZVBhdGNoSXRlbVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgcmVnaXN0ZXJJdGVtRWxlbWVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZkl0ZW0gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnJlZkl0ZW0ub2JzZXJ2ZShpdGVtID0+IHRoaXMucHJvcHMucmVnaXN0ZXJJdGVtRWxlbWVudCh0aGlzLnByb3BzLmZpbGVQYXRjaCwgaXRlbSkpLFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRjaCwgc2VsZWN0ZWQsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzO1xuICAgIGRlbGV0ZSBvdGhlcnMucmVnaXN0ZXJJdGVtRWxlbWVudDtcbiAgICBjb25zdCBzdGF0dXMgPSBjbGFzc05hbWVGb3JTdGF0dXNbZmlsZVBhdGNoLnN0YXR1c107XG4gICAgY29uc3QgY2xhc3NOYW1lID0gc2VsZWN0ZWQgPyAnaXMtc2VsZWN0ZWQnIDogJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiByZWY9e3RoaXMucmVmSXRlbS5zZXR0ZXJ9IHsuLi5vdGhlcnN9IGNsYXNzTmFtZT17YGdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pdGVtIGlzLSR7c3RhdHVzfSAke2NsYXNzTmFtZX1gfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWljb24gaWNvbiBpY29uLWRpZmYtJHtzdGF0dXN9IHN0YXR1cy0ke3N0YXR1c31gfSAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcGF0aFwiPntmaWxlUGF0Y2guZmlsZVBhdGh9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==