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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CreatePullRequestTile extends _react.default.Component {
  render() {
    if (this.isRepositoryNotFound()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, /*#__PURE__*/_react.default.createElement("strong", null, "Repository not found"), " for the remote ", /*#__PURE__*/_react.default.createElement("code", null, this.props.remote.getName()), ".", /*#__PURE__*/_react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "link"
      }), "Do you need to update your ", /*#__PURE__*/_react.default.createElement("strong", null, "remote URL"), "?");
    }

    if (this.isDetachedHead()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "You are not currently on ", /*#__PURE__*/_react.default.createElement("strong", null, "any branch"), ".", /*#__PURE__*/_react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "git-branch"
      }), /*#__PURE__*/_react.default.createElement("strong", null, "Create a new branch"), "\xA0 to share your work with a pull request.");
    }

    if (this.hasNoDefaultRef()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "The repository at remote ", /*#__PURE__*/_react.default.createElement("code", null, this.props.remote.getName()), " is ", /*#__PURE__*/_react.default.createElement("strong", null, "empty"), ".", /*#__PURE__*/_react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "arrow-up"
      }), /*#__PURE__*/_react.default.createElement("strong", null, "Push a main branch"), " to begin sharing your work.");
    }

    if (this.isOnDefaultRef()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "You are currently on your repository's ", /*#__PURE__*/_react.default.createElement("strong", null, "default branch"), ".", /*#__PURE__*/_react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "git-branch"
      }), /*#__PURE__*/_react.default.createElement("strong", null, "Checkout or create a new branch"), "\xA0 to share your work with a pull request.");
    }

    if (this.isSameAsDefaultRef()) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-CreatePullRequestTile-message"
      }, "Your current branch ", /*#__PURE__*/_react.default.createElement("strong", null, "has not moved"), " from the repository's default branch.", /*#__PURE__*/_react.default.createElement("hr", {
        className: "github-CreatePullRequestTile-divider"
      }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "git-commit"
      }), /*#__PURE__*/_react.default.createElement("strong", null, "Make some commits"), "\xA0 to share your work with a pull request.");
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

    return /*#__PURE__*/_react.default.createElement("div", null, differentRemote && /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CreatePullRequestTile-message"
    }, "Your current branch is ", /*#__PURE__*/_react.default.createElement("strong", null, "configured"), " to push to the remote ", /*#__PURE__*/_react.default.createElement("code", null, this.props.branches.getHeadBranch().getPush().getRemoteName()), ".", /*#__PURE__*/_react.default.createElement("hr", {
      className: "github-CreatePullRequestTile-divider"
    }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "cloud-upload"
    }), /*#__PURE__*/_react.default.createElement("strong", null, "Publish"), " it to ", /*#__PURE__*/_react.default.createElement("code", null, this.props.remote.getName()), " instead?"), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CreatePullRequestTile-controls"
    }, /*#__PURE__*/_react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jcmVhdGUtcHVsbC1yZXF1ZXN0LXRpbGUuanMiXSwibmFtZXMiOlsiQ3JlYXRlUHVsbFJlcXVlc3RUaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJpc1JlcG9zaXRvcnlOb3RGb3VuZCIsInByb3BzIiwicmVtb3RlIiwiZ2V0TmFtZSIsImlzRGV0YWNoZWRIZWFkIiwiaGFzTm9EZWZhdWx0UmVmIiwiaXNPbkRlZmF1bHRSZWYiLCJpc1NhbWVBc0RlZmF1bHRSZWYiLCJtZXNzYWdlIiwiZGlzYWJsZSIsImRpZmZlcmVudFJlbW90ZSIsInB1c2hlc1RvRGlmZmVyZW50UmVtb3RlIiwicHVzaEluUHJvZ3Jlc3MiLCJoYXNVcHN0cmVhbUJyYW5jaCIsImFoZWFkQ291bnQiLCJicmFuY2hlcyIsImdldEhlYWRCcmFuY2giLCJnZXRQdXNoIiwiZ2V0UmVtb3RlTmFtZSIsIm9uQ3JlYXRlUHIiLCJyZXBvc2l0b3J5IiwiaXNQcmVzZW50IiwiZGVmYXVsdEJyYW5jaFJlZiIsImRlZmF1bHRSZWYiLCJjdXJyZW50QnJhbmNoIiwiZ2V0UmVtb3RlUmVmIiwicHJlZml4IiwibmFtZSIsIm1haW5CcmFuY2hlcyIsImdldFB1c2hTb3VyY2VzIiwic29tZSIsImJyYW5jaCIsImdldFNoYSIsInAiLCJpc1JlbW90ZVRyYWNraW5nIiwicHVzaFJlbW90ZU5hbWUiLCJnZXRVcHN0cmVhbSIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIlJlbW90ZVByb3BUeXBlIiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJudW1iZXIiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxxQkFBTixTQUFvQ0MsZUFBTUMsU0FBMUMsQ0FBb0Q7QUFpQmpFQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJLEtBQUtDLG9CQUFMLEVBQUosRUFBaUM7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QUFFaENiLE1BQUFBLElBQUksRUFBRVUsbUJBQVVFLE1BQVYsQ0FBaUJDO0FBRlMsS0FBaEI7QUFEUSxHQUFoQixDQURLO0FBUWpCdEMsRUFBQUEsTUFBTSxFQUFFdUMsMkJBQWVELFVBUk47QUFTakJ6QixFQUFBQSxRQUFRLEVBQUUyQiw4QkFBa0JGLFVBVFg7QUFVakIxQixFQUFBQSxVQUFVLEVBQUV1QixtQkFBVU0sTUFWTDtBQVdqQi9CLEVBQUFBLGNBQWMsRUFBRXlCLG1CQUFVTyxJQUFWLENBQWVKLFVBWGQ7QUFhakJyQixFQUFBQSxVQUFVLEVBQUVrQixtQkFBVVEsSUFBVixDQUFlTDtBQWJWLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmltcG9ydCB7UmVtb3RlUHJvcFR5cGUsIEJyYW5jaFNldFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlUHVsbFJlcXVlc3RUaWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZGVmYXVsdEJyYW5jaFJlZjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgcHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgIH0pLFxuXG4gICAgcmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGJyYW5jaGVzOiBCcmFuY2hTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGFoZWFkQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgcHVzaEluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICBvbkNyZWF0ZVByOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmlzUmVwb3NpdG9yeU5vdEZvdW5kKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1tZXNzYWdlXCI+XG4gICAgICAgICAgPHN0cm9uZz5SZXBvc2l0b3J5IG5vdCBmb3VuZDwvc3Ryb25nPiBmb3IgdGhlIHJlbW90ZSA8Y29kZT57dGhpcy5wcm9wcy5yZW1vdGUuZ2V0TmFtZSgpfTwvY29kZT4uXG4gICAgICAgICAgPGhyIGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtZGl2aWRlclwiIC8+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj1cImxpbmtcIiAvPlxuICAgICAgICAgIERvIHlvdSBuZWVkIHRvIHVwZGF0ZSB5b3VyIDxzdHJvbmc+cmVtb3RlIFVSTDwvc3Ryb25nPj9cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGV0YWNoZWRIZWFkKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1tZXNzYWdlXCI+XG4gICAgICAgICAgWW91IGFyZSBub3QgY3VycmVudGx5IG9uIDxzdHJvbmc+YW55IGJyYW5jaDwvc3Ryb25nPi5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZ2l0LWJyYW5jaFwiIC8+XG4gICAgICAgICAgPHN0cm9uZz5DcmVhdGUgYSBuZXcgYnJhbmNoPC9zdHJvbmc+Jm5ic3A7XG4gICAgICAgICAgdG8gc2hhcmUgeW91ciB3b3JrIHdpdGggYSBwdWxsIHJlcXVlc3QuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNOb0RlZmF1bHRSZWYoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICBUaGUgcmVwb3NpdG9yeSBhdCByZW1vdGUgPGNvZGU+e3RoaXMucHJvcHMucmVtb3RlLmdldE5hbWUoKX08L2NvZGU+IGlzIDxzdHJvbmc+ZW1wdHk8L3N0cm9uZz4uXG4gICAgICAgICAgPGhyIGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtZGl2aWRlclwiIC8+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj1cImFycm93LXVwXCIgLz5cbiAgICAgICAgICA8c3Ryb25nPlB1c2ggYSBtYWluIGJyYW5jaDwvc3Ryb25nPiB0byBiZWdpbiBzaGFyaW5nIHlvdXIgd29yay5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzT25EZWZhdWx0UmVmKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1tZXNzYWdlXCI+XG4gICAgICAgICAgWW91IGFyZSBjdXJyZW50bHkgb24geW91ciByZXBvc2l0b3J5J3MgPHN0cm9uZz5kZWZhdWx0IGJyYW5jaDwvc3Ryb25nPi5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZ2l0LWJyYW5jaFwiIC8+XG4gICAgICAgICAgPHN0cm9uZz5DaGVja291dCBvciBjcmVhdGUgYSBuZXcgYnJhbmNoPC9zdHJvbmc+Jm5ic3A7XG4gICAgICAgICAgdG8gc2hhcmUgeW91ciB3b3JrIHdpdGggYSBwdWxsIHJlcXVlc3QuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1NhbWVBc0RlZmF1bHRSZWYoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ3JlYXRlUHVsbFJlcXVlc3RUaWxlLW1lc3NhZ2VcIj5cbiAgICAgICAgICBZb3VyIGN1cnJlbnQgYnJhbmNoIDxzdHJvbmc+aGFzIG5vdCBtb3ZlZDwvc3Ryb25nPiBmcm9tIHRoZSByZXBvc2l0b3J5J3MgZGVmYXVsdCBicmFuY2guXG4gICAgICAgICAgPGhyIGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtZGl2aWRlclwiIC8+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj1cImdpdC1jb21taXRcIiAvPlxuICAgICAgICAgIDxzdHJvbmc+TWFrZSBzb21lIGNvbW1pdHM8L3N0cm9uZz4mbmJzcDtcbiAgICAgICAgICB0byBzaGFyZSB5b3VyIHdvcmsgd2l0aCBhIHB1bGwgcmVxdWVzdC5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBtZXNzYWdlID0gJ09wZW4gbmV3IHB1bGwgcmVxdWVzdCc7XG4gICAgbGV0IGRpc2FibGUgPSBmYWxzZTtcbiAgICBjb25zdCBkaWZmZXJlbnRSZW1vdGUgPSB0aGlzLnB1c2hlc1RvRGlmZmVyZW50UmVtb3RlKCk7XG4gICAgaWYgKHRoaXMucHJvcHMucHVzaEluUHJvZ3Jlc3MpIHtcbiAgICAgIG1lc3NhZ2UgPSAnUHVzaGluZy4uLic7XG4gICAgICBkaXNhYmxlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc1Vwc3RyZWFtQnJhbmNoKCkgfHwgZGlmZmVyZW50UmVtb3RlKSB7XG4gICAgICBtZXNzYWdlID0gJ1B1Ymxpc2ggKyBvcGVuIG5ldyBwdWxsIHJlcXVlc3QnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5haGVhZENvdW50ID4gMCkge1xuICAgICAgbWVzc2FnZSA9ICdQdXNoICsgb3BlbiBuZXcgcHVsbCByZXF1ZXN0JztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2RpZmZlcmVudFJlbW90ZSAmJlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1tZXNzYWdlXCI+XG4gICAgICAgICAgICBZb3VyIGN1cnJlbnQgYnJhbmNoIGlzIDxzdHJvbmc+Y29uZmlndXJlZDwvc3Ryb25nPiB0byBwdXNoIHRvIHRoZVxuICAgICAgICAgICAgcmVtb3RlIDxjb2RlPnt0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKS5nZXRQdXNoKCkuZ2V0UmVtb3RlTmFtZSgpfTwvY29kZT4uXG4gICAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1kaXZpZGVyXCIgLz5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJjbG91ZC11cGxvYWRcIiAvPlxuICAgICAgICAgICAgPHN0cm9uZz5QdWJsaXNoPC9zdHJvbmc+IGl0IHRvIDxjb2RlPnt0aGlzLnByb3BzLnJlbW90ZS5nZXROYW1lKCl9PC9jb2RlPiBpbnN0ZWFkP1xuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNyZWF0ZVB1bGxSZXF1ZXN0VGlsZS1jb250cm9sc1wiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1DcmVhdGVQdWxsUmVxdWVzdFRpbGUtY3JlYXRlUHIgYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DcmVhdGVQcn1cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlfT5cbiAgICAgICAgICAgIHttZXNzYWdlfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpc1JlcG9zaXRvcnlOb3RGb3VuZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgfVxuXG4gIGlzRGV0YWNoZWRIZWFkKCkge1xuICAgIHJldHVybiAhdGhpcy5wcm9wcy5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCkuaXNQcmVzZW50KCk7XG4gIH1cblxuICBoYXNOb0RlZmF1bHRSZWYoKSB7XG4gICAgcmV0dXJuICF0aGlzLnByb3BzLnJlcG9zaXRvcnkuZGVmYXVsdEJyYW5jaFJlZjtcbiAgfVxuXG4gIGlzT25EZWZhdWx0UmVmKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGRlZmF1bHRSZWYgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZGVmYXVsdEJyYW5jaFJlZjtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIWRlZmF1bHRSZWYpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gdGhpcy5wcm9wcy5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRCcmFuY2guZ2V0UHVzaCgpLmdldFJlbW90ZVJlZigpID09PSBgJHtkZWZhdWx0UmVmLnByZWZpeH0ke2RlZmF1bHRSZWYubmFtZX1gO1xuICB9XG5cbiAgaXNTYW1lQXNEZWZhdWx0UmVmKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGRlZmF1bHRSZWYgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZGVmYXVsdEJyYW5jaFJlZjtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIWRlZmF1bHRSZWYpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gdGhpcy5wcm9wcy5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG4gICAgY29uc3QgbWFpbkJyYW5jaGVzID0gdGhpcy5wcm9wcy5icmFuY2hlcy5nZXRQdXNoU291cmNlcyhcbiAgICAgIHRoaXMucHJvcHMucmVtb3RlLmdldE5hbWUoKSwgYCR7ZGVmYXVsdFJlZi5wcmVmaXh9JHtkZWZhdWx0UmVmLm5hbWV9YCk7XG4gICAgcmV0dXJuIG1haW5CcmFuY2hlcy5zb21lKGJyYW5jaCA9PiBicmFuY2guZ2V0U2hhKCkgPT09IGN1cnJlbnRCcmFuY2guZ2V0U2hhKCkpO1xuICB9XG5cbiAgcHVzaGVzVG9EaWZmZXJlbnRSZW1vdGUoKSB7XG4gICAgY29uc3QgcCA9IHRoaXMucHJvcHMuYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpLmdldFB1c2goKTtcbiAgICBpZiAoIXAuaXNSZW1vdGVUcmFja2luZygpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgY29uc3QgcHVzaFJlbW90ZU5hbWUgPSBwLmdldFJlbW90ZU5hbWUoKTtcbiAgICByZXR1cm4gcHVzaFJlbW90ZU5hbWUgIT09IHRoaXMucHJvcHMucmVtb3RlLmdldE5hbWUoKTtcbiAgfVxuXG4gIGhhc1Vwc3RyZWFtQnJhbmNoKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKS5nZXRVcHN0cmVhbSgpLmlzUHJlc2VudCgpO1xuICB9XG59XG4iXX0=