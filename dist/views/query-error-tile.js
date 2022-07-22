"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class QueryErrorTile extends _react.default.Component {
  componentDidMount() {
    // eslint-disable-next-line no-console
    console.error('Error encountered in subquery', this.props.error);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-QueryErrorTile"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-QueryErrorTile-messages"
    }, this.renderMessages()));
  }

  renderMessages() {
    if (this.props.error.errors) {
      return this.props.error.errors.map((error, index) => {
        return this.renderMessage(error.message, index, 'alert');
      });
    }

    if (this.props.error.response) {
      return this.renderMessage(this.props.error.responseText, '0', 'alert');
    }

    if (this.props.error.network) {
      return this.renderMessage('Offline', '0', 'alignment-unalign');
    }

    return this.renderMessage(this.props.error.toString(), '0', 'alert');
  }

  renderMessage(body, key, icon) {
    return /*#__PURE__*/_react.default.createElement("p", {
      key: key,
      className: "github-QueryErrorTile-message"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: icon
    }), body);
  }

}

exports.default = QueryErrorTile;

_defineProperty(QueryErrorTile, "propTypes", {
  error: _propTypes.default.shape({
    response: _propTypes.default.shape({
      status: _propTypes.default.number.isRequired
    }),
    responseText: _propTypes.default.string,
    network: _propTypes.default.bool,
    errors: _propTypes.default.arrayOf(_propTypes.default.shape({
      message: _propTypes.default.string.isRequired
    }))
  }).isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9xdWVyeS1lcnJvci10aWxlLmpzIl0sIm5hbWVzIjpbIlF1ZXJ5RXJyb3JUaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbnNvbGUiLCJlcnJvciIsInByb3BzIiwicmVuZGVyIiwicmVuZGVyTWVzc2FnZXMiLCJlcnJvcnMiLCJtYXAiLCJpbmRleCIsInJlbmRlck1lc3NhZ2UiLCJtZXNzYWdlIiwicmVzcG9uc2UiLCJyZXNwb25zZVRleHQiLCJuZXR3b3JrIiwidG9TdHJpbmciLCJib2R5Iiwia2V5IiwiaWNvbiIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RhdHVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImJvb2wiLCJhcnJheU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBYzFEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQjtBQUNBQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYywrQkFBZCxFQUErQyxLQUFLQyxLQUFMLENBQVdELEtBQTFEO0FBQ0Q7O0FBRURFLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLQyxjQUFMLEVBREgsQ0FERixDQURGO0FBT0Q7O0FBRURBLEVBQUFBLGNBQWMsR0FBRztBQUNmLFFBQUksS0FBS0YsS0FBTCxDQUFXRCxLQUFYLENBQWlCSSxNQUFyQixFQUE2QjtBQUMzQixhQUFPLEtBQUtILEtBQUwsQ0FBV0QsS0FBWCxDQUFpQkksTUFBakIsQ0FBd0JDLEdBQXhCLENBQTRCLENBQUNMLEtBQUQsRUFBUU0sS0FBUixLQUFrQjtBQUNuRCxlQUFPLEtBQUtDLGFBQUwsQ0FBbUJQLEtBQUssQ0FBQ1EsT0FBekIsRUFBa0NGLEtBQWxDLEVBQXlDLE9BQXpDLENBQVA7QUFDRCxPQUZNLENBQVA7QUFHRDs7QUFFRCxRQUFJLEtBQUtMLEtBQUwsQ0FBV0QsS0FBWCxDQUFpQlMsUUFBckIsRUFBK0I7QUFDN0IsYUFBTyxLQUFLRixhQUFMLENBQW1CLEtBQUtOLEtBQUwsQ0FBV0QsS0FBWCxDQUFpQlUsWUFBcEMsRUFBa0QsR0FBbEQsRUFBdUQsT0FBdkQsQ0FBUDtBQUNEOztBQUVELFFBQUksS0FBS1QsS0FBTCxDQUFXRCxLQUFYLENBQWlCVyxPQUFyQixFQUE4QjtBQUM1QixhQUFPLEtBQUtKLGFBQUwsQ0FBbUIsU0FBbkIsRUFBOEIsR0FBOUIsRUFBbUMsbUJBQW5DLENBQVA7QUFDRDs7QUFFRCxXQUFPLEtBQUtBLGFBQUwsQ0FBbUIsS0FBS04sS0FBTCxDQUFXRCxLQUFYLENBQWlCWSxRQUFqQixFQUFuQixFQUFnRCxHQUFoRCxFQUFxRCxPQUFyRCxDQUFQO0FBQ0Q7O0FBRURMLEVBQUFBLGFBQWEsQ0FBQ00sSUFBRCxFQUFPQyxHQUFQLEVBQVlDLElBQVosRUFBa0I7QUFDN0Isd0JBQ0U7QUFBRyxNQUFBLEdBQUcsRUFBRUQsR0FBUjtBQUFhLE1BQUEsU0FBUyxFQUFDO0FBQXZCLG9CQUNFLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUVDO0FBQWYsTUFERixFQUVHRixJQUZILENBREY7QUFNRDs7QUF0RHlEOzs7O2dCQUF2Q2xCLGMsZUFDQTtBQUNqQkssRUFBQUEsS0FBSyxFQUFFZ0IsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDckJSLElBQUFBLFFBQVEsRUFBRU8sbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDeEJDLE1BQUFBLE1BQU0sRUFBRUYsbUJBQVVHLE1BQVYsQ0FBaUJDO0FBREQsS0FBaEIsQ0FEVztBQUlyQlYsSUFBQUEsWUFBWSxFQUFFTSxtQkFBVUssTUFKSDtBQUtyQlYsSUFBQUEsT0FBTyxFQUFFSyxtQkFBVU0sSUFMRTtBQU1yQmxCLElBQUFBLE1BQU0sRUFBRVksbUJBQVVPLE9BQVYsQ0FBa0JQLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3hDVCxNQUFBQSxPQUFPLEVBQUVRLG1CQUFVSyxNQUFWLENBQWlCRDtBQURjLEtBQWhCLENBQWxCO0FBTmEsR0FBaEIsRUFTSkE7QUFWYyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5RXJyb3JUaWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlcnJvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlc3BvbnNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBzdGF0dXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVzcG9uc2VUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbmV0d29yazogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBlcnJvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pKSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbmNvdW50ZXJlZCBpbiBzdWJxdWVyeScsIHRoaXMucHJvcHMuZXJyb3IpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1RdWVyeUVycm9yVGlsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1RdWVyeUVycm9yVGlsZS1tZXNzYWdlc1wiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlck1lc3NhZ2VzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2VzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmVycm9yLmVycm9ycykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZXJyb3IuZXJyb3JzLm1hcCgoZXJyb3IsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlck1lc3NhZ2UoZXJyb3IubWVzc2FnZSwgaW5kZXgsICdhbGVydCcpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IucmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlck1lc3NhZ2UodGhpcy5wcm9wcy5lcnJvci5yZXNwb25zZVRleHQsICcwJywgJ2FsZXJ0Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IubmV0d29yaykge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZSgnT2ZmbGluZScsICcwJywgJ2FsaWdubWVudC11bmFsaWduJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZSh0aGlzLnByb3BzLmVycm9yLnRvU3RyaW5nKCksICcwJywgJ2FsZXJ0Jyk7XG4gIH1cblxuICByZW5kZXJNZXNzYWdlKGJvZHksIGtleSwgaWNvbikge1xuICAgIHJldHVybiAoXG4gICAgICA8cCBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLVF1ZXJ5RXJyb3JUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gLz5cbiAgICAgICAge2JvZHl9XG4gICAgICA8L3A+XG4gICAgKTtcbiAgfVxufVxuIl19