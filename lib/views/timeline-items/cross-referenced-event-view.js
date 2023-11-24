"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCrossReferencedEventView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _issueishBadge = _interopRequireDefault(require("../../views/issueish-badge"));

var _issueishLink = _interopRequireDefault(require("../../views/issueish-link"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCrossReferencedEventView extends _react.default.Component {
  render() {
    const xref = this.props.item;
    const repo = xref.source.repository;
    const repoLabel = `${repo.owner.login}/${repo.name}`;
    return _react.default.createElement("div", {
      className: "cross-referenced-event"
    }, _react.default.createElement("div", {
      className: "cross-referenced-event-label"
    }, _react.default.createElement("span", {
      className: "cross-referenced-event-label-title"
    }, xref.source.title), _react.default.createElement(_issueishLink.default, {
      url: xref.source.url,
      className: "cross-referenced-event-label-number"
    }, this.getIssueishNumberDisplay(xref))), repo.isPrivate ? _react.default.createElement("div", {
      className: "cross-referenced-event-private"
    }, _react.default.createElement(_octicon.default, {
      icon: "lock",
      title: `Only people who can see ${repoLabel} will see this reference.`
    })) : '', _react.default.createElement("div", {
      className: "cross-referenced-event-state"
    }, _react.default.createElement(_issueishBadge.default, {
      type: xref.source.__typename,
      state: xref.source.issueState || xref.source.prState
    })));
  }

  getIssueishNumberDisplay(xref) {
    const {
      source
    } = xref;

    if (!xref.isCrossRepository) {
      return `#${source.number}`;
    } else {
      const {
        repository
      } = source;
      return `${repository.owner.login}/${repository.name}#${source.number}`;
    }
  }

}

exports.BareCrossReferencedEventView = BareCrossReferencedEventView;

_defineProperty(BareCrossReferencedEventView, "propTypes", {
  item: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    isCrossRepository: _propTypes.default.bool.isRequired,
    source: _propTypes.default.shape({
      __typename: _propTypes.default.oneOf(['Issue', 'PullRequest']).isRequired,
      number: _propTypes.default.number.isRequired,
      title: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired,
      issueState: _propTypes.default.oneOf(['OPEN', 'CLOSED']),
      prState: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED']),
      repository: _propTypes.default.shape({
        name: _propTypes.default.string.isRequired,
        isPrivate: _propTypes.default.bool.isRequired,
        owner: _propTypes.default.shape({
          login: _propTypes.default.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCrossReferencedEventView, {
  item: function () {
    const node = require("./__generated__/crossReferencedEventView_item.graphql");

    if (node.hash && node.hash !== "b90b8c9f0acee56516e7413263cf7f51") {
      console.error("The definition of 'crossReferencedEventView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/crossReferencedEventView_item.graphql");
  }
});

exports.default = _default;