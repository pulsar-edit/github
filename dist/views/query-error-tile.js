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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9xdWVyeS1lcnJvci10aWxlLmpzIl0sIm5hbWVzIjpbIlF1ZXJ5RXJyb3JUaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbnNvbGUiLCJlcnJvciIsInByb3BzIiwicmVuZGVyIiwicmVuZGVyTWVzc2FnZXMiLCJlcnJvcnMiLCJtYXAiLCJpbmRleCIsInJlbmRlck1lc3NhZ2UiLCJtZXNzYWdlIiwicmVzcG9uc2UiLCJyZXNwb25zZVRleHQiLCJuZXR3b3JrIiwidG9TdHJpbmciLCJib2R5Iiwia2V5IiwiaWNvbiIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RhdHVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImJvb2wiLCJhcnJheU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBYzFEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQjtBQUNBQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYywrQkFBZCxFQUErQyxLQUFLQyxLQUFMLENBQVdELEtBQTFEO0FBQ0Q7O0FBRURFLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0csS0FBS0MsY0FBTCxFQURILENBREYsQ0FERjtBQU9EOztBQUVEQSxFQUFBQSxjQUFjLEdBQUc7QUFDZixRQUFJLEtBQUtGLEtBQUwsQ0FBV0QsS0FBWCxDQUFpQkksTUFBckIsRUFBNkI7QUFDM0IsYUFBTyxLQUFLSCxLQUFMLENBQVdELEtBQVgsQ0FBaUJJLE1BQWpCLENBQXdCQyxHQUF4QixDQUE0QixDQUFDTCxLQUFELEVBQVFNLEtBQVIsS0FBa0I7QUFDbkQsZUFBTyxLQUFLQyxhQUFMLENBQW1CUCxLQUFLLENBQUNRLE9BQXpCLEVBQWtDRixLQUFsQyxFQUF5QyxPQUF6QyxDQUFQO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7O0FBRUQsUUFBSSxLQUFLTCxLQUFMLENBQVdELEtBQVgsQ0FBaUJTLFFBQXJCLEVBQStCO0FBQzdCLGFBQU8sS0FBS0YsYUFBTCxDQUFtQixLQUFLTixLQUFMLENBQVdELEtBQVgsQ0FBaUJVLFlBQXBDLEVBQWtELEdBQWxELEVBQXVELE9BQXZELENBQVA7QUFDRDs7QUFFRCxRQUFJLEtBQUtULEtBQUwsQ0FBV0QsS0FBWCxDQUFpQlcsT0FBckIsRUFBOEI7QUFDNUIsYUFBTyxLQUFLSixhQUFMLENBQW1CLFNBQW5CLEVBQThCLEdBQTlCLEVBQW1DLG1CQUFuQyxDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLQSxhQUFMLENBQW1CLEtBQUtOLEtBQUwsQ0FBV0QsS0FBWCxDQUFpQlksUUFBakIsRUFBbkIsRUFBZ0QsR0FBaEQsRUFBcUQsT0FBckQsQ0FBUDtBQUNEOztBQUVETCxFQUFBQSxhQUFhLENBQUNNLElBQUQsRUFBT0MsR0FBUCxFQUFZQyxJQUFaLEVBQWtCO0FBQzdCLFdBQ0U7QUFBRyxNQUFBLEdBQUcsRUFBRUQsR0FBUjtBQUFhLE1BQUEsU0FBUyxFQUFDO0FBQXZCLE9BQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBRUM7QUFBZixNQURGLEVBRUdGLElBRkgsQ0FERjtBQU1EOztBQXREeUQ7Ozs7Z0JBQXZDbEIsYyxlQUNBO0FBQ2pCSyxFQUFBQSxLQUFLLEVBQUVnQixtQkFBVUMsS0FBVixDQUFnQjtBQUNyQlIsSUFBQUEsUUFBUSxFQUFFTyxtQkFBVUMsS0FBVixDQUFnQjtBQUN4QkMsTUFBQUEsTUFBTSxFQUFFRixtQkFBVUcsTUFBVixDQUFpQkM7QUFERCxLQUFoQixDQURXO0FBSXJCVixJQUFBQSxZQUFZLEVBQUVNLG1CQUFVSyxNQUpIO0FBS3JCVixJQUFBQSxPQUFPLEVBQUVLLG1CQUFVTSxJQUxFO0FBTXJCbEIsSUFBQUEsTUFBTSxFQUFFWSxtQkFBVU8sT0FBVixDQUFrQlAsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDeENULE1BQUFBLE9BQU8sRUFBRVEsbUJBQVVLLE1BQVYsQ0FBaUJEO0FBRGMsS0FBaEIsQ0FBbEI7QUFOYSxHQUFoQixFQVNKQTtBQVZjLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlFcnJvclRpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVycm9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcmVzcG9uc2U6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHN0YXR1czogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICByZXNwb25zZVRleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBuZXR3b3JrOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGVycm9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSkpLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIGluIHN1YnF1ZXJ5JywgdGhpcy5wcm9wcy5lcnJvcik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVF1ZXJ5RXJyb3JUaWxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVF1ZXJ5RXJyb3JUaWxlLW1lc3NhZ2VzXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyTWVzc2FnZXMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTWVzc2FnZXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IuZXJyb3JzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5lcnJvci5lcnJvcnMubWFwKChlcnJvciwgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZShlcnJvci5tZXNzYWdlLCBpbmRleCwgJ2FsZXJ0Jyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvci5yZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTWVzc2FnZSh0aGlzLnByb3BzLmVycm9yLnJlc3BvbnNlVGV4dCwgJzAnLCAnYWxlcnQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvci5uZXR3b3JrKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJNZXNzYWdlKCdPZmZsaW5lJywgJzAnLCAnYWxpZ25tZW50LXVuYWxpZ24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZW5kZXJNZXNzYWdlKHRoaXMucHJvcHMuZXJyb3IudG9TdHJpbmcoKSwgJzAnLCAnYWxlcnQnKTtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoYm9keSwga2V5LCBpY29uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxwIGtleT17a2V5fSBjbGFzc05hbWU9XCJnaXRodWItUXVlcnlFcnJvclRpbGUtbWVzc2FnZVwiPlxuICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSAvPlxuICAgICAgICB7Ym9keX1cbiAgICAgIDwvcD5cbiAgICApO1xuICB9XG59XG4iXX0=