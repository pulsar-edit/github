"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _classnames = _interopRequireDefault(require("classnames"));
var _reactSelect = _interopRequireDefault(require("react-select"));
var _tooltip = _interopRequireDefault(require("../atom/tooltip"));
var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));
var _coAuthorForm = _interopRequireDefault(require("./co-author-form"));
var _recentCommitsView = _interopRequireDefault(require("./recent-commits-view"));
var _stagingView = _interopRequireDefault(require("./staging-view"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _author = _interopRequireDefault(require("../models/author"));
var _observeModel = _interopRequireDefault(require("./observe-model"));
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
var _reporterProxy = require("../reporter-proxy");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const TOOLTIP_DELAY = 200;

// CustomEvent is a DOM primitive, which v8 can't access
// so we're essentially lazy loading to keep snapshotting from breaking.
let FakeKeyDownEvent;
class CommitView extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'submitNewCoAuthor', 'cancelNewCoAuthor', 'didMoveCursor', 'toggleHardWrap', 'toggleCoAuthorInput', 'abortMerge', 'commit', 'amendLastCommit', 'toggleExpandedCommitMessageEditor', 'renderCoAuthorListItem', 'onSelectedCoAuthorsChanged', 'excludeCoAuthor');
    this.state = {
      showWorking: false,
      showCoAuthorInput: false,
      showCoAuthorForm: false,
      coAuthorInput: ''
    };
    this.timeoutHandle = null;
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.refRoot = new _refHolder.default();
    this.refCommitPreviewButton = new _refHolder.default();
    this.refExpandButton = new _refHolder.default();
    this.refCommitButton = new _refHolder.default();
    this.refHardWrapButton = new _refHolder.default();
    this.refAbortMergeButton = new _refHolder.default();
    this.refCoAuthorToggle = new _refHolder.default();
    this.refCoAuthorSelect = new _refHolder.default();
    this.refCoAuthorForm = new _refHolder.default();
    this.refEditorComponent = new _refHolder.default();
    this.refEditorModel = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable();
  }
  proxyKeyCode(keyCode) {
    return e => {
      if (this.refCoAuthorSelect.isEmpty()) {
        return;
      }
      if (!FakeKeyDownEvent) {
        FakeKeyDownEvent = class extends CustomEvent {
          constructor(kCode) {
            super('keydown');
            this.keyCode = kCode;
          }
        };
      }
      const fakeEvent = new FakeKeyDownEvent(keyCode);
      this.refCoAuthorSelect.get().handleKeyDown(fakeEvent);
      if (!fakeEvent.defaultPrevented) {
        e.abortKeyBinding();
      }
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.scheduleShowWorking(this.props);
    this.subs.add(this.props.config.onDidChange('github.automaticCommitMessageWrapping', () => this.forceUpdate()), this.props.messageBuffer.onDidChange(() => this.forceUpdate()));
  }
  render() {
    let remainingCharsClassName = '';
    const remainingCharacters = parseInt(this.getRemainingCharacters(), 10);
    if (remainingCharacters < 0) {
      remainingCharsClassName = 'is-error';
    } else if (remainingCharacters < this.props.maximumCharacterLimit / 4) {
      remainingCharsClassName = 'is-warning';
    }
    const showAbortMergeButton = this.props.isMerging || null;

    /* istanbul ignore next */
    const modKey = process.platform === 'darwin' ? 'Cmd' : 'Ctrl';
    return _react.default.createElement("div", {
      className: "github-CommitView",
      ref: this.refRoot.setter
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, _react.default.createElement(_commands.Command, {
      command: "github:commit",
      callback: this.commit
    }), _react.default.createElement(_commands.Command, {
      command: "github:amend-last-commit",
      callback: this.amendLastCommit
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-expanded-commit-message-editor",
      callback: this.toggleExpandedCommitMessageEditor
    })), _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-CommitView-coAuthorEditor"
    }, _react.default.createElement(_commands.Command, {
      command: "github:selectbox-down",
      callback: this.proxyKeyCode(40)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-up",
      callback: this.proxyKeyCode(38)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-enter",
      callback: this.proxyKeyCode(13)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-tab",
      callback: this.proxyKeyCode(9)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-backspace",
      callback: this.proxyKeyCode(8)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-pageup",
      callback: this.proxyKeyCode(33)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-pagedown",
      callback: this.proxyKeyCode(34)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-end",
      callback: this.proxyKeyCode(35)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-home",
      callback: this.proxyKeyCode(36)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-delete",
      callback: this.proxyKeyCode(46)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-escape",
      callback: this.proxyKeyCode(27)
    }), _react.default.createElement(_commands.Command, {
      command: "github:co-author-exclude",
      callback: this.excludeCoAuthor
    })), _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-CommitView-commitPreview"
    }, _react.default.createElement(_commands.Command, {
      command: "github:dive",
      callback: this.props.activateCommitPreview
    })), _react.default.createElement("div", {
      className: "github-CommitView-buttonWrapper"
    }, _react.default.createElement("button", {
      ref: this.refCommitPreviewButton.setter,
      className: "github-CommitView-commitPreview github-CommitView-button btn",
      disabled: !this.props.stagedChangesExist,
      onClick: this.props.toggleCommitPreview
    }, this.props.commitPreviewActive ? 'Hide All Staged Changes' : 'See All Staged Changes')), _react.default.createElement("div", {
      className: (0, _classnames.default)('github-CommitView-editor', {
        'is-expanded': this.props.deactivateCommitBox
      })
    }, _react.default.createElement(_atomTextEditor.default, {
      ref: this.refEditorComponent.setter,
      refModel: this.refEditorModel,
      softWrapped: true,
      placeholderText: "Commit message",
      lineNumberGutterVisible: false,
      showInvisibles: false,
      autoHeight: false,
      scrollPastEnd: false,
      buffer: this.props.messageBuffer,
      workspace: this.props.workspace,
      didChangeCursorPosition: this.didMoveCursor
    }), _react.default.createElement("button", {
      ref: this.refCoAuthorToggle.setter,
      className: (0, _classnames.default)('github-CommitView-coAuthorToggle', {
        focused: this.state.showCoAuthorInput
      }),
      onClick: this.toggleCoAuthorInput
    }, this.renderCoAuthorToggleIcon()), _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refCoAuthorToggle,
      title: `${this.state.showCoAuthorInput ? 'Remove' : 'Add'} co-authors`,
      showDelay: TOOLTIP_DELAY
    }), _react.default.createElement("button", {
      ref: this.refHardWrapButton.setter,
      onClick: this.toggleHardWrap,
      className: "github-CommitView-hardwrap hard-wrap-icons"
    }, this.renderHardWrapIcon()), _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refHardWrapButton,
      className: "github-CommitView-hardwrap-tooltip",
      title: "Toggle hard wrap on commit",
      showDelay: TOOLTIP_DELAY
    }), _react.default.createElement("button", {
      ref: this.refExpandButton.setter,
      className: "github-CommitView-expandButton icon icon-screen-full",
      onClick: this.toggleExpandedCommitMessageEditor
    }), _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refExpandButton,
      className: "github-CommitView-expandButton-tooltip",
      title: "Expand commit message editor",
      showDelay: TOOLTIP_DELAY
    })), this.renderCoAuthorForm(), this.renderCoAuthorInput(), _react.default.createElement("footer", {
      className: "github-CommitView-bar"
    }, showAbortMergeButton && _react.default.createElement("button", {
      ref: this.refAbortMergeButton.setter,
      className: "btn github-CommitView-button github-CommitView-abortMerge is-secondary",
      onClick: this.abortMerge
    }, "Abort Merge"), _react.default.createElement("button", {
      ref: this.refCommitButton.setter,
      className: "github-CommitView-button github-CommitView-commit btn btn-primary native-key-bindings",
      onClick: this.commit,
      disabled: !this.commitIsEnabled(false)
    }, this.commitButtonText()), this.commitIsEnabled(false) && _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refCommitButton,
      className: "github-CommitView-button-tooltip",
      title: `${modKey}-enter to commit`,
      showDelay: TOOLTIP_DELAY
    }), _react.default.createElement("div", {
      className: `github-CommitView-remaining-characters ${remainingCharsClassName}`
    }, this.getRemainingCharacters())));
  }
  renderCoAuthorToggleIcon() {
    /* eslint-disable max-len */
    const svgPath = 'M9.875 2.125H12v1.75H9.875V6h-1.75V3.875H6v-1.75h2.125V0h1.75v2.125zM6 6.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V6c0-1.316 2-2 2-2s.114-.204 0-.5c-.42-.31-.472-.795-.5-2C1.587.293 2.434 0 3 0s1.413.293 1.5 1.5c-.028 1.205-.08 1.69-.5 2-.114.295 0 .5 0 .5s2 .684 2 2v.5z';
    return _react.default.createElement("svg", {
      className: (0, _classnames.default)('github-CommitView-coAuthorToggleIcon', {
        focused: this.state.showCoAuthorInput
      }),
      viewBox: "0 0 12 7",
      xmlns: "http://www.w3.org/2000/svg"
    }, _react.default.createElement("title", null, "Add or remove co-authors"), _react.default.createElement("path", {
      d: svgPath
    }));
  }
  renderCoAuthorInput() {
    if (!this.state.showCoAuthorInput) {
      return null;
    }
    return _react.default.createElement(_observeModel.default, {
      model: this.props.userStore,
      fetchData: store => store.getUsers()
    }, mentionableUsers => _react.default.createElement(_reactSelect.default, {
      ref: this.refCoAuthorSelect.setter,
      className: "github-CommitView-coAuthorEditor input-textarea native-key-bindings",
      placeholder: "Co-Authors",
      arrowRenderer: null,
      options: mentionableUsers,
      labelKey: "fullName",
      valueKey: "email",
      filterOptions: this.matchAuthors,
      optionRenderer: this.renderCoAuthorListItem,
      valueRenderer: this.renderCoAuthorValue,
      onChange: this.onSelectedCoAuthorsChanged,
      value: this.props.selectedCoAuthors,
      multi: true,
      openOnClick: false,
      openOnFocus: false,
      tabIndex: "5"
    }));
  }
  renderHardWrapIcon() {
    const singleLineMessage = this.props.messageBuffer.getText().split(_helpers.LINE_ENDING_REGEX).length === 1;
    const hardWrap = this.props.config.get('github.automaticCommitMessageWrapping');
    const notApplicable = this.props.deactivateCommitBox || singleLineMessage;

    /* eslint-disable max-len */
    const svgPaths = {
      hardWrapEnabled: {
        path1: 'M7.058 10.2h-.975v2.4L2 9l4.083-3.6v2.4h.97l1.202 1.203L7.058 10.2zm2.525-4.865V4.2h2.334v1.14l-1.164 1.165-1.17-1.17z',
        // eslint-disable-line max-len
        path2: 'M7.842 6.94l2.063 2.063-2.122 2.12.908.91 2.123-2.123 1.98 1.98.85-.848L11.58 8.98l2.12-2.123-.824-.825-2.122 2.12-2.062-2.06z' // eslint-disable-line max-len
      },
      hardWrapDisabled: {
        path1: 'M11.917 8.4c0 .99-.788 1.8-1.75 1.8H6.083v2.4L2 9l4.083-3.6v2.4h3.5V4.2h2.334v4.2z'
      }
    };
    /* eslint-enable max-len */

    if (notApplicable) {
      return null;
    }
    if (hardWrap) {
      return _react.default.createElement("div", {
        className: (0, _classnames.default)('icon', 'hardwrap', 'icon-hardwrap-enabled', {
          hidden: notApplicable || !hardWrap
        })
      }, _react.default.createElement("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg"
      }, _react.default.createElement("path", {
        d: svgPaths.hardWrapDisabled.path1,
        fillRule: "evenodd"
      })));
    } else {
      return _react.default.createElement("div", {
        className: (0, _classnames.default)('icon', 'no-hardwrap', 'icon-hardwrap-disabled', {
          hidden: notApplicable || hardWrap
        })
      }, _react.default.createElement("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg"
      }, _react.default.createElement("g", {
        fillRule: "evenodd"
      }, _react.default.createElement("path", {
        d: svgPaths.hardWrapEnabled.path1
      }), _react.default.createElement("path", {
        fillRule: "nonzero",
        d: svgPaths.hardWrapEnabled.path2
      }))));
    }
  }
  renderCoAuthorForm() {
    if (!this.state.showCoAuthorForm) {
      return null;
    }
    return _react.default.createElement(_coAuthorForm.default, {
      ref: this.refCoAuthorForm.setter,
      commands: this.props.commands,
      onSubmit: this.submitNewCoAuthor,
      onCancel: this.cancelNewCoAuthor,
      name: this.state.coAuthorInput
    });
  }
  submitNewCoAuthor(newAuthor) {
    this.props.updateSelectedCoAuthors(this.props.selectedCoAuthors, newAuthor);
    this.hideNewAuthorForm();
  }
  cancelNewCoAuthor() {
    this.hideNewAuthorForm();
  }
  hideNewAuthorForm() {
    this.setState({
      showCoAuthorForm: false
    }, () => {
      this.refCoAuthorSelect.map(c => c.focus());
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.scheduleShowWorking(nextProps);
  }
  componentWillUnmount() {
    this.subs.dispose();
  }
  didMoveCursor() {
    this.forceUpdate();
  }
  toggleHardWrap() {
    const currentSetting = this.props.config.get('github.automaticCommitMessageWrapping');
    this.props.config.set('github.automaticCommitMessageWrapping', !currentSetting);
  }
  toggleCoAuthorInput() {
    this.setState({
      showCoAuthorInput: !this.state.showCoAuthorInput
    }, () => {
      if (this.state.showCoAuthorInput) {
        (0, _reporterProxy.incrementCounter)('show-co-author-input');
        this.refCoAuthorSelect.map(c => c.focus());
      } else {
        // if input is closed, remove all co-authors
        this.props.updateSelectedCoAuthors([]);
        (0, _reporterProxy.incrementCounter)('hide-co-author-input');
      }
    });
  }
  excludeCoAuthor() {
    const author = this.refCoAuthorSelect.map(c => c.getFocusedOption()).getOr(null);
    if (!author || author.isNew()) {
      return;
    }
    let excluded = this.props.config.get('github.excludedUsers');
    if (excluded && excluded !== '') {
      excluded += ', ';
    }
    excluded += author.getEmail();
    this.props.config.set('github.excludedUsers', excluded);
  }
  abortMerge() {
    this.props.abortMerge();
  }
  async commit(event, amend) {
    if ((await this.props.prepareToCommit()) && this.commitIsEnabled(amend)) {
      try {
        await this.props.commit(this.props.messageBuffer.getText(), this.props.selectedCoAuthors, amend);
      } catch (e) {
        // do nothing - error was taken care of in pipeline manager
        if (!atom.isReleasedVersion()) {
          throw e;
        }
      }
    } else {
      this.setFocus(CommitView.focus.EDITOR);
    }
  }
  amendLastCommit() {
    (0, _reporterProxy.incrementCounter)('amend');
    this.commit(null, true);
  }
  getRemainingCharacters() {
    return this.refEditorModel.map(editor => {
      if (editor.getCursorBufferPosition().row === 0) {
        return (this.props.maximumCharacterLimit - editor.lineTextForBufferRow(0).length).toString();
      } else {
        return '∞';
      }
    }).getOr(this.props.maximumCharacterLimit || '');
  }

  // We don't want the user to see the UI flicker in the case
  // the commit takes a very small time to complete. Instead we
  // will only show the working message if we are working for longer
  // than 1 second as per https://www.nngroup.com/articles/response-times-3-important-limits/
  //
  // The closure is created to restrict variable access
  scheduleShowWorking(props) {
    if (props.isCommitting) {
      if (!this.state.showWorking && this.timeoutHandle === null) {
        this.timeoutHandle = setTimeout(() => {
          this.timeoutHandle = null;
          this.setState({
            showWorking: true
          });
        }, 1000);
      }
    } else {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
      this.setState({
        showWorking: false
      });
    }
  }
  isValidMessage() {
    // ensure that there are at least some non-comment lines in the commit message.
    // Commented lines are stripped out of commit messages by git, by default configuration.
    return this.props.messageBuffer.getText().replace(/^#.*$/gm, '').trim().length !== 0;
  }
  commitIsEnabled(amend) {
    return !this.props.isCommitting && (amend || this.props.stagedChangesExist) && !this.props.mergeConflictsExist && this.props.lastCommit.isPresent() && (this.props.deactivateCommitBox || amend || this.isValidMessage());
  }
  commitButtonText() {
    if (this.state.showWorking) {
      return 'Working...';
    } else if (this.props.currentBranch.isDetached()) {
      return 'Create detached commit';
    } else if (this.props.currentBranch.isPresent()) {
      return `Commit to ${this.props.currentBranch.getName()}`;
    } else {
      return 'Commit';
    }
  }
  toggleExpandedCommitMessageEditor() {
    return this.props.toggleExpandedCommitMessageEditor(this.props.messageBuffer.getText());
  }
  matchAuthors(authors, filterText, selectedAuthors) {
    const matchedAuthors = authors.filter((author, index) => {
      const isAlreadySelected = selectedAuthors && selectedAuthors.find(selected => selected.matches(author));
      const matchesFilter = [author.getLogin(), author.getFullName(), author.getEmail()].some(field => field && field.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
      return !isAlreadySelected && matchesFilter;
    });
    matchedAuthors.push(_author.default.createNew('Add new author', filterText));
    return matchedAuthors;
  }
  renderCoAuthorListItemField(fieldName, value) {
    if (!value || value.length === 0) {
      return null;
    }
    return _react.default.createElement("span", {
      className: `github-CommitView-coAuthorEditor-${fieldName}`
    }, value);
  }
  renderCoAuthorListItem(author) {
    return _react.default.createElement("div", {
      className: (0, _classnames.default)('github-CommitView-coAuthorEditor-selectListItem', {
        'new-author': author.isNew()
      })
    }, this.renderCoAuthorListItemField('name', author.getFullName()), author.hasLogin() && this.renderCoAuthorListItemField('login', '@' + author.getLogin()), this.renderCoAuthorListItemField('email', author.getEmail()));
  }
  renderCoAuthorValue(author) {
    const fullName = author.getFullName();
    if (fullName && fullName.length > 0) {
      return _react.default.createElement("span", null, author.getFullName());
    }
    if (author.hasLogin()) {
      return _react.default.createElement("span", null, "@", author.getLogin());
    }
    return _react.default.createElement("span", null, author.getEmail());
  }
  onSelectedCoAuthorsChanged(selectedCoAuthors) {
    (0, _reporterProxy.incrementCounter)('selected-co-authors-changed');
    const newAuthor = selectedCoAuthors.find(author => author.isNew());
    if (newAuthor) {
      this.setState({
        coAuthorInput: newAuthor.getFullName(),
        showCoAuthorForm: true
      });
    } else {
      this.props.updateSelectedCoAuthors(selectedCoAuthors);
    }
  }
  hasFocus() {
    return this.refRoot.map(element => element.contains(document.activeElement)).getOr(false);
  }
  getFocus(element) {
    if (this.refCommitPreviewButton.map(button => button.contains(element)).getOr(false)) {
      return CommitView.focus.COMMIT_PREVIEW_BUTTON;
    }
    if (this.refEditorComponent.map(editor => editor.contains(element)).getOr(false)) {
      return CommitView.focus.EDITOR;
    }
    if (this.refAbortMergeButton.map(e => e.contains(element)).getOr(false)) {
      return CommitView.focus.ABORT_MERGE_BUTTON;
    }
    if (this.refCommitButton.map(e => e.contains(element)).getOr(false)) {
      return CommitView.focus.COMMIT_BUTTON;
    }
    if (this.refCoAuthorSelect.map(c => c.wrapper && c.wrapper.contains(element)).getOr(false)) {
      return CommitView.focus.COAUTHOR_INPUT;
    }
    return null;
  }
  setFocus(focus) {
    let fallback = false;
    const focusElement = element => {
      element.focus();
      return true;
    };
    if (focus === CommitView.focus.COMMIT_PREVIEW_BUTTON) {
      if (this.refCommitPreviewButton.map(focusElement).getOr(false)) {
        return true;
      }
    }
    if (focus === CommitView.focus.EDITOR) {
      if (this.refEditorComponent.map(focusElement).getOr(false)) {
        if (this.props.messageBuffer.getText().length > 0 && !this.isValidMessage()) {
          // there is likely a commit message template present
          // we want the cursor to be at the beginning, not at the and of the template
          this.refEditorComponent.get().getModel().setCursorBufferPosition([0, 0]);
        }
        return true;
      }
    }
    if (focus === CommitView.focus.ABORT_MERGE_BUTTON) {
      if (this.refAbortMergeButton.map(focusElement).getOr(false)) {
        return true;
      }
      fallback = true;
    }
    if (focus === CommitView.focus.COMMIT_BUTTON) {
      if (this.refCommitButton.map(focusElement).getOr(false)) {
        return true;
      }
      fallback = true;
    }
    if (focus === CommitView.focus.COAUTHOR_INPUT) {
      if (this.refCoAuthorSelect.map(focusElement).getOr(false)) {
        return true;
      }
      fallback = true;
    }
    if (focus === CommitView.lastFocus) {
      if (this.commitIsEnabled(false)) {
        return this.setFocus(CommitView.focus.COMMIT_BUTTON);
      } else if (this.props.isMerging) {
        return this.setFocus(CommitView.focus.ABORT_MERGE_BUTTON);
      } else if (this.state.showCoAuthorInput) {
        return this.setFocus(CommitView.focus.COAUTHOR_INPUT);
      } else {
        return this.setFocus(CommitView.focus.EDITOR);
      }
    }
    if (fallback && this.refEditorComponent.map(focusElement).getOr(false)) {
      return true;
    }
    return false;
  }
  advanceFocusFrom(focus) {
    const f = this.constructor.focus;
    let next = null;
    switch (focus) {
      case f.COMMIT_PREVIEW_BUTTON:
        next = f.EDITOR;
        break;
      case f.EDITOR:
        if (this.state.showCoAuthorInput) {
          next = f.COAUTHOR_INPUT;
        } else if (this.props.isMerging) {
          next = f.ABORT_MERGE_BUTTON;
        } else if (this.commitIsEnabled(false)) {
          next = f.COMMIT_BUTTON;
        } else {
          next = _recentCommitsView.default.firstFocus;
        }
        break;
      case f.COAUTHOR_INPUT:
        if (this.props.isMerging) {
          next = f.ABORT_MERGE_BUTTON;
        } else if (this.commitIsEnabled(false)) {
          next = f.COMMIT_BUTTON;
        } else {
          next = _recentCommitsView.default.firstFocus;
        }
        break;
      case f.ABORT_MERGE_BUTTON:
        next = this.commitIsEnabled(false) ? f.COMMIT_BUTTON : _recentCommitsView.default.firstFocus;
        break;
      case f.COMMIT_BUTTON:
        next = _recentCommitsView.default.firstFocus;
        break;
    }
    return Promise.resolve(next);
  }
  retreatFocusFrom(focus) {
    const f = this.constructor.focus;
    let previous = null;
    switch (focus) {
      case f.COMMIT_BUTTON:
        if (this.props.isMerging) {
          previous = f.ABORT_MERGE_BUTTON;
        } else if (this.state.showCoAuthorInput) {
          previous = f.COAUTHOR_INPUT;
        } else {
          previous = f.EDITOR;
        }
        break;
      case f.ABORT_MERGE_BUTTON:
        previous = this.state.showCoAuthorInput ? f.COAUTHOR_INPUT : f.EDITOR;
        break;
      case f.COAUTHOR_INPUT:
        previous = f.EDITOR;
        break;
      case f.EDITOR:
        previous = f.COMMIT_PREVIEW_BUTTON;
        break;
      case f.COMMIT_PREVIEW_BUTTON:
        previous = _stagingView.default.lastFocus;
        break;
    }
    return Promise.resolve(previous);
  }
}
exports.default = CommitView;
_defineProperty(CommitView, "focus", {
  COMMIT_PREVIEW_BUTTON: Symbol('commit-preview-button'),
  EDITOR: Symbol('commit-editor'),
  COAUTHOR_INPUT: Symbol('coauthor-input'),
  ABORT_MERGE_BUTTON: Symbol('commit-abort-merge-button'),
  COMMIT_BUTTON: Symbol('commit-button')
});
_defineProperty(CommitView, "firstFocus", CommitView.focus.COMMIT_PREVIEW_BUTTON);
_defineProperty(CommitView, "lastFocus", Symbol('last-focus'));
_defineProperty(CommitView, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  lastCommit: _propTypes.default.object.isRequired,
  currentBranch: _propTypes.default.object.isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  mergeConflictsExist: _propTypes.default.bool.isRequired,
  stagedChangesExist: _propTypes.default.bool.isRequired,
  isCommitting: _propTypes.default.bool.isRequired,
  commitPreviewActive: _propTypes.default.bool.isRequired,
  deactivateCommitBox: _propTypes.default.bool.isRequired,
  maximumCharacterLimit: _propTypes.default.number.isRequired,
  messageBuffer: _propTypes.default.object.isRequired,
  // FIXME more specific proptype
  userStore: _propTypes2.UserStorePropType.isRequired,
  selectedCoAuthors: _propTypes.default.arrayOf(_propTypes2.AuthorPropType),
  updateSelectedCoAuthors: _propTypes.default.func,
  commit: _propTypes.default.func.isRequired,
  abortMerge: _propTypes.default.func.isRequired,
  prepareToCommit: _propTypes.default.func.isRequired,
  toggleExpandedCommitMessageEditor: _propTypes.default.func.isRequired,
  toggleCommitPreview: _propTypes.default.func.isRequired,
  activateCommitPreview: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfZXZlbnRLaXQiLCJfY2xhc3NuYW1lcyIsIl9yZWFjdFNlbGVjdCIsIl90b29sdGlwIiwiX2F0b21UZXh0RWRpdG9yIiwiX2NvQXV0aG9yRm9ybSIsIl9yZWNlbnRDb21taXRzVmlldyIsIl9zdGFnaW5nVmlldyIsIl9jb21tYW5kcyIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX3JlZkhvbGRlciIsIl9hdXRob3IiLCJfb2JzZXJ2ZU1vZGVsIiwiX2hlbHBlcnMiLCJfcHJvcFR5cGVzMiIsIl9yZXBvcnRlclByb3h5IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib2JqIiwiX2RlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiVE9PTFRJUF9ERUxBWSIsIkZha2VLZXlEb3duRXZlbnQiLCJDb21taXRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY29udGV4dCIsImF1dG9iaW5kIiwic3RhdGUiLCJzaG93V29ya2luZyIsInNob3dDb0F1dGhvcklucHV0Iiwic2hvd0NvQXV0aG9yRm9ybSIsImNvQXV0aG9ySW5wdXQiLCJ0aW1lb3V0SGFuZGxlIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwicmVmQ29tbWl0UHJldmlld0J1dHRvbiIsInJlZkV4cGFuZEJ1dHRvbiIsInJlZkNvbW1pdEJ1dHRvbiIsInJlZkhhcmRXcmFwQnV0dG9uIiwicmVmQWJvcnRNZXJnZUJ1dHRvbiIsInJlZkNvQXV0aG9yVG9nZ2xlIiwicmVmQ29BdXRob3JTZWxlY3QiLCJyZWZDb0F1dGhvckZvcm0iLCJyZWZFZGl0b3JDb21wb25lbnQiLCJyZWZFZGl0b3JNb2RlbCIsInN1YnMiLCJwcm94eUtleUNvZGUiLCJrZXlDb2RlIiwiaXNFbXB0eSIsIkN1c3RvbUV2ZW50Iiwia0NvZGUiLCJmYWtlRXZlbnQiLCJoYW5kbGVLZXlEb3duIiwiZGVmYXVsdFByZXZlbnRlZCIsImFib3J0S2V5QmluZGluZyIsIlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQiLCJzY2hlZHVsZVNob3dXb3JraW5nIiwiYWRkIiwiY29uZmlnIiwib25EaWRDaGFuZ2UiLCJmb3JjZVVwZGF0ZSIsIm1lc3NhZ2VCdWZmZXIiLCJyZW5kZXIiLCJyZW1haW5pbmdDaGFyc0NsYXNzTmFtZSIsInJlbWFpbmluZ0NoYXJhY3RlcnMiLCJwYXJzZUludCIsImdldFJlbWFpbmluZ0NoYXJhY3RlcnMiLCJtYXhpbXVtQ2hhcmFjdGVyTGltaXQiLCJzaG93QWJvcnRNZXJnZUJ1dHRvbiIsImlzTWVyZ2luZyIsIm1vZEtleSIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyZWYiLCJzZXR0ZXIiLCJyZWdpc3RyeSIsImNvbW1hbmRzIiwidGFyZ2V0IiwiQ29tbWFuZCIsImNvbW1hbmQiLCJjYWxsYmFjayIsImNvbW1pdCIsImFtZW5kTGFzdENvbW1pdCIsInRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvciIsImV4Y2x1ZGVDb0F1dGhvciIsImFjdGl2YXRlQ29tbWl0UHJldmlldyIsImRpc2FibGVkIiwic3RhZ2VkQ2hhbmdlc0V4aXN0Iiwib25DbGljayIsInRvZ2dsZUNvbW1pdFByZXZpZXciLCJjb21taXRQcmV2aWV3QWN0aXZlIiwiY3giLCJkZWFjdGl2YXRlQ29tbWl0Qm94IiwicmVmTW9kZWwiLCJzb2Z0V3JhcHBlZCIsInBsYWNlaG9sZGVyVGV4dCIsImxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlIiwic2hvd0ludmlzaWJsZXMiLCJhdXRvSGVpZ2h0Iiwic2Nyb2xsUGFzdEVuZCIsImJ1ZmZlciIsIndvcmtzcGFjZSIsImRpZENoYW5nZUN1cnNvclBvc2l0aW9uIiwiZGlkTW92ZUN1cnNvciIsImZvY3VzZWQiLCJ0b2dnbGVDb0F1dGhvcklucHV0IiwicmVuZGVyQ29BdXRob3JUb2dnbGVJY29uIiwibWFuYWdlciIsInRvb2x0aXBzIiwidGl0bGUiLCJzaG93RGVsYXkiLCJ0b2dnbGVIYXJkV3JhcCIsInJlbmRlckhhcmRXcmFwSWNvbiIsInJlbmRlckNvQXV0aG9yRm9ybSIsInJlbmRlckNvQXV0aG9ySW5wdXQiLCJhYm9ydE1lcmdlIiwiY29tbWl0SXNFbmFibGVkIiwiY29tbWl0QnV0dG9uVGV4dCIsInN2Z1BhdGgiLCJ2aWV3Qm94IiwieG1sbnMiLCJkIiwibW9kZWwiLCJ1c2VyU3RvcmUiLCJmZXRjaERhdGEiLCJzdG9yZSIsImdldFVzZXJzIiwibWVudGlvbmFibGVVc2VycyIsInBsYWNlaG9sZGVyIiwiYXJyb3dSZW5kZXJlciIsIm9wdGlvbnMiLCJsYWJlbEtleSIsInZhbHVlS2V5IiwiZmlsdGVyT3B0aW9ucyIsIm1hdGNoQXV0aG9ycyIsIm9wdGlvblJlbmRlcmVyIiwicmVuZGVyQ29BdXRob3JMaXN0SXRlbSIsInZhbHVlUmVuZGVyZXIiLCJyZW5kZXJDb0F1dGhvclZhbHVlIiwib25DaGFuZ2UiLCJvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZCIsInNlbGVjdGVkQ29BdXRob3JzIiwibXVsdGkiLCJvcGVuT25DbGljayIsIm9wZW5PbkZvY3VzIiwidGFiSW5kZXgiLCJzaW5nbGVMaW5lTWVzc2FnZSIsImdldFRleHQiLCJzcGxpdCIsIkxJTkVfRU5ESU5HX1JFR0VYIiwibGVuZ3RoIiwiaGFyZFdyYXAiLCJub3RBcHBsaWNhYmxlIiwic3ZnUGF0aHMiLCJoYXJkV3JhcEVuYWJsZWQiLCJwYXRoMSIsInBhdGgyIiwiaGFyZFdyYXBEaXNhYmxlZCIsImhpZGRlbiIsIndpZHRoIiwiaGVpZ2h0IiwiZmlsbFJ1bGUiLCJvblN1Ym1pdCIsInN1Ym1pdE5ld0NvQXV0aG9yIiwib25DYW5jZWwiLCJjYW5jZWxOZXdDb0F1dGhvciIsIm5hbWUiLCJuZXdBdXRob3IiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsImhpZGVOZXdBdXRob3JGb3JtIiwic2V0U3RhdGUiLCJtYXAiLCJjIiwiZm9jdXMiLCJVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImN1cnJlbnRTZXR0aW5nIiwiaW5jcmVtZW50Q291bnRlciIsImF1dGhvciIsImdldEZvY3VzZWRPcHRpb24iLCJnZXRPciIsImlzTmV3IiwiZXhjbHVkZWQiLCJnZXRFbWFpbCIsImV2ZW50IiwiYW1lbmQiLCJwcmVwYXJlVG9Db21taXQiLCJhdG9tIiwiaXNSZWxlYXNlZFZlcnNpb24iLCJzZXRGb2N1cyIsIkVESVRPUiIsImVkaXRvciIsImdldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwicm93IiwibGluZVRleHRGb3JCdWZmZXJSb3ciLCJ0b1N0cmluZyIsImlzQ29tbWl0dGluZyIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJpc1ZhbGlkTWVzc2FnZSIsInJlcGxhY2UiLCJ0cmltIiwibWVyZ2VDb25mbGljdHNFeGlzdCIsImxhc3RDb21taXQiLCJpc1ByZXNlbnQiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsImdldE5hbWUiLCJhdXRob3JzIiwiZmlsdGVyVGV4dCIsInNlbGVjdGVkQXV0aG9ycyIsIm1hdGNoZWRBdXRob3JzIiwiZmlsdGVyIiwiaW5kZXgiLCJpc0FscmVhZHlTZWxlY3RlZCIsImZpbmQiLCJzZWxlY3RlZCIsIm1hdGNoZXMiLCJtYXRjaGVzRmlsdGVyIiwiZ2V0TG9naW4iLCJnZXRGdWxsTmFtZSIsInNvbWUiLCJmaWVsZCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsInB1c2giLCJBdXRob3IiLCJjcmVhdGVOZXciLCJyZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQiLCJmaWVsZE5hbWUiLCJoYXNMb2dpbiIsImZ1bGxOYW1lIiwiaGFzRm9jdXMiLCJlbGVtZW50IiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJnZXRGb2N1cyIsImJ1dHRvbiIsIkNPTU1JVF9QUkVWSUVXX0JVVFRPTiIsIkFCT1JUX01FUkdFX0JVVFRPTiIsIkNPTU1JVF9CVVRUT04iLCJ3cmFwcGVyIiwiQ09BVVRIT1JfSU5QVVQiLCJmYWxsYmFjayIsImZvY3VzRWxlbWVudCIsImdldE1vZGVsIiwic2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJsYXN0Rm9jdXMiLCJhZHZhbmNlRm9jdXNGcm9tIiwiZiIsIm5leHQiLCJSZWNlbnRDb21taXRzVmlldyIsImZpcnN0Rm9jdXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJldHJlYXRGb2N1c0Zyb20iLCJwcmV2aW91cyIsIlN0YWdpbmdWaWV3IiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwibnVtYmVyIiwiVXNlclN0b3JlUHJvcFR5cGUiLCJhcnJheU9mIiwiQXV0aG9yUHJvcFR5cGUiLCJmdW5jIl0sInNvdXJjZXMiOlsiY29tbWl0LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgU2VsZWN0IGZyb20gJ3JlYWN0LXNlbGVjdCc7XG5cbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCBDb0F1dGhvckZvcm0gZnJvbSAnLi9jby1hdXRob3ItZm9ybSc7XG5pbXBvcnQgUmVjZW50Q29tbWl0c1ZpZXcgZnJvbSAnLi9yZWNlbnQtY29tbWl0cy12aWV3JztcbmltcG9ydCBTdGFnaW5nVmlldyBmcm9tICcuL3N0YWdpbmctdmlldyc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuLi9tb2RlbHMvYXV0aG9yJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCB7TElORV9FTkRJTkdfUkVHRVgsIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7QXV0aG9yUHJvcFR5cGUsIFVzZXJTdG9yZVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7aW5jcmVtZW50Q291bnRlcn0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBUT09MVElQX0RFTEFZID0gMjAwO1xuXG4vLyBDdXN0b21FdmVudCBpcyBhIERPTSBwcmltaXRpdmUsIHdoaWNoIHY4IGNhbid0IGFjY2Vzc1xuLy8gc28gd2UncmUgZXNzZW50aWFsbHkgbGF6eSBsb2FkaW5nIHRvIGtlZXAgc25hcHNob3R0aW5nIGZyb20gYnJlYWtpbmcuXG5sZXQgRmFrZUtleURvd25FdmVudDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBmb2N1cyA9IHtcbiAgICBDT01NSVRfUFJFVklFV19CVVRUT046IFN5bWJvbCgnY29tbWl0LXByZXZpZXctYnV0dG9uJyksXG4gICAgRURJVE9SOiBTeW1ib2woJ2NvbW1pdC1lZGl0b3InKSxcbiAgICBDT0FVVEhPUl9JTlBVVDogU3ltYm9sKCdjb2F1dGhvci1pbnB1dCcpLFxuICAgIEFCT1JUX01FUkdFX0JVVFRPTjogU3ltYm9sKCdjb21taXQtYWJvcnQtbWVyZ2UtYnV0dG9uJyksXG4gICAgQ09NTUlUX0JVVFRPTjogU3ltYm9sKCdjb21taXQtYnV0dG9uJyksXG4gIH07XG5cbiAgc3RhdGljIGZpcnN0Rm9jdXMgPSBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjtcblxuICBzdGF0aWMgbGFzdEZvY3VzID0gU3ltYm9sKCdsYXN0LWZvY3VzJyk7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBsYXN0Q29tbWl0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzTWVyZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBtZXJnZUNvbmZsaWN0c0V4aXN0OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHN0YWdlZENoYW5nZXNFeGlzdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0NvbW1pdHRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWl0UHJldmlld0FjdGl2ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBkZWFjdGl2YXRlQ29tbWl0Qm94OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG1heGltdW1DaGFyYWN0ZXJMaW1pdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG1lc3NhZ2VCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCwgLy8gRklYTUUgbW9yZSBzcGVjaWZpYyBwcm9wdHlwZVxuICAgIHVzZXJTdG9yZTogVXNlclN0b3JlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmFycmF5T2YoQXV0aG9yUHJvcFR5cGUpLFxuICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBjb21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYWJvcnRNZXJnZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwcmVwYXJlVG9Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHRvZ2dsZUNvbW1pdFByZXZpZXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYWN0aXZhdGVDb21taXRQcmV2aWV3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdzdWJtaXROZXdDb0F1dGhvcicsICdjYW5jZWxOZXdDb0F1dGhvcicsICdkaWRNb3ZlQ3Vyc29yJywgJ3RvZ2dsZUhhcmRXcmFwJyxcbiAgICAgICd0b2dnbGVDb0F1dGhvcklucHV0JywgJ2Fib3J0TWVyZ2UnLCAnY29tbWl0JywgJ2FtZW5kTGFzdENvbW1pdCcsICd0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3InLFxuICAgICAgJ3JlbmRlckNvQXV0aG9yTGlzdEl0ZW0nLCAnb25TZWxlY3RlZENvQXV0aG9yc0NoYW5nZWQnLCAnZXhjbHVkZUNvQXV0aG9yJyxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNob3dXb3JraW5nOiBmYWxzZSxcbiAgICAgIHNob3dDb0F1dGhvcklucHV0OiBmYWxzZSxcbiAgICAgIHNob3dDb0F1dGhvckZvcm06IGZhbHNlLFxuICAgICAgY29BdXRob3JJbnB1dDogJycsXG4gICAgfTtcblxuICAgIHRoaXMudGltZW91dEhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFeHBhbmRCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb21taXRCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZIYXJkV3JhcEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkFib3J0TWVyZ2VCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb0F1dGhvclRvZ2dsZSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29BdXRob3JGb3JtID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yQ29tcG9uZW50ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yTW9kZWwgPSBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgcHJveHlLZXlDb2RlKGtleUNvZGUpIHtcbiAgICByZXR1cm4gZSA9PiB7XG4gICAgICBpZiAodGhpcy5yZWZDb0F1dGhvclNlbGVjdC5pc0VtcHR5KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIUZha2VLZXlEb3duRXZlbnQpIHtcbiAgICAgICAgRmFrZUtleURvd25FdmVudCA9IGNsYXNzIGV4dGVuZHMgQ3VzdG9tRXZlbnQge1xuICAgICAgICAgIGNvbnN0cnVjdG9yKGtDb2RlKSB7XG4gICAgICAgICAgICBzdXBlcigna2V5ZG93bicpO1xuICAgICAgICAgICAgdGhpcy5rZXlDb2RlID0ga0NvZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmYWtlRXZlbnQgPSBuZXcgRmFrZUtleURvd25FdmVudChrZXlDb2RlKTtcbiAgICAgIHRoaXMucmVmQ29BdXRob3JTZWxlY3QuZ2V0KCkuaGFuZGxlS2V5RG93bihmYWtlRXZlbnQpO1xuXG4gICAgICBpZiAoIWZha2VFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcbiAgVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnNjaGVkdWxlU2hvd1dvcmtpbmcodGhpcy5wcm9wcyk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy5jb25maWcub25EaWRDaGFuZ2UoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnLCAoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICAgdGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLm9uRGlkQ2hhbmdlKCgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSksXG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgcmVtYWluaW5nQ2hhcnNDbGFzc05hbWUgPSAnJztcbiAgICBjb25zdCByZW1haW5pbmdDaGFyYWN0ZXJzID0gcGFyc2VJbnQodGhpcy5nZXRSZW1haW5pbmdDaGFyYWN0ZXJzKCksIDEwKTtcbiAgICBpZiAocmVtYWluaW5nQ2hhcmFjdGVycyA8IDApIHtcbiAgICAgIHJlbWFpbmluZ0NoYXJzQ2xhc3NOYW1lID0gJ2lzLWVycm9yJztcbiAgICB9IGVsc2UgaWYgKHJlbWFpbmluZ0NoYXJhY3RlcnMgPCB0aGlzLnByb3BzLm1heGltdW1DaGFyYWN0ZXJMaW1pdCAvIDQpIHtcbiAgICAgIHJlbWFpbmluZ0NoYXJzQ2xhc3NOYW1lID0gJ2lzLXdhcm5pbmcnO1xuICAgIH1cblxuICAgIGNvbnN0IHNob3dBYm9ydE1lcmdlQnV0dG9uID0gdGhpcy5wcm9wcy5pc01lcmdpbmcgfHwgbnVsbDtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgY29uc3QgbW9kS2V5ID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyAnQ21kJyA6ICdDdHJsJztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3XCIgcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y29tbWl0XCIgY2FsbGJhY2s9e3RoaXMuY29tbWl0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6YW1lbmQtbGFzdC1jb21taXRcIiBjYWxsYmFjaz17dGhpcy5hbWVuZExhc3RDb21taXR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZXhwYW5kZWQtY29tbWl0LW1lc3NhZ2UtZWRpdG9yXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLnRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvclwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoNDApfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXVwXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM4KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1lbnRlclwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgxMyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtdGFiXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDkpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWJhY2tzcGFjZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg4KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1wYWdldXBcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzMpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXBhZ2Vkb3duXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM0KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1lbmRcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWhvbWVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzYpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWRlbGV0ZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg0Nil9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZXNjYXBlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDI3KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNvLWF1dGhvci1leGNsdWRlXCIgY2FsbGJhY2s9e3RoaXMuZXhjbHVkZUNvQXV0aG9yfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItQ29tbWl0Vmlldy1jb21taXRQcmV2aWV3XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXZlXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuYWN0aXZhdGVDb21taXRQcmV2aWV3fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWJ1dHRvbldyYXBwZXJcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1jb21taXRQcmV2aWV3IGdpdGh1Yi1Db21taXRWaWV3LWJ1dHRvbiBidG5cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF0aGlzLnByb3BzLnN0YWdlZENoYW5nZXNFeGlzdH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlQ29tbWl0UHJldmlld30+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jb21taXRQcmV2aWV3QWN0aXZlID8gJ0hpZGUgQWxsIFN0YWdlZCBDaGFuZ2VzJyA6ICdTZWUgQWxsIFN0YWdlZCBDaGFuZ2VzJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctZWRpdG9yJywgeydpcy1leHBhbmRlZCc6IHRoaXMucHJvcHMuZGVhY3RpdmF0ZUNvbW1pdEJveH0pfT5cbiAgICAgICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZFZGl0b3JDb21wb25lbnQuc2V0dGVyfVxuICAgICAgICAgICAgcmVmTW9kZWw9e3RoaXMucmVmRWRpdG9yTW9kZWx9XG4gICAgICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dD1cIkNvbW1pdCBtZXNzYWdlXCJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgICAgIHNob3dJbnZpc2libGVzPXtmYWxzZX1cbiAgICAgICAgICAgIGF1dG9IZWlnaHQ9e2ZhbHNlfVxuICAgICAgICAgICAgc2Nyb2xsUGFzdEVuZD17ZmFsc2V9XG4gICAgICAgICAgICBidWZmZXI9e3RoaXMucHJvcHMubWVzc2FnZUJ1ZmZlcn1cbiAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICBkaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbj17dGhpcy5kaWRNb3ZlQ3Vyc29yfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvQXV0aG9yVG9nZ2xlLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yVG9nZ2xlJywge2ZvY3VzZWQ6IHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXR9KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlQ29BdXRob3JJbnB1dH0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvclRvZ2dsZUljb24oKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZDb0F1dGhvclRvZ2dsZX1cbiAgICAgICAgICAgIHRpdGxlPXtgJHt0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0ID8gJ1JlbW92ZScgOiAnQWRkJ30gY28tYXV0aG9yc2B9XG4gICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmSGFyZFdyYXBCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVIYXJkV3JhcH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWhhcmR3cmFwIGhhcmQtd3JhcC1pY29uc1wiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVySGFyZFdyYXBJY29uKCl9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmSGFyZFdyYXBCdXR0b259XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1oYXJkd3JhcC10b29sdGlwXCJcbiAgICAgICAgICAgIHRpdGxlPVwiVG9nZ2xlIGhhcmQgd3JhcCBvbiBjb21taXRcIlxuICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkV4cGFuZEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1leHBhbmRCdXR0b24gaWNvbiBpY29uLXNjcmVlbi1mdWxsXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmRXhwYW5kQnV0dG9ufVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctZXhwYW5kQnV0dG9uLXRvb2x0aXBcIlxuICAgICAgICAgICAgdGl0bGU9XCJFeHBhbmQgY29tbWl0IG1lc3NhZ2UgZWRpdG9yXCJcbiAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvckZvcm0oKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JJbnB1dCgpfVxuXG4gICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYmFyXCI+XG4gICAgICAgICAge3Nob3dBYm9ydE1lcmdlQnV0dG9uICYmXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHJlZj17dGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdpdGh1Yi1Db21taXRWaWV3LWJ1dHRvbiBnaXRodWItQ29tbWl0Vmlldy1hYm9ydE1lcmdlIGlzLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuYWJvcnRNZXJnZX0+QWJvcnQgTWVyZ2U8L2J1dHRvbj5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmQ29tbWl0QnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWJ1dHRvbiBnaXRodWItQ29tbWl0Vmlldy1jb21taXQgYnRuIGJ0bi1wcmltYXJ5IG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jb21taXR9XG4gICAgICAgICAgICBkaXNhYmxlZD17IXRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKX0+e3RoaXMuY29tbWl0QnV0dG9uVGV4dCgpfTwvYnV0dG9uPlxuICAgICAgICAgIHt0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkgJiZcbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZDb21taXRCdXR0b259XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWJ1dHRvbi10b29sdGlwXCJcbiAgICAgICAgICAgICAgdGl0bGU9e2Ake21vZEtleX0tZW50ZXIgdG8gY29tbWl0YH1cbiAgICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgICAgLz59XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItQ29tbWl0Vmlldy1yZW1haW5pbmctY2hhcmFjdGVycyAke3JlbWFpbmluZ0NoYXJzQ2xhc3NOYW1lfWB9PlxuICAgICAgICAgICAge3RoaXMuZ2V0UmVtYWluaW5nQ2hhcmFjdGVycygpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvclRvZ2dsZUljb24oKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGNvbnN0IHN2Z1BhdGggPSAnTTkuODc1IDIuMTI1SDEydjEuNzVIOS44NzVWNmgtMS43NVYzLjg3NUg2di0xLjc1aDIuMTI1VjBoMS43NXYyLjEyNXpNNiA2LjVhLjUuNSAwIDAgMS0uNS41aC01YS41LjUgMCAwIDEtLjUtLjVWNmMwLTEuMzE2IDItMiAyLTJzLjExNC0uMjA0IDAtLjVjLS40Mi0uMzEtLjQ3Mi0uNzk1LS41LTJDMS41ODcuMjkzIDIuNDM0IDAgMyAwczEuNDEzLjI5MyAxLjUgMS41Yy0uMDI4IDEuMjA1LS4wOCAxLjY5LS41IDItLjExNC4yOTUgMCAuNSAwIC41czIgLjY4NCAyIDJ2LjV6JztcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvclRvZ2dsZUljb24nLCB7Zm9jdXNlZDogdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dH0pfSB2aWV3Qm94PVwiMCAwIDEyIDdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDx0aXRsZT5BZGQgb3IgcmVtb3ZlIGNvLWF1dGhvcnM8L3RpdGxlPlxuICAgICAgICA8cGF0aCBkPXtzdmdQYXRofSAvPlxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9ySW5wdXQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy51c2VyU3RvcmV9IGZldGNoRGF0YT17c3RvcmUgPT4gc3RvcmUuZ2V0VXNlcnMoKX0+XG4gICAgICAgIHttZW50aW9uYWJsZVVzZXJzID0+IChcbiAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICByZWY9e3RoaXMucmVmQ29BdXRob3JTZWxlY3Quc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3IgaW5wdXQtdGV4dGFyZWEgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkNvLUF1dGhvcnNcIlxuICAgICAgICAgICAgYXJyb3dSZW5kZXJlcj17bnVsbH1cbiAgICAgICAgICAgIG9wdGlvbnM9e21lbnRpb25hYmxlVXNlcnN9XG4gICAgICAgICAgICBsYWJlbEtleT1cImZ1bGxOYW1lXCJcbiAgICAgICAgICAgIHZhbHVlS2V5PVwiZW1haWxcIlxuICAgICAgICAgICAgZmlsdGVyT3B0aW9ucz17dGhpcy5tYXRjaEF1dGhvcnN9XG4gICAgICAgICAgICBvcHRpb25SZW5kZXJlcj17dGhpcy5yZW5kZXJDb0F1dGhvckxpc3RJdGVtfVxuICAgICAgICAgICAgdmFsdWVSZW5kZXJlcj17dGhpcy5yZW5kZXJDb0F1dGhvclZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25TZWxlY3RlZENvQXV0aG9yc0NoYW5nZWR9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5zZWxlY3RlZENvQXV0aG9yc31cbiAgICAgICAgICAgIG11bHRpPXt0cnVlfVxuICAgICAgICAgICAgb3Blbk9uQ2xpY2s9e2ZhbHNlfVxuICAgICAgICAgICAgb3Blbk9uRm9jdXM9e2ZhbHNlfVxuICAgICAgICAgICAgdGFiSW5kZXg9XCI1XCJcbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhhcmRXcmFwSWNvbigpIHtcbiAgICBjb25zdCBzaW5nbGVMaW5lTWVzc2FnZSA9IHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLmxlbmd0aCA9PT0gMTtcbiAgICBjb25zdCBoYXJkV3JhcCA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLmF1dG9tYXRpY0NvbW1pdE1lc3NhZ2VXcmFwcGluZycpO1xuICAgIGNvbnN0IG5vdEFwcGxpY2FibGUgPSB0aGlzLnByb3BzLmRlYWN0aXZhdGVDb21taXRCb3ggfHwgc2luZ2xlTGluZU1lc3NhZ2U7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4gICAgY29uc3Qgc3ZnUGF0aHMgPSB7XG4gICAgICBoYXJkV3JhcEVuYWJsZWQ6IHtcbiAgICAgICAgcGF0aDE6ICdNNy4wNTggMTAuMmgtLjk3NXYyLjRMMiA5bDQuMDgzLTMuNnYyLjRoLjk3bDEuMjAyIDEuMjAzTDcuMDU4IDEwLjJ6bTIuNTI1LTQuODY1VjQuMmgyLjMzNHYxLjE0bC0xLjE2NCAxLjE2NS0xLjE3LTEuMTd6JywgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG4gICAgICAgIHBhdGgyOiAnTTcuODQyIDYuOTRsMi4wNjMgMi4wNjMtMi4xMjIgMi4xMi45MDguOTEgMi4xMjMtMi4xMjMgMS45OCAxLjk4Ljg1LS44NDhMMTEuNTggOC45OGwyLjEyLTIuMTIzLS44MjQtLjgyNS0yLjEyMiAyLjEyLTIuMDYyLTIuMDZ6JywgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG4gICAgICB9LFxuICAgICAgaGFyZFdyYXBEaXNhYmxlZDoge1xuICAgICAgICBwYXRoMTogJ00xMS45MTcgOC40YzAgLjk5LS43ODggMS44LTEuNzUgMS44SDYuMDgzdjIuNEwyIDlsNC4wODMtMy42djIuNGgzLjVWNC4yaDIuMzM0djQuMnonLFxuICAgICAgfSxcbiAgICB9O1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG4gICAgaWYgKG5vdEFwcGxpY2FibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChoYXJkV3JhcCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdpY29uJywgJ2hhcmR3cmFwJywgJ2ljb24taGFyZHdyYXAtZW5hYmxlZCcsIHtoaWRkZW46IG5vdEFwcGxpY2FibGUgfHwgIWhhcmRXcmFwfSl9PlxuICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAxNiAxNlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9e3N2Z1BhdGhzLmhhcmRXcmFwRGlzYWJsZWQucGF0aDF9IGZpbGxSdWxlPVwiZXZlbm9kZFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdpY29uJywgJ25vLWhhcmR3cmFwJywgJ2ljb24taGFyZHdyYXAtZGlzYWJsZWQnLCB7aGlkZGVuOiBub3RBcHBsaWNhYmxlIHx8IGhhcmRXcmFwfSl9PlxuICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAxNiAxNlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgIDxnIGZpbGxSdWxlPVwiZXZlbm9kZFwiPlxuICAgICAgICAgICAgICA8cGF0aCBkPXtzdmdQYXRocy5oYXJkV3JhcEVuYWJsZWQucGF0aDF9IC8+XG4gICAgICAgICAgICAgIDxwYXRoIGZpbGxSdWxlPVwibm9uemVyb1wiIGQ9e3N2Z1BhdGhzLmhhcmRXcmFwRW5hYmxlZC5wYXRoMn0gLz5cbiAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yRm9ybSgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0NvQXV0aG9yRm9ybSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb0F1dGhvckZvcm1cbiAgICAgICAgcmVmPXt0aGlzLnJlZkNvQXV0aG9yRm9ybS5zZXR0ZXJ9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBvblN1Ym1pdD17dGhpcy5zdWJtaXROZXdDb0F1dGhvcn1cbiAgICAgICAgb25DYW5jZWw9e3RoaXMuY2FuY2VsTmV3Q29BdXRob3J9XG4gICAgICAgIG5hbWU9e3RoaXMuc3RhdGUuY29BdXRob3JJbnB1dH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHN1Ym1pdE5ld0NvQXV0aG9yKG5ld0F1dGhvcikge1xuICAgIHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnModGhpcy5wcm9wcy5zZWxlY3RlZENvQXV0aG9ycywgbmV3QXV0aG9yKTtcbiAgICB0aGlzLmhpZGVOZXdBdXRob3JGb3JtKCk7XG4gIH1cblxuICBjYW5jZWxOZXdDb0F1dGhvcigpIHtcbiAgICB0aGlzLmhpZGVOZXdBdXRob3JGb3JtKCk7XG4gIH1cblxuICBoaWRlTmV3QXV0aG9yRm9ybSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaG93Q29BdXRob3JGb3JtOiBmYWxzZX0sICgpID0+IHtcbiAgICAgIHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGMgPT4gYy5mb2N1cygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcbiAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zY2hlZHVsZVNob3dXb3JraW5nKG5leHRQcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgZGlkTW92ZUN1cnNvcigpIHtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICB0b2dnbGVIYXJkV3JhcCgpIHtcbiAgICBjb25zdCBjdXJyZW50U2V0dGluZyA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLmF1dG9tYXRpY0NvbW1pdE1lc3NhZ2VXcmFwcGluZycpO1xuICAgIHRoaXMucHJvcHMuY29uZmlnLnNldCgnZ2l0aHViLmF1dG9tYXRpY0NvbW1pdE1lc3NhZ2VXcmFwcGluZycsICFjdXJyZW50U2V0dGluZyk7XG4gIH1cblxuICB0b2dnbGVDb0F1dGhvcklucHV0KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2hvd0NvQXV0aG9ySW5wdXQ6ICF0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0LFxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIGluY3JlbWVudENvdW50ZXIoJ3Nob3ctY28tYXV0aG9yLWlucHV0Jyk7XG4gICAgICAgIHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGMgPT4gYy5mb2N1cygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGlucHV0IGlzIGNsb3NlZCwgcmVtb3ZlIGFsbCBjby1hdXRob3JzXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMoW10pO1xuICAgICAgICBpbmNyZW1lbnRDb3VudGVyKCdoaWRlLWNvLWF1dGhvci1pbnB1dCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXhjbHVkZUNvQXV0aG9yKCkge1xuICAgIGNvbnN0IGF1dGhvciA9IHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGMgPT4gYy5nZXRGb2N1c2VkT3B0aW9uKCkpLmdldE9yKG51bGwpO1xuICAgIGlmICghYXV0aG9yIHx8IGF1dGhvci5pc05ldygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGV4Y2x1ZGVkID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuZXhjbHVkZWRVc2VycycpO1xuICAgIGlmIChleGNsdWRlZCAmJiBleGNsdWRlZCAhPT0gJycpIHtcbiAgICAgIGV4Y2x1ZGVkICs9ICcsICc7XG4gICAgfVxuICAgIGV4Y2x1ZGVkICs9IGF1dGhvci5nZXRFbWFpbCgpO1xuICAgIHRoaXMucHJvcHMuY29uZmlnLnNldCgnZ2l0aHViLmV4Y2x1ZGVkVXNlcnMnLCBleGNsdWRlZCk7XG4gIH1cblxuICBhYm9ydE1lcmdlKCkge1xuICAgIHRoaXMucHJvcHMuYWJvcnRNZXJnZSgpO1xuICB9XG5cbiAgYXN5bmMgY29tbWl0KGV2ZW50LCBhbWVuZCkge1xuICAgIGlmIChhd2FpdCB0aGlzLnByb3BzLnByZXBhcmVUb0NvbW1pdCgpICYmIHRoaXMuY29tbWl0SXNFbmFibGVkKGFtZW5kKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jb21taXQodGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKSwgdGhpcy5wcm9wcy5zZWxlY3RlZENvQXV0aG9ycywgYW1lbmQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nIC0gZXJyb3Igd2FzIHRha2VuIGNhcmUgb2YgaW4gcGlwZWxpbmUgbWFuYWdlclxuICAgICAgICBpZiAoIWF0b20uaXNSZWxlYXNlZFZlcnNpb24oKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkVESVRPUik7XG4gICAgfVxuICB9XG5cbiAgYW1lbmRMYXN0Q29tbWl0KCkge1xuICAgIGluY3JlbWVudENvdW50ZXIoJ2FtZW5kJyk7XG4gICAgdGhpcy5jb21taXQobnVsbCwgdHJ1ZSk7XG4gIH1cblxuICBnZXRSZW1haW5pbmdDaGFyYWN0ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvck1vZGVsLm1hcChlZGl0b3IgPT4ge1xuICAgICAgaWYgKGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyA9PT0gMCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucHJvcHMubWF4aW11bUNoYXJhY3RlckxpbWl0IC0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDApLmxlbmd0aCkudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAn4oieJztcbiAgICAgIH1cbiAgICB9KS5nZXRPcih0aGlzLnByb3BzLm1heGltdW1DaGFyYWN0ZXJMaW1pdCB8fCAnJyk7XG4gIH1cblxuICAvLyBXZSBkb24ndCB3YW50IHRoZSB1c2VyIHRvIHNlZSB0aGUgVUkgZmxpY2tlciBpbiB0aGUgY2FzZVxuICAvLyB0aGUgY29tbWl0IHRha2VzIGEgdmVyeSBzbWFsbCB0aW1lIHRvIGNvbXBsZXRlLiBJbnN0ZWFkIHdlXG4gIC8vIHdpbGwgb25seSBzaG93IHRoZSB3b3JraW5nIG1lc3NhZ2UgaWYgd2UgYXJlIHdvcmtpbmcgZm9yIGxvbmdlclxuICAvLyB0aGFuIDEgc2Vjb25kIGFzIHBlciBodHRwczovL3d3dy5ubmdyb3VwLmNvbS9hcnRpY2xlcy9yZXNwb25zZS10aW1lcy0zLWltcG9ydGFudC1saW1pdHMvXG4gIC8vXG4gIC8vIFRoZSBjbG9zdXJlIGlzIGNyZWF0ZWQgdG8gcmVzdHJpY3QgdmFyaWFibGUgYWNjZXNzXG4gIHNjaGVkdWxlU2hvd1dvcmtpbmcocHJvcHMpIHtcbiAgICBpZiAocHJvcHMuaXNDb21taXR0aW5nKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd1dvcmtpbmcgJiYgdGhpcy50aW1lb3V0SGFuZGxlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1dvcmtpbmc6IHRydWV9KTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRIYW5kbGUpO1xuICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dXb3JraW5nOiBmYWxzZX0pO1xuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWRNZXNzYWdlKCkge1xuICAgIC8vIGVuc3VyZSB0aGF0IHRoZXJlIGFyZSBhdCBsZWFzdCBzb21lIG5vbi1jb21tZW50IGxpbmVzIGluIHRoZSBjb21taXQgbWVzc2FnZS5cbiAgICAvLyBDb21tZW50ZWQgbGluZXMgYXJlIHN0cmlwcGVkIG91dCBvZiBjb21taXQgbWVzc2FnZXMgYnkgZ2l0LCBieSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAgcmV0dXJuIHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkucmVwbGFjZSgvXiMuKiQvZ20sICcnKS50cmltKCkubGVuZ3RoICE9PSAwO1xuICB9XG5cbiAgY29tbWl0SXNFbmFibGVkKGFtZW5kKSB7XG4gICAgcmV0dXJuICF0aGlzLnByb3BzLmlzQ29tbWl0dGluZyAmJlxuICAgICAgKGFtZW5kIHx8IHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc0V4aXN0KSAmJlxuICAgICAgIXRoaXMucHJvcHMubWVyZ2VDb25mbGljdHNFeGlzdCAmJlxuICAgICAgdGhpcy5wcm9wcy5sYXN0Q29tbWl0LmlzUHJlc2VudCgpICYmXG4gICAgICAodGhpcy5wcm9wcy5kZWFjdGl2YXRlQ29tbWl0Qm94IHx8IChhbWVuZCB8fCB0aGlzLmlzVmFsaWRNZXNzYWdlKCkpKTtcbiAgfVxuXG4gIGNvbW1pdEJ1dHRvblRleHQoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd1dvcmtpbmcpIHtcbiAgICAgIHJldHVybiAnV29ya2luZy4uLic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpKSB7XG4gICAgICByZXR1cm4gJ0NyZWF0ZSBkZXRhY2hlZCBjb21taXQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gYENvbW1pdCB0byAke3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdDb21taXQnO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3IodGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKSk7XG4gIH1cblxuICBtYXRjaEF1dGhvcnMoYXV0aG9ycywgZmlsdGVyVGV4dCwgc2VsZWN0ZWRBdXRob3JzKSB7XG4gICAgY29uc3QgbWF0Y2hlZEF1dGhvcnMgPSBhdXRob3JzLmZpbHRlcigoYXV0aG9yLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaXNBbHJlYWR5U2VsZWN0ZWQgPSBzZWxlY3RlZEF1dGhvcnMgJiYgc2VsZWN0ZWRBdXRob3JzLmZpbmQoc2VsZWN0ZWQgPT4gc2VsZWN0ZWQubWF0Y2hlcyhhdXRob3IpKTtcbiAgICAgIGNvbnN0IG1hdGNoZXNGaWx0ZXIgPSBbXG4gICAgICAgIGF1dGhvci5nZXRMb2dpbigpLFxuICAgICAgICBhdXRob3IuZ2V0RnVsbE5hbWUoKSxcbiAgICAgICAgYXV0aG9yLmdldEVtYWlsKCksXG4gICAgICBdLnNvbWUoZmllbGQgPT4gZmllbGQgJiYgZmllbGQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlclRleHQudG9Mb3dlckNhc2UoKSkgIT09IC0xKTtcblxuICAgICAgcmV0dXJuICFpc0FscmVhZHlTZWxlY3RlZCAmJiBtYXRjaGVzRmlsdGVyO1xuICAgIH0pO1xuICAgIG1hdGNoZWRBdXRob3JzLnB1c2goQXV0aG9yLmNyZWF0ZU5ldygnQWRkIG5ldyBhdXRob3InLCBmaWx0ZXJUZXh0KSk7XG4gICAgcmV0dXJuIG1hdGNoZWRBdXRob3JzO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKGZpZWxkTmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGdpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yLSR7ZmllbGROYW1lfWB9Pnt2YWx1ZX08L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yTGlzdEl0ZW0oYXV0aG9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3Itc2VsZWN0TGlzdEl0ZW0nLCB7J25ldy1hdXRob3InOiBhdXRob3IuaXNOZXcoKX0pfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKCduYW1lJywgYXV0aG9yLmdldEZ1bGxOYW1lKCkpfVxuICAgICAgICB7YXV0aG9yLmhhc0xvZ2luKCkgJiYgdGhpcy5yZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoJ2xvZ2luJywgJ0AnICsgYXV0aG9yLmdldExvZ2luKCkpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoJ2VtYWlsJywgYXV0aG9yLmdldEVtYWlsKCkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yVmFsdWUoYXV0aG9yKSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSBhdXRob3IuZ2V0RnVsbE5hbWUoKTtcbiAgICBpZiAoZnVsbE5hbWUgJiYgZnVsbE5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIDxzcGFuPnthdXRob3IuZ2V0RnVsbE5hbWUoKX08L3NwYW4+O1xuICAgIH1cbiAgICBpZiAoYXV0aG9yLmhhc0xvZ2luKCkpIHtcbiAgICAgIHJldHVybiA8c3Bhbj5Ae2F1dGhvci5nZXRMb2dpbigpfTwvc3Bhbj47XG4gICAgfVxuXG4gICAgcmV0dXJuIDxzcGFuPnthdXRob3IuZ2V0RW1haWwoKX08L3NwYW4+O1xuICB9XG5cbiAgb25TZWxlY3RlZENvQXV0aG9yc0NoYW5nZWQoc2VsZWN0ZWRDb0F1dGhvcnMpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKCdzZWxlY3RlZC1jby1hdXRob3JzLWNoYW5nZWQnKTtcbiAgICBjb25zdCBuZXdBdXRob3IgPSBzZWxlY3RlZENvQXV0aG9ycy5maW5kKGF1dGhvciA9PiBhdXRob3IuaXNOZXcoKSk7XG5cbiAgICBpZiAobmV3QXV0aG9yKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjb0F1dGhvcklucHV0OiBuZXdBdXRob3IuZ2V0RnVsbE5hbWUoKSwgc2hvd0NvQXV0aG9yRm9ybTogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKHNlbGVjdGVkQ29BdXRob3JzKTtcbiAgICB9XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChlbGVtZW50ID0+IGVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uLm1hcChidXR0b24gPT4gYnV0dG9uLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZFZGl0b3JDb21wb25lbnQubWFwKGVkaXRvciA9PiBlZGl0b3IuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuRURJVE9SO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkFib3J0TWVyZ2VCdXR0b24ubWFwKGUgPT4gZS5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmQ29tbWl0QnV0dG9uLm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX0JVVFRPTjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLndyYXBwZXIgJiYgYy53cmFwcGVyLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkNPQVVUSE9SX0lOUFVUO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2V0Rm9jdXMoZm9jdXMpIHtcbiAgICBsZXQgZmFsbGJhY2sgPSBmYWxzZTtcbiAgICBjb25zdCBmb2N1c0VsZW1lbnQgPSBlbGVtZW50ID0+IHtcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OKSB7XG4gICAgICBpZiAodGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uLm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuRURJVE9SKSB7XG4gICAgICBpZiAodGhpcy5yZWZFZGl0b3JDb21wb25lbnQubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLmxlbmd0aCA+IDAgJiYgIXRoaXMuaXNWYWxpZE1lc3NhZ2UoKSkge1xuICAgICAgICAgIC8vIHRoZXJlIGlzIGxpa2VseSBhIGNvbW1pdCBtZXNzYWdlIHRlbXBsYXRlIHByZXNlbnRcbiAgICAgICAgICAvLyB3ZSB3YW50IHRoZSBjdXJzb3IgdG8gYmUgYXQgdGhlIGJlZ2lubmluZywgbm90IGF0IHRoZSBhbmQgb2YgdGhlIHRlbXBsYXRlXG4gICAgICAgICAgdGhpcy5yZWZFZGl0b3JDb21wb25lbnQuZ2V0KCkuZ2V0TW9kZWwoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5BQk9SVF9NRVJHRV9CVVRUT04pIHtcbiAgICAgIGlmICh0aGlzLnJlZkFib3J0TWVyZ2VCdXR0b24ubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZmFsbGJhY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfQlVUVE9OKSB7XG4gICAgICBpZiAodGhpcy5yZWZDb21taXRCdXR0b24ubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZmFsbGJhY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5DT0FVVEhPUl9JTlBVVCkge1xuICAgICAgaWYgKHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZmFsbGJhY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5sYXN0Rm9jdXMpIHtcbiAgICAgIGlmICh0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfQlVUVE9OKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc01lcmdpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5BQk9SVF9NRVJHRV9CVVRUT04pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuQ09BVVRIT1JfSU5QVVQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5FRElUT1IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmYWxsYmFjayAmJiB0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkdmFuY2VGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBjb25zdCBmID0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cztcblxuICAgIGxldCBuZXh0ID0gbnVsbDtcbiAgICBzd2l0Y2ggKGZvY3VzKSB7XG4gICAgY2FzZSBmLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjpcbiAgICAgIG5leHQgPSBmLkVESVRPUjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5FRElUT1I6XG4gICAgICBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICBuZXh0ID0gZi5DT0FVVEhPUl9JTlBVVDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc01lcmdpbmcpIHtcbiAgICAgICAgbmV4dCA9IGYuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkpIHtcbiAgICAgICAgbmV4dCA9IGYuQ09NTUlUX0JVVFRPTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQgPSBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPQVVUSE9SX0lOUFVUOlxuICAgICAgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIG5leHQgPSBmLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpKSB7XG4gICAgICAgIG5leHQgPSBmLkNPTU1JVF9CVVRUT047XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0ID0gUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5BQk9SVF9NRVJHRV9CVVRUT046XG4gICAgICBuZXh0ID0gdGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpID8gZi5DT01NSVRfQlVUVE9OIDogUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5DT01NSVRfQlVUVE9OOlxuICAgICAgbmV4dCA9IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5leHQpO1xuICB9XG5cbiAgcmV0cmVhdEZvY3VzRnJvbShmb2N1cykge1xuICAgIGNvbnN0IGYgPSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzO1xuXG4gICAgbGV0IHByZXZpb3VzID0gbnVsbDtcbiAgICBzd2l0Y2ggKGZvY3VzKSB7XG4gICAgY2FzZSBmLkNPTU1JVF9CVVRUT046XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc01lcmdpbmcpIHtcbiAgICAgICAgcHJldmlvdXMgPSBmLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICBwcmV2aW91cyA9IGYuQ09BVVRIT1JfSU5QVVQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2aW91cyA9IGYuRURJVE9SO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkFCT1JUX01FUkdFX0JVVFRPTjpcbiAgICAgIHByZXZpb3VzID0gdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCA/IGYuQ09BVVRIT1JfSU5QVVQgOiBmLkVESVRPUjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5DT0FVVEhPUl9JTlBVVDpcbiAgICAgIHByZXZpb3VzID0gZi5FRElUT1I7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuRURJVE9SOlxuICAgICAgcHJldmlvdXMgPSBmLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5DT01NSVRfUFJFVklFV19CVVRUT046XG4gICAgICBwcmV2aW91cyA9IFN0YWdpbmdWaWV3Lmxhc3RGb2N1cztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJldmlvdXMpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFNBQUEsR0FBQUYsT0FBQTtBQUNBLElBQUFHLFdBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFlBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFLLFFBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLGVBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFPLGFBQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLGtCQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxZQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxTQUFBLEdBQUFDLHVCQUFBLENBQUFYLE9BQUE7QUFDQSxJQUFBWSxVQUFBLEdBQUFiLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYSxPQUFBLEdBQUFkLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYyxhQUFBLEdBQUFmLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZSxRQUFBLEdBQUFmLE9BQUE7QUFDQSxJQUFBZ0IsV0FBQSxHQUFBaEIsT0FBQTtBQUNBLElBQUFpQixjQUFBLEdBQUFqQixPQUFBO0FBQW1ELFNBQUFrQix5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxDQUFBLFdBQUFBLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLEtBQUFGLENBQUE7QUFBQSxTQUFBUix3QkFBQVEsQ0FBQSxFQUFBRSxDQUFBLFNBQUFBLENBQUEsSUFBQUYsQ0FBQSxJQUFBQSxDQUFBLENBQUFJLFVBQUEsU0FBQUosQ0FBQSxlQUFBQSxDQUFBLHVCQUFBQSxDQUFBLHlCQUFBQSxDQUFBLFdBQUFLLE9BQUEsRUFBQUwsQ0FBQSxRQUFBRyxDQUFBLEdBQUFKLHdCQUFBLENBQUFHLENBQUEsT0FBQUMsQ0FBQSxJQUFBQSxDQUFBLENBQUFHLEdBQUEsQ0FBQU4sQ0FBQSxVQUFBRyxDQUFBLENBQUFJLEdBQUEsQ0FBQVAsQ0FBQSxPQUFBUSxDQUFBLEtBQUFDLFNBQUEsVUFBQUMsQ0FBQSxHQUFBQyxNQUFBLENBQUFDLGNBQUEsSUFBQUQsTUFBQSxDQUFBRSx3QkFBQSxXQUFBQyxDQUFBLElBQUFkLENBQUEsb0JBQUFjLENBQUEsSUFBQUgsTUFBQSxDQUFBSSxTQUFBLENBQUFDLGNBQUEsQ0FBQUMsSUFBQSxDQUFBakIsQ0FBQSxFQUFBYyxDQUFBLFNBQUFJLENBQUEsR0FBQVIsQ0FBQSxHQUFBQyxNQUFBLENBQUFFLHdCQUFBLENBQUFiLENBQUEsRUFBQWMsQ0FBQSxVQUFBSSxDQUFBLEtBQUFBLENBQUEsQ0FBQVgsR0FBQSxJQUFBVyxDQUFBLENBQUFDLEdBQUEsSUFBQVIsTUFBQSxDQUFBQyxjQUFBLENBQUFKLENBQUEsRUFBQU0sQ0FBQSxFQUFBSSxDQUFBLElBQUFWLENBQUEsQ0FBQU0sQ0FBQSxJQUFBZCxDQUFBLENBQUFjLENBQUEsWUFBQU4sQ0FBQSxDQUFBSCxPQUFBLEdBQUFMLENBQUEsRUFBQUcsQ0FBQSxJQUFBQSxDQUFBLENBQUFnQixHQUFBLENBQUFuQixDQUFBLEVBQUFRLENBQUEsR0FBQUEsQ0FBQTtBQUFBLFNBQUE1Qix1QkFBQXdDLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFoQixVQUFBLEdBQUFnQixHQUFBLEtBQUFmLE9BQUEsRUFBQWUsR0FBQTtBQUFBLFNBQUFDLGdCQUFBRCxHQUFBLEVBQUFFLEdBQUEsRUFBQUMsS0FBQSxJQUFBRCxHQUFBLEdBQUFFLGNBQUEsQ0FBQUYsR0FBQSxPQUFBQSxHQUFBLElBQUFGLEdBQUEsSUFBQVQsTUFBQSxDQUFBQyxjQUFBLENBQUFRLEdBQUEsRUFBQUUsR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQUUsVUFBQSxRQUFBQyxZQUFBLFFBQUFDLFFBQUEsb0JBQUFQLEdBQUEsQ0FBQUUsR0FBQSxJQUFBQyxLQUFBLFdBQUFILEdBQUE7QUFBQSxTQUFBSSxlQUFBckIsQ0FBQSxRQUFBZSxDQUFBLEdBQUFVLFlBQUEsQ0FBQXpCLENBQUEsdUNBQUFlLENBQUEsR0FBQUEsQ0FBQSxHQUFBVyxNQUFBLENBQUFYLENBQUE7QUFBQSxTQUFBVSxhQUFBekIsQ0FBQSxFQUFBRCxDQUFBLDJCQUFBQyxDQUFBLEtBQUFBLENBQUEsU0FBQUEsQ0FBQSxNQUFBSCxDQUFBLEdBQUFHLENBQUEsQ0FBQTJCLE1BQUEsQ0FBQUMsV0FBQSxrQkFBQS9CLENBQUEsUUFBQWtCLENBQUEsR0FBQWxCLENBQUEsQ0FBQWlCLElBQUEsQ0FBQWQsQ0FBQSxFQUFBRCxDQUFBLHVDQUFBZ0IsQ0FBQSxTQUFBQSxDQUFBLFlBQUFjLFNBQUEseUVBQUE5QixDQUFBLEdBQUEyQixNQUFBLEdBQUFJLE1BQUEsRUFBQTlCLENBQUE7QUFFbkQsTUFBTStCLGFBQWEsR0FBRyxHQUFHOztBQUV6QjtBQUNBO0FBQ0EsSUFBSUMsZ0JBQWdCO0FBRUwsTUFBTUMsVUFBVSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXdDdERDLFdBQVdBLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFO0lBQzFCLEtBQUssQ0FBQ0QsS0FBSyxFQUFFQyxPQUFPLENBQUM7SUFDckIsSUFBQUMsaUJBQVEsRUFDTixJQUFJLEVBQ0osbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUMzRSxxQkFBcUIsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLG1DQUFtQyxFQUNyRyx3QkFBd0IsRUFBRSw0QkFBNEIsRUFBRSxpQkFDMUQsQ0FBQztJQUVELElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQ1hDLFdBQVcsRUFBRSxLQUFLO01BQ2xCQyxpQkFBaUIsRUFBRSxLQUFLO01BQ3hCQyxnQkFBZ0IsRUFBRSxLQUFLO01BQ3ZCQyxhQUFhLEVBQUU7SUFDakIsQ0FBQztJQUVELElBQUksQ0FBQ0MsYUFBYSxHQUFHLElBQUk7SUFDekIsSUFBSSxDQUFDQyxhQUFhLEdBQUcsSUFBSUMsNkJBQW1CLENBQUMsQ0FBQztJQUU5QyxJQUFJLENBQUNDLE9BQU8sR0FBRyxJQUFJQyxrQkFBUyxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDQyxzQkFBc0IsR0FBRyxJQUFJRCxrQkFBUyxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDRSxlQUFlLEdBQUcsSUFBSUYsa0JBQVMsQ0FBQyxDQUFDO0lBQ3RDLElBQUksQ0FBQ0csZUFBZSxHQUFHLElBQUlILGtCQUFTLENBQUMsQ0FBQztJQUN0QyxJQUFJLENBQUNJLGlCQUFpQixHQUFHLElBQUlKLGtCQUFTLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUNLLG1CQUFtQixHQUFHLElBQUlMLGtCQUFTLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUNNLGlCQUFpQixHQUFHLElBQUlOLGtCQUFTLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUNPLGlCQUFpQixHQUFHLElBQUlQLGtCQUFTLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUNRLGVBQWUsR0FBRyxJQUFJUixrQkFBUyxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDUyxrQkFBa0IsR0FBRyxJQUFJVCxrQkFBUyxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDVSxjQUFjLEdBQUcsSUFBSVYsa0JBQVMsQ0FBQyxDQUFDO0lBRXJDLElBQUksQ0FBQ1csSUFBSSxHQUFHLElBQUliLDZCQUFtQixDQUFDLENBQUM7RUFDdkM7RUFFQWMsWUFBWUEsQ0FBQ0MsT0FBTyxFQUFFO0lBQ3BCLE9BQU9qRSxDQUFDLElBQUk7TUFDVixJQUFJLElBQUksQ0FBQzJELGlCQUFpQixDQUFDTyxPQUFPLENBQUMsQ0FBQyxFQUFFO1FBQ3BDO01BQ0Y7TUFFQSxJQUFJLENBQUMvQixnQkFBZ0IsRUFBRTtRQUNyQkEsZ0JBQWdCLEdBQUcsY0FBY2dDLFdBQVcsQ0FBQztVQUMzQzVCLFdBQVdBLENBQUM2QixLQUFLLEVBQUU7WUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNoQixJQUFJLENBQUNILE9BQU8sR0FBR0csS0FBSztVQUN0QjtRQUNGLENBQUM7TUFDSDtNQUVBLE1BQU1DLFNBQVMsR0FBRyxJQUFJbEMsZ0JBQWdCLENBQUM4QixPQUFPLENBQUM7TUFDL0MsSUFBSSxDQUFDTixpQkFBaUIsQ0FBQ3BELEdBQUcsQ0FBQyxDQUFDLENBQUMrRCxhQUFhLENBQUNELFNBQVMsQ0FBQztNQUVyRCxJQUFJLENBQUNBLFNBQVMsQ0FBQ0UsZ0JBQWdCLEVBQUU7UUFDL0J2RSxDQUFDLENBQUN3RSxlQUFlLENBQUMsQ0FBQztNQUNyQjtJQUNGLENBQUM7RUFDSDs7RUFFQTtFQUNBQyx5QkFBeUJBLENBQUEsRUFBRztJQUMxQixJQUFJLENBQUNDLG1CQUFtQixDQUFDLElBQUksQ0FBQ2xDLEtBQUssQ0FBQztJQUVwQyxJQUFJLENBQUN1QixJQUFJLENBQUNZLEdBQUcsQ0FDWCxJQUFJLENBQUNuQyxLQUFLLENBQUNvQyxNQUFNLENBQUNDLFdBQVcsQ0FBQyx1Q0FBdUMsRUFBRSxNQUFNLElBQUksQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUNoRyxJQUFJLENBQUN0QyxLQUFLLENBQUN1QyxhQUFhLENBQUNGLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FDL0QsQ0FBQztFQUNIO0VBRUFFLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUlDLHVCQUF1QixHQUFHLEVBQUU7SUFDaEMsTUFBTUMsbUJBQW1CLEdBQUdDLFFBQVEsQ0FBQyxJQUFJLENBQUNDLHNCQUFzQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDdkUsSUFBSUYsbUJBQW1CLEdBQUcsQ0FBQyxFQUFFO01BQzNCRCx1QkFBdUIsR0FBRyxVQUFVO0lBQ3RDLENBQUMsTUFBTSxJQUFJQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMxQyxLQUFLLENBQUM2QyxxQkFBcUIsR0FBRyxDQUFDLEVBQUU7TUFDckVKLHVCQUF1QixHQUFHLFlBQVk7SUFDeEM7SUFFQSxNQUFNSyxvQkFBb0IsR0FBRyxJQUFJLENBQUM5QyxLQUFLLENBQUMrQyxTQUFTLElBQUksSUFBSTs7SUFFekQ7SUFDQSxNQUFNQyxNQUFNLEdBQUdDLE9BQU8sQ0FBQ0MsUUFBUSxLQUFLLFFBQVEsR0FBRyxLQUFLLEdBQUcsTUFBTTtJQUU3RCxPQUNFL0csTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUFLQyxTQUFTLEVBQUMsbUJBQW1CO01BQUNDLEdBQUcsRUFBRSxJQUFJLENBQUMxQyxPQUFPLENBQUMyQztJQUFPLEdBQzFEbkgsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBYyxPQUFRO01BQUMwRixRQUFRLEVBQUUsSUFBSSxDQUFDdkQsS0FBSyxDQUFDd0QsUUFBUztNQUFDQyxNQUFNLEVBQUM7SUFBZ0IsR0FDOUR0SCxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyxlQUFlO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNDO0lBQU8sQ0FBRSxDQUFDLEVBQzFEMUgsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBMkcsT0FBTztNQUFDQyxPQUFPLEVBQUMsMEJBQTBCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNFO0lBQWdCLENBQUUsQ0FBQyxFQUM5RTNILE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3BHLFNBQUEsQ0FBQTJHLE9BQU87TUFBQ0MsT0FBTyxFQUFDLDhDQUE4QztNQUM3REMsUUFBUSxFQUFFLElBQUksQ0FBQ0c7SUFBa0MsQ0FDbEQsQ0FDTyxDQUFDLEVBQ1g1SCxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUFjLE9BQVE7TUFBQzBGLFFBQVEsRUFBRSxJQUFJLENBQUN2RCxLQUFLLENBQUN3RCxRQUFTO01BQUNDLE1BQU0sRUFBQztJQUFtQyxHQUNqRnRILE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3BHLFNBQUEsQ0FBQTJHLE9BQU87TUFBQ0MsT0FBTyxFQUFDLHVCQUF1QjtNQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDcEMsWUFBWSxDQUFDLEVBQUU7SUFBRSxDQUFFLENBQUMsRUFDNUVyRixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyxxQkFBcUI7TUFBQ0MsUUFBUSxFQUFFLElBQUksQ0FBQ3BDLFlBQVksQ0FBQyxFQUFFO0lBQUUsQ0FBRSxDQUFDLEVBQzFFckYsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBMkcsT0FBTztNQUFDQyxPQUFPLEVBQUMsd0JBQXdCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNwQyxZQUFZLENBQUMsRUFBRTtJQUFFLENBQUUsQ0FBQyxFQUM3RXJGLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3BHLFNBQUEsQ0FBQTJHLE9BQU87TUFBQ0MsT0FBTyxFQUFDLHNCQUFzQjtNQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDcEMsWUFBWSxDQUFDLENBQUM7SUFBRSxDQUFFLENBQUMsRUFDMUVyRixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyw0QkFBNEI7TUFBQ0MsUUFBUSxFQUFFLElBQUksQ0FBQ3BDLFlBQVksQ0FBQyxDQUFDO0lBQUUsQ0FBRSxDQUFDLEVBQ2hGckYsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBMkcsT0FBTztNQUFDQyxPQUFPLEVBQUMseUJBQXlCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNwQyxZQUFZLENBQUMsRUFBRTtJQUFFLENBQUUsQ0FBQyxFQUM5RXJGLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3BHLFNBQUEsQ0FBQTJHLE9BQU87TUFBQ0MsT0FBTyxFQUFDLDJCQUEyQjtNQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDcEMsWUFBWSxDQUFDLEVBQUU7SUFBRSxDQUFFLENBQUMsRUFDaEZyRixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyxzQkFBc0I7TUFBQ0MsUUFBUSxFQUFFLElBQUksQ0FBQ3BDLFlBQVksQ0FBQyxFQUFFO0lBQUUsQ0FBRSxDQUFDLEVBQzNFckYsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBMkcsT0FBTztNQUFDQyxPQUFPLEVBQUMsdUJBQXVCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNwQyxZQUFZLENBQUMsRUFBRTtJQUFFLENBQUUsQ0FBQyxFQUM1RXJGLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3BHLFNBQUEsQ0FBQTJHLE9BQU87TUFBQ0MsT0FBTyxFQUFDLHlCQUF5QjtNQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDcEMsWUFBWSxDQUFDLEVBQUU7SUFBRSxDQUFFLENBQUMsRUFDOUVyRixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyx5QkFBeUI7TUFBQ0MsUUFBUSxFQUFFLElBQUksQ0FBQ3BDLFlBQVksQ0FBQyxFQUFFO0lBQUUsQ0FBRSxDQUFDLEVBQzlFckYsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBMkcsT0FBTztNQUFDQyxPQUFPLEVBQUMsMEJBQTBCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNJO0lBQWdCLENBQUUsQ0FDckUsQ0FBQyxFQUNYN0gsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDcEcsU0FBQSxDQUFBYyxPQUFRO01BQUMwRixRQUFRLEVBQUUsSUFBSSxDQUFDdkQsS0FBSyxDQUFDd0QsUUFBUztNQUFDQyxNQUFNLEVBQUM7SUFBa0MsR0FDaEZ0SCxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUNwRyxTQUFBLENBQUEyRyxPQUFPO01BQUNDLE9BQU8sRUFBQyxhQUFhO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUM1RCxLQUFLLENBQUNpRTtJQUFzQixDQUFFLENBQ3BFLENBQUMsRUFDWDlILE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7TUFBS0MsU0FBUyxFQUFDO0lBQWlDLEdBQzlDakgsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUNFRSxHQUFHLEVBQUUsSUFBSSxDQUFDeEMsc0JBQXNCLENBQUN5QyxNQUFPO01BQ3hDRixTQUFTLEVBQUMsOERBQThEO01BQ3hFYyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUNsRSxLQUFLLENBQUNtRSxrQkFBbUI7TUFDekNDLE9BQU8sRUFBRSxJQUFJLENBQUNwRSxLQUFLLENBQUNxRTtJQUFvQixHQUN2QyxJQUFJLENBQUNyRSxLQUFLLENBQUNzRSxtQkFBbUIsR0FBRyx5QkFBeUIsR0FBRyx3QkFDeEQsQ0FDTCxDQUFDLEVBQ05uSSxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO01BQUtDLFNBQVMsRUFBRSxJQUFBbUIsbUJBQUUsRUFBQywwQkFBMEIsRUFBRTtRQUFDLGFBQWEsRUFBRSxJQUFJLENBQUN2RSxLQUFLLENBQUN3RTtNQUFtQixDQUFDO0lBQUUsR0FDOUZySSxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUN4RyxlQUFBLENBQUFrQixPQUFjO01BQ2J3RixHQUFHLEVBQUUsSUFBSSxDQUFDaEMsa0JBQWtCLENBQUNpQyxNQUFPO01BQ3BDbUIsUUFBUSxFQUFFLElBQUksQ0FBQ25ELGNBQWU7TUFDOUJvRCxXQUFXLEVBQUUsSUFBSztNQUNsQkMsZUFBZSxFQUFDLGdCQUFnQjtNQUNoQ0MsdUJBQXVCLEVBQUUsS0FBTTtNQUMvQkMsY0FBYyxFQUFFLEtBQU07TUFDdEJDLFVBQVUsRUFBRSxLQUFNO01BQ2xCQyxhQUFhLEVBQUUsS0FBTTtNQUNyQkMsTUFBTSxFQUFFLElBQUksQ0FBQ2hGLEtBQUssQ0FBQ3VDLGFBQWM7TUFDakMwQyxTQUFTLEVBQUUsSUFBSSxDQUFDakYsS0FBSyxDQUFDaUYsU0FBVTtNQUNoQ0MsdUJBQXVCLEVBQUUsSUFBSSxDQUFDQztJQUFjLENBQzdDLENBQUMsRUFDRmhKLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7TUFDRUUsR0FBRyxFQUFFLElBQUksQ0FBQ25DLGlCQUFpQixDQUFDb0MsTUFBTztNQUNuQ0YsU0FBUyxFQUFFLElBQUFtQixtQkFBRSxFQUFDLGtDQUFrQyxFQUFFO1FBQUNhLE9BQU8sRUFBRSxJQUFJLENBQUNqRixLQUFLLENBQUNFO01BQWlCLENBQUMsQ0FBRTtNQUMzRitELE9BQU8sRUFBRSxJQUFJLENBQUNpQjtJQUFvQixHQUNqQyxJQUFJLENBQUNDLHdCQUF3QixDQUFDLENBQ3pCLENBQUMsRUFDVG5KLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ3pHLFFBQUEsQ0FBQW1CLE9BQU87TUFDTjBILE9BQU8sRUFBRSxJQUFJLENBQUN2RixLQUFLLENBQUN3RixRQUFTO01BQzdCL0IsTUFBTSxFQUFFLElBQUksQ0FBQ3ZDLGlCQUFrQjtNQUMvQnVFLEtBQUssRUFBRyxHQUFFLElBQUksQ0FBQ3RGLEtBQUssQ0FBQ0UsaUJBQWlCLEdBQUcsUUFBUSxHQUFHLEtBQU0sYUFBYTtNQUN2RXFGLFNBQVMsRUFBRWhHO0lBQWMsQ0FDMUIsQ0FBQyxFQUNGdkQsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUNFRSxHQUFHLEVBQUUsSUFBSSxDQUFDckMsaUJBQWlCLENBQUNzQyxNQUFPO01BQ25DYyxPQUFPLEVBQUUsSUFBSSxDQUFDdUIsY0FBZTtNQUM3QnZDLFNBQVMsRUFBQztJQUE0QyxHQUNyRCxJQUFJLENBQUN3QyxrQkFBa0IsQ0FBQyxDQUNuQixDQUFDLEVBQ1R6SixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLENBQUN6RyxRQUFBLENBQUFtQixPQUFPO01BQ04wSCxPQUFPLEVBQUUsSUFBSSxDQUFDdkYsS0FBSyxDQUFDd0YsUUFBUztNQUM3Qi9CLE1BQU0sRUFBRSxJQUFJLENBQUN6QyxpQkFBa0I7TUFDL0JvQyxTQUFTLEVBQUMsb0NBQW9DO01BQzlDcUMsS0FBSyxFQUFDLDRCQUE0QjtNQUNsQ0MsU0FBUyxFQUFFaEc7SUFBYyxDQUMxQixDQUFDLEVBQ0Z2RCxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO01BQ0VFLEdBQUcsRUFBRSxJQUFJLENBQUN2QyxlQUFlLENBQUN3QyxNQUFPO01BQ2pDRixTQUFTLEVBQUMsc0RBQXNEO01BQ2hFZ0IsT0FBTyxFQUFFLElBQUksQ0FBQ0w7SUFBa0MsQ0FDakQsQ0FBQyxFQUNGNUgsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDekcsUUFBQSxDQUFBbUIsT0FBTztNQUNOMEgsT0FBTyxFQUFFLElBQUksQ0FBQ3ZGLEtBQUssQ0FBQ3dGLFFBQVM7TUFDN0IvQixNQUFNLEVBQUUsSUFBSSxDQUFDM0MsZUFBZ0I7TUFDN0JzQyxTQUFTLEVBQUMsd0NBQXdDO01BQ2xEcUMsS0FBSyxFQUFDLDhCQUE4QjtNQUNwQ0MsU0FBUyxFQUFFaEc7SUFBYyxDQUMxQixDQUNFLENBQUMsRUFFTCxJQUFJLENBQUNtRyxrQkFBa0IsQ0FBQyxDQUFDLEVBQ3pCLElBQUksQ0FBQ0MsbUJBQW1CLENBQUMsQ0FBQyxFQUUzQjNKLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7TUFBUUMsU0FBUyxFQUFDO0lBQXVCLEdBQ3RDTixvQkFBb0IsSUFDbkIzRyxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO01BQ0VFLEdBQUcsRUFBRSxJQUFJLENBQUNwQyxtQkFBbUIsQ0FBQ3FDLE1BQU87TUFDckNGLFNBQVMsRUFBQyx3RUFBd0U7TUFDbEZnQixPQUFPLEVBQUUsSUFBSSxDQUFDMkI7SUFBVyxnQkFBb0IsQ0FBQyxFQUdsRDVKLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7TUFDRUUsR0FBRyxFQUFFLElBQUksQ0FBQ3RDLGVBQWUsQ0FBQ3VDLE1BQU87TUFDakNGLFNBQVMsRUFBQyx1RkFBdUY7TUFDakdnQixPQUFPLEVBQUUsSUFBSSxDQUFDUCxNQUFPO01BQ3JCSyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUM4QixlQUFlLENBQUMsS0FBSztJQUFFLEdBQUUsSUFBSSxDQUFDQyxnQkFBZ0IsQ0FBQyxDQUFVLENBQUMsRUFDM0UsSUFBSSxDQUFDRCxlQUFlLENBQUMsS0FBSyxDQUFDLElBQzFCN0osTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDekcsUUFBQSxDQUFBbUIsT0FBTztNQUNOMEgsT0FBTyxFQUFFLElBQUksQ0FBQ3ZGLEtBQUssQ0FBQ3dGLFFBQVM7TUFDN0IvQixNQUFNLEVBQUUsSUFBSSxDQUFDMUMsZUFBZ0I7TUFDN0JxQyxTQUFTLEVBQUMsa0NBQWtDO01BQzVDcUMsS0FBSyxFQUFHLEdBQUV6QyxNQUFPLGtCQUFrQjtNQUNuQzBDLFNBQVMsRUFBRWhHO0lBQWMsQ0FDMUIsQ0FBQyxFQUNKdkQsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUFLQyxTQUFTLEVBQUcsMENBQXlDWCx1QkFBd0I7SUFBRSxHQUNqRixJQUFJLENBQUNHLHNCQUFzQixDQUFDLENBQzFCLENBQ0MsQ0FDTCxDQUFDO0VBRVY7RUFFQTBDLHdCQUF3QkEsQ0FBQSxFQUFHO0lBQ3pCO0lBQ0EsTUFBTVksT0FBTyxHQUFHLDZRQUE2UTtJQUM3UixPQUNFL0osTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUFLQyxTQUFTLEVBQUUsSUFBQW1CLG1CQUFFLEVBQUMsc0NBQXNDLEVBQUU7UUFBQ2EsT0FBTyxFQUFFLElBQUksQ0FBQ2pGLEtBQUssQ0FBQ0U7TUFBaUIsQ0FBQyxDQUFFO01BQUM4RixPQUFPLEVBQUMsVUFBVTtNQUFDQyxLQUFLLEVBQUM7SUFBNEIsR0FDeEpqSyxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBLDBDQUFzQyxDQUFDLEVBQ3ZDaEgsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQTtNQUFNa0QsQ0FBQyxFQUFFSDtJQUFRLENBQUUsQ0FDaEIsQ0FBQztFQUVWO0VBRUFKLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMzRixLQUFLLENBQUNFLGlCQUFpQixFQUFFO01BQ2pDLE9BQU8sSUFBSTtJQUNiO0lBRUEsT0FDRWxFLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsQ0FBQ2hHLGFBQUEsQ0FBQVUsT0FBWTtNQUFDeUksS0FBSyxFQUFFLElBQUksQ0FBQ3RHLEtBQUssQ0FBQ3VHLFNBQVU7TUFBQ0MsU0FBUyxFQUFFQyxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsUUFBUSxDQUFDO0lBQUUsR0FDN0VDLGdCQUFnQixJQUNmeEssTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDMUcsWUFBQSxDQUFBb0IsT0FBTTtNQUNMd0YsR0FBRyxFQUFFLElBQUksQ0FBQ2xDLGlCQUFpQixDQUFDbUMsTUFBTztNQUNuQ0YsU0FBUyxFQUFDLHFFQUFxRTtNQUMvRXdELFdBQVcsRUFBQyxZQUFZO01BQ3hCQyxhQUFhLEVBQUUsSUFBSztNQUNwQkMsT0FBTyxFQUFFSCxnQkFBaUI7TUFDMUJJLFFBQVEsRUFBQyxVQUFVO01BQ25CQyxRQUFRLEVBQUMsT0FBTztNQUNoQkMsYUFBYSxFQUFFLElBQUksQ0FBQ0MsWUFBYTtNQUNqQ0MsY0FBYyxFQUFFLElBQUksQ0FBQ0Msc0JBQXVCO01BQzVDQyxhQUFhLEVBQUUsSUFBSSxDQUFDQyxtQkFBb0I7TUFDeENDLFFBQVEsRUFBRSxJQUFJLENBQUNDLDBCQUEyQjtNQUMxQ3pJLEtBQUssRUFBRSxJQUFJLENBQUNpQixLQUFLLENBQUN5SCxpQkFBa0I7TUFDcENDLEtBQUssRUFBRSxJQUFLO01BQ1pDLFdBQVcsRUFBRSxLQUFNO01BQ25CQyxXQUFXLEVBQUUsS0FBTTtNQUNuQkMsUUFBUSxFQUFDO0lBQUcsQ0FDYixDQUVTLENBQUM7RUFFbkI7RUFFQWpDLGtCQUFrQkEsQ0FBQSxFQUFHO0lBQ25CLE1BQU1rQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM5SCxLQUFLLENBQUN1QyxhQUFhLENBQUN3RixPQUFPLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUNDLDBCQUFpQixDQUFDLENBQUNDLE1BQU0sS0FBSyxDQUFDO0lBQ2xHLE1BQU1DLFFBQVEsR0FBRyxJQUFJLENBQUNuSSxLQUFLLENBQUNvQyxNQUFNLENBQUNyRSxHQUFHLENBQUMsdUNBQXVDLENBQUM7SUFDL0UsTUFBTXFLLGFBQWEsR0FBRyxJQUFJLENBQUNwSSxLQUFLLENBQUN3RSxtQkFBbUIsSUFBSXNELGlCQUFpQjs7SUFFekU7SUFDQSxNQUFNTyxRQUFRLEdBQUc7TUFDZkMsZUFBZSxFQUFFO1FBQ2ZDLEtBQUssRUFBRSx3SEFBd0g7UUFBRTtRQUNqSUMsS0FBSyxFQUFFLGdJQUFnSSxDQUFFO01BQzNJLENBQUM7TUFDREMsZ0JBQWdCLEVBQUU7UUFDaEJGLEtBQUssRUFBRTtNQUNUO0lBQ0YsQ0FBQztJQUNEOztJQUVBLElBQUlILGFBQWEsRUFBRTtNQUNqQixPQUFPLElBQUk7SUFDYjtJQUVBLElBQUlELFFBQVEsRUFBRTtNQUNaLE9BQ0VoTSxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO1FBQUtDLFNBQVMsRUFBRSxJQUFBbUIsbUJBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFFO1VBQUNtRSxNQUFNLEVBQUVOLGFBQWEsSUFBSSxDQUFDRDtRQUFRLENBQUM7TUFBRSxHQUNwR2hNLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7UUFBS3dGLEtBQUssRUFBQyxJQUFJO1FBQUNDLE1BQU0sRUFBQyxJQUFJO1FBQUN6QyxPQUFPLEVBQUMsV0FBVztRQUFDQyxLQUFLLEVBQUM7TUFBNEIsR0FDaEZqSyxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO1FBQU1rRCxDQUFDLEVBQUVnQyxRQUFRLENBQUNJLGdCQUFnQixDQUFDRixLQUFNO1FBQUNNLFFBQVEsRUFBQztNQUFTLENBQUUsQ0FDM0QsQ0FDRixDQUFDO0lBRVYsQ0FBQyxNQUFNO01BQ0wsT0FDRTFNLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7UUFBS0MsU0FBUyxFQUFFLElBQUFtQixtQkFBRSxFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsd0JBQXdCLEVBQUU7VUFBQ21FLE1BQU0sRUFBRU4sYUFBYSxJQUFJRDtRQUFRLENBQUM7TUFBRSxHQUN2R2hNLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7UUFBS3dGLEtBQUssRUFBQyxJQUFJO1FBQUNDLE1BQU0sRUFBQyxJQUFJO1FBQUN6QyxPQUFPLEVBQUMsV0FBVztRQUFDQyxLQUFLLEVBQUM7TUFBNEIsR0FDaEZqSyxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO1FBQUcwRixRQUFRLEVBQUM7TUFBUyxHQUNuQjFNLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7UUFBTWtELENBQUMsRUFBRWdDLFFBQVEsQ0FBQ0MsZUFBZSxDQUFDQztNQUFNLENBQUUsQ0FBQyxFQUMzQ3BNLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUE7UUFBTTBGLFFBQVEsRUFBQyxTQUFTO1FBQUN4QyxDQUFDLEVBQUVnQyxRQUFRLENBQUNDLGVBQWUsQ0FBQ0U7TUFBTSxDQUFFLENBQzVELENBQ0EsQ0FDRixDQUFDO0lBRVY7RUFDRjtFQUVBM0Msa0JBQWtCQSxDQUFBLEVBQUc7SUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQzFGLEtBQUssQ0FBQ0csZ0JBQWdCLEVBQUU7TUFDaEMsT0FBTyxJQUFJO0lBQ2I7SUFFQSxPQUNFbkUsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxDQUFDdkcsYUFBQSxDQUFBaUIsT0FBWTtNQUNYd0YsR0FBRyxFQUFFLElBQUksQ0FBQ2pDLGVBQWUsQ0FBQ2tDLE1BQU87TUFDakNFLFFBQVEsRUFBRSxJQUFJLENBQUN4RCxLQUFLLENBQUN3RCxRQUFTO01BQzlCc0YsUUFBUSxFQUFFLElBQUksQ0FBQ0MsaUJBQWtCO01BQ2pDQyxRQUFRLEVBQUUsSUFBSSxDQUFDQyxpQkFBa0I7TUFDakNDLElBQUksRUFBRSxJQUFJLENBQUMvSSxLQUFLLENBQUNJO0lBQWMsQ0FDaEMsQ0FBQztFQUVOO0VBRUF3SSxpQkFBaUJBLENBQUNJLFNBQVMsRUFBRTtJQUMzQixJQUFJLENBQUNuSixLQUFLLENBQUNvSix1QkFBdUIsQ0FBQyxJQUFJLENBQUNwSixLQUFLLENBQUN5SCxpQkFBaUIsRUFBRTBCLFNBQVMsQ0FBQztJQUMzRSxJQUFJLENBQUNFLGlCQUFpQixDQUFDLENBQUM7RUFDMUI7RUFFQUosaUJBQWlCQSxDQUFBLEVBQUc7SUFDbEIsSUFBSSxDQUFDSSxpQkFBaUIsQ0FBQyxDQUFDO0VBQzFCO0VBRUFBLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLElBQUksQ0FBQ0MsUUFBUSxDQUFDO01BQUNoSixnQkFBZ0IsRUFBRTtJQUFLLENBQUMsRUFBRSxNQUFNO01BQzdDLElBQUksQ0FBQ2EsaUJBQWlCLENBQUNvSSxHQUFHLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQztFQUNKOztFQUVBO0VBQ0FDLGdDQUFnQ0EsQ0FBQ0MsU0FBUyxFQUFFO0lBQzFDLElBQUksQ0FBQ3pILG1CQUFtQixDQUFDeUgsU0FBUyxDQUFDO0VBQ3JDO0VBRUFDLG9CQUFvQkEsQ0FBQSxFQUFHO0lBQ3JCLElBQUksQ0FBQ3JJLElBQUksQ0FBQ3NJLE9BQU8sQ0FBQyxDQUFDO0VBQ3JCO0VBRUExRSxhQUFhQSxDQUFBLEVBQUc7SUFDZCxJQUFJLENBQUM3QyxXQUFXLENBQUMsQ0FBQztFQUNwQjtFQUVBcUQsY0FBY0EsQ0FBQSxFQUFHO0lBQ2YsTUFBTW1FLGNBQWMsR0FBRyxJQUFJLENBQUM5SixLQUFLLENBQUNvQyxNQUFNLENBQUNyRSxHQUFHLENBQUMsdUNBQXVDLENBQUM7SUFDckYsSUFBSSxDQUFDaUMsS0FBSyxDQUFDb0MsTUFBTSxDQUFDekQsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLENBQUNtTCxjQUFjLENBQUM7RUFDakY7RUFFQXpFLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQ3BCLElBQUksQ0FBQ2lFLFFBQVEsQ0FBQztNQUNaakosaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUNGLEtBQUssQ0FBQ0U7SUFDakMsQ0FBQyxFQUFFLE1BQU07TUFDUCxJQUFJLElBQUksQ0FBQ0YsS0FBSyxDQUFDRSxpQkFBaUIsRUFBRTtRQUNoQyxJQUFBMEosK0JBQWdCLEVBQUMsc0JBQXNCLENBQUM7UUFDeEMsSUFBSSxDQUFDNUksaUJBQWlCLENBQUNvSSxHQUFHLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQzVDLENBQUMsTUFBTTtRQUNMO1FBQ0EsSUFBSSxDQUFDekosS0FBSyxDQUFDb0osdUJBQXVCLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUFXLCtCQUFnQixFQUFDLHNCQUFzQixDQUFDO01BQzFDO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQS9GLGVBQWVBLENBQUEsRUFBRztJQUNoQixNQUFNZ0csTUFBTSxHQUFHLElBQUksQ0FBQzdJLGlCQUFpQixDQUFDb0ksR0FBRyxDQUFDQyxDQUFDLElBQUlBLENBQUMsQ0FBQ1MsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDaEYsSUFBSSxDQUFDRixNQUFNLElBQUlBLE1BQU0sQ0FBQ0csS0FBSyxDQUFDLENBQUMsRUFBRTtNQUM3QjtJQUNGO0lBRUEsSUFBSUMsUUFBUSxHQUFHLElBQUksQ0FBQ3BLLEtBQUssQ0FBQ29DLE1BQU0sQ0FBQ3JFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztJQUM1RCxJQUFJcU0sUUFBUSxJQUFJQSxRQUFRLEtBQUssRUFBRSxFQUFFO01BQy9CQSxRQUFRLElBQUksSUFBSTtJQUNsQjtJQUNBQSxRQUFRLElBQUlKLE1BQU0sQ0FBQ0ssUUFBUSxDQUFDLENBQUM7SUFDN0IsSUFBSSxDQUFDckssS0FBSyxDQUFDb0MsTUFBTSxDQUFDekQsR0FBRyxDQUFDLHNCQUFzQixFQUFFeUwsUUFBUSxDQUFDO0VBQ3pEO0VBRUFyRSxVQUFVQSxDQUFBLEVBQUc7SUFDWCxJQUFJLENBQUMvRixLQUFLLENBQUMrRixVQUFVLENBQUMsQ0FBQztFQUN6QjtFQUVBLE1BQU1sQyxNQUFNQSxDQUFDeUcsS0FBSyxFQUFFQyxLQUFLLEVBQUU7SUFDekIsSUFBSSxPQUFNLElBQUksQ0FBQ3ZLLEtBQUssQ0FBQ3dLLGVBQWUsQ0FBQyxDQUFDLEtBQUksSUFBSSxDQUFDeEUsZUFBZSxDQUFDdUUsS0FBSyxDQUFDLEVBQUU7TUFDckUsSUFBSTtRQUNGLE1BQU0sSUFBSSxDQUFDdkssS0FBSyxDQUFDNkQsTUFBTSxDQUFDLElBQUksQ0FBQzdELEtBQUssQ0FBQ3VDLGFBQWEsQ0FBQ3dGLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDL0gsS0FBSyxDQUFDeUgsaUJBQWlCLEVBQUU4QyxLQUFLLENBQUM7TUFDbEcsQ0FBQyxDQUFDLE9BQU8vTSxDQUFDLEVBQUU7UUFDVjtRQUNBLElBQUksQ0FBQ2lOLElBQUksQ0FBQ0MsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO1VBQzdCLE1BQU1sTixDQUFDO1FBQ1Q7TUFDRjtJQUNGLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ21OLFFBQVEsQ0FBQy9LLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ21CLE1BQU0sQ0FBQztJQUN4QztFQUNGO0VBRUE5RyxlQUFlQSxDQUFBLEVBQUc7SUFDaEIsSUFBQWlHLCtCQUFnQixFQUFDLE9BQU8sQ0FBQztJQUN6QixJQUFJLENBQUNsRyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztFQUN6QjtFQUVBakIsc0JBQXNCQSxDQUFBLEVBQUc7SUFDdkIsT0FBTyxJQUFJLENBQUN0QixjQUFjLENBQUNpSSxHQUFHLENBQUNzQixNQUFNLElBQUk7TUFDdkMsSUFBSUEsTUFBTSxDQUFDQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUNDLEdBQUcsS0FBSyxDQUFDLEVBQUU7UUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQy9LLEtBQUssQ0FBQzZDLHFCQUFxQixHQUFHZ0ksTUFBTSxDQUFDRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzlDLE1BQU0sRUFBRStDLFFBQVEsQ0FBQyxDQUFDO01BQzlGLENBQUMsTUFBTTtRQUNMLE9BQU8sR0FBRztNQUNaO0lBQ0YsQ0FBQyxDQUFDLENBQUNmLEtBQUssQ0FBQyxJQUFJLENBQUNsSyxLQUFLLENBQUM2QyxxQkFBcUIsSUFBSSxFQUFFLENBQUM7RUFDbEQ7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0FYLG1CQUFtQkEsQ0FBQ2xDLEtBQUssRUFBRTtJQUN6QixJQUFJQSxLQUFLLENBQUNrTCxZQUFZLEVBQUU7TUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQy9LLEtBQUssQ0FBQ0MsV0FBVyxJQUFJLElBQUksQ0FBQ0ksYUFBYSxLQUFLLElBQUksRUFBRTtRQUMxRCxJQUFJLENBQUNBLGFBQWEsR0FBRzJLLFVBQVUsQ0FBQyxNQUFNO1VBQ3BDLElBQUksQ0FBQzNLLGFBQWEsR0FBRyxJQUFJO1VBQ3pCLElBQUksQ0FBQzhJLFFBQVEsQ0FBQztZQUFDbEosV0FBVyxFQUFFO1VBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDVjtJQUNGLENBQUMsTUFBTTtNQUNMZ0wsWUFBWSxDQUFDLElBQUksQ0FBQzVLLGFBQWEsQ0FBQztNQUNoQyxJQUFJLENBQUNBLGFBQWEsR0FBRyxJQUFJO01BQ3pCLElBQUksQ0FBQzhJLFFBQVEsQ0FBQztRQUFDbEosV0FBVyxFQUFFO01BQUssQ0FBQyxDQUFDO0lBQ3JDO0VBQ0Y7RUFFQWlMLGNBQWNBLENBQUEsRUFBRztJQUNmO0lBQ0E7SUFDQSxPQUFPLElBQUksQ0FBQ3JMLEtBQUssQ0FBQ3VDLGFBQWEsQ0FBQ3dGLE9BQU8sQ0FBQyxDQUFDLENBQUN1RCxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDQyxJQUFJLENBQUMsQ0FBQyxDQUFDckQsTUFBTSxLQUFLLENBQUM7RUFDdEY7RUFFQWxDLGVBQWVBLENBQUN1RSxLQUFLLEVBQUU7SUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQ3ZLLEtBQUssQ0FBQ2tMLFlBQVksS0FDNUJYLEtBQUssSUFBSSxJQUFJLENBQUN2SyxLQUFLLENBQUNtRSxrQkFBa0IsQ0FBQyxJQUN4QyxDQUFDLElBQUksQ0FBQ25FLEtBQUssQ0FBQ3dMLG1CQUFtQixJQUMvQixJQUFJLENBQUN4TCxLQUFLLENBQUN5TCxVQUFVLENBQUNDLFNBQVMsQ0FBQyxDQUFDLEtBQ2hDLElBQUksQ0FBQzFMLEtBQUssQ0FBQ3dFLG1CQUFtQixJQUFLK0YsS0FBSyxJQUFJLElBQUksQ0FBQ2MsY0FBYyxDQUFDLENBQUUsQ0FBQztFQUN4RTtFQUVBcEYsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDakIsSUFBSSxJQUFJLENBQUM5RixLQUFLLENBQUNDLFdBQVcsRUFBRTtNQUMxQixPQUFPLFlBQVk7SUFDckIsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDSixLQUFLLENBQUMyTCxhQUFhLENBQUNDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7TUFDaEQsT0FBTyx3QkFBd0I7SUFDakMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDNUwsS0FBSyxDQUFDMkwsYUFBYSxDQUFDRCxTQUFTLENBQUMsQ0FBQyxFQUFFO01BQy9DLE9BQVEsYUFBWSxJQUFJLENBQUMxTCxLQUFLLENBQUMyTCxhQUFhLENBQUNFLE9BQU8sQ0FBQyxDQUFFLEVBQUM7SUFDMUQsQ0FBQyxNQUFNO01BQ0wsT0FBTyxRQUFRO0lBQ2pCO0VBQ0Y7RUFFQTlILGlDQUFpQ0EsQ0FBQSxFQUFHO0lBQ2xDLE9BQU8sSUFBSSxDQUFDL0QsS0FBSyxDQUFDK0QsaUNBQWlDLENBQUMsSUFBSSxDQUFDL0QsS0FBSyxDQUFDdUMsYUFBYSxDQUFDd0YsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUN6RjtFQUVBYixZQUFZQSxDQUFDNEUsT0FBTyxFQUFFQyxVQUFVLEVBQUVDLGVBQWUsRUFBRTtJQUNqRCxNQUFNQyxjQUFjLEdBQUdILE9BQU8sQ0FBQ0ksTUFBTSxDQUFDLENBQUNsQyxNQUFNLEVBQUVtQyxLQUFLLEtBQUs7TUFDdkQsTUFBTUMsaUJBQWlCLEdBQUdKLGVBQWUsSUFBSUEsZUFBZSxDQUFDSyxJQUFJLENBQUNDLFFBQVEsSUFBSUEsUUFBUSxDQUFDQyxPQUFPLENBQUN2QyxNQUFNLENBQUMsQ0FBQztNQUN2RyxNQUFNd0MsYUFBYSxHQUFHLENBQ3BCeEMsTUFBTSxDQUFDeUMsUUFBUSxDQUFDLENBQUMsRUFDakJ6QyxNQUFNLENBQUMwQyxXQUFXLENBQUMsQ0FBQyxFQUNwQjFDLE1BQU0sQ0FBQ0ssUUFBUSxDQUFDLENBQUMsQ0FDbEIsQ0FBQ3NDLElBQUksQ0FBQ0MsS0FBSyxJQUFJQSxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQ0MsT0FBTyxDQUFDZixVQUFVLENBQUNjLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUV0RixPQUFPLENBQUNULGlCQUFpQixJQUFJSSxhQUFhO0lBQzVDLENBQUMsQ0FBQztJQUNGUCxjQUFjLENBQUNjLElBQUksQ0FBQ0MsZUFBTSxDQUFDQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUVsQixVQUFVLENBQUMsQ0FBQztJQUNuRSxPQUFPRSxjQUFjO0VBQ3ZCO0VBRUFpQiwyQkFBMkJBLENBQUNDLFNBQVMsRUFBRXBPLEtBQUssRUFBRTtJQUM1QyxJQUFJLENBQUNBLEtBQUssSUFBSUEsS0FBSyxDQUFDbUosTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNoQyxPQUFPLElBQUk7SUFDYjtJQUVBLE9BQ0UvTCxNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO01BQU1DLFNBQVMsRUFBRyxvQ0FBbUMrSixTQUFVO0lBQUUsR0FBRXBPLEtBQVksQ0FBQztFQUVwRjtFQUVBcUksc0JBQXNCQSxDQUFDNEMsTUFBTSxFQUFFO0lBQzdCLE9BQ0U3TixNQUFBLENBQUEwQixPQUFBLENBQUFzRixhQUFBO01BQUtDLFNBQVMsRUFBRSxJQUFBbUIsbUJBQUUsRUFBQyxpREFBaUQsRUFBRTtRQUFDLFlBQVksRUFBRXlGLE1BQU0sQ0FBQ0csS0FBSyxDQUFDO01BQUMsQ0FBQztJQUFFLEdBQ25HLElBQUksQ0FBQytDLDJCQUEyQixDQUFDLE1BQU0sRUFBRWxELE1BQU0sQ0FBQzBDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFDOUQxQyxNQUFNLENBQUNvRCxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQ0YsMkJBQTJCLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBR2xELE1BQU0sQ0FBQ3lDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDdkYsSUFBSSxDQUFDUywyQkFBMkIsQ0FBQyxPQUFPLEVBQUVsRCxNQUFNLENBQUNLLFFBQVEsQ0FBQyxDQUFDLENBQ3pELENBQUM7RUFFVjtFQUVBL0MsbUJBQW1CQSxDQUFDMEMsTUFBTSxFQUFFO0lBQzFCLE1BQU1xRCxRQUFRLEdBQUdyRCxNQUFNLENBQUMwQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxJQUFJVyxRQUFRLElBQUlBLFFBQVEsQ0FBQ25GLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDbkMsT0FBTy9MLE1BQUEsQ0FBQTBCLE9BQUEsQ0FBQXNGLGFBQUEsZUFBTzZHLE1BQU0sQ0FBQzBDLFdBQVcsQ0FBQyxDQUFRLENBQUM7SUFDNUM7SUFDQSxJQUFJMUMsTUFBTSxDQUFDb0QsUUFBUSxDQUFDLENBQUMsRUFBRTtNQUNyQixPQUFPalIsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxvQkFBUTZHLE1BQU0sQ0FBQ3lDLFFBQVEsQ0FBQyxDQUFRLENBQUM7SUFDMUM7SUFFQSxPQUFPdFEsTUFBQSxDQUFBMEIsT0FBQSxDQUFBc0YsYUFBQSxlQUFPNkcsTUFBTSxDQUFDSyxRQUFRLENBQUMsQ0FBUSxDQUFDO0VBQ3pDO0VBRUE3QywwQkFBMEJBLENBQUNDLGlCQUFpQixFQUFFO0lBQzVDLElBQUFzQywrQkFBZ0IsRUFBQyw2QkFBNkIsQ0FBQztJQUMvQyxNQUFNWixTQUFTLEdBQUcxQixpQkFBaUIsQ0FBQzRFLElBQUksQ0FBQ3JDLE1BQU0sSUFBSUEsTUFBTSxDQUFDRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWxFLElBQUloQixTQUFTLEVBQUU7TUFDYixJQUFJLENBQUNHLFFBQVEsQ0FBQztRQUFDL0ksYUFBYSxFQUFFNEksU0FBUyxDQUFDdUQsV0FBVyxDQUFDLENBQUM7UUFBRXBNLGdCQUFnQixFQUFFO01BQUksQ0FBQyxDQUFDO0lBQ2pGLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ04sS0FBSyxDQUFDb0osdUJBQXVCLENBQUMzQixpQkFBaUIsQ0FBQztJQUN2RDtFQUNGO0VBRUE2RixRQUFRQSxDQUFBLEVBQUc7SUFDVCxPQUFPLElBQUksQ0FBQzNNLE9BQU8sQ0FBQzRJLEdBQUcsQ0FBQ2dFLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxRQUFRLENBQUNDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQ3hELEtBQUssQ0FBQyxLQUFLLENBQUM7RUFDM0Y7RUFFQXlELFFBQVFBLENBQUNKLE9BQU8sRUFBRTtJQUNoQixJQUFJLElBQUksQ0FBQzFNLHNCQUFzQixDQUFDMEksR0FBRyxDQUFDcUUsTUFBTSxJQUFJQSxNQUFNLENBQUNKLFFBQVEsQ0FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQ3JELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNwRixPQUFPdEssVUFBVSxDQUFDNkosS0FBSyxDQUFDb0UscUJBQXFCO0lBQy9DO0lBRUEsSUFBSSxJQUFJLENBQUN4TSxrQkFBa0IsQ0FBQ2tJLEdBQUcsQ0FBQ3NCLE1BQU0sSUFBSUEsTUFBTSxDQUFDMkMsUUFBUSxDQUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDckQsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2hGLE9BQU90SyxVQUFVLENBQUM2SixLQUFLLENBQUNtQixNQUFNO0lBQ2hDO0lBRUEsSUFBSSxJQUFJLENBQUMzSixtQkFBbUIsQ0FBQ3NJLEdBQUcsQ0FBQy9MLENBQUMsSUFBSUEsQ0FBQyxDQUFDZ1EsUUFBUSxDQUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDckQsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3ZFLE9BQU90SyxVQUFVLENBQUM2SixLQUFLLENBQUNxRSxrQkFBa0I7SUFDNUM7SUFFQSxJQUFJLElBQUksQ0FBQy9NLGVBQWUsQ0FBQ3dJLEdBQUcsQ0FBQy9MLENBQUMsSUFBSUEsQ0FBQyxDQUFDZ1EsUUFBUSxDQUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDckQsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ25FLE9BQU90SyxVQUFVLENBQUM2SixLQUFLLENBQUNzRSxhQUFhO0lBQ3ZDO0lBRUEsSUFBSSxJQUFJLENBQUM1TSxpQkFBaUIsQ0FBQ29JLEdBQUcsQ0FBQ0MsQ0FBQyxJQUFJQSxDQUFDLENBQUN3RSxPQUFPLElBQUl4RSxDQUFDLENBQUN3RSxPQUFPLENBQUNSLFFBQVEsQ0FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQ3JELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUMxRixPQUFPdEssVUFBVSxDQUFDNkosS0FBSyxDQUFDd0UsY0FBYztJQUN4QztJQUVBLE9BQU8sSUFBSTtFQUNiO0VBRUF0RCxRQUFRQSxDQUFDbEIsS0FBSyxFQUFFO0lBQ2QsSUFBSXlFLFFBQVEsR0FBRyxLQUFLO0lBQ3BCLE1BQU1DLFlBQVksR0FBR1osT0FBTyxJQUFJO01BQzlCQSxPQUFPLENBQUM5RCxLQUFLLENBQUMsQ0FBQztNQUNmLE9BQU8sSUFBSTtJQUNiLENBQUM7SUFFRCxJQUFJQSxLQUFLLEtBQUs3SixVQUFVLENBQUM2SixLQUFLLENBQUNvRSxxQkFBcUIsRUFBRTtNQUNwRCxJQUFJLElBQUksQ0FBQ2hOLHNCQUFzQixDQUFDMEksR0FBRyxDQUFDNEUsWUFBWSxDQUFDLENBQUNqRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDOUQsT0FBTyxJQUFJO01BQ2I7SUFDRjtJQUVBLElBQUlULEtBQUssS0FBSzdKLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ21CLE1BQU0sRUFBRTtNQUNyQyxJQUFJLElBQUksQ0FBQ3ZKLGtCQUFrQixDQUFDa0ksR0FBRyxDQUFDNEUsWUFBWSxDQUFDLENBQUNqRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUQsSUFBSSxJQUFJLENBQUNsSyxLQUFLLENBQUN1QyxhQUFhLENBQUN3RixPQUFPLENBQUMsQ0FBQyxDQUFDRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDbUQsY0FBYyxDQUFDLENBQUMsRUFBRTtVQUMzRTtVQUNBO1VBQ0EsSUFBSSxDQUFDaEssa0JBQWtCLENBQUN0RCxHQUFHLENBQUMsQ0FBQyxDQUFDcVEsUUFBUSxDQUFDLENBQUMsQ0FBQ0MsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUU7UUFDQSxPQUFPLElBQUk7TUFDYjtJQUNGO0lBRUEsSUFBSTVFLEtBQUssS0FBSzdKLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ3FFLGtCQUFrQixFQUFFO01BQ2pELElBQUksSUFBSSxDQUFDN00sbUJBQW1CLENBQUNzSSxHQUFHLENBQUM0RSxZQUFZLENBQUMsQ0FBQ2pFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzRCxPQUFPLElBQUk7TUFDYjtNQUNBZ0UsUUFBUSxHQUFHLElBQUk7SUFDakI7SUFFQSxJQUFJekUsS0FBSyxLQUFLN0osVUFBVSxDQUFDNkosS0FBSyxDQUFDc0UsYUFBYSxFQUFFO01BQzVDLElBQUksSUFBSSxDQUFDaE4sZUFBZSxDQUFDd0ksR0FBRyxDQUFDNEUsWUFBWSxDQUFDLENBQUNqRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkQsT0FBTyxJQUFJO01BQ2I7TUFDQWdFLFFBQVEsR0FBRyxJQUFJO0lBQ2pCO0lBRUEsSUFBSXpFLEtBQUssS0FBSzdKLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ3dFLGNBQWMsRUFBRTtNQUM3QyxJQUFJLElBQUksQ0FBQzlNLGlCQUFpQixDQUFDb0ksR0FBRyxDQUFDNEUsWUFBWSxDQUFDLENBQUNqRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekQsT0FBTyxJQUFJO01BQ2I7TUFDQWdFLFFBQVEsR0FBRyxJQUFJO0lBQ2pCO0lBRUEsSUFBSXpFLEtBQUssS0FBSzdKLFVBQVUsQ0FBQzBPLFNBQVMsRUFBRTtNQUNsQyxJQUFJLElBQUksQ0FBQ3RJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMvQixPQUFPLElBQUksQ0FBQzJFLFFBQVEsQ0FBQy9LLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ3NFLGFBQWEsQ0FBQztNQUN0RCxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMvTixLQUFLLENBQUMrQyxTQUFTLEVBQUU7UUFDL0IsT0FBTyxJQUFJLENBQUM0SCxRQUFRLENBQUMvSyxVQUFVLENBQUM2SixLQUFLLENBQUNxRSxrQkFBa0IsQ0FBQztNQUMzRCxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMzTixLQUFLLENBQUNFLGlCQUFpQixFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDc0ssUUFBUSxDQUFDL0ssVUFBVSxDQUFDNkosS0FBSyxDQUFDd0UsY0FBYyxDQUFDO01BQ3ZELENBQUMsTUFBTTtRQUNMLE9BQU8sSUFBSSxDQUFDdEQsUUFBUSxDQUFDL0ssVUFBVSxDQUFDNkosS0FBSyxDQUFDbUIsTUFBTSxDQUFDO01BQy9DO0lBQ0Y7SUFFQSxJQUFJc0QsUUFBUSxJQUFJLElBQUksQ0FBQzdNLGtCQUFrQixDQUFDa0ksR0FBRyxDQUFDNEUsWUFBWSxDQUFDLENBQUNqRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDdEUsT0FBTyxJQUFJO0lBQ2I7SUFFQSxPQUFPLEtBQUs7RUFDZDtFQUVBcUUsZ0JBQWdCQSxDQUFDOUUsS0FBSyxFQUFFO0lBQ3RCLE1BQU0rRSxDQUFDLEdBQUcsSUFBSSxDQUFDek8sV0FBVyxDQUFDMEosS0FBSztJQUVoQyxJQUFJZ0YsSUFBSSxHQUFHLElBQUk7SUFDZixRQUFRaEYsS0FBSztNQUNiLEtBQUsrRSxDQUFDLENBQUNYLHFCQUFxQjtRQUMxQlksSUFBSSxHQUFHRCxDQUFDLENBQUM1RCxNQUFNO1FBQ2Y7TUFDRixLQUFLNEQsQ0FBQyxDQUFDNUQsTUFBTTtRQUNYLElBQUksSUFBSSxDQUFDekssS0FBSyxDQUFDRSxpQkFBaUIsRUFBRTtVQUNoQ29PLElBQUksR0FBR0QsQ0FBQyxDQUFDUCxjQUFjO1FBQ3pCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQ2pPLEtBQUssQ0FBQytDLFNBQVMsRUFBRTtVQUMvQjBMLElBQUksR0FBR0QsQ0FBQyxDQUFDVixrQkFBa0I7UUFDN0IsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDOUgsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1VBQ3RDeUksSUFBSSxHQUFHRCxDQUFDLENBQUNULGFBQWE7UUFDeEIsQ0FBQyxNQUFNO1VBQ0xVLElBQUksR0FBR0MsMEJBQWlCLENBQUNDLFVBQVU7UUFDckM7UUFDQTtNQUNGLEtBQUtILENBQUMsQ0FBQ1AsY0FBYztRQUNuQixJQUFJLElBQUksQ0FBQ2pPLEtBQUssQ0FBQytDLFNBQVMsRUFBRTtVQUN4QjBMLElBQUksR0FBR0QsQ0FBQyxDQUFDVixrQkFBa0I7UUFDN0IsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDOUgsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1VBQ3RDeUksSUFBSSxHQUFHRCxDQUFDLENBQUNULGFBQWE7UUFDeEIsQ0FBQyxNQUFNO1VBQ0xVLElBQUksR0FBR0MsMEJBQWlCLENBQUNDLFVBQVU7UUFDckM7UUFDQTtNQUNGLEtBQUtILENBQUMsQ0FBQ1Ysa0JBQWtCO1FBQ3ZCVyxJQUFJLEdBQUcsSUFBSSxDQUFDekksZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHd0ksQ0FBQyxDQUFDVCxhQUFhLEdBQUdXLDBCQUFpQixDQUFDQyxVQUFVO1FBQ25GO01BQ0YsS0FBS0gsQ0FBQyxDQUFDVCxhQUFhO1FBQ2xCVSxJQUFJLEdBQUdDLDBCQUFpQixDQUFDQyxVQUFVO1FBQ25DO0lBQ0Y7SUFFQSxPQUFPQyxPQUFPLENBQUNDLE9BQU8sQ0FBQ0osSUFBSSxDQUFDO0VBQzlCO0VBRUFLLGdCQUFnQkEsQ0FBQ3JGLEtBQUssRUFBRTtJQUN0QixNQUFNK0UsQ0FBQyxHQUFHLElBQUksQ0FBQ3pPLFdBQVcsQ0FBQzBKLEtBQUs7SUFFaEMsSUFBSXNGLFFBQVEsR0FBRyxJQUFJO0lBQ25CLFFBQVF0RixLQUFLO01BQ2IsS0FBSytFLENBQUMsQ0FBQ1QsYUFBYTtRQUNsQixJQUFJLElBQUksQ0FBQy9OLEtBQUssQ0FBQytDLFNBQVMsRUFBRTtVQUN4QmdNLFFBQVEsR0FBR1AsQ0FBQyxDQUFDVixrQkFBa0I7UUFDakMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDM04sS0FBSyxDQUFDRSxpQkFBaUIsRUFBRTtVQUN2QzBPLFFBQVEsR0FBR1AsQ0FBQyxDQUFDUCxjQUFjO1FBQzdCLENBQUMsTUFBTTtVQUNMYyxRQUFRLEdBQUdQLENBQUMsQ0FBQzVELE1BQU07UUFDckI7UUFDQTtNQUNGLEtBQUs0RCxDQUFDLENBQUNWLGtCQUFrQjtRQUN2QmlCLFFBQVEsR0FBRyxJQUFJLENBQUM1TyxLQUFLLENBQUNFLGlCQUFpQixHQUFHbU8sQ0FBQyxDQUFDUCxjQUFjLEdBQUdPLENBQUMsQ0FBQzVELE1BQU07UUFDckU7TUFDRixLQUFLNEQsQ0FBQyxDQUFDUCxjQUFjO1FBQ25CYyxRQUFRLEdBQUdQLENBQUMsQ0FBQzVELE1BQU07UUFDbkI7TUFDRixLQUFLNEQsQ0FBQyxDQUFDNUQsTUFBTTtRQUNYbUUsUUFBUSxHQUFHUCxDQUFDLENBQUNYLHFCQUFxQjtRQUNsQztNQUNGLEtBQUtXLENBQUMsQ0FBQ1gscUJBQXFCO1FBQzFCa0IsUUFBUSxHQUFHQyxvQkFBVyxDQUFDVixTQUFTO1FBQ2hDO0lBQ0Y7SUFFQSxPQUFPTSxPQUFPLENBQUNDLE9BQU8sQ0FBQ0UsUUFBUSxDQUFDO0VBQ2xDO0FBQ0Y7QUFBQ0UsT0FBQSxDQUFBcFIsT0FBQSxHQUFBK0IsVUFBQTtBQUFBZixlQUFBLENBcnNCb0JlLFVBQVUsV0FDZDtFQUNiaU8scUJBQXFCLEVBQUV2TyxNQUFNLENBQUMsdUJBQXVCLENBQUM7RUFDdERzTCxNQUFNLEVBQUV0TCxNQUFNLENBQUMsZUFBZSxDQUFDO0VBQy9CMk8sY0FBYyxFQUFFM08sTUFBTSxDQUFDLGdCQUFnQixDQUFDO0VBQ3hDd08sa0JBQWtCLEVBQUV4TyxNQUFNLENBQUMsMkJBQTJCLENBQUM7RUFDdkR5TyxhQUFhLEVBQUV6TyxNQUFNLENBQUMsZUFBZTtBQUN2QyxDQUFDO0FBQUFULGVBQUEsQ0FQa0JlLFVBQVUsZ0JBU1RBLFVBQVUsQ0FBQzZKLEtBQUssQ0FBQ29FLHFCQUFxQjtBQUFBaFAsZUFBQSxDQVR2Q2UsVUFBVSxlQVdWTixNQUFNLENBQUMsWUFBWSxDQUFDO0FBQUFULGVBQUEsQ0FYcEJlLFVBQVUsZUFhVjtFQUNqQnFGLFNBQVMsRUFBRWlLLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUN0Q2hOLE1BQU0sRUFBRThNLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUNuQzVKLFFBQVEsRUFBRTBKLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUNyQzVMLFFBQVEsRUFBRTBMLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUVyQzNELFVBQVUsRUFBRXlELGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUN2Q3pELGFBQWEsRUFBRXVELGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUMxQ3JNLFNBQVMsRUFBRW1NLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUNwQzVELG1CQUFtQixFQUFFMEQsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDRCxVQUFVO0VBQzlDakwsa0JBQWtCLEVBQUUrSyxrQkFBUyxDQUFDRyxJQUFJLENBQUNELFVBQVU7RUFDN0NsRSxZQUFZLEVBQUVnRSxrQkFBUyxDQUFDRyxJQUFJLENBQUNELFVBQVU7RUFDdkM5SyxtQkFBbUIsRUFBRTRLLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUM5QzVLLG1CQUFtQixFQUFFMEssa0JBQVMsQ0FBQ0csSUFBSSxDQUFDRCxVQUFVO0VBQzlDdk0scUJBQXFCLEVBQUVxTSxrQkFBUyxDQUFDSSxNQUFNLENBQUNGLFVBQVU7RUFDbEQ3TSxhQUFhLEVBQUUyTSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFBRTtFQUM1QzdJLFNBQVMsRUFBRWdKLDZCQUFpQixDQUFDSCxVQUFVO0VBQ3ZDM0gsaUJBQWlCLEVBQUV5SCxrQkFBUyxDQUFDTSxPQUFPLENBQUNDLDBCQUFjLENBQUM7RUFDcERyRyx1QkFBdUIsRUFBRThGLGtCQUFTLENBQUNRLElBQUk7RUFDdkM3TCxNQUFNLEVBQUVxTCxrQkFBUyxDQUFDUSxJQUFJLENBQUNOLFVBQVU7RUFDakNySixVQUFVLEVBQUVtSixrQkFBUyxDQUFDUSxJQUFJLENBQUNOLFVBQVU7RUFDckM1RSxlQUFlLEVBQUUwRSxrQkFBUyxDQUFDUSxJQUFJLENBQUNOLFVBQVU7RUFDMUNyTCxpQ0FBaUMsRUFBRW1MLGtCQUFTLENBQUNRLElBQUksQ0FBQ04sVUFBVTtFQUM1RC9LLG1CQUFtQixFQUFFNkssa0JBQVMsQ0FBQ1EsSUFBSSxDQUFDTixVQUFVO0VBQzlDbkwscUJBQXFCLEVBQUVpTCxrQkFBUyxDQUFDUSxJQUFJLENBQUNOO0FBQ3hDLENBQUMifQ==