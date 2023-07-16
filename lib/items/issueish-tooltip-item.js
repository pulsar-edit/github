"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _reactRelay = require("react-relay");
var _issueishTooltipContainer = _interopRequireDefault(require("../containers/issueish-tooltip-container"));
var _graphql;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class IssueishTooltipItem {
  constructor(issueishUrl, relayEnvironment) {
    this.issueishUrl = issueishUrl;
    this.relayEnvironment = relayEnvironment;
  }
  getElement() {
    return this.element;
  }
  get element() {
    if (!this._element) {
      this._element = document.createElement('div');
      const rootContainer = _react.default.createElement(_reactRelay.QueryRenderer, {
        environment: this.relayEnvironment,
        query: _graphql || (_graphql = function () {
          const node = require("./__generated__/issueishTooltipItemQuery.graphql");
          if (node.hash && node.hash !== "8e6b32b5cdcdd3debccc7adaa2b4e82c") {
            console.error("The definition of 'issueishTooltipItemQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
          }
          return require("./__generated__/issueishTooltipItemQuery.graphql");
        }),
        variables: {
          issueishUrl: this.issueishUrl
        },
        render: ({
          error,
          props,
          retry
        }) => {
          if (error) {
            return _react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return _react.default.createElement(_issueishTooltipContainer.default, props);
          } else {
            return _react.default.createElement("div", {
              className: "github-Loader"
            }, _react.default.createElement("span", {
              className: "github-Spinner"
            }));
          }
        }
      });
      this._component = _reactDom.default.render(rootContainer, this._element);
    }
    return this._element;
  }
  destroy() {
    if (this._element) {
      _reactDom.default.unmountComponentAtNode(this._element);
      delete this._element;
    }
  }
}
exports.default = IssueishTooltipItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdERvbSIsIl9yZWFjdFJlbGF5IiwiX2lzc3VlaXNoVG9vbHRpcENvbnRhaW5lciIsIl9ncmFwaHFsIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJJc3N1ZWlzaFRvb2x0aXBJdGVtIiwiY29uc3RydWN0b3IiLCJpc3N1ZWlzaFVybCIsInJlbGF5RW52aXJvbm1lbnQiLCJnZXRFbGVtZW50IiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwicm9vdENvbnRhaW5lciIsIlF1ZXJ5UmVuZGVyZXIiLCJlbnZpcm9ubWVudCIsInF1ZXJ5Iiwibm9kZSIsImhhc2giLCJjb25zb2xlIiwiZXJyb3IiLCJ2YXJpYWJsZXMiLCJyZW5kZXIiLCJwcm9wcyIsInJldHJ5IiwiY2xhc3NOYW1lIiwiX2NvbXBvbmVudCIsIlJlYWN0RG9tIiwiZGVzdHJveSIsInVubW91bnRDb21wb25lbnRBdE5vZGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiaXNzdWVpc2gtdG9vbHRpcC1pdGVtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3REb20gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgSXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvaXNzdWVpc2gtdG9vbHRpcC1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaFRvb2x0aXBJdGVtIHtcbiAgY29uc3RydWN0b3IoaXNzdWVpc2hVcmwsIHJlbGF5RW52aXJvbm1lbnQpIHtcbiAgICB0aGlzLmlzc3VlaXNoVXJsID0gaXNzdWVpc2hVcmw7XG4gICAgdGhpcy5yZWxheUVudmlyb25tZW50ID0gcmVsYXlFbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29uc3Qgcm9vdENvbnRhaW5lciA9IChcbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17dGhpcy5yZWxheUVudmlyb25tZW50fVxuICAgICAgICAgIHF1ZXJ5PXtncmFwaHFsYFxuICAgICAgICAgICAgcXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KCRpc3N1ZWlzaFVybDogVVJJISkge1xuICAgICAgICAgICAgICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xuICAgICAgICAgICAgICAgIC4uLmlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgICB2YXJpYWJsZXM9e3tcbiAgICAgICAgICAgIGlzc3VlaXNoVXJsOiB0aGlzLmlzc3VlaXNoVXJsLFxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVuZGVyPXsoe2Vycm9yLCBwcm9wcywgcmV0cnl9KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDxkaXY+Q291bGQgbm90IGxvYWQgaW5mb3JtYXRpb248L2Rpdj47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8SXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIHsuLi5wcm9wc30gLz47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUxvYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVNwaW5uZXJcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gUmVhY3REb20ucmVuZGVyKHJvb3RDb250YWluZXIsIHRoaXMuX2VsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgUmVhY3REb20udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLl9lbGVtZW50KTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbGVtZW50O1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxXQUFBLEdBQUFGLE9BQUE7QUFFQSxJQUFBRyx5QkFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQWdGLElBQUFJLFFBQUE7QUFBQSxTQUFBTCx1QkFBQU0sR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUVqRSxNQUFNRyxtQkFBbUIsQ0FBQztFQUN2Q0MsV0FBV0EsQ0FBQ0MsV0FBVyxFQUFFQyxnQkFBZ0IsRUFBRTtJQUN6QyxJQUFJLENBQUNELFdBQVcsR0FBR0EsV0FBVztJQUM5QixJQUFJLENBQUNDLGdCQUFnQixHQUFHQSxnQkFBZ0I7RUFDMUM7RUFFQUMsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUNDLE9BQU87RUFDckI7RUFFQSxJQUFJQSxPQUFPQSxDQUFBLEVBQUc7SUFDWixJQUFJLENBQUMsSUFBSSxDQUFDQyxRQUFRLEVBQUU7TUFDbEIsSUFBSSxDQUFDQSxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUM3QyxNQUFNQyxhQUFhLEdBQ2pCbkIsTUFBQSxDQUFBUyxPQUFBLENBQUFTLGFBQUEsQ0FBQ2QsV0FBQSxDQUFBZ0IsYUFBYTtRQUNaQyxXQUFXLEVBQUUsSUFBSSxDQUFDUixnQkFBaUI7UUFDbkNTLEtBQUssRUFBQWhCLFFBQUEsS0FBQUEsUUFBQSxZQUFBQSxDQUFBO1VBQUEsTUFBQWlCLElBQUEsR0FBQXJCLE9BQUE7VUFBQSxJQUFBcUIsSUFBQSxDQUFBQyxJQUFBLElBQUFELElBQUEsQ0FBQUMsSUFBQTtZQUFBQyxPQUFBLENBQUFDLEtBQUE7VUFBQTtVQUFBLE9BQUF4QixPQUFBO1FBQUEsRUFNSDtRQUNGeUIsU0FBUyxFQUFFO1VBQ1RmLFdBQVcsRUFBRSxJQUFJLENBQUNBO1FBQ3BCLENBQUU7UUFDRmdCLE1BQU0sRUFBRUEsQ0FBQztVQUFDRixLQUFLO1VBQUVHLEtBQUs7VUFBRUM7UUFBSyxDQUFDLEtBQUs7VUFDakMsSUFBSUosS0FBSyxFQUFFO1lBQ1QsT0FBTzFCLE1BQUEsQ0FBQVMsT0FBQSxDQUFBUyxhQUFBLDBDQUFvQyxDQUFDO1VBQzlDLENBQUMsTUFBTSxJQUFJVyxLQUFLLEVBQUU7WUFDaEIsT0FBTzdCLE1BQUEsQ0FBQVMsT0FBQSxDQUFBUyxhQUFBLENBQUNiLHlCQUFBLENBQUFJLE9BQXdCLEVBQUtvQixLQUFRLENBQUM7VUFDaEQsQ0FBQyxNQUFNO1lBQ0wsT0FDRTdCLE1BQUEsQ0FBQVMsT0FBQSxDQUFBUyxhQUFBO2NBQUthLFNBQVMsRUFBQztZQUFlLEdBQzVCL0IsTUFBQSxDQUFBUyxPQUFBLENBQUFTLGFBQUE7Y0FBTWEsU0FBUyxFQUFDO1lBQWdCLENBQUUsQ0FDL0IsQ0FBQztVQUVWO1FBQ0Y7TUFBRSxDQUNILENBQ0Y7TUFDRCxJQUFJLENBQUNDLFVBQVUsR0FBR0MsaUJBQVEsQ0FBQ0wsTUFBTSxDQUFDVCxhQUFhLEVBQUUsSUFBSSxDQUFDSCxRQUFRLENBQUM7SUFDakU7SUFFQSxPQUFPLElBQUksQ0FBQ0EsUUFBUTtFQUN0QjtFQUVBa0IsT0FBT0EsQ0FBQSxFQUFHO0lBQ1IsSUFBSSxJQUFJLENBQUNsQixRQUFRLEVBQUU7TUFDakJpQixpQkFBUSxDQUFDRSxzQkFBc0IsQ0FBQyxJQUFJLENBQUNuQixRQUFRLENBQUM7TUFDOUMsT0FBTyxJQUFJLENBQUNBLFFBQVE7SUFDdEI7RUFDRjtBQUNGO0FBQUNvQixPQUFBLENBQUEzQixPQUFBLEdBQUFDLG1CQUFBIn0=