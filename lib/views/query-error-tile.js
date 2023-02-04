"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class QueryErrorTile extends _react.default.Component {
  componentDidMount() {
    // eslint-disable-next-line no-console
    console.error('Error encountered in subquery', this.props.error);
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-QueryErrorTile"
    }, _react.default.createElement("div", {
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
    return _react.default.createElement("p", {
      key: key,
      className: "github-QueryErrorTile-message"
    }, _react.default.createElement(_octicon.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJRdWVyeUVycm9yVGlsZSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29tcG9uZW50RGlkTW91bnQiLCJjb25zb2xlIiwiZXJyb3IiLCJwcm9wcyIsInJlbmRlciIsInJlbmRlck1lc3NhZ2VzIiwiZXJyb3JzIiwibWFwIiwiaW5kZXgiLCJyZW5kZXJNZXNzYWdlIiwibWVzc2FnZSIsInJlc3BvbnNlIiwicmVzcG9uc2VUZXh0IiwibmV0d29yayIsInRvU3RyaW5nIiwiYm9keSIsImtleSIsImljb24iLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0YXR1cyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJib29sIiwiYXJyYXlPZiJdLCJzb3VyY2VzIjpbInF1ZXJ5LWVycm9yLXRpbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5RXJyb3JUaWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlcnJvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlc3BvbnNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBzdGF0dXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVzcG9uc2VUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbmV0d29yazogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBlcnJvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pKSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbmNvdW50ZXJlZCBpbiBzdWJxdWVyeScsIHRoaXMucHJvcHMuZXJyb3IpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1RdWVyeUVycm9yVGlsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1RdWVyeUVycm9yVGlsZS1tZXNzYWdlc1wiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlck1lc3NhZ2VzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2VzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmVycm9yLmVycm9ycykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZXJyb3IuZXJyb3JzLm1hcCgoZXJyb3IsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlck1lc3NhZ2UoZXJyb3IubWVzc2FnZSwgaW5kZXgsICdhbGVydCcpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IucmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlck1lc3NhZ2UodGhpcy5wcm9wcy5lcnJvci5yZXNwb25zZVRleHQsICcwJywgJ2FsZXJ0Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IubmV0d29yaykge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZSgnT2ZmbGluZScsICcwJywgJ2FsaWdubWVudC11bmFsaWduJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZSh0aGlzLnByb3BzLmVycm9yLnRvU3RyaW5nKCksICcwJywgJ2FsZXJ0Jyk7XG4gIH1cblxuICByZW5kZXJNZXNzYWdlKGJvZHksIGtleSwgaWNvbikge1xuICAgIHJldHVybiAoXG4gICAgICA8cCBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLVF1ZXJ5RXJyb3JUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gLz5cbiAgICAgICAge2JvZHl9XG4gICAgICA8L3A+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFBc0M7QUFBQTtBQUFBO0FBQUE7QUFFdkIsTUFBTUEsY0FBYyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWMxREMsaUJBQWlCLEdBQUc7SUFDbEI7SUFDQUMsT0FBTyxDQUFDQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDQyxLQUFLLENBQUNELEtBQUssQ0FBQztFQUNsRTtFQUVBRSxNQUFNLEdBQUc7SUFDUCxPQUNFO01BQUssU0FBUyxFQUFDO0lBQXVCLEdBQ3BDO01BQUssU0FBUyxFQUFDO0lBQWdDLEdBQzVDLElBQUksQ0FBQ0MsY0FBYyxFQUFFLENBQ2xCLENBQ0Y7RUFFVjtFQUVBQSxjQUFjLEdBQUc7SUFDZixJQUFJLElBQUksQ0FBQ0YsS0FBSyxDQUFDRCxLQUFLLENBQUNJLE1BQU0sRUFBRTtNQUMzQixPQUFPLElBQUksQ0FBQ0gsS0FBSyxDQUFDRCxLQUFLLENBQUNJLE1BQU0sQ0FBQ0MsR0FBRyxDQUFDLENBQUNMLEtBQUssRUFBRU0sS0FBSyxLQUFLO1FBQ25ELE9BQU8sSUFBSSxDQUFDQyxhQUFhLENBQUNQLEtBQUssQ0FBQ1EsT0FBTyxFQUFFRixLQUFLLEVBQUUsT0FBTyxDQUFDO01BQzFELENBQUMsQ0FBQztJQUNKO0lBRUEsSUFBSSxJQUFJLENBQUNMLEtBQUssQ0FBQ0QsS0FBSyxDQUFDUyxRQUFRLEVBQUU7TUFDN0IsT0FBTyxJQUFJLENBQUNGLGFBQWEsQ0FBQyxJQUFJLENBQUNOLEtBQUssQ0FBQ0QsS0FBSyxDQUFDVSxZQUFZLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQztJQUN4RTtJQUVBLElBQUksSUFBSSxDQUFDVCxLQUFLLENBQUNELEtBQUssQ0FBQ1csT0FBTyxFQUFFO01BQzVCLE9BQU8sSUFBSSxDQUFDSixhQUFhLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQztJQUNoRTtJQUVBLE9BQU8sSUFBSSxDQUFDQSxhQUFhLENBQUMsSUFBSSxDQUFDTixLQUFLLENBQUNELEtBQUssQ0FBQ1ksUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQztFQUN0RTtFQUVBTCxhQUFhLENBQUNNLElBQUksRUFBRUMsR0FBRyxFQUFFQyxJQUFJLEVBQUU7SUFDN0IsT0FDRTtNQUFHLEdBQUcsRUFBRUQsR0FBSTtNQUFDLFNBQVMsRUFBQztJQUErQixHQUNwRCw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBRUM7SUFBSyxFQUFHLEVBQ3RCRixJQUFJLENBQ0g7RUFFUjtBQUNGO0FBQUM7QUFBQSxnQkF2RG9CbEIsY0FBYyxlQUNkO0VBQ2pCSyxLQUFLLEVBQUVnQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJSLFFBQVEsRUFBRU8sa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ3hCQyxNQUFNLEVBQUVGLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0M7SUFDM0IsQ0FBQyxDQUFDO0lBQ0ZWLFlBQVksRUFBRU0sa0JBQVMsQ0FBQ0ssTUFBTTtJQUM5QlYsT0FBTyxFQUFFSyxrQkFBUyxDQUFDTSxJQUFJO0lBQ3ZCbEIsTUFBTSxFQUFFWSxrQkFBUyxDQUFDTyxPQUFPLENBQUNQLGtCQUFTLENBQUNDLEtBQUssQ0FBQztNQUN4Q1QsT0FBTyxFQUFFUSxrQkFBUyxDQUFDSyxNQUFNLENBQUNEO0lBQzVCLENBQUMsQ0FBQztFQUNKLENBQUMsQ0FBQyxDQUFDQTtBQUNMLENBQUMifQ==