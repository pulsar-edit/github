"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COMMIT_GRAMMAR_SCOPE = void 0;

var _path = _interopRequireDefault(require("path"));

var _atom = require("atom");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _commitView = _interopRequireDefault(require("../views/commit-view"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _commitPreviewItem = _interopRequireDefault(require("../items/commit-preview-item"));

var _propTypes2 = require("../prop-types");

var _watchWorkspaceItem = require("../watch-workspace-item");

var _helpers = require("../helpers");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMMIT_GRAMMAR_SCOPE = 'text.git-commit';
exports.COMMIT_GRAMMAR_SCOPE = COMMIT_GRAMMAR_SCOPE;

class CommitController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "activateCommitPreview", () => {
      const uri = _commitPreviewItem.default.buildURI(this.props.repository.getWorkingDirectoryPath());

      return this.props.workspace.open(uri, {
        searchAllPanes: true,
        pending: true,
        activate: true
      });
    });

    (0, _helpers.autobind)(this, 'commit', 'handleMessageChange', 'toggleExpandedCommitMessageEditor', 'grammarAdded', 'toggleCommitPreview');
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.refCommitView = new _refHolder.default();
    this.commitMessageBuffer = new _atom.TextBuffer({
      text: this.props.repository.getCommitMessage()
    });
    this.subscriptions.add(this.commitMessageBuffer.onDidChange(this.handleMessageChange));
    this.previewWatcher = (0, _watchWorkspaceItem.watchWorkspaceItem)(this.props.workspace, _commitPreviewItem.default.buildURI(this.props.repository.getWorkingDirectoryPath()), this, 'commitPreviewActive');
    this.subscriptions.add(this.previewWatcher);
  }

  componentDidMount() {
    this.subscriptions.add(this.props.workspace.onDidAddTextEditor(({
      textEditor
    }) => {
      if (this.props.repository.isPresent() && textEditor.getPath() === this.getCommitMessagePath()) {
        const grammar = this.props.grammars.grammarForScopeName(COMMIT_GRAMMAR_SCOPE);

        if (grammar) {
          textEditor.setGrammar(grammar);
        }
      }
    }), this.props.workspace.onDidDestroyPaneItem(async ({
      item
    }) => {
      if (this.props.repository.isPresent() && item.getPath && item.getPath() === this.getCommitMessagePath() && this.getCommitMessageEditors().length === 0) {
        // we closed the last editor pointing to the commit message file
        try {
          this.commitMessageBuffer.setText(await _fsExtra.default.readFile(this.getCommitMessagePath(), {
            encoding: 'utf8'
          }));
        } catch (e) {
          if (e.code !== 'ENOENT') {
            throw e;
          }
        }
      }
    }));
  }

  render() {
    const operationStates = this.props.repository.getOperationStates();
    return _react.default.createElement(_commitView.default, {
      ref: this.refCommitView.setter,
      workspace: this.props.workspace,
      tooltips: this.props.tooltips,
      config: this.props.config,
      stagedChangesExist: this.props.stagedChangesExist,
      mergeConflictsExist: this.props.mergeConflictsExist,
      prepareToCommit: this.props.prepareToCommit,
      commit: this.commit,
      abortMerge: this.props.abortMerge,
      commands: this.props.commands,
      maximumCharacterLimit: 72,
      messageBuffer: this.commitMessageBuffer,
      isMerging: this.props.isMerging,
      isCommitting: operationStates.isCommitInProgress(),
      lastCommit: this.props.lastCommit,
      currentBranch: this.props.currentBranch,
      toggleExpandedCommitMessageEditor: this.toggleExpandedCommitMessageEditor,
      deactivateCommitBox: this.isCommitMessageEditorExpanded(),
      userStore: this.props.userStore,
      selectedCoAuthors: this.props.selectedCoAuthors,
      updateSelectedCoAuthors: this.props.updateSelectedCoAuthors,
      toggleCommitPreview: this.toggleCommitPreview,
      activateCommitPreview: this.activateCommitPreview,
      commitPreviewActive: this.state.commitPreviewActive
    });
  }

  componentDidUpdate(prevProps) {
    this.commitMessageBuffer.setTextViaDiff(this.getCommitMessage());

    if (prevProps.repository !== this.props.repository) {
      this.previewWatcher.setPattern(_commitPreviewItem.default.buildURI(this.props.repository.getWorkingDirectoryPath()));
    }
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  commit(message, coAuthors = [], amend = false) {
    let msg, verbatim;

    if (this.isCommitMessageEditorExpanded()) {
      msg = this.getCommitMessageEditors()[0].getText();
      verbatim = false;
    } else {
      const wrapMessage = this.props.config.get('github.automaticCommitMessageWrapping');
      msg = wrapMessage ? wrapCommitMessage(message) : message;
      verbatim = true;
    }

    return this.props.commit(msg.trim(), {
      amend,
      coAuthors,
      verbatim
    });
  }

  setCommitMessage(message, options) {
    if (!this.props.repository.isPresent()) {
      return;
    }

    this.props.repository.setCommitMessage(message, options);
  }

  getCommitMessage() {
    return this.props.repository.getCommitMessage();
  }

  getCommitMessagePath() {
    return _path.default.join(this.props.repository.getGitDirectoryPath(), 'ATOM_COMMIT_EDITMSG');
  }

  handleMessageChange() {
    if (!this.props.repository.isPresent()) {
      return;
    }

    this.setCommitMessage(this.commitMessageBuffer.getText(), {
      suppressUpdate: true
    });
  }

  getCommitMessageEditors() {
    if (!this.props.repository.isPresent()) {
      return [];
    }

    return this.props.workspace.getTextEditors().filter(editor => editor.getPath() === this.getCommitMessagePath());
  }

  async toggleExpandedCommitMessageEditor(messageFromBox) {
    if (this.isCommitMessageEditorExpanded()) {
      if (this.commitMessageEditorIsInForeground()) {
        await this.closeAllOpenCommitMessageEditors();
        this.forceUpdate();
      } else {
        this.activateCommitMessageEditor();
      }
    } else {
      await this.openCommitMessageEditor(messageFromBox);
      this.forceUpdate();
    }
  }

  isCommitMessageEditorExpanded() {
    return this.getCommitMessageEditors().length > 0;
  }

  commitMessageEditorIsInForeground() {
    const commitMessageEditorsInForeground = this.props.workspace.getPanes().map(pane => pane.getActiveItem()).filter(item => item && item.getPath && item.getPath() === this.getCommitMessagePath());
    return commitMessageEditorsInForeground.length > 0;
  }

  activateCommitMessageEditor() {
    const panes = this.props.workspace.getPanes();
    let editor;
    const paneWithEditor = panes.find(pane => {
      editor = pane.getItems().find(item => item.getPath && item.getPath() === this.getCommitMessagePath());
      return !!editor;
    });
    paneWithEditor.activate();
    paneWithEditor.activateItem(editor);
  }

  closeAllOpenCommitMessageEditors() {
    return Promise.all(this.props.workspace.getPanes().map(pane => {
      return Promise.all(pane.getItems().map(async item => {
        if (item && item.getPath && item.getPath() === this.getCommitMessagePath()) {
          const destroyed = await pane.destroyItem(item);

          if (!destroyed) {
            pane.activateItem(item);
          }
        }
      }));
    }));
  }

  async openCommitMessageEditor(messageFromBox) {
    await _fsExtra.default.writeFile(this.getCommitMessagePath(), messageFromBox, 'utf8');
    const commitEditor = await this.props.workspace.open(this.getCommitMessagePath());
    (0, _reporterProxy.addEvent)('open-commit-message-editor', {
      package: 'github'
    });
    const grammar = this.props.grammars.grammarForScopeName(COMMIT_GRAMMAR_SCOPE);

    if (grammar) {
      commitEditor.setGrammar(grammar);
    } else {
      this.grammarSubscription = this.props.grammars.onDidAddGrammar(this.grammarAdded);
      this.subscriptions.add(this.grammarSubscription);
    }
  }

  grammarAdded(grammar) {
    if (grammar.scopeName !== COMMIT_GRAMMAR_SCOPE) {
      return;
    }

    this.getCommitMessageEditors().forEach(editor => editor.setGrammar(grammar));
    this.grammarSubscription.dispose();
  }

  getFocus(element) {
    return this.refCommitView.map(view => view.getFocus(element)).getOr(null);
  }

  setFocus(focus) {
    return this.refCommitView.map(view => view.setFocus(focus)).getOr(false);
  }

  advanceFocusFrom(...args) {
    return this.refCommitView.map(view => view.advanceFocusFrom(...args)).getOr(false);
  }

  retreatFocusFrom(...args) {
    return this.refCommitView.map(view => view.retreatFocusFrom(...args)).getOr(false);
  }

  toggleCommitPreview() {
    (0, _reporterProxy.addEvent)('toggle-commit-preview', {
      package: 'github'
    });

    const uri = _commitPreviewItem.default.buildURI(this.props.repository.getWorkingDirectoryPath());

    if (this.props.workspace.hide(uri)) {
      return Promise.resolve();
    } else {
      return this.props.workspace.open(uri, {
        searchAllPanes: true,
        pending: true
      });
    }
  }

}

exports.default = CommitController;

_defineProperty(CommitController, "focus", _objectSpread({}, _commitView.default.focus));

_defineProperty(CommitController, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  grammars: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object.isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  mergeConflictsExist: _propTypes.default.bool.isRequired,
  stagedChangesExist: _propTypes.default.bool.isRequired,
  lastCommit: _propTypes.default.object.isRequired,
  currentBranch: _propTypes.default.object.isRequired,
  userStore: _propTypes2.UserStorePropType.isRequired,
  selectedCoAuthors: _propTypes.default.arrayOf(_propTypes2.AuthorPropType),
  updateSelectedCoAuthors: _propTypes.default.func,
  prepareToCommit: _propTypes.default.func.isRequired,
  commit: _propTypes.default.func.isRequired,
  abortMerge: _propTypes.default.func.isRequired
});

function wrapCommitMessage(message) {
  // hard wrap message (except for first line) at 72 characters
  let results = [];
  message.split('\n').forEach((line, index) => {
    if (line.length <= 72 || index === 0) {
      results.push(line);
    } else {
      const matches = line.match(/.{1,72}(\s|$)|\S+?(\s|$)/g).map(match => {
        return match.endsWith('\n') ? match.substr(0, match.length - 1) : match;
      });
      results = results.concat(matches);
    }
  });
  return results.join('\n');
}