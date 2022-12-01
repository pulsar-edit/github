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

    return _react.default.createElement("span", _extends({
      className: (0, _classnames.default)(className, 'github-IssueishBadge', state.toLowerCase())
    }, otherProps), _react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase());
  }

}

exports.default = IssueishBadge;

_defineProperty(IssueishBadge, "propTypes", {
  type: _propTypes.default.oneOf(['Issue', 'PullRequest', 'Unknown']).isRequired,
  state: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED', 'UNKNOWN']).isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1iYWRnZS5qcyJdLCJuYW1lcyI6WyJ0eXBlQW5kU3RhdGVUb0ljb24iLCJJc3N1ZSIsIk9QRU4iLCJDTE9TRUQiLCJQdWxsUmVxdWVzdCIsIk1FUkdFRCIsIklzc3VlaXNoQmFkZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidHlwZSIsInN0YXRlIiwib3RoZXJzIiwiaWNvbnMiLCJpY29uIiwiY2xhc3NOYW1lIiwib3RoZXJQcm9wcyIsInRvTG93ZXJDYXNlIiwiUHJvcFR5cGVzIiwib25lT2YiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixHQUFHO0FBQ3pCQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsSUFBSSxFQUFFLGNBREQ7QUFFTEMsSUFBQUEsTUFBTSxFQUFFO0FBRkgsR0FEa0I7QUFLekJDLEVBQUFBLFdBQVcsRUFBRTtBQUNYRixJQUFBQSxJQUFJLEVBQUUsa0JBREs7QUFFWEMsSUFBQUEsTUFBTSxFQUFFLGtCQUZHO0FBR1hFLElBQUFBLE1BQU0sRUFBRTtBQUhHO0FBTFksQ0FBM0I7O0FBWWUsTUFBTUMsYUFBTixTQUE0QkMsZUFBTUMsU0FBbEMsQ0FBNEM7QUFVekRDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUFpQyxLQUFLQyxLQUF0QztBQUFBLFVBQU07QUFBQ0MsTUFBQUEsSUFBRDtBQUFPQyxNQUFBQTtBQUFQLEtBQU47QUFBQSxVQUF1QkMsTUFBdkI7O0FBQ0EsVUFBTUMsS0FBSyxHQUFHZCxrQkFBa0IsQ0FBQ1csSUFBRCxDQUFsQixJQUE0QixFQUExQztBQUNBLFVBQU1JLElBQUksR0FBR0QsS0FBSyxDQUFDRixLQUFELENBQUwsSUFBZ0IsVUFBN0I7O0FBRUEsVUFBTTtBQUFDSSxNQUFBQTtBQUFELFFBQTZCSCxNQUFuQztBQUFBLFVBQXFCSSxVQUFyQiw0QkFBbUNKLE1BQW5DOztBQUNBLFdBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBRSx5QkFBR0csU0FBSCxFQUFjLHNCQUFkLEVBQXNDSixLQUFLLENBQUNNLFdBQU4sRUFBdEM7QUFBakIsT0FBaUZELFVBQWpGLEdBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBRUY7QUFBZixNQURGLEVBRUdILEtBQUssQ0FBQ00sV0FBTixFQUZILENBREY7QUFNRDs7QUF0QndEOzs7O2dCQUF0Q1osYSxlQUNBO0FBQ2pCSyxFQUFBQSxJQUFJLEVBQUVRLG1CQUFVQyxLQUFWLENBQWdCLENBQ3BCLE9BRG9CLEVBQ1gsYUFEVyxFQUNJLFNBREosQ0FBaEIsRUFFSEMsVUFIYztBQUlqQlQsRUFBQUEsS0FBSyxFQUFFTyxtQkFBVUMsS0FBVixDQUFnQixDQUNyQixNQURxQixFQUNiLFFBRGEsRUFDSCxRQURHLEVBQ08sU0FEUCxDQUFoQixFQUVKQztBQU5jLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuY29uc3QgdHlwZUFuZFN0YXRlVG9JY29uID0ge1xuICBJc3N1ZToge1xuICAgIE9QRU46ICdpc3N1ZS1vcGVuZWQnLFxuICAgIENMT1NFRDogJ2lzc3VlLWNsb3NlZCcsXG4gIH0sXG4gIFB1bGxSZXF1ZXN0OiB7XG4gICAgT1BFTjogJ2dpdC1wdWxsLXJlcXVlc3QnLFxuICAgIENMT1NFRDogJ2dpdC1wdWxsLXJlcXVlc3QnLFxuICAgIE1FUkdFRDogJ2dpdC1tZXJnZScsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaEJhZGdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgJ0lzc3VlJywgJ1B1bGxSZXF1ZXN0JywgJ1Vua25vd24nLFxuICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgc3RhdGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAnT1BFTicsICdDTE9TRUQnLCAnTUVSR0VEJywgJ1VOS05PV04nLFxuICAgIF0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3R5cGUsIHN0YXRlLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpY29ucyA9IHR5cGVBbmRTdGF0ZVRvSWNvblt0eXBlXSB8fCB7fTtcbiAgICBjb25zdCBpY29uID0gaWNvbnNbc3RhdGVdIHx8ICdxdWVzdGlvbic7XG5cbiAgICBjb25zdCB7Y2xhc3NOYW1lLCAuLi5vdGhlclByb3BzfSA9IG90aGVycztcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChjbGFzc05hbWUsICdnaXRodWItSXNzdWVpc2hCYWRnZScsIHN0YXRlLnRvTG93ZXJDYXNlKCkpfSB7Li4ub3RoZXJQcm9wc30+XG4gICAgICAgIDxPY3RpY29uIGljb249e2ljb259IC8+XG4gICAgICAgIHtzdGF0ZS50b0xvd2VyQ2FzZSgpfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==