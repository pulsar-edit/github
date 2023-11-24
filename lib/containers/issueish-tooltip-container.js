"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueishTooltipContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const typeAndStateToIcon = {
  Issue: {
    OPEN: 'issue-opened',
    CLOSED: 'issue-closed'
  },
  PullRequest: {
    OPEN: 'git-pull-request',
    CLOSED: 'git-pull-request',
    MERGED: 'git-merge'
  }
};

class BareIssueishTooltipContainer extends _react.default.Component {
  render() {
    const resource = this.props.resource;
    const author = resource.author || _helpers.GHOST_USER;
    const {
      repository,
      state,
      number,
      title,
      __typename
    } = resource;
    const icons = typeAndStateToIcon[__typename] || {};
    const icon = icons[state] || '';
    return _react.default.createElement("div", {
      className: "github-IssueishTooltip"
    }, _react.default.createElement("div", {
      className: "issueish-avatar-and-title"
    }, _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }), _react.default.createElement("h3", {
      className: "issueish-title"
    }, title)), _react.default.createElement("div", {
      className: "issueish-badge-and-link"
    }, _react.default.createElement("span", {
      className: (0, _classnames.default)('issueish-badge', 'badge', state.toLowerCase())
    }, _react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase()), _react.default.createElement("span", {
      className: "issueish-link"
    }, repository.owner.login, "/", repository.name, "#", number)));
  }

}

exports.BareIssueishTooltipContainer = BareIssueishTooltipContainer;

_defineProperty(BareIssueishTooltipContainer, "propTypes", {
  resource: _propTypes.default.shape({
    issue: _propTypes.default.shape({}),
    pullRequest: _propTypes.default.shape({})
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareIssueishTooltipContainer, {
  resource: function () {
    const node = require("./__generated__/issueishTooltipContainer_resource.graphql");

    if (node.hash && node.hash !== "8980fc73c7ed3f632f0612ce14f2f0d1") {
      console.error("The definition of 'issueishTooltipContainer_resource' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueishTooltipContainer_resource.graphql");
  }
});

exports.default = _default;