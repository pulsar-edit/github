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