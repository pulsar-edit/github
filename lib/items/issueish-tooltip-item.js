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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdERvbSIsIl9yZWFjdFJlbGF5IiwiX2lzc3VlaXNoVG9vbHRpcENvbnRhaW5lciIsIl9ncmFwaHFsIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiSXNzdWVpc2hUb29sdGlwSXRlbSIsImNvbnN0cnVjdG9yIiwiaXNzdWVpc2hVcmwiLCJyZWxheUVudmlyb25tZW50IiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJfZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJvb3RDb250YWluZXIiLCJRdWVyeVJlbmRlcmVyIiwiZW52aXJvbm1lbnQiLCJxdWVyeSIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwidmFyaWFibGVzIiwicmVuZGVyIiwicHJvcHMiLCJyZXRyeSIsImNsYXNzTmFtZSIsIl9jb21wb25lbnQiLCJSZWFjdERvbSIsImRlc3Ryb3kiLCJ1bm1vdW50Q29tcG9uZW50QXROb2RlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImlzc3VlaXNoLXRvb2x0aXAtaXRlbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IElzc3VlaXNoVG9vbHRpcENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2lzc3VlaXNoLXRvb2x0aXAtY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVpc2hUb29sdGlwSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGlzc3VlaXNoVXJsLCByZWxheUVudmlyb25tZW50KSB7XG4gICAgdGhpcy5pc3N1ZWlzaFVybCA9IGlzc3VlaXNoVXJsO1xuICAgIHRoaXMucmVsYXlFbnZpcm9ubWVudCA9IHJlbGF5RW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IHJvb3RDb250YWluZXIgPSAoXG4gICAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgICAgZW52aXJvbm1lbnQ9e3RoaXMucmVsYXlFbnZpcm9ubWVudH1cbiAgICAgICAgICBxdWVyeT17Z3JhcGhxbGBcbiAgICAgICAgICAgIHF1ZXJ5IGlzc3VlaXNoVG9vbHRpcEl0ZW1RdWVyeSgkaXNzdWVpc2hVcmw6IFVSSSEpIHtcbiAgICAgICAgICAgICAgcmVzb3VyY2UodXJsOiAkaXNzdWVpc2hVcmwpIHtcbiAgICAgICAgICAgICAgICAuLi5pc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgICAgdmFyaWFibGVzPXt7XG4gICAgICAgICAgICBpc3N1ZWlzaFVybDogdGhpcy5pc3N1ZWlzaFVybCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlbmRlcj17KHtlcnJvciwgcHJvcHMsIHJldHJ5fSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8ZGl2PkNvdWxkIG5vdCBsb2FkIGluZm9ybWF0aW9uPC9kaXY+O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4gPElzc3VlaXNoVG9vbHRpcENvbnRhaW5lciB7Li4ucHJvcHN9IC8+O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TcGlubmVyXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IFJlYWN0RG9tLnJlbmRlcihyb290Q29udGFpbmVyLCB0aGlzLl9lbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIFJlYWN0RG9tLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fZWxlbWVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fZWxlbWVudDtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsV0FBQSxHQUFBRixPQUFBO0FBRUEsSUFBQUcseUJBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUFnRixJQUFBSSxRQUFBO0FBQUEsU0FBQUwsdUJBQUFNLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFFakUsTUFBTUcsbUJBQW1CLENBQUM7RUFDdkNDLFdBQVdBLENBQUNDLFdBQVcsRUFBRUMsZ0JBQWdCLEVBQUU7SUFDekMsSUFBSSxDQUFDRCxXQUFXLEdBQUdBLFdBQVc7SUFDOUIsSUFBSSxDQUFDQyxnQkFBZ0IsR0FBR0EsZ0JBQWdCO0VBQzFDO0VBRUFDLFVBQVVBLENBQUEsRUFBRztJQUNYLE9BQU8sSUFBSSxDQUFDQyxPQUFPO0VBQ3JCO0VBRUEsSUFBSUEsT0FBT0EsQ0FBQSxFQUFHO0lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQ0MsUUFBUSxFQUFFO01BQ2xCLElBQUksQ0FBQ0EsUUFBUSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDN0MsTUFBTUMsYUFBYSxHQUNqQm5CLE1BQUEsQ0FBQVMsT0FBQSxDQUFBUyxhQUFBLENBQUNkLFdBQUEsQ0FBQWdCLGFBQWE7UUFDWkMsV0FBVyxFQUFFLElBQUksQ0FBQ1IsZ0JBQWlCO1FBQ25DUyxLQUFLLEVBQUFoQixRQUFBLEtBQUFBLFFBQUEsWUFBQUEsQ0FBQTtVQUFBLE1BQUFpQixJQUFBLEdBQUFyQixPQUFBO1VBQUEsSUFBQXFCLElBQUEsQ0FBQUMsSUFBQSxJQUFBRCxJQUFBLENBQUFDLElBQUE7WUFBQUMsT0FBQSxDQUFBQyxLQUFBO1VBQUE7VUFBQSxPQUFBeEIsT0FBQTtRQUFBLEVBTUg7UUFDRnlCLFNBQVMsRUFBRTtVQUNUZixXQUFXLEVBQUUsSUFBSSxDQUFDQTtRQUNwQixDQUFFO1FBQ0ZnQixNQUFNLEVBQUVBLENBQUM7VUFBQ0YsS0FBSztVQUFFRyxLQUFLO1VBQUVDO1FBQUssQ0FBQyxLQUFLO1VBQ2pDLElBQUlKLEtBQUssRUFBRTtZQUNULE9BQU8xQixNQUFBLENBQUFTLE9BQUEsQ0FBQVMsYUFBQSwwQ0FBb0MsQ0FBQztVQUM5QyxDQUFDLE1BQU0sSUFBSVcsS0FBSyxFQUFFO1lBQ2hCLE9BQU83QixNQUFBLENBQUFTLE9BQUEsQ0FBQVMsYUFBQSxDQUFDYix5QkFBQSxDQUFBSSxPQUF3QixFQUFLb0IsS0FBUSxDQUFDO1VBQ2hELENBQUMsTUFBTTtZQUNMLE9BQ0U3QixNQUFBLENBQUFTLE9BQUEsQ0FBQVMsYUFBQTtjQUFLYSxTQUFTLEVBQUM7WUFBZSxHQUM1Qi9CLE1BQUEsQ0FBQVMsT0FBQSxDQUFBUyxhQUFBO2NBQU1hLFNBQVMsRUFBQztZQUFnQixDQUFFLENBQy9CLENBQUM7VUFFVjtRQUNGO01BQUUsQ0FDSCxDQUNGO01BQ0QsSUFBSSxDQUFDQyxVQUFVLEdBQUdDLGlCQUFRLENBQUNMLE1BQU0sQ0FBQ1QsYUFBYSxFQUFFLElBQUksQ0FBQ0gsUUFBUSxDQUFDO0lBQ2pFO0lBRUEsT0FBTyxJQUFJLENBQUNBLFFBQVE7RUFDdEI7RUFFQWtCLE9BQU9BLENBQUEsRUFBRztJQUNSLElBQUksSUFBSSxDQUFDbEIsUUFBUSxFQUFFO01BQ2pCaUIsaUJBQVEsQ0FBQ0Usc0JBQXNCLENBQUMsSUFBSSxDQUFDbkIsUUFBUSxDQUFDO01BQzlDLE9BQU8sSUFBSSxDQUFDQSxRQUFRO0lBQ3RCO0VBQ0Y7QUFDRjtBQUFDb0IsT0FBQSxDQUFBM0IsT0FBQSxHQUFBQyxtQkFBQSIsImlnbm9yZUxpc3QiOltdfQ==