"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareUserMentionTooltipContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareUserMentionTooltipContainer extends _react.default.Component {
  render() {
    const owner = this.props.repositoryOwner;
    const {
      login,
      company,
      repositories,
      membersWithRole
    } = owner;
    return _react.default.createElement("div", {
      className: "github-UserMentionTooltip"
    }, _react.default.createElement("div", {
      className: "github-UserMentionTooltip-avatar"
    }, _react.default.createElement("img", {
      alt: "repository owner's avatar",
      src: owner.avatarUrl
    })), _react.default.createElement("div", {
      className: "github-UserMentionTooltip-info"
    }, _react.default.createElement("div", {
      className: "github-UserMentionTooltip-info-username"
    }, _react.default.createElement(_octicon.default, {
      icon: "mention"
    }), _react.default.createElement("strong", null, login)), company && _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "briefcase"
    }), _react.default.createElement("span", null, company)), membersWithRole && _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "organization"
    }), _react.default.createElement("span", null, membersWithRole.totalCount, " members")), _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "repo"
    }), _react.default.createElement("span", null, repositories.totalCount, " repositories"))), _react.default.createElement("div", {
      style: {
        clear: 'both'
      }
    }));
  }

}

exports.BareUserMentionTooltipContainer = BareUserMentionTooltipContainer;

_defineProperty(BareUserMentionTooltipContainer, "propTypes", {
  repositoryOwner: _propTypes.default.shape({
    login: _propTypes.default.string.isRequired,
    avatarUrl: _propTypes.default.string.isRequired,
    repositories: _propTypes.default.shape({
      totalCount: _propTypes.default.number.isRequired
    }).isRequired,
    // Users
    company: _propTypes.default.string,
    // Organizations
    membersWithRole: _propTypes.default.shape({
      totalCount: _propTypes.default.number.isRequired
    })
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareUserMentionTooltipContainer, {
  repositoryOwner: function () {
    const node = require("./__generated__/userMentionTooltipContainer_repositoryOwner.graphql");

    if (node.hash && node.hash !== "3ee858460adcfbee1dfc27cf8dc46332") {
      console.error("The definition of 'userMentionTooltipContainer_repositoryOwner' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/userMentionTooltipContainer_repositoryOwner.graphql");
  }
});

exports.default = _default;