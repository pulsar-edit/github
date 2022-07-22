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

      const rootContainer = /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
            return /*#__PURE__*/_react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return /*#__PURE__*/_react.default.createElement(_issueishTooltipContainer.default, props);
          } else {
            return /*#__PURE__*/_react.default.createElement("div", {
              className: "github-Loader"
            }, /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9pc3N1ZWlzaC10b29sdGlwLWl0ZW0uanMiXSwibmFtZXMiOlsiSXNzdWVpc2hUb29sdGlwSXRlbSIsImNvbnN0cnVjdG9yIiwiaXNzdWVpc2hVcmwiLCJyZWxheUVudmlyb25tZW50IiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJfZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJvb3RDb250YWluZXIiLCJlcnJvciIsInByb3BzIiwicmV0cnkiLCJfY29tcG9uZW50IiwiUmVhY3REb20iLCJyZW5kZXIiLCJkZXN0cm95IiwidW5tb3VudENvbXBvbmVudEF0Tm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxtQkFBTixDQUEwQjtBQUN2Q0MsRUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWNDLGdCQUFkLEVBQWdDO0FBQ3pDLFNBQUtELFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JBLGdCQUF4QjtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxXQUFPLEtBQUtDLE9BQVo7QUFDRDs7QUFFVSxNQUFQQSxPQUFPLEdBQUc7QUFDWixRQUFJLENBQUMsS0FBS0MsUUFBVixFQUFvQjtBQUNsQixXQUFLQSxRQUFMLEdBQWdCQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7O0FBQ0EsWUFBTUMsYUFBYSxnQkFDakIsNkJBQUMseUJBQUQ7QUFDRSxRQUFBLFdBQVcsRUFBRSxLQUFLTixnQkFEcEI7QUFFRSxRQUFBLEtBQUs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxVQUZQO0FBU0UsUUFBQSxTQUFTLEVBQUU7QUFDVEQsVUFBQUEsV0FBVyxFQUFFLEtBQUtBO0FBRFQsU0FUYjtBQVlFLFFBQUEsTUFBTSxFQUFFLENBQUM7QUFBQ1EsVUFBQUEsS0FBRDtBQUFRQyxVQUFBQSxLQUFSO0FBQWVDLFVBQUFBO0FBQWYsU0FBRCxLQUEyQjtBQUNqQyxjQUFJRixLQUFKLEVBQVc7QUFDVCxnQ0FBTyx1RUFBUDtBQUNELFdBRkQsTUFFTyxJQUFJQyxLQUFKLEVBQVc7QUFDaEIsZ0NBQU8sNkJBQUMsaUNBQUQsRUFBOEJBLEtBQTlCLENBQVA7QUFDRCxXQUZNLE1BRUE7QUFDTCxnQ0FDRTtBQUFLLGNBQUEsU0FBUyxFQUFDO0FBQWYsNEJBQ0U7QUFBTSxjQUFBLFNBQVMsRUFBQztBQUFoQixjQURGLENBREY7QUFLRDtBQUNGO0FBeEJILFFBREY7O0FBNEJBLFdBQUtFLFVBQUwsR0FBa0JDLGtCQUFTQyxNQUFULENBQWdCTixhQUFoQixFQUErQixLQUFLSCxRQUFwQyxDQUFsQjtBQUNEOztBQUVELFdBQU8sS0FBS0EsUUFBWjtBQUNEOztBQUVEVSxFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJLEtBQUtWLFFBQVQsRUFBbUI7QUFDakJRLHdCQUFTRyxzQkFBVCxDQUFnQyxLQUFLWCxRQUFyQzs7QUFDQSxhQUFPLEtBQUtBLFFBQVo7QUFDRDtBQUNGOztBQXBEc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IElzc3VlaXNoVG9vbHRpcENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2lzc3VlaXNoLXRvb2x0aXAtY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVpc2hUb29sdGlwSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGlzc3VlaXNoVXJsLCByZWxheUVudmlyb25tZW50KSB7XG4gICAgdGhpcy5pc3N1ZWlzaFVybCA9IGlzc3VlaXNoVXJsO1xuICAgIHRoaXMucmVsYXlFbnZpcm9ubWVudCA9IHJlbGF5RW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IHJvb3RDb250YWluZXIgPSAoXG4gICAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgICAgZW52aXJvbm1lbnQ9e3RoaXMucmVsYXlFbnZpcm9ubWVudH1cbiAgICAgICAgICBxdWVyeT17Z3JhcGhxbGBcbiAgICAgICAgICAgIHF1ZXJ5IGlzc3VlaXNoVG9vbHRpcEl0ZW1RdWVyeSgkaXNzdWVpc2hVcmw6IFVSSSEpIHtcbiAgICAgICAgICAgICAgcmVzb3VyY2UodXJsOiAkaXNzdWVpc2hVcmwpIHtcbiAgICAgICAgICAgICAgICAuLi5pc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgICAgdmFyaWFibGVzPXt7XG4gICAgICAgICAgICBpc3N1ZWlzaFVybDogdGhpcy5pc3N1ZWlzaFVybCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlbmRlcj17KHtlcnJvciwgcHJvcHMsIHJldHJ5fSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8ZGl2PkNvdWxkIG5vdCBsb2FkIGluZm9ybWF0aW9uPC9kaXY+O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4gPElzc3VlaXNoVG9vbHRpcENvbnRhaW5lciB7Li4ucHJvcHN9IC8+O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TcGlubmVyXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IFJlYWN0RG9tLnJlbmRlcihyb290Q29udGFpbmVyLCB0aGlzLl9lbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIFJlYWN0RG9tLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fZWxlbWVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fZWxlbWVudDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==