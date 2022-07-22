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

      const rootContainer = /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
            return /*#__PURE__*/_react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return /*#__PURE__*/_react.default.createElement(_userMentionTooltipContainer.default, props);
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

exports.default = UserMentionTooltipItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy91c2VyLW1lbnRpb24tdG9vbHRpcC1pdGVtLmpzIl0sIm5hbWVzIjpbIlVzZXJNZW50aW9uVG9vbHRpcEl0ZW0iLCJjb25zdHJ1Y3RvciIsInVzZXJuYW1lIiwicmVsYXlFbnZpcm9ubWVudCIsInN1YnN0ciIsImdldEVsZW1lbnQiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJyb290Q29udGFpbmVyIiwiZXJyb3IiLCJwcm9wcyIsInJldHJ5IiwiX2NvbXBvbmVudCIsIlJlYWN0RG9tIiwicmVuZGVyIiwiZGVzdHJveSIsInVubW91bnRDb21wb25lbnRBdE5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRWUsTUFBTUEsc0JBQU4sQ0FBNkI7QUFDMUNDLEVBQUFBLFdBQVcsQ0FBQ0MsUUFBRCxFQUFXQyxnQkFBWCxFQUE2QjtBQUN0QyxTQUFLRCxRQUFMLEdBQWdCQSxRQUFRLENBQUNFLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQSxTQUFLRCxnQkFBTCxHQUF3QkEsZ0JBQXhCO0FBQ0Q7O0FBRURFLEVBQUFBLFVBQVUsR0FBRztBQUNYLFdBQU8sS0FBS0MsT0FBWjtBQUNEOztBQUVVLE1BQVBBLE9BQU8sR0FBRztBQUNaLFFBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ2xCLFdBQUtBLFFBQUwsR0FBZ0JDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixLQUF2QixDQUFoQjs7QUFDQSxZQUFNQyxhQUFhLGdCQUNqQiw2QkFBQyx5QkFBRDtBQUNFLFFBQUEsV0FBVyxFQUFFLEtBQUtQLGdCQURwQjtBQUVFLFFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLFVBRlA7QUFTRSxRQUFBLFNBQVMsRUFBRTtBQUNURCxVQUFBQSxRQUFRLEVBQUUsS0FBS0E7QUFETixTQVRiO0FBWUUsUUFBQSxNQUFNLEVBQUUsQ0FBQztBQUFDUyxVQUFBQSxLQUFEO0FBQVFDLFVBQUFBLEtBQVI7QUFBZUMsVUFBQUE7QUFBZixTQUFELEtBQTJCO0FBQ2pDLGNBQUlGLEtBQUosRUFBVztBQUNULGdDQUFPLHVFQUFQO0FBQ0QsV0FGRCxNQUVPLElBQUlDLEtBQUosRUFBVztBQUNoQixnQ0FBTyw2QkFBQyxvQ0FBRCxFQUFpQ0EsS0FBakMsQ0FBUDtBQUNELFdBRk0sTUFFQTtBQUNMLGdDQUNFO0FBQUssY0FBQSxTQUFTLEVBQUM7QUFBZiw0QkFDRTtBQUFNLGNBQUEsU0FBUyxFQUFDO0FBQWhCLGNBREYsQ0FERjtBQUtEO0FBQ0Y7QUF4QkgsUUFERjs7QUE0QkEsV0FBS0UsVUFBTCxHQUFrQkMsa0JBQVNDLE1BQVQsQ0FBZ0JOLGFBQWhCLEVBQStCLEtBQUtILFFBQXBDLENBQWxCO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLQSxRQUFaO0FBQ0Q7O0FBRURVLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUksS0FBS1YsUUFBVCxFQUFtQjtBQUNqQlEsd0JBQVNHLHNCQUFULENBQWdDLEtBQUtYLFFBQXJDOztBQUNBLGFBQU8sS0FBS0EsUUFBWjtBQUNEO0FBQ0Y7O0FBcER5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3REb20gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvdXNlci1tZW50aW9uLXRvb2x0aXAtY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlck1lbnRpb25Ub29sdGlwSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHVzZXJuYW1lLCByZWxheUVudmlyb25tZW50KSB7XG4gICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lLnN1YnN0cigxKTtcbiAgICB0aGlzLnJlbGF5RW52aXJvbm1lbnQgPSByZWxheUVudmlyb25tZW50O1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb25zdCByb290Q29udGFpbmVyID0gKFxuICAgICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICAgIGVudmlyb25tZW50PXt0aGlzLnJlbGF5RW52aXJvbm1lbnR9XG4gICAgICAgICAgcXVlcnk9e2dyYXBocWxgXG4gICAgICAgICAgICBxdWVyeSB1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnkoJHVzZXJuYW1lOiBTdHJpbmchKSB7XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlPd25lcihsb2dpbjogJHVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgLi4udXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lclxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH1cbiAgICAgICAgICB2YXJpYWJsZXM9e3tcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVuZGVyPXsoe2Vycm9yLCBwcm9wcywgcmV0cnl9KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDxkaXY+Q291bGQgbm90IGxvYWQgaW5mb3JtYXRpb248L2Rpdj47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgIHJldHVybiA8VXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIHsuLi5wcm9wc30gLz47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUxvYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVNwaW5uZXJcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgICAgdGhpcy5fY29tcG9uZW50ID0gUmVhY3REb20ucmVuZGVyKHJvb3RDb250YWluZXIsIHRoaXMuX2VsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgUmVhY3REb20udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLl9lbGVtZW50KTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbGVtZW50O1xuICAgIH1cbiAgfVxufVxuIl19