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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJc3N1ZWlzaFRvb2x0aXBJdGVtIiwiY29uc3RydWN0b3IiLCJpc3N1ZWlzaFVybCIsInJlbGF5RW52aXJvbm1lbnQiLCJnZXRFbGVtZW50IiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwicm9vdENvbnRhaW5lciIsImVycm9yIiwicHJvcHMiLCJyZXRyeSIsIl9jb21wb25lbnQiLCJSZWFjdERvbSIsInJlbmRlciIsImRlc3Ryb3kiLCJ1bm1vdW50Q29tcG9uZW50QXROb2RlIl0sInNvdXJjZXMiOlsiaXNzdWVpc2gtdG9vbHRpcC1pdGVtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3REb20gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgSXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvaXNzdWVpc2gtdG9vbHRpcC1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaFRvb2x0aXBJdGVtIHtcbiAgY29uc3RydWN0b3IoaXNzdWVpc2hVcmwsIHJlbGF5RW52aXJvbm1lbnQpIHtcbiAgICB0aGlzLmlzc3VlaXNoVXJsID0gaXNzdWVpc2hVcmw7XG4gICAgdGhpcy5yZWxheUVudmlyb25tZW50ID0gcmVsYXlFbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29uc3Qgcm9vdENvbnRhaW5lciA9IChcbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17dGhpcy5yZWxheUVudmlyb25tZW50fVxuICAgICAgICAgIHF1ZXJ5PXtncmFwaHFsYFxuICAgICAgICAgICAgcXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KCRpc3N1ZWlzaFVybDogVVJJISkge1xuICAgICAgICAgICAgICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xuICAgICAgICAgICAgICAgIC4uLmlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgICB2YXJpYWJsZXM9e3tcbiAgICAgICAgICAgIGlzc3VlaXNoVXJsOiB0aGlzLmlzc3VlaXNoVXJsLFxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVuZGVyPXsoe2Vycm9yLCBwcm9wcywgcmV0cnl9KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDxkaXY+Q291bGQgbm90IGxvYWQgaW5mb3JtYXRpb248L2Rpdj47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8SXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIHsuLi5wcm9wc30gLz47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUxvYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVNwaW5uZXJcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gUmVhY3REb20ucmVuZGVyKHJvb3RDb250YWluZXIsIHRoaXMuX2VsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgUmVhY3REb20udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLl9lbGVtZW50KTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbGVtZW50O1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUFnRjtBQUFBO0FBRWpFLE1BQU1BLG1CQUFtQixDQUFDO0VBQ3ZDQyxXQUFXLENBQUNDLFdBQVcsRUFBRUMsZ0JBQWdCLEVBQUU7SUFDekMsSUFBSSxDQUFDRCxXQUFXLEdBQUdBLFdBQVc7SUFDOUIsSUFBSSxDQUFDQyxnQkFBZ0IsR0FBR0EsZ0JBQWdCO0VBQzFDO0VBRUFDLFVBQVUsR0FBRztJQUNYLE9BQU8sSUFBSSxDQUFDQyxPQUFPO0VBQ3JCO0VBRUEsSUFBSUEsT0FBTyxHQUFHO0lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQ0MsUUFBUSxFQUFFO01BQ2xCLElBQUksQ0FBQ0EsUUFBUSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDN0MsTUFBTUMsYUFBYSxHQUNqQiw2QkFBQyx5QkFBYTtRQUNaLFdBQVcsRUFBRSxJQUFJLENBQUNOLGdCQUFpQjtRQUNuQyxLQUFLO1VBQUE7VUFBQTtZQUFBO1VBQUE7VUFBQTtRQUFBLEVBTUg7UUFDRixTQUFTLEVBQUU7VUFDVEQsV0FBVyxFQUFFLElBQUksQ0FBQ0E7UUFDcEIsQ0FBRTtRQUNGLE1BQU0sRUFBRSxDQUFDO1VBQUNRLEtBQUs7VUFBRUMsS0FBSztVQUFFQztRQUFLLENBQUMsS0FBSztVQUNqQyxJQUFJRixLQUFLLEVBQUU7WUFDVCxPQUFPLHVFQUFxQztVQUM5QyxDQUFDLE1BQU0sSUFBSUMsS0FBSyxFQUFFO1lBQ2hCLE9BQU8sNkJBQUMsaUNBQXdCLEVBQUtBLEtBQUssQ0FBSTtVQUNoRCxDQUFDLE1BQU07WUFDTCxPQUNFO2NBQUssU0FBUyxFQUFDO1lBQWUsR0FDNUI7Y0FBTSxTQUFTLEVBQUM7WUFBZ0IsRUFBRyxDQUMvQjtVQUVWO1FBQ0Y7TUFBRSxFQUVMO01BQ0QsSUFBSSxDQUFDRSxVQUFVLEdBQUdDLGlCQUFRLENBQUNDLE1BQU0sQ0FBQ04sYUFBYSxFQUFFLElBQUksQ0FBQ0gsUUFBUSxDQUFDO0lBQ2pFO0lBRUEsT0FBTyxJQUFJLENBQUNBLFFBQVE7RUFDdEI7RUFFQVUsT0FBTyxHQUFHO0lBQ1IsSUFBSSxJQUFJLENBQUNWLFFBQVEsRUFBRTtNQUNqQlEsaUJBQVEsQ0FBQ0csc0JBQXNCLENBQUMsSUFBSSxDQUFDWCxRQUFRLENBQUM7TUFDOUMsT0FBTyxJQUFJLENBQUNBLFFBQVE7SUFDdEI7RUFDRjtBQUNGO0FBQUMifQ==