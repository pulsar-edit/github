"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reporterProxy = require("../reporter-proxy");

var _eventKit = require("event-kit");

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _uriPattern = _interopRequireDefault(require("../atom/uri-pattern"));

var _recentCommitsView = _interopRequireDefault(require("../views/recent-commits-view"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RecentCommitsController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "updateSelectedCommit", () => {
      const activeItem = this.props.workspace.getActivePaneItem();
      const pattern = new _uriPattern.default(decodeURIComponent(_commitDetailItem.default.buildURI(this.props.repository.getWorkingDirectoryPath(), '{sha}')));

      if (activeItem && activeItem.getURI) {
        const match = pattern.matches(activeItem.getURI());
        const {
          sha
        } = match.getParams();

        if (match.ok() && sha && sha !== this.state.selectedCommitSha) {
          return new Promise(resolve => this.setState({
            selectedCommitSha: sha
          }, resolve));
        }
      }

      return Promise.resolve();
    });

    _defineProperty(this, "openCommit", async ({
      sha,
      preserveFocus
    }) => {
      const workdir = this.props.repository.getWorkingDirectoryPath();

      const uri = _commitDetailItem.default.buildURI(workdir, sha);

      const item = await this.props.workspace.open(uri, {
        pending: true
      });

      if (preserveFocus) {
        item.preventFocus();
        this.setFocus(this.constructor.focus.RECENT_COMMIT);
      }

      (0, _reporterProxy.addEvent)('open-commit-in-pane', {
        package: 'github',
        from: this.constructor.name
      });
    });

    _defineProperty(this, "selectNextCommit", () => this.setSelectedCommitIndex(this.getSelectedCommitIndex() + 1));

    _defineProperty(this, "selectPreviousCommit", () => this.setSelectedCommitIndex(Math.max(this.getSelectedCommitIndex() - 1, 0)));

    this.subscriptions = new _eventKit.CompositeDisposable(this.props.workspace.onDidChangeActivePaneItem(this.updateSelectedCommit));
    this.refView = new _refHolder.default();
    this.state = {
      selectedCommitSha: ''
    };
  }

  render() {
    return _react.default.createElement(_recentCommitsView.default, {
      ref: this.refView.setter,
      commits: this.props.commits,
      isLoading: this.props.isLoading,
      undoLastCommit: this.props.undoLastCommit,
      openCommit: this.openCommit,
      selectNextCommit: this.selectNextCommit,
      selectPreviousCommit: this.selectPreviousCommit,
      selectedCommitSha: this.state.selectedCommitSha,
      commands: this.props.commands,
      clipboard: atom.clipboard
    });
  }

  getSelectedCommitIndex() {
    return this.props.commits.findIndex(commit => commit.getSha() === this.state.selectedCommitSha);
  }

  setSelectedCommitIndex(ind) {
    const commit = this.props.commits[ind];

    if (commit) {
      return new Promise(resolve => this.setState({
        selectedCommitSha: commit.getSha()
      }, resolve));
    } else {
      return Promise.resolve();
    }
  }

  getFocus(element) {
    return this.refView.map(view => view.getFocus(element)).getOr(null);
  }

  setFocus(focus) {
    return this.refView.map(view => {
      const wasFocused = view.setFocus(focus);

      if (wasFocused && this.getSelectedCommitIndex() === -1) {
        this.setSelectedCommitIndex(0);
      }

      return wasFocused;
    }).getOr(false);
  }

  advanceFocusFrom(focus) {
    return this.refView.map(view => view.advanceFocusFrom(focus)).getOr(Promise.resolve(null));
  }

  retreatFocusFrom(focus) {
    return this.refView.map(view => view.retreatFocusFrom(focus)).getOr(Promise.resolve(null));
  }

}

exports.default = RecentCommitsController;

_defineProperty(RecentCommitsController, "propTypes", {
  commits: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  undoLastCommit: _propTypes.default.func.isRequired,
  workspace: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});

_defineProperty(RecentCommitsController, "focus", _recentCommitsView.default.focus);