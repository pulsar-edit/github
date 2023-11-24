"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PrCommitView = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _nodeEmoji = require("node-emoji");

var _moment = _interopRequireDefault(require("moment"));

var _reactRelay = require("react-relay");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const avatarAltText = 'committer avatar';

class PrCommitView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openCommitDetailItem", () => this.props.openCommit({
      sha: this.props.item.sha
    }));

    this.state = {
      showMessageBody: false
    };
    (0, _helpers.autobind)(this, 'toggleShowCommitMessageBody', 'humanizeTimeSince');
  }

  toggleShowCommitMessageBody() {
    this.setState({
      showMessageBody: !this.state.showMessageBody
    });
  }

  humanizeTimeSince(date) {
    return (0, _moment.default)(date).fromNow();
  }

  render() {
    const {
      messageHeadline,
      messageBody,
      shortSha,
      url
    } = this.props.item;
    const {
      avatarUrl,
      name,
      date
    } = this.props.item.committer;
    return _react.default.createElement("div", {
      className: "github-PrCommitView-container"
    }, _react.default.createElement("div", {
      className: "github-PrCommitView-commit"
    }, _react.default.createElement("h3", {
      className: "github-PrCommitView-title"
    }, this.props.onBranch ? _react.default.createElement("button", {
      className: "github-PrCommitView-messageHeadline is-button",
      onClick: this.openCommitDetailItem
    }, (0, _nodeEmoji.emojify)(messageHeadline)) : _react.default.createElement("span", {
      className: "github-PrCommitView-messageHeadline"
    }, (0, _nodeEmoji.emojify)(messageHeadline)), messageBody ? _react.default.createElement("button", {
      className: "github-PrCommitView-moreButton",
      onClick: this.toggleShowCommitMessageBody
    }, this.state.showMessageBody ? 'hide' : 'show', " more...") : null), _react.default.createElement("div", {
      className: "github-PrCommitView-meta"
    }, _react.default.createElement("img", {
      className: "github-PrCommitView-avatar",
      src: avatarUrl,
      alt: avatarAltText,
      title: avatarAltText
    }), _react.default.createElement("span", {
      className: "github-PrCommitView-metaText"
    }, name, " committed ", this.humanizeTimeSince(date))), this.state.showMessageBody ? _react.default.createElement("pre", {
      className: "github-PrCommitView-moreText"
    }, (0, _nodeEmoji.emojify)(messageBody)) : null), _react.default.createElement("div", {
      className: "github-PrCommitView-sha"
    }, _react.default.createElement("a", {
      href: url,
      title: `open commit ${shortSha} on GitHub.com`
    }, shortSha)));
  }

}

exports.PrCommitView = PrCommitView;

_defineProperty(PrCommitView, "propTypes", {
  item: _propTypes.default.shape({
    committer: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired,
      date: _propTypes.default.string.isRequired
    }).isRequired,
    messageBody: _propTypes.default.string,
    messageHeadline: _propTypes.default.string.isRequired,
    shortSha: _propTypes.default.string.isRequired,
    sha: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired,
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(PrCommitView, {
  item: function () {
    const node = require("./__generated__/prCommitView_item.graphql");

    if (node.hash && node.hash !== "2bd193bec5d758f465d9428ff3cd8a09") {
      console.error("The definition of 'prCommitView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCommitView_item.graphql");
  }
});

exports.default = _default;