"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const typeAndStateToIcon = {
  Issue: {
    OPEN: 'issue-opened',
    CLOSED: 'issue-closed'
  },
  PullRequest: {
    OPEN: 'git-pull-request',
    CLOSED: 'git-pull-request',
    MERGED: 'git-merge'
  }
};

class IssueishBadge extends _react.default.Component {
  render() {
    const _this$props = this.props,
          {
      type,
      state
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["type", "state"]);

    const icons = typeAndStateToIcon[type] || {};
    const icon = icons[state] || 'question';

    const {
      className
    } = others,
          otherProps = _objectWithoutProperties(others, ["className"]);

    return /*#__PURE__*/_react.default.createElement("span", _extends({
      className: (0, _classnames.default)(className, 'github-IssueishBadge', state.toLowerCase())
    }, otherProps), /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase());
  }

}

exports.default = IssueishBadge;

_defineProperty(IssueishBadge, "propTypes", {
  type: _propTypes.default.oneOf(['Issue', 'PullRequest', 'Unknown']).isRequired,
  state: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED', 'UNKNOWN']).isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1iYWRnZS5qcyJdLCJuYW1lcyI6WyJ0eXBlQW5kU3RhdGVUb0ljb24iLCJJc3N1ZSIsIk9QRU4iLCJDTE9TRUQiLCJQdWxsUmVxdWVzdCIsIk1FUkdFRCIsIklzc3VlaXNoQmFkZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidHlwZSIsInN0YXRlIiwib3RoZXJzIiwiaWNvbnMiLCJpY29uIiwiY2xhc3NOYW1lIiwib3RoZXJQcm9wcyIsInRvTG93ZXJDYXNlIiwiUHJvcFR5cGVzIiwib25lT2YiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixHQUFHO0FBQ3pCQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsSUFBSSxFQUFFLGNBREQ7QUFFTEMsSUFBQUEsTUFBTSxFQUFFO0FBRkgsR0FEa0I7QUFLekJDLEVBQUFBLFdBQVcsRUFBRTtBQUNYRixJQUFBQSxJQUFJLEVBQUUsa0JBREs7QUFFWEMsSUFBQUEsTUFBTSxFQUFFLGtCQUZHO0FBR1hFLElBQUFBLE1BQU0sRUFBRTtBQUhHO0FBTFksQ0FBM0I7O0FBWWUsTUFBTUMsYUFBTixTQUE0QkMsZUFBTUMsU0FBbEMsQ0FBNEM7QUFVekRDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUFpQyxLQUFLQyxLQUF0QztBQUFBLFVBQU07QUFBQ0MsTUFBQUEsSUFBRDtBQUFPQyxNQUFBQTtBQUFQLEtBQU47QUFBQSxVQUF1QkMsTUFBdkI7O0FBQ0EsVUFBTUMsS0FBSyxHQUFHZCxrQkFBa0IsQ0FBQ1csSUFBRCxDQUFsQixJQUE0QixFQUExQztBQUNBLFVBQU1JLElBQUksR0FBR0QsS0FBSyxDQUFDRixLQUFELENBQUwsSUFBZ0IsVUFBN0I7O0FBRUEsVUFBTTtBQUFDSSxNQUFBQTtBQUFELFFBQTZCSCxNQUFuQztBQUFBLFVBQXFCSSxVQUFyQiw0QkFBbUNKLE1BQW5DOztBQUNBLHdCQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUUseUJBQUdHLFNBQUgsRUFBYyxzQkFBZCxFQUFzQ0osS0FBSyxDQUFDTSxXQUFOLEVBQXRDO0FBQWpCLE9BQWlGRCxVQUFqRixnQkFDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFFRjtBQUFmLE1BREYsRUFFR0gsS0FBSyxDQUFDTSxXQUFOLEVBRkgsQ0FERjtBQU1EOztBQXRCd0Q7Ozs7Z0JBQXRDWixhLGVBQ0E7QUFDakJLLEVBQUFBLElBQUksRUFBRVEsbUJBQVVDLEtBQVYsQ0FBZ0IsQ0FDcEIsT0FEb0IsRUFDWCxhQURXLEVBQ0ksU0FESixDQUFoQixFQUVIQyxVQUhjO0FBSWpCVCxFQUFBQSxLQUFLLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCLENBQ3JCLE1BRHFCLEVBQ2IsUUFEYSxFQUNILFFBREcsRUFDTyxTQURQLENBQWhCLEVBRUpDO0FBTmMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5jb25zdCB0eXBlQW5kU3RhdGVUb0ljb24gPSB7XG4gIElzc3VlOiB7XG4gICAgT1BFTjogJ2lzc3VlLW9wZW5lZCcsXG4gICAgQ0xPU0VEOiAnaXNzdWUtY2xvc2VkJyxcbiAgfSxcbiAgUHVsbFJlcXVlc3Q6IHtcbiAgICBPUEVOOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgQ0xPU0VEOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgTUVSR0VEOiAnZ2l0LW1lcmdlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoQmFkZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAnSXNzdWUnLCAnUHVsbFJlcXVlc3QnLCAnVW5rbm93bicsXG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgICBzdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICdPUEVOJywgJ0NMT1NFRCcsICdNRVJHRUQnLCAnVU5LTk9XTicsXG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7dHlwZSwgc3RhdGUsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGljb25zID0gdHlwZUFuZFN0YXRlVG9JY29uW3R5cGVdIHx8IHt9O1xuICAgIGNvbnN0IGljb24gPSBpY29uc1tzdGF0ZV0gfHwgJ3F1ZXN0aW9uJztcblxuICAgIGNvbnN0IHtjbGFzc05hbWUsIC4uLm90aGVyUHJvcHN9ID0gb3RoZXJzO1xuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2N4KGNsYXNzTmFtZSwgJ2dpdGh1Yi1Jc3N1ZWlzaEJhZGdlJywgc3RhdGUudG9Mb3dlckNhc2UoKSl9IHsuLi5vdGhlclByb3BzfT5cbiAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gLz5cbiAgICAgICAge3N0YXRlLnRvTG93ZXJDYXNlKCl9XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxufVxuIl19