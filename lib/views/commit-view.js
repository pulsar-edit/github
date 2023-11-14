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
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfZXZlbnRLaXQiLCJfY2xhc3NuYW1lcyIsIl9yZWFjdFNlbGVjdCIsIl90b29sdGlwIiwiX2F0b21UZXh0RWRpdG9yIiwiX2NvQXV0aG9yRm9ybSIsIl9yZWNlbnRDb21taXRzVmlldyIsIl9zdGFnaW5nVmlldyIsIl9jb21tYW5kcyIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX3JlZkhvbGRlciIsIl9hdXRob3IiLCJfb2JzZXJ2ZU1vZGVsIiwiX2hlbHBlcnMiLCJfcHJvcFR5cGVzMiIsIl9yZXBvcnRlclByb3h5IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib2JqIiwiX2RlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsIlRPT0xUSVBfREVMQVkiLCJGYWtlS2V5RG93bkV2ZW50IiwiQ29tbWl0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJhdXRvYmluZCIsInN0YXRlIiwic2hvd1dvcmtpbmciLCJzaG93Q29BdXRob3JJbnB1dCIsInNob3dDb0F1dGhvckZvcm0iLCJjb0F1dGhvcklucHV0IiwidGltZW91dEhhbmRsZSIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwicmVmUm9vdCIsIlJlZkhvbGRlciIsInJlZkNvbW1pdFByZXZpZXdCdXR0b24iLCJyZWZFeHBhbmRCdXR0b24iLCJyZWZDb21taXRCdXR0b24iLCJyZWZIYXJkV3JhcEJ1dHRvbiIsInJlZkFib3J0TWVyZ2VCdXR0b24iLCJyZWZDb0F1dGhvclRvZ2dsZSIsInJlZkNvQXV0aG9yU2VsZWN0IiwicmVmQ29BdXRob3JGb3JtIiwicmVmRWRpdG9yQ29tcG9uZW50IiwicmVmRWRpdG9yTW9kZWwiLCJzdWJzIiwicHJveHlLZXlDb2RlIiwia2V5Q29kZSIsImlzRW1wdHkiLCJDdXN0b21FdmVudCIsImtDb2RlIiwiZmFrZUV2ZW50IiwiaGFuZGxlS2V5RG93biIsImRlZmF1bHRQcmV2ZW50ZWQiLCJhYm9ydEtleUJpbmRpbmciLCJVTlNBRkVfY29tcG9uZW50V2lsbE1vdW50Iiwic2NoZWR1bGVTaG93V29ya2luZyIsImFkZCIsImNvbmZpZyIsIm9uRGlkQ2hhbmdlIiwiZm9yY2VVcGRhdGUiLCJtZXNzYWdlQnVmZmVyIiwicmVuZGVyIiwicmVtYWluaW5nQ2hhcnNDbGFzc05hbWUiLCJyZW1haW5pbmdDaGFyYWN0ZXJzIiwicGFyc2VJbnQiLCJnZXRSZW1haW5pbmdDaGFyYWN0ZXJzIiwibWF4aW11bUNoYXJhY3RlckxpbWl0Iiwic2hvd0Fib3J0TWVyZ2VCdXR0b24iLCJpc01lcmdpbmciLCJtb2RLZXkiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVmIiwic2V0dGVyIiwicmVnaXN0cnkiLCJjb21tYW5kcyIsInRhcmdldCIsIkNvbW1hbmQiLCJjb21tYW5kIiwiY2FsbGJhY2siLCJjb21taXQiLCJhbWVuZExhc3RDb21taXQiLCJ0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3IiLCJleGNsdWRlQ29BdXRob3IiLCJhY3RpdmF0ZUNvbW1pdFByZXZpZXciLCJkaXNhYmxlZCIsInN0YWdlZENoYW5nZXNFeGlzdCIsIm9uQ2xpY2siLCJ0b2dnbGVDb21taXRQcmV2aWV3IiwiY29tbWl0UHJldmlld0FjdGl2ZSIsImN4IiwiZGVhY3RpdmF0ZUNvbW1pdEJveCIsInJlZk1vZGVsIiwic29mdFdyYXBwZWQiLCJwbGFjZWhvbGRlclRleHQiLCJsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZSIsInNob3dJbnZpc2libGVzIiwiYXV0b0hlaWdodCIsInNjcm9sbFBhc3RFbmQiLCJidWZmZXIiLCJ3b3Jrc3BhY2UiLCJkaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiIsImRpZE1vdmVDdXJzb3IiLCJmb2N1c2VkIiwidG9nZ2xlQ29BdXRob3JJbnB1dCIsInJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbiIsIm1hbmFnZXIiLCJ0b29sdGlwcyIsInRpdGxlIiwic2hvd0RlbGF5IiwidG9nZ2xlSGFyZFdyYXAiLCJyZW5kZXJIYXJkV3JhcEljb24iLCJyZW5kZXJDb0F1dGhvckZvcm0iLCJyZW5kZXJDb0F1dGhvcklucHV0IiwiYWJvcnRNZXJnZSIsImNvbW1pdElzRW5hYmxlZCIsImNvbW1pdEJ1dHRvblRleHQiLCJzdmdQYXRoIiwidmlld0JveCIsInhtbG5zIiwiZCIsIm1vZGVsIiwidXNlclN0b3JlIiwiZmV0Y2hEYXRhIiwic3RvcmUiLCJnZXRVc2VycyIsIm1lbnRpb25hYmxlVXNlcnMiLCJwbGFjZWhvbGRlciIsImFycm93UmVuZGVyZXIiLCJvcHRpb25zIiwibGFiZWxLZXkiLCJ2YWx1ZUtleSIsImZpbHRlck9wdGlvbnMiLCJtYXRjaEF1dGhvcnMiLCJvcHRpb25SZW5kZXJlciIsInJlbmRlckNvQXV0aG9yTGlzdEl0ZW0iLCJ2YWx1ZVJlbmRlcmVyIiwicmVuZGVyQ29BdXRob3JWYWx1ZSIsIm9uQ2hhbmdlIiwib25TZWxlY3RlZENvQXV0aG9yc0NoYW5nZWQiLCJzZWxlY3RlZENvQXV0aG9ycyIsIm11bHRpIiwib3Blbk9uQ2xpY2siLCJvcGVuT25Gb2N1cyIsInRhYkluZGV4Iiwic2luZ2xlTGluZU1lc3NhZ2UiLCJnZXRUZXh0Iiwic3BsaXQiLCJMSU5FX0VORElOR19SRUdFWCIsImxlbmd0aCIsImhhcmRXcmFwIiwibm90QXBwbGljYWJsZSIsInN2Z1BhdGhzIiwiaGFyZFdyYXBFbmFibGVkIiwicGF0aDEiLCJwYXRoMiIsImhhcmRXcmFwRGlzYWJsZWQiLCJoaWRkZW4iLCJ3aWR0aCIsImhlaWdodCIsImZpbGxSdWxlIiwib25TdWJtaXQiLCJzdWJtaXROZXdDb0F1dGhvciIsIm9uQ2FuY2VsIiwiY2FuY2VsTmV3Q29BdXRob3IiLCJuYW1lIiwibmV3QXV0aG9yIiwidXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMiLCJoaWRlTmV3QXV0aG9yRm9ybSIsInNldFN0YXRlIiwibWFwIiwiYyIsImZvY3VzIiwiVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjdXJyZW50U2V0dGluZyIsImluY3JlbWVudENvdW50ZXIiLCJhdXRob3IiLCJnZXRGb2N1c2VkT3B0aW9uIiwiZ2V0T3IiLCJpc05ldyIsImV4Y2x1ZGVkIiwiZ2V0RW1haWwiLCJldmVudCIsImFtZW5kIiwicHJlcGFyZVRvQ29tbWl0IiwiYXRvbSIsImlzUmVsZWFzZWRWZXJzaW9uIiwic2V0Rm9jdXMiLCJFRElUT1IiLCJlZGl0b3IiLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInJvdyIsImxpbmVUZXh0Rm9yQnVmZmVyUm93IiwidG9TdHJpbmciLCJpc0NvbW1pdHRpbmciLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiaXNWYWxpZE1lc3NhZ2UiLCJyZXBsYWNlIiwidHJpbSIsIm1lcmdlQ29uZmxpY3RzRXhpc3QiLCJsYXN0Q29tbWl0IiwiaXNQcmVzZW50IiwiY3VycmVudEJyYW5jaCIsImlzRGV0YWNoZWQiLCJnZXROYW1lIiwiYXV0aG9ycyIsImZpbHRlclRleHQiLCJzZWxlY3RlZEF1dGhvcnMiLCJtYXRjaGVkQXV0aG9ycyIsImZpbHRlciIsImluZGV4IiwiaXNBbHJlYWR5U2VsZWN0ZWQiLCJmaW5kIiwic2VsZWN0ZWQiLCJtYXRjaGVzIiwibWF0Y2hlc0ZpbHRlciIsImdldExvZ2luIiwiZ2V0RnVsbE5hbWUiLCJzb21lIiwiZmllbGQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiQXV0aG9yIiwiY3JlYXRlTmV3IiwicmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkIiwiZmllbGROYW1lIiwiaGFzTG9naW4iLCJmdWxsTmFtZSIsImhhc0ZvY3VzIiwiZWxlbWVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiZ2V0Rm9jdXMiLCJidXR0b24iLCJDT01NSVRfUFJFVklFV19CVVRUT04iLCJBQk9SVF9NRVJHRV9CVVRUT04iLCJDT01NSVRfQlVUVE9OIiwid3JhcHBlciIsIkNPQVVUSE9SX0lOUFVUIiwiZmFsbGJhY2siLCJmb2N1c0VsZW1lbnQiLCJnZXRNb2RlbCIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwibGFzdEZvY3VzIiwiYWR2YW5jZUZvY3VzRnJvbSIsImYiLCJuZXh0IiwiUmVjZW50Q29tbWl0c1ZpZXciLCJmaXJzdEZvY3VzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXRyZWF0Rm9jdXNGcm9tIiwicHJldmlvdXMiLCJTdGFnaW5nVmlldyIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsIm51bWJlciIsIlVzZXJTdG9yZVByb3BUeXBlIiwiYXJyYXlPZiIsIkF1dGhvclByb3BUeXBlIiwiZnVuYyJdLCJzb3VyY2VzIjpbImNvbW1pdC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QnO1xuXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9hdG9tL3Rvb2x0aXAnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgQ29BdXRob3JGb3JtIGZyb20gJy4vY28tYXV0aG9yLWZvcm0nO1xuaW1wb3J0IFJlY2VudENvbW1pdHNWaWV3IGZyb20gJy4vcmVjZW50LWNvbW1pdHMtdmlldyc7XG5pbXBvcnQgU3RhZ2luZ1ZpZXcgZnJvbSAnLi9zdGFnaW5nLXZpZXcnO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi4vbW9kZWxzL2F1dGhvcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4vb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQge0xJTkVfRU5ESU5HX1JFR0VYLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0F1dGhvclByb3BUeXBlLCBVc2VyU3RvcmVQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXJ9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuY29uc3QgVE9PTFRJUF9ERUxBWSA9IDIwMDtcblxuLy8gQ3VzdG9tRXZlbnQgaXMgYSBET00gcHJpbWl0aXZlLCB3aGljaCB2OCBjYW4ndCBhY2Nlc3Ncbi8vIHNvIHdlJ3JlIGVzc2VudGlhbGx5IGxhenkgbG9hZGluZyB0byBrZWVwIHNuYXBzaG90dGluZyBmcm9tIGJyZWFraW5nLlxubGV0IEZha2VLZXlEb3duRXZlbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgQ09NTUlUX1BSRVZJRVdfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1wcmV2aWV3LWJ1dHRvbicpLFxuICAgIEVESVRPUjogU3ltYm9sKCdjb21taXQtZWRpdG9yJyksXG4gICAgQ09BVVRIT1JfSU5QVVQ6IFN5bWJvbCgnY29hdXRob3ItaW5wdXQnKSxcbiAgICBBQk9SVF9NRVJHRV9CVVRUT046IFN5bWJvbCgnY29tbWl0LWFib3J0LW1lcmdlLWJ1dHRvbicpLFxuICAgIENPTU1JVF9CVVRUT046IFN5bWJvbCgnY29tbWl0LWJ1dHRvbicpLFxuICB9O1xuXG4gIHN0YXRpYyBmaXJzdEZvY3VzID0gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT047XG5cbiAgc3RhdGljIGxhc3RGb2N1cyA9IFN5bWJvbCgnbGFzdC1mb2N1cycpO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgbGFzdENvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHNFeGlzdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzRXhpc3Q6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNDb21taXR0aW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdFByZXZpZXdBY3RpdmU6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZGVhY3RpdmF0ZUNvbW1pdEJveDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBtYXhpbXVtQ2hhcmFjdGVyTGltaXQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBtZXNzYWdlQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsIC8vIEZJWE1FIG1vcmUgc3BlY2lmaWMgcHJvcHR5cGVcbiAgICB1c2VyU3RvcmU6IFVzZXJTdG9yZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5hcnJheU9mKEF1dGhvclByb3BUeXBlKSxcbiAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFib3J0TWVyZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcHJlcGFyZVRvQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b2dnbGVDb21taXRQcmV2aWV3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFjdGl2YXRlQ29tbWl0UHJldmlldzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnc3VibWl0TmV3Q29BdXRob3InLCAnY2FuY2VsTmV3Q29BdXRob3InLCAnZGlkTW92ZUN1cnNvcicsICd0b2dnbGVIYXJkV3JhcCcsXG4gICAgICAndG9nZ2xlQ29BdXRob3JJbnB1dCcsICdhYm9ydE1lcmdlJywgJ2NvbW1pdCcsICdhbWVuZExhc3RDb21taXQnLCAndG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yJyxcbiAgICAgICdyZW5kZXJDb0F1dGhvckxpc3RJdGVtJywgJ29uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkJywgJ2V4Y2x1ZGVDb0F1dGhvcicsXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzaG93V29ya2luZzogZmFsc2UsXG4gICAgICBzaG93Q29BdXRob3JJbnB1dDogZmFsc2UsXG4gICAgICBzaG93Q29BdXRob3JGb3JtOiBmYWxzZSxcbiAgICAgIGNvQXV0aG9ySW5wdXQ6ICcnLFxuICAgIH07XG5cbiAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRXhwYW5kQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29tbWl0QnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmSGFyZFdyYXBCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29BdXRob3JUb2dnbGUgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvQXV0aG9yRm9ybSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvckNvbXBvbmVudCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvck1vZGVsID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIHByb3h5S2V5Q29kZShrZXlDb2RlKSB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgaWYgKHRoaXMucmVmQ29BdXRob3JTZWxlY3QuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFGYWtlS2V5RG93bkV2ZW50KSB7XG4gICAgICAgIEZha2VLZXlEb3duRXZlbnQgPSBjbGFzcyBleHRlbmRzIEN1c3RvbUV2ZW50IHtcbiAgICAgICAgICBjb25zdHJ1Y3RvcihrQ29kZSkge1xuICAgICAgICAgICAgc3VwZXIoJ2tleWRvd24nKTtcbiAgICAgICAgICAgIHRoaXMua2V5Q29kZSA9IGtDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFrZUV2ZW50ID0gbmV3IEZha2VLZXlEb3duRXZlbnQoa2V5Q29kZSk7XG4gICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LmdldCgpLmhhbmRsZUtleURvd24oZmFrZUV2ZW50KTtcblxuICAgICAgaWYgKCFmYWtlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBlLmFib3J0S2V5QmluZGluZygpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gIFVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5zY2hlZHVsZVNob3dXb3JraW5nKHRoaXMucHJvcHMpO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMuY29uZmlnLm9uRGlkQ2hhbmdlKCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJywgKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICAgIHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5vbkRpZENoYW5nZSgoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHJlbWFpbmluZ0NoYXJzQ2xhc3NOYW1lID0gJyc7XG4gICAgY29uc3QgcmVtYWluaW5nQ2hhcmFjdGVycyA9IHBhcnNlSW50KHRoaXMuZ2V0UmVtYWluaW5nQ2hhcmFjdGVycygpLCAxMCk7XG4gICAgaWYgKHJlbWFpbmluZ0NoYXJhY3RlcnMgPCAwKSB7XG4gICAgICByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICdpcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmdDaGFyYWN0ZXJzIDwgdGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgLyA0KSB7XG4gICAgICByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICdpcy13YXJuaW5nJztcbiAgICB9XG5cbiAgICBjb25zdCBzaG93QWJvcnRNZXJnZUJ1dHRvbiA9IHRoaXMucHJvcHMuaXNNZXJnaW5nIHx8IG51bGw7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGNvbnN0IG1vZEtleSA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nID8gJ0NtZCcgOiAnQ3RybCc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlld1wiIHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNvbW1pdFwiIGNhbGxiYWNrPXt0aGlzLmNvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFtZW5kLWxhc3QtY29tbWl0XCIgY2FsbGJhY2s9e3RoaXMuYW1lbmRMYXN0Q29tbWl0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWV4cGFuZGVkLWNvbW1pdC1tZXNzYWdlLWVkaXRvclwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy50b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3JcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kb3duXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQwKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC11cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW50ZXJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMTMpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXRhYlwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg5KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1iYWNrc3BhY2VcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZXVwXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDMzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1wYWdlZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW5kXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM1KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1ob21lXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kZWxldGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoNDYpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVzY2FwZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgyNyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjby1hdXRob3ItZXhjbHVkZVwiIGNhbGxiYWNrPXt0aGlzLmV4Y2x1ZGVDb0F1dGhvcn0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0UHJldmlld1wiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGl2ZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmFjdGl2YXRlQ29tbWl0UHJldmlld30gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b25XcmFwcGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0UHJldmlldyBnaXRodWItQ29tbWl0Vmlldy1idXR0b24gYnRuXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzRXhpc3R9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLnRvZ2dsZUNvbW1pdFByZXZpZXd9PlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY29tbWl0UHJldmlld0FjdGl2ZSA/ICdIaWRlIEFsbCBTdGFnZWQgQ2hhbmdlcycgOiAnU2VlIEFsbCBTdGFnZWQgQ2hhbmdlcyd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWVkaXRvcicsIHsnaXMtZXhwYW5kZWQnOiB0aGlzLnByb3BzLmRlYWN0aXZhdGVDb21taXRCb3h9KX0+XG4gICAgICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmRWRpdG9yQ29tcG9uZW50LnNldHRlcn1cbiAgICAgICAgICAgIHJlZk1vZGVsPXt0aGlzLnJlZkVkaXRvck1vZGVsfVxuICAgICAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG4gICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ9XCJDb21taXQgbWVzc2FnZVwiXG4gICAgICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgICAgICBzaG93SW52aXNpYmxlcz17ZmFsc2V9XG4gICAgICAgICAgICBhdXRvSGVpZ2h0PXtmYWxzZX1cbiAgICAgICAgICAgIHNjcm9sbFBhc3RFbmQ9e2ZhbHNlfVxuICAgICAgICAgICAgYnVmZmVyPXt0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXJ9XG4gICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb249e3RoaXMuZGlkTW92ZUN1cnNvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvclRvZ2dsZS5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvclRvZ2dsZScsIHtmb2N1c2VkOiB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0fSl9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUNvQXV0aG9ySW5wdXR9PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JUb2dnbGVJY29uKCl9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmQ29BdXRob3JUb2dnbGV9XG4gICAgICAgICAgICB0aXRsZT17YCR7dGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCA/ICdSZW1vdmUnIDogJ0FkZCd9IGNvLWF1dGhvcnNgfVxuICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkhhcmRXcmFwQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlSGFyZFdyYXB9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1oYXJkd3JhcCBoYXJkLXdyYXAtaWNvbnNcIj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckhhcmRXcmFwSWNvbigpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkhhcmRXcmFwQnV0dG9ufVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctaGFyZHdyYXAtdG9vbHRpcFwiXG4gICAgICAgICAgICB0aXRsZT1cIlRvZ2dsZSBoYXJkIHdyYXAgb24gY29tbWl0XCJcbiAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZFeHBhbmRCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctZXhwYW5kQnV0dG9uIGljb24gaWNvbi1zY3JlZW4tZnVsbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkV4cGFuZEJ1dHRvbn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWV4cGFuZEJ1dHRvbi10b29sdGlwXCJcbiAgICAgICAgICAgIHRpdGxlPVwiRXhwYW5kIGNvbW1pdCBtZXNzYWdlIGVkaXRvclwiXG4gICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JGb3JtKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9ySW5wdXQoKX1cblxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWJhclwiPlxuICAgICAgICAgIHtzaG93QWJvcnRNZXJnZUJ1dHRvbiAmJlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICByZWY9e3RoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBnaXRodWItQ29tbWl0Vmlldy1idXR0b24gZ2l0aHViLUNvbW1pdFZpZXctYWJvcnRNZXJnZSBpcy1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmFib3J0TWVyZ2V9PkFib3J0IE1lcmdlPC9idXR0b24+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b24gZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0IGJ0biBidG4tcHJpbWFyeSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY29tbWl0fVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSl9Pnt0aGlzLmNvbW1pdEJ1dHRvblRleHQoKX08L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpICYmXG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmQ29tbWl0QnV0dG9ufVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b24tdG9vbHRpcFwiXG4gICAgICAgICAgICAgIHRpdGxlPXtgJHttb2RLZXl9LWVudGVyIHRvIGNvbW1pdGB9XG4gICAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAgIC8+fVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLUNvbW1pdFZpZXctcmVtYWluaW5nLWNoYXJhY3RlcnMgJHtyZW1haW5pbmdDaGFyc0NsYXNzTmFtZX1gfT5cbiAgICAgICAgICAgIHt0aGlzLmdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb290ZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JUb2dnbGVJY29uKCkge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBjb25zdCBzdmdQYXRoID0gJ005Ljg3NSAyLjEyNUgxMnYxLjc1SDkuODc1VjZoLTEuNzVWMy44NzVINnYtMS43NWgyLjEyNVYwaDEuNzV2Mi4xMjV6TTYgNi41YS41LjUgMCAwIDEtLjUuNWgtNWEuNS41IDAgMCAxLS41LS41VjZjMC0xLjMxNiAyLTIgMi0ycy4xMTQtLjIwNCAwLS41Yy0uNDItLjMxLS40NzItLjc5NS0uNS0yQzEuNTg3LjI5MyAyLjQzNCAwIDMgMHMxLjQxMy4yOTMgMS41IDEuNWMtLjAyOCAxLjIwNS0uMDggMS42OS0uNSAyLS4xMTQuMjk1IDAgLjUgMCAuNXMyIC42ODQgMiAydi41eic7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JUb2dnbGVJY29uJywge2ZvY3VzZWQ6IHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXR9KX0gdmlld0JveD1cIjAgMCAxMiA3XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8dGl0bGU+QWRkIG9yIHJlbW92ZSBjby1hdXRob3JzPC90aXRsZT5cbiAgICAgICAgPHBhdGggZD17c3ZnUGF0aH0gLz5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvcklucHV0KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMudXNlclN0b3JlfSBmZXRjaERhdGE9e3N0b3JlID0+IHN0b3JlLmdldFVzZXJzKCl9PlxuICAgICAgICB7bWVudGlvbmFibGVVc2VycyA9PiAoXG4gICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yIGlucHV0LXRleHRhcmVhIG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDby1BdXRob3JzXCJcbiAgICAgICAgICAgIGFycm93UmVuZGVyZXI9e251bGx9XG4gICAgICAgICAgICBvcHRpb25zPXttZW50aW9uYWJsZVVzZXJzfVxuICAgICAgICAgICAgbGFiZWxLZXk9XCJmdWxsTmFtZVwiXG4gICAgICAgICAgICB2YWx1ZUtleT1cImVtYWlsXCJcbiAgICAgICAgICAgIGZpbHRlck9wdGlvbnM9e3RoaXMubWF0Y2hBdXRob3JzfVxuICAgICAgICAgICAgb3B0aW9uUmVuZGVyZXI9e3RoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbX1cbiAgICAgICAgICAgIHZhbHVlUmVuZGVyZXI9e3RoaXMucmVuZGVyQ29BdXRob3JWYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgICAgICBtdWx0aT17dHJ1ZX1cbiAgICAgICAgICAgIG9wZW5PbkNsaWNrPXtmYWxzZX1cbiAgICAgICAgICAgIG9wZW5PbkZvY3VzPXtmYWxzZX1cbiAgICAgICAgICAgIHRhYkluZGV4PVwiNVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIYXJkV3JhcEljb24oKSB7XG4gICAgY29uc3Qgc2luZ2xlTGluZU1lc3NhZ2UgPSB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5sZW5ndGggPT09IDE7XG4gICAgY29uc3QgaGFyZFdyYXAgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnKTtcbiAgICBjb25zdCBub3RBcHBsaWNhYmxlID0gdGhpcy5wcm9wcy5kZWFjdGl2YXRlQ29tbWl0Qm94IHx8IHNpbmdsZUxpbmVNZXNzYWdlO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGNvbnN0IHN2Z1BhdGhzID0ge1xuICAgICAgaGFyZFdyYXBFbmFibGVkOiB7XG4gICAgICAgIHBhdGgxOiAnTTcuMDU4IDEwLjJoLS45NzV2Mi40TDIgOWw0LjA4My0zLjZ2Mi40aC45N2wxLjIwMiAxLjIwM0w3LjA1OCAxMC4yem0yLjUyNS00Ljg2NVY0LjJoMi4zMzR2MS4xNGwtMS4xNjQgMS4xNjUtMS4xNy0xLjE3eicsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICAgICAgICBwYXRoMjogJ003Ljg0MiA2Ljk0bDIuMDYzIDIuMDYzLTIuMTIyIDIuMTIuOTA4LjkxIDIuMTIzLTIuMTIzIDEuOTggMS45OC44NS0uODQ4TDExLjU4IDguOThsMi4xMi0yLjEyMy0uODI0LS44MjUtMi4xMjIgMi4xMi0yLjA2Mi0yLjA2eicsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICAgICAgfSxcbiAgICAgIGhhcmRXcmFwRGlzYWJsZWQ6IHtcbiAgICAgICAgcGF0aDE6ICdNMTEuOTE3IDguNGMwIC45OS0uNzg4IDEuOC0xLjc1IDEuOEg2LjA4M3YyLjRMMiA5bDQuMDgzLTMuNnYyLjRoMy41VjQuMmgyLjMzNHY0LjJ6JyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuICAgIGlmIChub3RBcHBsaWNhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoaGFyZFdyYXApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnaWNvbicsICdoYXJkd3JhcCcsICdpY29uLWhhcmR3cmFwLWVuYWJsZWQnLCB7aGlkZGVuOiBub3RBcHBsaWNhYmxlIHx8ICFoYXJkV3JhcH0pfT5cbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8cGF0aCBkPXtzdmdQYXRocy5oYXJkV3JhcERpc2FibGVkLnBhdGgxfSBmaWxsUnVsZT1cImV2ZW5vZGRcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnaWNvbicsICduby1oYXJkd3JhcCcsICdpY29uLWhhcmR3cmFwLWRpc2FibGVkJywge2hpZGRlbjogbm90QXBwbGljYWJsZSB8fCBoYXJkV3JhcH0pfT5cbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8ZyBmaWxsUnVsZT1cImV2ZW5vZGRcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD17c3ZnUGF0aHMuaGFyZFdyYXBFbmFibGVkLnBhdGgxfSAvPlxuICAgICAgICAgICAgICA8cGF0aCBmaWxsUnVsZT1cIm5vbnplcm9cIiBkPXtzdmdQYXRocy5oYXJkV3JhcEVuYWJsZWQucGF0aDJ9IC8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckZvcm0oKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNob3dDb0F1dGhvckZvcm0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29BdXRob3JGb3JtXG4gICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvckZvcm0uc2V0dGVyfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgb25TdWJtaXQ9e3RoaXMuc3VibWl0TmV3Q29BdXRob3J9XG4gICAgICAgIG9uQ2FuY2VsPXt0aGlzLmNhbmNlbE5ld0NvQXV0aG9yfVxuICAgICAgICBuYW1lPXt0aGlzLnN0YXRlLmNvQXV0aG9ySW5wdXR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBzdWJtaXROZXdDb0F1dGhvcihuZXdBdXRob3IpIHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKHRoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnMsIG5ld0F1dGhvcik7XG4gICAgdGhpcy5oaWRlTmV3QXV0aG9yRm9ybSgpO1xuICB9XG5cbiAgY2FuY2VsTmV3Q29BdXRob3IoKSB7XG4gICAgdGhpcy5oaWRlTmV3QXV0aG9yRm9ybSgpO1xuICB9XG5cbiAgaGlkZU5ld0F1dGhvckZvcm0oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0NvQXV0aG9yRm9ybTogZmFsc2V9LCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZm9jdXMoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2NoZWR1bGVTaG93V29ya2luZyhuZXh0UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGRpZE1vdmVDdXJzb3IoKSB7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgdG9nZ2xlSGFyZFdyYXAoKSB7XG4gICAgY29uc3QgY3VycmVudFNldHRpbmcgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnKTtcbiAgICB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnLCAhY3VycmVudFNldHRpbmcpO1xuICB9XG5cbiAgdG9nZ2xlQ29BdXRob3JJbnB1dCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNob3dDb0F1dGhvcklucHV0OiAhdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCxcbiAgICB9LCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICBpbmNyZW1lbnRDb3VudGVyKCdzaG93LWNvLWF1dGhvci1pbnB1dCcpO1xuICAgICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZm9jdXMoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBpbnB1dCBpcyBjbG9zZWQsIHJlbW92ZSBhbGwgY28tYXV0aG9yc1xuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKFtdKTtcbiAgICAgICAgaW5jcmVtZW50Q291bnRlcignaGlkZS1jby1hdXRob3ItaW5wdXQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV4Y2x1ZGVDb0F1dGhvcigpIHtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZ2V0Rm9jdXNlZE9wdGlvbigpKS5nZXRPcihudWxsKTtcbiAgICBpZiAoIWF1dGhvciB8fCBhdXRob3IuaXNOZXcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBleGNsdWRlZCA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLmV4Y2x1ZGVkVXNlcnMnKTtcbiAgICBpZiAoZXhjbHVkZWQgJiYgZXhjbHVkZWQgIT09ICcnKSB7XG4gICAgICBleGNsdWRlZCArPSAnLCAnO1xuICAgIH1cbiAgICBleGNsdWRlZCArPSBhdXRob3IuZ2V0RW1haWwoKTtcbiAgICB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ2dpdGh1Yi5leGNsdWRlZFVzZXJzJywgZXhjbHVkZWQpO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICB0aGlzLnByb3BzLmFib3J0TWVyZ2UoKTtcbiAgfVxuXG4gIGFzeW5jIGNvbW1pdChldmVudCwgYW1lbmQpIHtcbiAgICBpZiAoYXdhaXQgdGhpcy5wcm9wcy5wcmVwYXJlVG9Db21taXQoKSAmJiB0aGlzLmNvbW1pdElzRW5hYmxlZChhbWVuZCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMucHJvcHMuY29tbWl0KHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCksIHRoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnMsIGFtZW5kKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyAtIGVycm9yIHdhcyB0YWtlbiBjYXJlIG9mIGluIHBpcGVsaW5lIG1hbmFnZXJcbiAgICAgICAgaWYgKCFhdG9tLmlzUmVsZWFzZWRWZXJzaW9uKCkpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5FRElUT1IpO1xuICAgIH1cbiAgfVxuXG4gIGFtZW5kTGFzdENvbW1pdCgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKCdhbWVuZCcpO1xuICAgIHRoaXMuY29tbWl0KG51bGwsIHRydWUpO1xuICB9XG5cbiAgZ2V0UmVtYWluaW5nQ2hhcmFjdGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3JNb2RlbC5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgPT09IDApIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLm1heGltdW1DaGFyYWN0ZXJMaW1pdCAtIGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygwKS5sZW5ndGgpLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ+KInic7XG4gICAgICB9XG4gICAgfSkuZ2V0T3IodGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgfHwgJycpO1xuICB9XG5cbiAgLy8gV2UgZG9uJ3Qgd2FudCB0aGUgdXNlciB0byBzZWUgdGhlIFVJIGZsaWNrZXIgaW4gdGhlIGNhc2VcbiAgLy8gdGhlIGNvbW1pdCB0YWtlcyBhIHZlcnkgc21hbGwgdGltZSB0byBjb21wbGV0ZS4gSW5zdGVhZCB3ZVxuICAvLyB3aWxsIG9ubHkgc2hvdyB0aGUgd29ya2luZyBtZXNzYWdlIGlmIHdlIGFyZSB3b3JraW5nIGZvciBsb25nZXJcbiAgLy8gdGhhbiAxIHNlY29uZCBhcyBwZXIgaHR0cHM6Ly93d3cubm5ncm91cC5jb20vYXJ0aWNsZXMvcmVzcG9uc2UtdGltZXMtMy1pbXBvcnRhbnQtbGltaXRzL1xuICAvL1xuICAvLyBUaGUgY2xvc3VyZSBpcyBjcmVhdGVkIHRvIHJlc3RyaWN0IHZhcmlhYmxlIGFjY2Vzc1xuICBzY2hlZHVsZVNob3dXb3JraW5nKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLmlzQ29tbWl0dGluZykge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dXb3JraW5nICYmIHRoaXMudGltZW91dEhhbmRsZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dXb3JraW5nOiB0cnVlfSk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SGFuZGxlKTtcbiAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IG51bGw7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93V29ya2luZzogZmFsc2V9KTtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkTWVzc2FnZSgpIHtcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgYXQgbGVhc3Qgc29tZSBub24tY29tbWVudCBsaW5lcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2UuXG4gICAgLy8gQ29tbWVudGVkIGxpbmVzIGFyZSBzdHJpcHBlZCBvdXQgb2YgY29tbWl0IG1lc3NhZ2VzIGJ5IGdpdCwgYnkgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgIHJldHVybiB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLnJlcGxhY2UoL14jLiokL2dtLCAnJykudHJpbSgpLmxlbmd0aCAhPT0gMDtcbiAgfVxuXG4gIGNvbW1pdElzRW5hYmxlZChhbWVuZCkge1xuICAgIHJldHVybiAhdGhpcy5wcm9wcy5pc0NvbW1pdHRpbmcgJiZcbiAgICAgIChhbWVuZCB8fCB0aGlzLnByb3BzLnN0YWdlZENoYW5nZXNFeGlzdCkgJiZcbiAgICAgICF0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzRXhpc3QgJiZcbiAgICAgIHRoaXMucHJvcHMubGFzdENvbW1pdC5pc1ByZXNlbnQoKSAmJlxuICAgICAgKHRoaXMucHJvcHMuZGVhY3RpdmF0ZUNvbW1pdEJveCB8fCAoYW1lbmQgfHwgdGhpcy5pc1ZhbGlkTWVzc2FnZSgpKSk7XG4gIH1cblxuICBjb21taXRCdXR0b25UZXh0KCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNob3dXb3JraW5nKSB7XG4gICAgICByZXR1cm4gJ1dvcmtpbmcuLi4nO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSkge1xuICAgICAgcmV0dXJuICdDcmVhdGUgZGV0YWNoZWQgY29tbWl0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGBDb21taXQgdG8gJHt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnQ29tbWl0JztcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yKHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkpO1xuICB9XG5cbiAgbWF0Y2hBdXRob3JzKGF1dGhvcnMsIGZpbHRlclRleHQsIHNlbGVjdGVkQXV0aG9ycykge1xuICAgIGNvbnN0IG1hdGNoZWRBdXRob3JzID0gYXV0aG9ycy5maWx0ZXIoKGF1dGhvciwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGlzQWxyZWFkeVNlbGVjdGVkID0gc2VsZWN0ZWRBdXRob3JzICYmIHNlbGVjdGVkQXV0aG9ycy5maW5kKHNlbGVjdGVkID0+IHNlbGVjdGVkLm1hdGNoZXMoYXV0aG9yKSk7XG4gICAgICBjb25zdCBtYXRjaGVzRmlsdGVyID0gW1xuICAgICAgICBhdXRob3IuZ2V0TG9naW4oKSxcbiAgICAgICAgYXV0aG9yLmdldEZ1bGxOYW1lKCksXG4gICAgICAgIGF1dGhvci5nZXRFbWFpbCgpLFxuICAgICAgXS5zb21lKGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJUZXh0LnRvTG93ZXJDYXNlKCkpICE9PSAtMSk7XG5cbiAgICAgIHJldHVybiAhaXNBbHJlYWR5U2VsZWN0ZWQgJiYgbWF0Y2hlc0ZpbHRlcjtcbiAgICB9KTtcbiAgICBtYXRjaGVkQXV0aG9ycy5wdXNoKEF1dGhvci5jcmVhdGVOZXcoJ0FkZCBuZXcgYXV0aG9yJywgZmlsdGVyVGV4dCkpO1xuICAgIHJldHVybiBtYXRjaGVkQXV0aG9ycztcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZChmaWVsZE5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvci0ke2ZpZWxkTmFtZX1gfT57dmFsdWV9PC9zcGFuPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckxpc3RJdGVtKGF1dGhvcikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yLXNlbGVjdExpc3RJdGVtJywgeyduZXctYXV0aG9yJzogYXV0aG9yLmlzTmV3KCl9KX0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnbmFtZScsIGF1dGhvci5nZXRGdWxsTmFtZSgpKX1cbiAgICAgICAge2F1dGhvci5oYXNMb2dpbigpICYmIHRoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKCdsb2dpbicsICdAJyArIGF1dGhvci5nZXRMb2dpbigpKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKCdlbWFpbCcsIGF1dGhvci5nZXRFbWFpbCgpKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvclZhbHVlKGF1dGhvcikge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gYXV0aG9yLmdldEZ1bGxOYW1lKCk7XG4gICAgaWYgKGZ1bGxOYW1lICYmIGZ1bGxOYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiA8c3Bhbj57YXV0aG9yLmdldEZ1bGxOYW1lKCl9PC9zcGFuPjtcbiAgICB9XG4gICAgaWYgKGF1dGhvci5oYXNMb2dpbigpKSB7XG4gICAgICByZXR1cm4gPHNwYW4+QHthdXRob3IuZ2V0TG9naW4oKX08L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiA8c3Bhbj57YXV0aG9yLmdldEVtYWlsKCl9PC9zcGFuPjtcbiAgfVxuXG4gIG9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkKHNlbGVjdGVkQ29BdXRob3JzKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcignc2VsZWN0ZWQtY28tYXV0aG9ycy1jaGFuZ2VkJyk7XG4gICAgY29uc3QgbmV3QXV0aG9yID0gc2VsZWN0ZWRDb0F1dGhvcnMuZmluZChhdXRob3IgPT4gYXV0aG9yLmlzTmV3KCkpO1xuXG4gICAgaWYgKG5ld0F1dGhvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y29BdXRob3JJbnB1dDogbmV3QXV0aG9yLmdldEZ1bGxOYW1lKCksIHNob3dDb0F1dGhvckZvcm06IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhzZWxlY3RlZENvQXV0aG9ycyk7XG4gICAgfVxuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbi5tYXAoYnV0dG9uID0+IGJ1dHRvbi5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT047XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChlZGl0b3IgPT4gZWRpdG9yLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkVESVRPUjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uLm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkNvbW1pdEJ1dHRvbi5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT047XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGMgPT4gYy53cmFwcGVyICYmIGMud3JhcHBlci5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT0FVVEhPUl9JTlBVVDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgbGV0IGZhbGxiYWNrID0gZmFsc2U7XG4gICAgY29uc3QgZm9jdXNFbGVtZW50ID0gZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9QUkVWSUVXX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkVESVRPUikge1xuICAgICAgaWYgKHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5sZW5ndGggPiAwICYmICF0aGlzLmlzVmFsaWRNZXNzYWdlKCkpIHtcbiAgICAgICAgICAvLyB0aGVyZSBpcyBsaWtlbHkgYSBjb21taXQgbWVzc2FnZSB0ZW1wbGF0ZSBwcmVzZW50XG4gICAgICAgICAgLy8gd2Ugd2FudCB0aGUgY3Vyc29yIHRvIGJlIGF0IHRoZSBiZWdpbm5pbmcsIG5vdCBhdCB0aGUgYW5kIG9mIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgIHRoaXMucmVmRWRpdG9yQ29tcG9uZW50LmdldCgpLmdldE1vZGVsKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OKSB7XG4gICAgICBpZiAodGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uLm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQ29tbWl0QnV0dG9uLm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQ09BVVRIT1JfSU5QVVQpIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcubGFzdEZvY3VzKSB7XG4gICAgICBpZiAodGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX0JVVFRPTik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkNPQVVUSE9SX0lOUFVUKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuRURJVE9SKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmFsbGJhY2sgJiYgdGhpcy5yZWZFZGl0b3JDb21wb25lbnQubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZHZhbmNlRm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuY29uc3RydWN0b3IuZm9jdXM7XG5cbiAgICBsZXQgbmV4dCA9IG51bGw7XG4gICAgc3dpdGNoIChmb2N1cykge1xuICAgIGNhc2UgZi5DT01NSVRfUFJFVklFV19CVVRUT046XG4gICAgICBuZXh0ID0gZi5FRElUT1I7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuRURJVE9SOlxuICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgbmV4dCA9IGYuQ09BVVRIT1JfSU5QVVQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIG5leHQgPSBmLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpKSB7XG4gICAgICAgIG5leHQgPSBmLkNPTU1JVF9CVVRUT047XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0ID0gUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5DT0FVVEhPUl9JTlBVVDpcbiAgICAgIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBuZXh0ID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICBuZXh0ID0gZi5DT01NSVRfQlVUVE9OO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQUJPUlRfTUVSR0VfQlVUVE9OOlxuICAgICAgbmV4dCA9IHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSA/IGYuQ09NTUlUX0JVVFRPTiA6IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09NTUlUX0JVVFRPTjpcbiAgICAgIG5leHQgPSBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXh0KTtcbiAgfVxuXG4gIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBjb25zdCBmID0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cztcblxuICAgIGxldCBwcmV2aW91cyA9IG51bGw7XG4gICAgc3dpdGNoIChmb2N1cykge1xuICAgIGNhc2UgZi5DT01NSVRfQlVUVE9OOlxuICAgICAgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgcHJldmlvdXMgPSBmLkNPQVVUSE9SX0lOUFVUO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmlvdXMgPSBmLkVESVRPUjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5BQk9SVF9NRVJHRV9CVVRUT046XG4gICAgICBwcmV2aW91cyA9IHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQgPyBmLkNPQVVUSE9SX0lOUFVUIDogZi5FRElUT1I7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09BVVRIT1JfSU5QVVQ6XG4gICAgICBwcmV2aW91cyA9IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkVESVRPUjpcbiAgICAgIHByZXZpb3VzID0gZi5DT01NSVRfUFJFVklFV19CVVRUT047XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OOlxuICAgICAgcHJldmlvdXMgPSBTdGFnaW5nVmlldy5sYXN0Rm9jdXM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByZXZpb3VzKTtcbiAgfVxufVxuIl0s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