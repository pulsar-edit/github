"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCrossReferencedEventsView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _timeago = _interopRequireDefault(require("../../views/timeago"));

var _crossReferencedEventView = _interopRequireDefault(require("./cross-referenced-event-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCrossReferencedEventsView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "timeline-item cross-referenced-events"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "bookmark"
    }), _react.default.createElement("span", {
      className: "cross-referenced-event-header"
    }, this.renderSummary())), this.renderEvents());
  }

  renderSummary() {
    const first = this.props.nodes[0];

    if (this.props.nodes.length > 1) {
      return _react.default.createElement("span", null, "This was referenced ", _react.default.createElement(_timeago.default, {
        time: first.referencedAt
      }));
    } else {
      const type = {
        PullRequest: 'a pull request',
        Issue: 'an issue'
      }[first.source.__typename];
      let xrefClause = '';

      if (first.isCrossRepository) {
        const repo = first.source.repository;
        xrefClause = _react.default.createElement("span", null, "in ", _react.default.createElement("strong", null, repo.owner.login, "/", repo.name));
      }

      return _react.default.createElement("span", null, _react.default.createElement("img", {
        className: "author-avatar",
        src: first.actor.avatarUrl,
        alt: first.actor.login,
        title: first.actor.login
      }), _react.default.createElement("strong", null, first.actor.login), " referenced this from ", type, " ", xrefClause, _react.default.createElement(_timeago.default, {
        time: first.referencedAt
      }));
    }
  }

  renderEvents() {
    return this.props.nodes.map(node => {
      return _react.default.createElement(_crossReferencedEventView.default, {
        key: node.id,
        item: node
      });
    });
  }

}

exports.BareCrossReferencedEventsView = BareCrossReferencedEventsView;

_defineProperty(BareCrossReferencedEventsView, "propTypes", {
  nodes: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    referencedAt: _propTypes.default.string.isRequired,
    isCrossRepository: _propTypes.default.bool.isRequired,
    actor: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    source: _propTypes.default.shape({
      __typename: _propTypes.default.oneOf(['Issue', 'PullRequest']).isRequired,
      repository: _propTypes.default.shape({
        name: _propTypes.default.string.isRequired,
        owner: _propTypes.default.shape({
          login: _propTypes.default.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCrossReferencedEventsView, {
  nodes: function () {
    const node = require("./__generated__/crossReferencedEventsView_nodes.graphql");

    if (node.hash && node.hash !== "5bbb7b39e10559bac4af2d6f9ff7a9e2") {
      console.error("The definition of 'crossReferencedEventsView_nodes' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/crossReferencedEventsView_nodes.graphql");
  }
});

exports.default = _default;