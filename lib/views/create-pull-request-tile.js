"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CreatePullRequestTile extends _react.default.Component {
  render() {
    if (this.isRepositoryNotFound()) {
      return _react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, _react.default.createElement("strong", null, "Repository not found"), " for the remote ", _react.default.createElement("code", null, this.props.remote.getName()), ".", _react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), _react.default.createElement(_octicon.default, {
        icon: "link"
      }), "Do you need to update your ", _react.default.createElement("strong", null, "remote URL"), "?");
    }
    if (this.isDetachedHead()) {
      return _react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "You are not currently on ", _react.default.createElement("strong", null, "any branch"), ".", _react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), _react.default.createElement(_octicon.default, {
        icon: "git-branch"
      }), _react.default.createElement("strong", null, "Create a new branch"), "\xA0 to share your work with a pull request.");
    }
    if (this.hasNoDefaultRef()) {
      return _react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "The repository at remote ", _react.default.createElement("code", null, this.props.remote.getName()), " is ", _react.default.createElement("strong", null, "empty"), ".", _react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), _react.default.createElement(_octicon.default, {
        icon: "arrow-up"
      }), _react.default.createElement("strong", null, "Push a main branch"), " to begin sharing your work.");
    }
    if (this.isOnDefaultRef()) {
      return _react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "You are currently on your repository's ", _react.default.createElement("strong", null, "default branch"), ".", _react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), _react.default.createElement(_octicon.default, {
        icon: "git-branch"
      }), _react.default.createElement("strong", null, "Checkout or create a new branch"), "\xA0 to share your work with a pull request.");
    }
    if (this.isSameAsDefaultRef()) {
      return _react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "Your current branch ", _react.default.createElement("strong", null, "has not moved"), " from the repository's default branch.", _react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), _react.default.createElement(_octicon.default, {
        icon: "git-commit"
      }), _react.default.createElement("strong", null, "Make some commits"), "\xA0 to share your work with a pull request.");
    }
    let message = 'Open new pull request';
    let disable = false;
    const differentRemote = this.pushesToDifferentRemote();
    if (this.props.pushInProgress) {
      message = 'Pushing...';
      disable = true;
    } else if (!this.hasUpstreamBranch() || differentRemote) {
      message = 'Publish + open new pull request';
    } else if (this.props.aheadCount > 0) {
      message = 'Push + open new pull request';
    }
    return _react.default.createElement("div", null, differentRemote && _react.default.createElement("div", {
      className: "github-CreatePullRequestTile-message"
    }, "Your current branch is ", _react.default.createElement("strong", null, "configured"), " to push to the remote ", _react.default.createElement("code", null, this.props.branches.getHeadBranch().getPush().getRemoteName()), ".", _react.default.createElement("hr", {
      className: "github-CreatePullRequestTile-divider"
    }), _react.default.createElement(_octicon.default, {
      icon: "cloud-upload"
    }), _react.default.createElement("strong", null, "Publish"), " it to ", _react.default.createElement("code", null, this.props.remote.getName()), " instead?"), _react.default.createElement("div", {
      className: "github-CreatePullRequestTile-controls"
    }, _react.default.createElement("button", {
      className: "github-CreatePullRequestTile-createPr btn btn-primary",
      onClick: this.props.onCreatePr,
      disabled: disable
    }, message)));
  }
  isRepositoryNotFound() {
    return !this.props.repository;
  }
  isDetachedHead() {
    return !this.props.branches.getHeadBranch().isPresent();
  }
  hasNoDefaultRef() {
    return !this.props.repository.defaultBranchRef;
  }
  isOnDefaultRef() {
    /* istanbul ignore if */
    if (!this.props.repository) {
      return false;
    }
    const defaultRef = this.props.repository.defaultBranchRef;
    /* istanbul ignore if */
    if (!defaultRef) {
      return false;
    }
    const currentBranch = this.props.branches.getHeadBranch();
    return currentBranch.getPush().getRemoteRef() === `${defaultRef.prefix}${defaultRef.name}`;
  }
  isSameAsDefaultRef() {
    /* istanbul ignore if */
    if (!this.props.repository) {
      return false;
    }
    const defaultRef = this.props.repository.defaultBranchRef;
    /* istanbul ignore if */
    if (!defaultRef) {
      return false;
    }
    const currentBranch = this.props.branches.getHeadBranch();
    const mainBranches = this.props.branches.getPushSources(this.props.remote.getName(), `${defaultRef.prefix}${defaultRef.name}`);
    return mainBranches.some(branch => branch.getSha() === currentBranch.getSha());
  }
  pushesToDifferentRemote() {
    const p = this.props.branches.getHeadBranch().getPush();
    if (!p.isRemoteTracking()) {
      return false;
    }
    const pushRemoteName = p.getRemoteName();
    return pushRemoteName !== this.props.remote.getName();
  }
  hasUpstreamBranch() {
    return this.props.branches.getHeadBranch().getUpstream().isPresent();
  }
}
exports.default = CreatePullRequestTile;
_defineProperty(CreatePullRequestTile, "propTypes", {
  repository: _propTypes.default.shape({
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }),
  remote: _propTypes2.RemotePropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  onCreatePr: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDcmVhdGVQdWxsUmVxdWVzdFRpbGUiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImlzUmVwb3NpdG9yeU5vdEZvdW5kIiwicHJvcHMiLCJyZW1vdGUiLCJnZXROYW1lIiwiaXNEZXRhY2hlZEhlYWQiLCJoYXNOb0RlZmF1bHRSZWYiLCJpc09uRGVmYXVsdFJlZiIsImlzU2FtZUFzRGVmYXVsdFJlZiIsIm1lc3NhZ2UiLCJkaXNhYmxlIiwiZGlmZmVyZW50UmVtb3RlIiwicHVzaGVzVG9EaWZmZXJlbnRSZW1vdGUiLCJwdXNoSW5Qcm9ncmVzcyIsImhhc1Vwc3RyZWFtQnJhbmNoIiwiYWhlYWRDb3VudCIsImJyYW5jaGVzIiwiZ2V0SGVhZEJyYW5jaCIsImdldFB1c2giLCJnZXRSZW1vdGVOYW1lIiwib25DcmVhdGVQciIsInJlcG9zaXRvcnkiLCJpc1ByZXNlbnQiLCJkZWZhdWx0QnJhbmNoUmVmIiwiZGVmYXVsdFJlZiIsImN1cnJlbnRCcmFuY2giLCJnZXRSZW1vdGVSZWYiLCJwcmVmaXgiLCJuYW1lIiwibWFpbkJyYW5jaGVzIiwiZ2V0UHVzaFNvdXJjZXMiLCJzb21lIiwiYnJhbmNoIiwiZ2V0U2hhIiwicCIsImlzUmVtb3RlVHJhY2tpbmciLCJwdXNoUmVtb3RlTmFtZSIsImdldFVwc3RyZWFtIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiUmVtb3RlUHJvcFR5cGUiLCJCcmFuY2hTZXRQcm9wVHlwZSIsIm51bWJlciIsImJvb2wiLCJmdW5jIl0sInNvdXJjZXMiOlsiY3JlYXRlLXB1bGwtcmVxdWVzdC10aWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuaW1wb3J0IHtSZW1vdGVQcm9wVHlwZSwgQnJhbmNoU2V0UHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVQdWxsUmVxdWVzdFRpbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBkZWZhdWx0QnJhbmNoUmVmOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBwcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSksXG5cbiAgICByZW1vdGU6IFJlbW90ZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYWhlYWRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBwdXNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIG9uQ3JlYXRlUHI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuaXNSZXBvc2l0b3J5Tm90Rm91bmQoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICA8c3Ryb25nPlJlcG9zaXRvcnkgbm90IGZvdW5kPC9zdHJvbmc+IGZvciB0aGUgcmVtb3RlIDxjb2RlPnt0aGlzLnByb3BzLnJlbW90ZS5nZXROYW1lKCl9PC9jb2RlPi5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPVwibGlua1wiIC8+XG4gICAgICAgICAgRG8geW91IG5lZWQgdG8gdXBkYXRlIHlvdXIgPHN0cm9uZz5yZW1vdGUgVVJMPC9zdHJvbmc+P1xuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEZXRhY2hlZEhlYWQoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICBZb3UgYXJlIG5vdCBjdXJyZW50bHkgb24gPHN0cm9uZz5hbnkgYnJhbmNoPC9zdHJvbmc+LlxuICAgICAgICAgIDxociBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLWRpdmlkZXJcIiAvPlxuICAgICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtYnJhbmNoXCIgLz5cbiAgICAgICAgICA8c3Ryb25nPkNyZWF0ZSBhIG5ldyBicmFuY2g8L3N0cm9uZz4mbmJzcDtcbiAgICAgICAgICB0byBzaGFyZSB5b3VyIHdvcmsgd2l0aCBhIHB1bGwgcmVxdWVzdC5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc05vRGVmYXVsdFJlZigpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtbWVzc2FnZVwiPlxuICAgICAgICAgIFRoZSByZXBvc2l0b3J5IGF0IHJlbW90ZSA8Y29kZT57dGhpcy5wcm9wcy5yZW1vdGUuZ2V0TmFtZSgpfTwvY29kZT4gaXMgPHN0cm9uZz5lbXB0eTwvc3Ryb25nPi5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiYXJyb3ctdXBcIiAvPlxuICAgICAgICAgIDxzdHJvbmc+UHVzaCBhIG1haW4gYnJhbmNoPC9zdHJvbmc+IHRvIGJlZ2luIHNoYXJpbmcgeW91ciB3b3JrLlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNPbkRlZmF1bHRSZWYoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICBZb3UgYXJlIGN1cnJlbnRseSBvbiB5b3VyIHJlcG9zaXRvcnkncyA8c3Ryb25nPmRlZmF1bHQgYnJhbmNoPC9zdHJvbmc+LlxuICAgICAgICAgIDxociBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLWRpdmlkZXJcIiAvPlxuICAgICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtYnJhbmNoXCIgLz5cbiAgICAgICAgICA8c3Ryb25nPkNoZWNrb3V0IG9yIGNyZWF0ZSBhIG5ldyBicmFuY2g8L3N0cm9uZz4mbmJzcDtcbiAgICAgICAgICB0byBzaGFyZSB5b3VyIHdvcmsgd2l0aCBhIHB1bGwgcmVxdWVzdC5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzU2FtZUFzRGVmYXVsdFJlZigpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtbWVzc2FnZVwiPlxuICAgICAgICAgIFlvdXIgY3VycmVudCBicmFuY2ggPHN0cm9uZz5oYXMgbm90IG1vdmVkPC9zdHJvbmc+IGZyb20gdGhlIHJlcG9zaXRvcnkncyBkZWZhdWx0IGJyYW5jaC5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZ2l0LWNvbW1pdFwiIC8+XG4gICAgICAgICAgPHN0cm9uZz5NYWtlIHNvbWUgY29tbWl0czwvc3Ryb25nPiZuYnNwO1xuICAgICAgICAgIHRvIHNoYXJlIHlvdXIgd29yayB3aXRoIGEgcHVsbCByZXF1ZXN0LlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IG1lc3NhZ2UgPSAnT3BlbiBuZXcgcHVsbCByZXF1ZXN0JztcbiAgICBsZXQgZGlzYWJsZSA9IGZhbHNlO1xuICAgIGNvbnN0IGRpZmZlcmVudFJlbW90ZSA9IHRoaXMucHVzaGVzVG9EaWZmZXJlbnRSZW1vdGUoKTtcbiAgICBpZiAodGhpcy5wcm9wcy5wdXNoSW5Qcm9ncmVzcykge1xuICAgICAgbWVzc2FnZSA9ICdQdXNoaW5nLi4uJztcbiAgICAgIGRpc2FibGUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaGFzVXBzdHJlYW1CcmFuY2goKSB8fCBkaWZmZXJlbnRSZW1vdGUpIHtcbiAgICAgIG1lc3NhZ2UgPSAnUHVibGlzaCArIG9wZW4gbmV3IHB1bGwgcmVxdWVzdCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmFoZWFkQ291bnQgPiAwKSB7XG4gICAgICBtZXNzYWdlID0gJ1B1c2ggKyBvcGVuIG5ldyBwdWxsIHJlcXVlc3QnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7ZGlmZmVyZW50UmVtb3RlICYmXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICAgIFlvdXIgY3VycmVudCBicmFuY2ggaXMgPHN0cm9uZz5jb25maWd1cmVkPC9zdHJvbmc+IHRvIHB1c2ggdG8gdGhlXG4gICAgICAgICAgICByZW1vdGUgPGNvZGU+e3RoaXMucHJvcHMuYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpLmdldFB1c2goKS5nZXRSZW1vdGVOYW1lKCl9PC9jb2RlPi5cbiAgICAgICAgICAgIDxociBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLWRpdmlkZXJcIiAvPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImNsb3VkLXVwbG9hZFwiIC8+XG4gICAgICAgICAgICA8c3Ryb25nPlB1Ymxpc2g8L3N0cm9uZz4gaXQgdG8gPGNvZGU+e3RoaXMucHJvcHMucmVtb3RlLmdldE5hbWUoKX08L2NvZGU+IGluc3RlYWQ/XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLWNvbnRyb2xzXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1jcmVhdGVQciBidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkNyZWF0ZVByfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGV9PlxuICAgICAgICAgICAge21lc3NhZ2V9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlzUmVwb3NpdG9yeU5vdEZvdW5kKCkge1xuICAgIHJldHVybiAhdGhpcy5wcm9wcy5yZXBvc2l0b3J5O1xuICB9XG5cbiAgaXNEZXRhY2hlZEhlYWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKS5pc1ByZXNlbnQoKTtcbiAgfVxuXG4gIGhhc05vRGVmYXVsdFJlZigpIHtcbiAgICByZXR1cm4gIXRoaXMucHJvcHMucmVwb3NpdG9yeS5kZWZhdWx0QnJhbmNoUmVmO1xuICB9XG5cbiAgaXNPbkRlZmF1bHRSZWYoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgY29uc3QgZGVmYXVsdFJlZiA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5kZWZhdWx0QnJhbmNoUmVmO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghZGVmYXVsdFJlZikgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSB0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICByZXR1cm4gY3VycmVudEJyYW5jaC5nZXRQdXNoKCkuZ2V0UmVtb3RlUmVmKCkgPT09IGAke2RlZmF1bHRSZWYucHJlZml4fSR7ZGVmYXVsdFJlZi5uYW1lfWA7XG4gIH1cblxuICBpc1NhbWVBc0RlZmF1bHRSZWYoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgY29uc3QgZGVmYXVsdFJlZiA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5kZWZhdWx0QnJhbmNoUmVmO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghZGVmYXVsdFJlZikgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSB0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBjb25zdCBtYWluQnJhbmNoZXMgPSB0aGlzLnByb3BzLmJyYW5jaGVzLmdldFB1c2hTb3VyY2VzKFxuICAgICAgdGhpcy5wcm9wcy5yZW1vdGUuZ2V0TmFtZSgpLCBgJHtkZWZhdWx0UmVmLnByZWZpeH0ke2RlZmF1bHRSZWYubmFtZX1gKTtcbiAgICByZXR1cm4gbWFpbkJyYW5jaGVzLnNvbWUoYnJhbmNoID0+IGJyYW5jaC5nZXRTaGEoKSA9PT0gY3VycmVudEJyYW5jaC5nZXRTaGEoKSk7XG4gIH1cblxuICBwdXNoZXNUb0RpZmZlcmVudFJlbW90ZSgpIHtcbiAgICBjb25zdCBwID0gdGhpcy5wcm9wcy5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCkuZ2V0UHVzaCgpO1xuICAgIGlmICghcC5pc1JlbW90ZVRyYWNraW5nKCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBjb25zdCBwdXNoUmVtb3RlTmFtZSA9IHAuZ2V0UmVtb3RlTmFtZSgpO1xuICAgIHJldHVybiBwdXNoUmVtb3RlTmFtZSAhPT0gdGhpcy5wcm9wcy5yZW1vdGUuZ2V0TmFtZSgpO1xuICB9XG5cbiAgaGFzVXBzdHJlYW1CcmFuY2goKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpLmdldFVwc3RyZWFtKCkuaXNQcmVzZW50KCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBZ0U7QUFBQTtBQUFBO0FBQUE7QUFFakQsTUFBTUEscUJBQXFCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBaUJqRUMsTUFBTSxHQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUNDLG9CQUFvQixFQUFFLEVBQUU7TUFDL0IsT0FDRTtRQUFLLFNBQVMsRUFBQztNQUFzQyxHQUNuRCxvRUFBcUMsc0JBQWdCLDJDQUFPLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxNQUFNLENBQUNDLE9BQU8sRUFBRSxDQUFRLE9BQy9GO1FBQUksU0FBUyxFQUFDO01BQXNDLEVBQUcsRUFDdkQsNkJBQUMsZ0JBQU87UUFBQyxJQUFJLEVBQUM7TUFBTSxFQUFHLGlDQUNJLDBEQUEyQixNQUNsRDtJQUVWO0lBRUEsSUFBSSxJQUFJLENBQUNDLGNBQWMsRUFBRSxFQUFFO01BQ3pCLE9BQ0U7UUFBSyxTQUFTLEVBQUM7TUFBc0MsZ0NBQzFCLDBEQUEyQixPQUNwRDtRQUFJLFNBQVMsRUFBQztNQUFzQyxFQUFHLEVBQ3ZELDZCQUFDLGdCQUFPO1FBQUMsSUFBSSxFQUFDO01BQVksRUFBRyxFQUM3QixtRUFBb0MsaURBRWhDO0lBRVY7SUFFQSxJQUFJLElBQUksQ0FBQ0MsZUFBZSxFQUFFLEVBQUU7TUFDMUIsT0FDRTtRQUFLLFNBQVMsRUFBQztNQUFzQyxnQ0FD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