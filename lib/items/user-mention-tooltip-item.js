"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _reactRelay = require("react-relay");
var _userMentionTooltipContainer = _interopRequireDefault(require("../containers/user-mention-tooltip-container"));
var _graphql;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class UserMentionTooltipItem {
  constructor(username, relayEnvironment) {
    this.username = username.substr(1);
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
          const node = require("./__generated__/userMentionTooltipItemQuery.graphql");
          if (node.hash && node.hash !== "c0e8b6f6d3028f3f2679ce9e1486981e") {
            console.error("The definition of 'userMentionTooltipItemQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
          }
          return require("./__generated__/userMentionTooltipItemQuery.graphql");
        }),
        variables: {
          username: this.username
        },
        render: ({
          error,
          props,
          retry
        }) => {
          if (error) {
            return _react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return _react.default.createElement(_userMentionTooltipContainer.default, props);
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
exports.default = UserMentionTooltipItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdERvbSIsIl9yZWFjdFJlbGF5IiwiX3VzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciIsIl9ncmFwaHFsIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJVc2VyTWVudGlvblRvb2x0aXBJdGVtIiwiY29uc3RydWN0b3IiLCJ1c2VybmFtZSIsInJlbGF5RW52aXJvbm1lbnQiLCJzdWJzdHIiLCJnZXRFbGVtZW50IiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwicm9vdENvbnRhaW5lciIsIlF1ZXJ5UmVuZGVyZXIiLCJlbnZpcm9ubWVudCIsInF1ZXJ5Iiwibm9kZSIsImhhc2giLCJjb25zb2xlIiwiZXJyb3IiLCJ2YXJpYWJsZXMiLCJyZW5kZXIiLCJwcm9wcyIsInJldHJ5IiwiY2xhc3NOYW1lIiwiX2NvbXBvbmVudCIsIlJlYWN0RG9tIiwiZGVzdHJveSIsInVubW91bnRDb21wb25lbnRBdE5vZGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsidXNlci1tZW50aW9uLXRvb2x0aXAtaXRlbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IFVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL3VzZXItbWVudGlvbi10b29sdGlwLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJNZW50aW9uVG9vbHRpcEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcih1c2VybmFtZSwgcmVsYXlFbnZpcm9ubWVudCkge1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZS5zdWJzdHIoMSk7XG4gICAgdGhpcy5yZWxheUVudmlyb25tZW50ID0gcmVsYXlFbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29uc3Qgcm9vdENvbnRhaW5lciA9IChcbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17dGhpcy5yZWxheUVudmlyb25tZW50fVxuICAgICAgICAgIHF1ZXJ5PXtncmFwaHFsYFxuICAgICAgICAgICAgcXVlcnkgdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5KCR1c2VybmFtZTogU3RyaW5nISkge1xuICAgICAgICAgICAgICByZXBvc2l0b3J5T3duZXIobG9naW46ICR1c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIC4uLnVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgICAgdmFyaWFibGVzPXt7XG4gICAgICAgICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlbmRlcj17KHtlcnJvciwgcHJvcHMsIHJldHJ5fSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8ZGl2PkNvdWxkIG5vdCBsb2FkIGluZm9ybWF0aW9uPC9kaXY+O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4gPFVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciB7Li4ucHJvcHN9IC8+O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TcGlubmVyXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IFJlYWN0RG9tLnJlbmRlcihyb290Q29udGFpbmVyLCB0aGlzLl9lbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIFJlYWN0RG9tLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fZWxlbWVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fZWxlbWVudDtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsV0FBQSxHQUFBRixPQUFBO0FBRUEsSUFBQUcsNEJBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUF1RixJQUFBSSxRQUFBO0FBQUEsU0FBQUwsdUJBQUFNLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFFeEUsTUFBTUcsc0JBQXNCLENBQUM7RUFDMUNDLFdBQVdBLENBQUNDLFFBQVEsRUFBRUMsZ0JBQWdCLEVBQUU7SUFDdEMsSUFBSSxDQUFDRCxRQUFRLEdBQUdBLFFBQVEsQ0FBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsQyxJQUFJLENBQUNELGdCQUFnQixHQUFHQSxnQkFBZ0I7RUFDMUM7RUFFQUUsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUNDLE9BQU87RUFDckI7RUFFQSxJQUFJQSxPQUFPQSxDQUFBLEVBQUc7SUFDWixJQUFJLENBQUMsSUFBSSxDQUFDQyxRQUFRLEVBQUU7TUFDbEIsSUFBSSxDQUFDQSxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUM3QyxNQUFNQyxhQUFhLEdBQ2pCcEIsTUFBQSxDQUFBUyxPQUFBLENBQUFVLGFBQUEsQ0FBQ2YsV0FBQSxDQUFBaUIsYUFBYTtRQUNaQyxXQUFXLEVBQUUsSUFBSSxDQUFDVCxnQkFBaUI7UUFDbkNVLEtBQUssRUFBQWpCLFFBQUEsS0FBQUEsUUFBQSxZQUFBQSxDQUFBO1VBQUEsTUFBQWtCLElBQUEsR0FBQXRCLE9BQUE7VUFBQSxJQUFBc0IsSUFBQSxDQUFBQyxJQUFBLElBQUFELElBQUEsQ0FBQUMsSUFBQTtZQUFBQyxPQUFBLENBQUFDLEtBQUE7VUFBQTtVQUFBLE9BQUF6QixPQUFBO1FBQUEsRUFNSDtRQUNGMEIsU0FBUyxFQUFFO1VBQ1RoQixRQUFRLEVBQUUsSUFBSSxDQUFDQTtRQUNqQixDQUFFO1FBQ0ZpQixNQUFNLEVBQUVBLENBQUM7VUFBQ0YsS0FBSztVQUFFRyxLQUFLO1VBQUVDO1FBQUssQ0FBQyxLQUFLO1VBQ2pDLElBQUlKLEtBQUssRUFBRTtZQUNULE9BQU8zQixNQUFBLENBQUFTLE9BQUEsQ0FBQVUsYUFBQSwwQ0FBb0MsQ0FBQztVQUM5QyxDQUFDLE1BQU0sSUFBSVcsS0FBSyxFQUFFO1lBQ2hCLE9BQU85QixNQUFBLENBQUFTLE9BQUEsQ0FBQVUsYUFBQSxDQUFDZCw0QkFBQSxDQUFBSSxPQUEyQixFQUFLcUIsS0FBUSxDQUFDO1VBQ25ELENBQUMsTUFBTTtZQUNMLE9BQ0U5QixNQUFBLENBQUFTLE9BQUEsQ0FBQVUsYUFBQTtjQUFLYSxTQUFTLEVBQUM7WUFBZSxHQUM1QmhDLE1BQUEsQ0FBQVMsT0FBQSxDQUFBVSxhQUFBO2NBQU1hLFNBQVMsRUFBQztZQUFnQixDQUFFLENBQy9CLENBQUM7VUFFVjtRQUNGO01BQUUsQ0FDSCxDQUNGO01BQ0QsSUFBSSxDQUFDQyxVQUFVLEdBQUdDLGlCQUFRLENBQUNMLE1BQU0sQ0FBQ1QsYUFBYSxFQUFFLElBQUksQ0FBQ0gsUUFBUSxDQUFDO0lBQ2pFO0lBRUEsT0FBTyxJQUFJLENBQUNBLFFBQVE7RUFDdEI7RUFFQWtCLE9BQU9BLENBQUEsRUFBRztJQUNSLElBQUksSUFBSSxDQUFDbEIsUUFBUSxFQUFFO01BQ2pCaUIsaUJBQVEsQ0FBQ0Usc0JBQXNCLENBQUMsSUFBSSxDQUFDbkIsUUFBUSxDQUFDO01BQzlDLE9BQU8sSUFBSSxDQUFDQSxRQUFRO0lBQ3RCO0VBQ0Y7QUFDRjtBQUFDb0IsT0FBQSxDQUFBNUIsT0FBQSxHQUFBQyxzQkFBQSJ9