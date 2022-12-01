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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy91c2VyLW1lbnRpb24tdG9vbHRpcC1pdGVtLmpzIl0sIm5hbWVzIjpbIlVzZXJNZW50aW9uVG9vbHRpcEl0ZW0iLCJjb25zdHJ1Y3RvciIsInVzZXJuYW1lIiwicmVsYXlFbnZpcm9ubWVudCIsInN1YnN0ciIsImdldEVsZW1lbnQiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJyb290Q29udGFpbmVyIiwiZXJyb3IiLCJwcm9wcyIsInJldHJ5IiwiX2NvbXBvbmVudCIsIlJlYWN0RG9tIiwicmVuZGVyIiwiZGVzdHJveSIsInVubW91bnRDb21wb25lbnRBdE5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRWUsTUFBTUEsc0JBQU4sQ0FBNkI7QUFDMUNDLEVBQUFBLFdBQVcsQ0FBQ0MsUUFBRCxFQUFXQyxnQkFBWCxFQUE2QjtBQUN0QyxTQUFLRCxRQUFMLEdBQWdCQSxRQUFRLENBQUNFLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQSxTQUFLRCxnQkFBTCxHQUF3QkEsZ0JBQXhCO0FBQ0Q7O0FBRURFLEVBQUFBLFVBQVUsR0FBRztBQUNYLFdBQU8sS0FBS0MsT0FBWjtBQUNEOztBQUVVLE1BQVBBLE9BQU8sR0FBRztBQUNaLFFBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ2xCLFdBQUtBLFFBQUwsR0FBZ0JDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixLQUF2QixDQUFoQjs7QUFDQSxZQUFNQyxhQUFhLEdBQ2pCLDZCQUFDLHlCQUFEO0FBQ0UsUUFBQSxXQUFXLEVBQUUsS0FBS1AsZ0JBRHBCO0FBRUUsUUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsVUFGUDtBQVNFLFFBQUEsU0FBUyxFQUFFO0FBQ1RELFVBQUFBLFFBQVEsRUFBRSxLQUFLQTtBQUROLFNBVGI7QUFZRSxRQUFBLE1BQU0sRUFBRSxDQUFDO0FBQUNTLFVBQUFBLEtBQUQ7QUFBUUMsVUFBQUEsS0FBUjtBQUFlQyxVQUFBQTtBQUFmLFNBQUQsS0FBMkI7QUFDakMsY0FBSUYsS0FBSixFQUFXO0FBQ1QsbUJBQU8sdUVBQVA7QUFDRCxXQUZELE1BRU8sSUFBSUMsS0FBSixFQUFXO0FBQ2hCLG1CQUFPLDZCQUFDLG9DQUFELEVBQWlDQSxLQUFqQyxDQUFQO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsbUJBQ0U7QUFBSyxjQUFBLFNBQVMsRUFBQztBQUFmLGVBQ0U7QUFBTSxjQUFBLFNBQVMsRUFBQztBQUFoQixjQURGLENBREY7QUFLRDtBQUNGO0FBeEJILFFBREY7O0FBNEJBLFdBQUtFLFVBQUwsR0FBa0JDLGtCQUFTQyxNQUFULENBQWdCTixhQUFoQixFQUErQixLQUFLSCxRQUFwQyxDQUFsQjtBQUNEOztBQUVELFdBQU8sS0FBS0EsUUFBWjtBQUNEOztBQUVEVSxFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJLEtBQUtWLFFBQVQsRUFBbUI7QUFDakJRLHdCQUFTRyxzQkFBVCxDQUFnQyxLQUFLWCxRQUFyQzs7QUFDQSxhQUFPLEtBQUtBLFFBQVo7QUFDRDtBQUNGOztBQXBEeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IFVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL3VzZXItbWVudGlvbi10b29sdGlwLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJNZW50aW9uVG9vbHRpcEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcih1c2VybmFtZSwgcmVsYXlFbnZpcm9ubWVudCkge1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZS5zdWJzdHIoMSk7XG4gICAgdGhpcy5yZWxheUVudmlyb25tZW50ID0gcmVsYXlFbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29uc3Qgcm9vdENvbnRhaW5lciA9IChcbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17dGhpcy5yZWxheUVudmlyb25tZW50fVxuICAgICAgICAgIHF1ZXJ5PXtncmFwaHFsYFxuICAgICAgICAgICAgcXVlcnkgdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5KCR1c2VybmFtZTogU3RyaW5nISkge1xuICAgICAgICAgICAgICByZXBvc2l0b3J5T3duZXIobG9naW46ICR1c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIC4uLnVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGB9XG4gICAgICAgICAgdmFyaWFibGVzPXt7XG4gICAgICAgICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHJlbmRlcj17KHtlcnJvciwgcHJvcHMsIHJldHJ5fSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8ZGl2PkNvdWxkIG5vdCBsb2FkIGluZm9ybWF0aW9uPC9kaXY+O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4gPFVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciB7Li4ucHJvcHN9IC8+O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TcGlubmVyXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudCA9IFJlYWN0RG9tLnJlbmRlcihyb290Q29udGFpbmVyLCB0aGlzLl9lbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIFJlYWN0RG9tLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fZWxlbWVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fZWxlbWVudDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==