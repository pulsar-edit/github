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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUT09MVElQX0RFTEFZIiwiRmFrZUtleURvd25FdmVudCIsIkNvbW1pdFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiYXV0b2JpbmQiLCJzdGF0ZSIsInNob3dXb3JraW5nIiwic2hvd0NvQXV0aG9ySW5wdXQiLCJzaG93Q29BdXRob3JGb3JtIiwiY29BdXRob3JJbnB1dCIsInRpbWVvdXRIYW5kbGUiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJyZWZDb21taXRQcmV2aWV3QnV0dG9uIiwicmVmRXhwYW5kQnV0dG9uIiwicmVmQ29tbWl0QnV0dG9uIiwicmVmSGFyZFdyYXBCdXR0b24iLCJyZWZBYm9ydE1lcmdlQnV0dG9uIiwicmVmQ29BdXRob3JUb2dnbGUiLCJyZWZDb0F1dGhvclNlbGVjdCIsInJlZkNvQXV0aG9yRm9ybSIsInJlZkVkaXRvckNvbXBvbmVudCIsInJlZkVkaXRvck1vZGVsIiwic3VicyIsInByb3h5S2V5Q29kZSIsImtleUNvZGUiLCJlIiwiaXNFbXB0eSIsIkN1c3RvbUV2ZW50Iiwia0NvZGUiLCJmYWtlRXZlbnQiLCJnZXQiLCJoYW5kbGVLZXlEb3duIiwiZGVmYXVsdFByZXZlbnRlZCIsImFib3J0S2V5QmluZGluZyIsIlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQiLCJzY2hlZHVsZVNob3dXb3JraW5nIiwiYWRkIiwiY29uZmlnIiwib25EaWRDaGFuZ2UiLCJmb3JjZVVwZGF0ZSIsIm1lc3NhZ2VCdWZmZXIiLCJyZW5kZXIiLCJyZW1haW5pbmdDaGFyc0NsYXNzTmFtZSIsInJlbWFpbmluZ0NoYXJhY3RlcnMiLCJwYXJzZUludCIsImdldFJlbWFpbmluZ0NoYXJhY3RlcnMiLCJtYXhpbXVtQ2hhcmFjdGVyTGltaXQiLCJzaG93QWJvcnRNZXJnZUJ1dHRvbiIsImlzTWVyZ2luZyIsIm1vZEtleSIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldHRlciIsImNvbW1hbmRzIiwiY29tbWl0IiwiYW1lbmRMYXN0Q29tbWl0IiwidG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yIiwiZXhjbHVkZUNvQXV0aG9yIiwiYWN0aXZhdGVDb21taXRQcmV2aWV3Iiwic3RhZ2VkQ2hhbmdlc0V4aXN0IiwidG9nZ2xlQ29tbWl0UHJldmlldyIsImNvbW1pdFByZXZpZXdBY3RpdmUiLCJjeCIsImRlYWN0aXZhdGVDb21taXRCb3giLCJ3b3Jrc3BhY2UiLCJkaWRNb3ZlQ3Vyc29yIiwiZm9jdXNlZCIsInRvZ2dsZUNvQXV0aG9ySW5wdXQiLCJyZW5kZXJDb0F1dGhvclRvZ2dsZUljb24iLCJ0b29sdGlwcyIsInRvZ2dsZUhhcmRXcmFwIiwicmVuZGVySGFyZFdyYXBJY29uIiwicmVuZGVyQ29BdXRob3JGb3JtIiwicmVuZGVyQ29BdXRob3JJbnB1dCIsImFib3J0TWVyZ2UiLCJjb21taXRJc0VuYWJsZWQiLCJjb21taXRCdXR0b25UZXh0Iiwic3ZnUGF0aCIsInVzZXJTdG9yZSIsInN0b3JlIiwiZ2V0VXNlcnMiLCJtZW50aW9uYWJsZVVzZXJzIiwibWF0Y2hBdXRob3JzIiwicmVuZGVyQ29BdXRob3JMaXN0SXRlbSIsInJlbmRlckNvQXV0aG9yVmFsdWUiLCJvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZCIsInNlbGVjdGVkQ29BdXRob3JzIiwic2luZ2xlTGluZU1lc3NhZ2UiLCJnZXRUZXh0Iiwic3BsaXQiLCJMSU5FX0VORElOR19SRUdFWCIsImxlbmd0aCIsImhhcmRXcmFwIiwibm90QXBwbGljYWJsZSIsInN2Z1BhdGhzIiwiaGFyZFdyYXBFbmFibGVkIiwicGF0aDEiLCJwYXRoMiIsImhhcmRXcmFwRGlzYWJsZWQiLCJoaWRkZW4iLCJzdWJtaXROZXdDb0F1dGhvciIsImNhbmNlbE5ld0NvQXV0aG9yIiwibmV3QXV0aG9yIiwidXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMiLCJoaWRlTmV3QXV0aG9yRm9ybSIsInNldFN0YXRlIiwibWFwIiwiYyIsImZvY3VzIiwiVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjdXJyZW50U2V0dGluZyIsInNldCIsImluY3JlbWVudENvdW50ZXIiLCJhdXRob3IiLCJnZXRGb2N1c2VkT3B0aW9uIiwiZ2V0T3IiLCJpc05ldyIsImV4Y2x1ZGVkIiwiZ2V0RW1haWwiLCJldmVudCIsImFtZW5kIiwicHJlcGFyZVRvQ29tbWl0IiwiYXRvbSIsImlzUmVsZWFzZWRWZXJzaW9uIiwic2V0Rm9jdXMiLCJFRElUT1IiLCJlZGl0b3IiLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInJvdyIsImxpbmVUZXh0Rm9yQnVmZmVyUm93IiwidG9TdHJpbmciLCJpc0NvbW1pdHRpbmciLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiaXNWYWxpZE1lc3NhZ2UiLCJyZXBsYWNlIiwidHJpbSIsIm1lcmdlQ29uZmxpY3RzRXhpc3QiLCJsYXN0Q29tbWl0IiwiaXNQcmVzZW50IiwiY3VycmVudEJyYW5jaCIsImlzRGV0YWNoZWQiLCJnZXROYW1lIiwiYXV0aG9ycyIsImZpbHRlclRleHQiLCJzZWxlY3RlZEF1dGhvcnMiLCJtYXRjaGVkQXV0aG9ycyIsImZpbHRlciIsImluZGV4IiwiaXNBbHJlYWR5U2VsZWN0ZWQiLCJmaW5kIiwic2VsZWN0ZWQiLCJtYXRjaGVzIiwibWF0Y2hlc0ZpbHRlciIsImdldExvZ2luIiwiZ2V0RnVsbE5hbWUiLCJzb21lIiwiZmllbGQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiQXV0aG9yIiwiY3JlYXRlTmV3IiwicmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkIiwiZmllbGROYW1lIiwidmFsdWUiLCJoYXNMb2dpbiIsImZ1bGxOYW1lIiwiaGFzRm9jdXMiLCJlbGVtZW50IiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJnZXRGb2N1cyIsImJ1dHRvbiIsIkNPTU1JVF9QUkVWSUVXX0JVVFRPTiIsIkFCT1JUX01FUkdFX0JVVFRPTiIsIkNPTU1JVF9CVVRUT04iLCJ3cmFwcGVyIiwiQ09BVVRIT1JfSU5QVVQiLCJmYWxsYmFjayIsImZvY3VzRWxlbWVudCIsImdldE1vZGVsIiwic2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJsYXN0Rm9jdXMiLCJhZHZhbmNlRm9jdXNGcm9tIiwiZiIsIm5leHQiLCJSZWNlbnRDb21taXRzVmlldyIsImZpcnN0Rm9jdXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJldHJlYXRGb2N1c0Zyb20iLCJwcmV2aW91cyIsIlN0YWdpbmdWaWV3IiwiU3ltYm9sIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJudW1iZXIiLCJVc2VyU3RvcmVQcm9wVHlwZSIsImFycmF5T2YiLCJBdXRob3JQcm9wVHlwZSIsImZ1bmMiXSwic291cmNlcyI6WyJjb21taXQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBTZWxlY3QgZnJvbSAncmVhY3Qtc2VsZWN0JztcblxuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IENvQXV0aG9yRm9ybSBmcm9tICcuL2NvLWF1dGhvci1mb3JtJztcbmltcG9ydCBSZWNlbnRDb21taXRzVmlldyBmcm9tICcuL3JlY2VudC1jb21taXRzLXZpZXcnO1xuaW1wb3J0IFN0YWdpbmdWaWV3IGZyb20gJy4vc3RhZ2luZy12aWV3JztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL21vZGVscy9hdXRob3InO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IHtMSU5FX0VORElOR19SRUdFWCwgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtBdXRob3JQcm9wVHlwZSwgVXNlclN0b3JlUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyfSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IFRPT0xUSVBfREVMQVkgPSAyMDA7XG5cbi8vIEN1c3RvbUV2ZW50IGlzIGEgRE9NIHByaW1pdGl2ZSwgd2hpY2ggdjggY2FuJ3QgYWNjZXNzXG4vLyBzbyB3ZSdyZSBlc3NlbnRpYWxseSBsYXp5IGxvYWRpbmcgdG8ga2VlcCBzbmFwc2hvdHRpbmcgZnJvbSBicmVha2luZy5cbmxldCBGYWtlS2V5RG93bkV2ZW50O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIENPTU1JVF9QUkVWSUVXX0JVVFRPTjogU3ltYm9sKCdjb21taXQtcHJldmlldy1idXR0b24nKSxcbiAgICBFRElUT1I6IFN5bWJvbCgnY29tbWl0LWVkaXRvcicpLFxuICAgIENPQVVUSE9SX0lOUFVUOiBTeW1ib2woJ2NvYXV0aG9yLWlucHV0JyksXG4gICAgQUJPUlRfTUVSR0VfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1hYm9ydC1tZXJnZS1idXR0b24nKSxcbiAgICBDT01NSVRfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1idXR0b24nKSxcbiAgfTtcblxuICBzdGF0aWMgZmlyc3RGb2N1cyA9IENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBTeW1ib2woJ2xhc3QtZm9jdXMnKTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGxhc3RDb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzRXhpc3Q6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlc0V4aXN0OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzQ29tbWl0dGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21taXRQcmV2aWV3QWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGRlYWN0aXZhdGVDb21taXRCb3g6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbWF4aW11bUNoYXJhY3RlckxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbWVzc2FnZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAvLyBGSVhNRSBtb3JlIHNwZWNpZmljIHByb3B0eXBlXG4gICAgdXNlclN0b3JlOiBVc2VyU3RvcmVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuYXJyYXlPZihBdXRob3JQcm9wVHlwZSksXG4gICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhYm9ydE1lcmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHByZXBhcmVUb0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlQ29tbWl0UHJldmlldzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhY3RpdmF0ZUNvbW1pdFByZXZpZXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ3N1Ym1pdE5ld0NvQXV0aG9yJywgJ2NhbmNlbE5ld0NvQXV0aG9yJywgJ2RpZE1vdmVDdXJzb3InLCAndG9nZ2xlSGFyZFdyYXAnLFxuICAgICAgJ3RvZ2dsZUNvQXV0aG9ySW5wdXQnLCAnYWJvcnRNZXJnZScsICdjb21taXQnLCAnYW1lbmRMYXN0Q29tbWl0JywgJ3RvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcicsXG4gICAgICAncmVuZGVyQ29BdXRob3JMaXN0SXRlbScsICdvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZCcsICdleGNsdWRlQ29BdXRob3InLFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2hvd1dvcmtpbmc6IGZhbHNlLFxuICAgICAgc2hvd0NvQXV0aG9ySW5wdXQ6IGZhbHNlLFxuICAgICAgc2hvd0NvQXV0aG9yRm9ybTogZmFsc2UsXG4gICAgICBjb0F1dGhvcklucHV0OiAnJyxcbiAgICB9O1xuXG4gICAgdGhpcy50aW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkV4cGFuZEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvbW1pdEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkhhcmRXcmFwQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvQXV0aG9yVG9nZ2xlID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29BdXRob3JTZWxlY3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb0F1dGhvckZvcm0gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3JDb21wb25lbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3JNb2RlbCA9IG5ldyBSZWZIb2xkZXIoKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBwcm94eUtleUNvZGUoa2V5Q29kZSkge1xuICAgIHJldHVybiBlID0+IHtcbiAgICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghRmFrZUtleURvd25FdmVudCkge1xuICAgICAgICBGYWtlS2V5RG93bkV2ZW50ID0gY2xhc3MgZXh0ZW5kcyBDdXN0b21FdmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3Ioa0NvZGUpIHtcbiAgICAgICAgICAgIHN1cGVyKCdrZXlkb3duJyk7XG4gICAgICAgICAgICB0aGlzLmtleUNvZGUgPSBrQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZha2VFdmVudCA9IG5ldyBGYWtlS2V5RG93bkV2ZW50KGtleUNvZGUpO1xuICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5nZXQoKS5oYW5kbGVLZXlEb3duKGZha2VFdmVudCk7XG5cbiAgICAgIGlmICghZmFrZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICBVTlNBRkVfY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuc2NoZWR1bGVTaG93V29ya2luZyh0aGlzLnByb3BzKTtcblxuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnByb3BzLmNvbmZpZy5vbkRpZENoYW5nZSgnZ2l0aHViLmF1dG9tYXRpY0NvbW1pdE1lc3NhZ2VXcmFwcGluZycsICgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSksXG4gICAgICB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIub25EaWRDaGFuZ2UoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICcnO1xuICAgIGNvbnN0IHJlbWFpbmluZ0NoYXJhY3RlcnMgPSBwYXJzZUludCh0aGlzLmdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKSwgMTApO1xuICAgIGlmIChyZW1haW5pbmdDaGFyYWN0ZXJzIDwgMCkge1xuICAgICAgcmVtYWluaW5nQ2hhcnNDbGFzc05hbWUgPSAnaXMtZXJyb3InO1xuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nQ2hhcmFjdGVycyA8IHRoaXMucHJvcHMubWF4aW11bUNoYXJhY3RlckxpbWl0IC8gNCkge1xuICAgICAgcmVtYWluaW5nQ2hhcnNDbGFzc05hbWUgPSAnaXMtd2FybmluZyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd0Fib3J0TWVyZ2VCdXR0b24gPSB0aGlzLnByb3BzLmlzTWVyZ2luZyB8fCBudWxsO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBjb25zdCBtb2RLZXkgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/ICdDbWQnIDogJ0N0cmwnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXdcIiByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjb21taXRcIiBjYWxsYmFjaz17dGhpcy5jb21taXR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphbWVuZC1sYXN0LWNvbW1pdFwiIGNhbGxiYWNrPXt0aGlzLmFtZW5kTGFzdENvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1leHBhbmRlZC1jb21taXQtbWVzc2FnZS1lZGl0b3JcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg0MCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtdXBcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVudGVyXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDEzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC10YWJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtYmFja3NwYWNlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXBhZ2V1cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzMyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzQpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVuZFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtaG9tZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNil9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZGVsZXRlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQ2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1lc2NhcGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMjcpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y28tYXV0aG9yLWV4Y2x1ZGVcIiBjYWxsYmFjaz17dGhpcy5leGNsdWRlQ29BdXRob3J9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdFByZXZpZXdcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpdmVcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5hY3RpdmF0ZUNvbW1pdFByZXZpZXd9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uV3JhcHBlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdFByZXZpZXcgZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGJ0blwiXG4gICAgICAgICAgICBkaXNhYmxlZD17IXRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc0V4aXN0fVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy50b2dnbGVDb21taXRQcmV2aWV3fT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNvbW1pdFByZXZpZXdBY3RpdmUgPyAnSGlkZSBBbGwgU3RhZ2VkIENoYW5nZXMnIDogJ1NlZSBBbGwgU3RhZ2VkIENoYW5nZXMnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1lZGl0b3InLCB7J2lzLWV4cGFuZGVkJzogdGhpcy5wcm9wcy5kZWFjdGl2YXRlQ29tbWl0Qm94fSl9PlxuICAgICAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5zZXR0ZXJ9XG4gICAgICAgICAgICByZWZNb2RlbD17dGhpcy5yZWZFZGl0b3JNb2RlbH1cbiAgICAgICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0PVwiQ29tbWl0IG1lc3NhZ2VcIlxuICAgICAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICAgICAgc2hvd0ludmlzaWJsZXM9e2ZhbHNlfVxuICAgICAgICAgICAgYXV0b0hlaWdodD17ZmFsc2V9XG4gICAgICAgICAgICBzY3JvbGxQYXN0RW5kPXtmYWxzZX1cbiAgICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyfVxuICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgIGRpZENoYW5nZUN1cnNvclBvc2l0aW9uPXt0aGlzLmRpZE1vdmVDdXJzb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmQ29BdXRob3JUb2dnbGUuc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JUb2dnbGUnLCB7Zm9jdXNlZDogdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dH0pfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVDb0F1dGhvcklucHV0fT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbigpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkNvQXV0aG9yVG9nZ2xlfVxuICAgICAgICAgICAgdGl0bGU9e2Ake3RoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQgPyAnUmVtb3ZlJyA6ICdBZGQnfSBjby1hdXRob3JzYH1cbiAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZIYXJkV3JhcEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUhhcmRXcmFwfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctaGFyZHdyYXAgaGFyZC13cmFwLWljb25zXCI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJIYXJkV3JhcEljb24oKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZIYXJkV3JhcEJ1dHRvbn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWhhcmR3cmFwLXRvb2x0aXBcIlxuICAgICAgICAgICAgdGl0bGU9XCJUb2dnbGUgaGFyZCB3cmFwIG9uIGNvbW1pdFwiXG4gICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmRXhwYW5kQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWV4cGFuZEJ1dHRvbiBpY29uIGljb24tc2NyZWVuLWZ1bGxcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZFeHBhbmRCdXR0b259XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1leHBhbmRCdXR0b24tdG9vbHRpcFwiXG4gICAgICAgICAgICB0aXRsZT1cIkV4cGFuZCBjb21taXQgbWVzc2FnZSBlZGl0b3JcIlxuICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yRm9ybSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvcklucHV0KCl9XG5cbiAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1iYXJcIj5cbiAgICAgICAgICB7c2hvd0Fib3J0TWVyZ2VCdXR0b24gJiZcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkFib3J0TWVyZ2VCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGdpdGh1Yi1Db21taXRWaWV3LWFib3J0TWVyZ2UgaXMtc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5hYm9ydE1lcmdlfT5BYm9ydCBNZXJnZTwvYnV0dG9uPlxuICAgICAgICAgIH1cblxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb21taXRCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdCBidG4gYnRuLXByaW1hcnkgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNvbW1pdH1cbiAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpfT57dGhpcy5jb21taXRCdXR0b25UZXh0KCl9PC9idXR0b24+XG4gICAgICAgICAge3RoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSAmJlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkNvbW1pdEJ1dHRvbn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uLXRvb2x0aXBcIlxuICAgICAgICAgICAgICB0aXRsZT17YCR7bW9kS2V5fS1lbnRlciB0byBjb21taXRgfVxuICAgICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgICAvPn1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1Db21taXRWaWV3LXJlbWFpbmluZy1jaGFyYWN0ZXJzICR7cmVtYWluaW5nQ2hhcnNDbGFzc05hbWV9YH0+XG4gICAgICAgICAgICB7dGhpcy5nZXRSZW1haW5pbmdDaGFyYWN0ZXJzKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9vdGVyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbigpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4gICAgY29uc3Qgc3ZnUGF0aCA9ICdNOS44NzUgMi4xMjVIMTJ2MS43NUg5Ljg3NVY2aC0xLjc1VjMuODc1SDZ2LTEuNzVoMi4xMjVWMGgxLjc1djIuMTI1ek02IDYuNWEuNS41IDAgMCAxLS41LjVoLTVhLjUuNSAwIDAgMS0uNS0uNVY2YzAtMS4zMTYgMi0yIDItMnMuMTE0LS4yMDQgMC0uNWMtLjQyLS4zMS0uNDcyLS43OTUtLjUtMkMxLjU4Ny4yOTMgMi40MzQgMCAzIDBzMS40MTMuMjkzIDEuNSAxLjVjLS4wMjggMS4yMDUtLjA4IDEuNjktLjUgMi0uMTE0LjI5NSAwIC41IDAgLjVzMiAuNjg0IDIgMnYuNXonO1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yVG9nZ2xlSWNvbicsIHtmb2N1c2VkOiB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0fSl9IHZpZXdCb3g9XCIwIDAgMTIgN1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPHRpdGxlPkFkZCBvciByZW1vdmUgY28tYXV0aG9yczwvdGl0bGU+XG4gICAgICAgIDxwYXRoIGQ9e3N2Z1BhdGh9IC8+XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JJbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnVzZXJTdG9yZX0gZmV0Y2hEYXRhPXtzdG9yZSA9PiBzdG9yZS5nZXRVc2VycygpfT5cbiAgICAgICAge21lbnRpb25hYmxlVXNlcnMgPT4gKFxuICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvclNlbGVjdC5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvciBpbnB1dC10ZXh0YXJlYSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ28tQXV0aG9yc1wiXG4gICAgICAgICAgICBhcnJvd1JlbmRlcmVyPXtudWxsfVxuICAgICAgICAgICAgb3B0aW9ucz17bWVudGlvbmFibGVVc2Vyc31cbiAgICAgICAgICAgIGxhYmVsS2V5PVwiZnVsbE5hbWVcIlxuICAgICAgICAgICAgdmFsdWVLZXk9XCJlbWFpbFwiXG4gICAgICAgICAgICBmaWx0ZXJPcHRpb25zPXt0aGlzLm1hdGNoQXV0aG9yc31cbiAgICAgICAgICAgIG9wdGlvblJlbmRlcmVyPXt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW19XG4gICAgICAgICAgICB2YWx1ZVJlbmRlcmVyPXt0aGlzLnJlbmRlckNvQXV0aG9yVmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAgICAgbXVsdGk9e3RydWV9XG4gICAgICAgICAgICBvcGVuT25DbGljaz17ZmFsc2V9XG4gICAgICAgICAgICBvcGVuT25Gb2N1cz17ZmFsc2V9XG4gICAgICAgICAgICB0YWJJbmRleD1cIjVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGFyZFdyYXBJY29uKCkge1xuICAgIGNvbnN0IHNpbmdsZUxpbmVNZXNzYWdlID0gdGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubGVuZ3RoID09PSAxO1xuICAgIGNvbnN0IGhhcmRXcmFwID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJyk7XG4gICAgY29uc3Qgbm90QXBwbGljYWJsZSA9IHRoaXMucHJvcHMuZGVhY3RpdmF0ZUNvbW1pdEJveCB8fCBzaW5nbGVMaW5lTWVzc2FnZTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBjb25zdCBzdmdQYXRocyA9IHtcbiAgICAgIGhhcmRXcmFwRW5hYmxlZDoge1xuICAgICAgICBwYXRoMTogJ003LjA1OCAxMC4yaC0uOTc1djIuNEwyIDlsNC4wODMtMy42djIuNGguOTdsMS4yMDIgMS4yMDNMNy4wNTggMTAuMnptMi41MjUtNC44NjVWNC4yaDIuMzM0djEuMTRsLTEuMTY0IDEuMTY1LTEuMTctMS4xN3onLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgICAgICAgcGF0aDI6ICdNNy44NDIgNi45NGwyLjA2MyAyLjA2My0yLjEyMiAyLjEyLjkwOC45MSAyLjEyMy0yLjEyMyAxLjk4IDEuOTguODUtLjg0OEwxMS41OCA4Ljk4bDIuMTItMi4xMjMtLjgyNC0uODI1LTIuMTIyIDIuMTItMi4wNjItMi4wNnonLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgICAgIH0sXG4gICAgICBoYXJkV3JhcERpc2FibGVkOiB7XG4gICAgICAgIHBhdGgxOiAnTTExLjkxNyA4LjRjMCAuOTktLjc4OCAxLjgtMS43NSAxLjhINi4wODN2Mi40TDIgOWw0LjA4My0zLjZ2Mi40aDMuNVY0LjJoMi4zMzR2NC4yeicsXG4gICAgICB9LFxuICAgIH07XG4gICAgLyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cbiAgICBpZiAobm90QXBwbGljYWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGhhcmRXcmFwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2ljb24nLCAnaGFyZHdyYXAnLCAnaWNvbi1oYXJkd3JhcC1lbmFibGVkJywge2hpZGRlbjogbm90QXBwbGljYWJsZSB8fCAhaGFyZFdyYXB9KX0+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPHBhdGggZD17c3ZnUGF0aHMuaGFyZFdyYXBEaXNhYmxlZC5wYXRoMX0gZmlsbFJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2ljb24nLCAnbm8taGFyZHdyYXAnLCAnaWNvbi1oYXJkd3JhcC1kaXNhYmxlZCcsIHtoaWRkZW46IG5vdEFwcGxpY2FibGUgfHwgaGFyZFdyYXB9KX0+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPGcgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9e3N2Z1BhdGhzLmhhcmRXcmFwRW5hYmxlZC5wYXRoMX0gLz5cbiAgICAgICAgICAgICAgPHBhdGggZmlsbFJ1bGU9XCJub256ZXJvXCIgZD17c3ZnUGF0aHMuaGFyZFdyYXBFbmFibGVkLnBhdGgyfSAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JGb3JtKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JGb3JtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvQXV0aG9yRm9ybVxuICAgICAgICByZWY9e3RoaXMucmVmQ29BdXRob3JGb3JtLnNldHRlcn1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIG9uU3VibWl0PXt0aGlzLnN1Ym1pdE5ld0NvQXV0aG9yfVxuICAgICAgICBvbkNhbmNlbD17dGhpcy5jYW5jZWxOZXdDb0F1dGhvcn1cbiAgICAgICAgbmFtZT17dGhpcy5zdGF0ZS5jb0F1dGhvcklucHV0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgc3VibWl0TmV3Q29BdXRob3IobmV3QXV0aG9yKSB7XG4gICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyh0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzLCBuZXdBdXRob3IpO1xuICAgIHRoaXMuaGlkZU5ld0F1dGhvckZvcm0oKTtcbiAgfVxuXG4gIGNhbmNlbE5ld0NvQXV0aG9yKCkge1xuICAgIHRoaXMuaGlkZU5ld0F1dGhvckZvcm0oKTtcbiAgfVxuXG4gIGhpZGVOZXdBdXRob3JGb3JtKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dDb0F1dGhvckZvcm06IGZhbHNlfSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmZvY3VzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICBVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNjaGVkdWxlU2hvd1dvcmtpbmcobmV4dFByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBkaWRNb3ZlQ3Vyc29yKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHRvZ2dsZUhhcmRXcmFwKCkge1xuICAgIGNvbnN0IGN1cnJlbnRTZXR0aW5nID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJyk7XG4gICAgdGhpcy5wcm9wcy5jb25maWcuc2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJywgIWN1cnJlbnRTZXR0aW5nKTtcbiAgfVxuXG4gIHRvZ2dsZUNvQXV0aG9ySW5wdXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Q29BdXRob3JJbnB1dDogIXRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgaW5jcmVtZW50Q291bnRlcignc2hvdy1jby1hdXRob3ItaW5wdXQnKTtcbiAgICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmZvY3VzKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgaW5wdXQgaXMgY2xvc2VkLCByZW1vdmUgYWxsIGNvLWF1dGhvcnNcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhbXSk7XG4gICAgICAgIGluY3JlbWVudENvdW50ZXIoJ2hpZGUtY28tYXV0aG9yLWlucHV0Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBleGNsdWRlQ29BdXRob3IoKSB7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmdldEZvY3VzZWRPcHRpb24oKSkuZ2V0T3IobnVsbCk7XG4gICAgaWYgKCFhdXRob3IgfHwgYXV0aG9yLmlzTmV3KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZXhjbHVkZWQgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5leGNsdWRlZFVzZXJzJyk7XG4gICAgaWYgKGV4Y2x1ZGVkICYmIGV4Y2x1ZGVkICE9PSAnJykge1xuICAgICAgZXhjbHVkZWQgKz0gJywgJztcbiAgICB9XG4gICAgZXhjbHVkZWQgKz0gYXV0aG9yLmdldEVtYWlsKCk7XG4gICAgdGhpcy5wcm9wcy5jb25maWcuc2V0KCdnaXRodWIuZXhjbHVkZWRVc2VycycsIGV4Y2x1ZGVkKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgdGhpcy5wcm9wcy5hYm9ydE1lcmdlKCk7XG4gIH1cblxuICBhc3luYyBjb21taXQoZXZlbnQsIGFtZW5kKSB7XG4gICAgaWYgKGF3YWl0IHRoaXMucHJvcHMucHJlcGFyZVRvQ29tbWl0KCkgJiYgdGhpcy5jb21taXRJc0VuYWJsZWQoYW1lbmQpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3BzLmNvbW1pdCh0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLCB0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzLCBhbWVuZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgLSBlcnJvciB3YXMgdGFrZW4gY2FyZSBvZiBpbiBwaXBlbGluZSBtYW5hZ2VyXG4gICAgICAgIGlmICghYXRvbS5pc1JlbGVhc2VkVmVyc2lvbigpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuRURJVE9SKTtcbiAgICB9XG4gIH1cblxuICBhbWVuZExhc3RDb21taXQoKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcignYW1lbmQnKTtcbiAgICB0aGlzLmNvbW1pdChudWxsLCB0cnVlKTtcbiAgfVxuXG4gIGdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yTW9kZWwubWFwKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ID09PSAwKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgLSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMCkubGVuZ3RoKS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICfiiJ4nO1xuICAgICAgfVxuICAgIH0pLmdldE9yKHRoaXMucHJvcHMubWF4aW11bUNoYXJhY3RlckxpbWl0IHx8ICcnKTtcbiAgfVxuXG4gIC8vIFdlIGRvbid0IHdhbnQgdGhlIHVzZXIgdG8gc2VlIHRoZSBVSSBmbGlja2VyIGluIHRoZSBjYXNlXG4gIC8vIHRoZSBjb21taXQgdGFrZXMgYSB2ZXJ5IHNtYWxsIHRpbWUgdG8gY29tcGxldGUuIEluc3RlYWQgd2VcbiAgLy8gd2lsbCBvbmx5IHNob3cgdGhlIHdvcmtpbmcgbWVzc2FnZSBpZiB3ZSBhcmUgd29ya2luZyBmb3IgbG9uZ2VyXG4gIC8vIHRoYW4gMSBzZWNvbmQgYXMgcGVyIGh0dHBzOi8vd3d3Lm5uZ3JvdXAuY29tL2FydGljbGVzL3Jlc3BvbnNlLXRpbWVzLTMtaW1wb3J0YW50LWxpbWl0cy9cbiAgLy9cbiAgLy8gVGhlIGNsb3N1cmUgaXMgY3JlYXRlZCB0byByZXN0cmljdCB2YXJpYWJsZSBhY2Nlc3NcbiAgc2NoZWR1bGVTaG93V29ya2luZyhwcm9wcykge1xuICAgIGlmIChwcm9wcy5pc0NvbW1pdHRpbmcpIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zaG93V29ya2luZyAmJiB0aGlzLnRpbWVvdXRIYW5kbGUgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtzaG93V29ya2luZzogdHJ1ZX0pO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEhhbmRsZSk7XG4gICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1dvcmtpbmc6IGZhbHNlfSk7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZE1lc3NhZ2UoKSB7XG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgYXJlIGF0IGxlYXN0IHNvbWUgbm9uLWNvbW1lbnQgbGluZXMgaW4gdGhlIGNvbW1pdCBtZXNzYWdlLlxuICAgIC8vIENvbW1lbnRlZCBsaW5lcyBhcmUgc3RyaXBwZWQgb3V0IG9mIGNvbW1pdCBtZXNzYWdlcyBieSBnaXQsIGJ5IGRlZmF1bHQgY29uZmlndXJhdGlvbi5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5yZXBsYWNlKC9eIy4qJC9nbSwgJycpLnRyaW0oKS5sZW5ndGggIT09IDA7XG4gIH1cblxuICBjb21taXRJc0VuYWJsZWQoYW1lbmQpIHtcbiAgICByZXR1cm4gIXRoaXMucHJvcHMuaXNDb21taXR0aW5nICYmXG4gICAgICAoYW1lbmQgfHwgdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzRXhpc3QpICYmXG4gICAgICAhdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c0V4aXN0ICYmXG4gICAgICB0aGlzLnByb3BzLmxhc3RDb21taXQuaXNQcmVzZW50KCkgJiZcbiAgICAgICh0aGlzLnByb3BzLmRlYWN0aXZhdGVDb21taXRCb3ggfHwgKGFtZW5kIHx8IHRoaXMuaXNWYWxpZE1lc3NhZ2UoKSkpO1xuICB9XG5cbiAgY29tbWl0QnV0dG9uVGV4dCgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93V29ya2luZykge1xuICAgICAgcmV0dXJuICdXb3JraW5nLi4uJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5pc0RldGFjaGVkKCkpIHtcbiAgICAgIHJldHVybiAnQ3JlYXRlIGRldGFjaGVkIGNvbW1pdCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBgQ29tbWl0IHRvICR7dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmdldE5hbWUoKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ0NvbW1pdCc7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcih0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpKTtcbiAgfVxuXG4gIG1hdGNoQXV0aG9ycyhhdXRob3JzLCBmaWx0ZXJUZXh0LCBzZWxlY3RlZEF1dGhvcnMpIHtcbiAgICBjb25zdCBtYXRjaGVkQXV0aG9ycyA9IGF1dGhvcnMuZmlsdGVyKChhdXRob3IsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHNlbGVjdGVkQXV0aG9ycyAmJiBzZWxlY3RlZEF1dGhvcnMuZmluZChzZWxlY3RlZCA9PiBzZWxlY3RlZC5tYXRjaGVzKGF1dGhvcikpO1xuICAgICAgY29uc3QgbWF0Y2hlc0ZpbHRlciA9IFtcbiAgICAgICAgYXV0aG9yLmdldExvZ2luKCksXG4gICAgICAgIGF1dGhvci5nZXRGdWxsTmFtZSgpLFxuICAgICAgICBhdXRob3IuZ2V0RW1haWwoKSxcbiAgICAgIF0uc29tZShmaWVsZCA9PiBmaWVsZCAmJiBmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVGV4dC50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpO1xuXG4gICAgICByZXR1cm4gIWlzQWxyZWFkeVNlbGVjdGVkICYmIG1hdGNoZXNGaWx0ZXI7XG4gICAgfSk7XG4gICAgbWF0Y2hlZEF1dGhvcnMucHVzaChBdXRob3IuY3JlYXRlTmV3KCdBZGQgbmV3IGF1dGhvcicsIGZpbHRlclRleHQpKTtcbiAgICByZXR1cm4gbWF0Y2hlZEF1dGhvcnM7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoZmllbGROYW1lLCB2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3ItJHtmaWVsZE5hbWV9YH0+e3ZhbHVlfTwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JMaXN0SXRlbShhdXRob3IpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvci1zZWxlY3RMaXN0SXRlbScsIHsnbmV3LWF1dGhvcic6IGF1dGhvci5pc05ldygpfSl9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoJ25hbWUnLCBhdXRob3IuZ2V0RnVsbE5hbWUoKSl9XG4gICAgICAgIHthdXRob3IuaGFzTG9naW4oKSAmJiB0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnbG9naW4nLCAnQCcgKyBhdXRob3IuZ2V0TG9naW4oKSl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnZW1haWwnLCBhdXRob3IuZ2V0RW1haWwoKSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JWYWx1ZShhdXRob3IpIHtcbiAgICBjb25zdCBmdWxsTmFtZSA9IGF1dGhvci5nZXRGdWxsTmFtZSgpO1xuICAgIGlmIChmdWxsTmFtZSAmJiBmdWxsTmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gPHNwYW4+e2F1dGhvci5nZXRGdWxsTmFtZSgpfTwvc3Bhbj47XG4gICAgfVxuICAgIGlmIChhdXRob3IuaGFzTG9naW4oKSkge1xuICAgICAgcmV0dXJuIDxzcGFuPkB7YXV0aG9yLmdldExvZ2luKCl9PC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4+e2F1dGhvci5nZXRFbWFpbCgpfTwvc3Bhbj47XG4gIH1cblxuICBvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZChzZWxlY3RlZENvQXV0aG9ycykge1xuICAgIGluY3JlbWVudENvdW50ZXIoJ3NlbGVjdGVkLWNvLWF1dGhvcnMtY2hhbmdlZCcpO1xuICAgIGNvbnN0IG5ld0F1dGhvciA9IHNlbGVjdGVkQ29BdXRob3JzLmZpbmQoYXV0aG9yID0+IGF1dGhvci5pc05ldygpKTtcblxuICAgIGlmIChuZXdBdXRob3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NvQXV0aG9ySW5wdXQ6IG5ld0F1dGhvci5nZXRGdWxsTmFtZSgpLCBzaG93Q29BdXRob3JGb3JtOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMoc2VsZWN0ZWRDb0F1dGhvcnMpO1xuICAgIH1cbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKGVsZW1lbnQgPT4gZWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgZ2V0Rm9jdXMoZWxlbWVudCkge1xuICAgIGlmICh0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24ubWFwKGJ1dHRvbiA9PiBidXR0b24uY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5tYXAoZWRpdG9yID0+IGVkaXRvci5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5FRElUT1I7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZDb21taXRCdXR0b24ubWFwKGUgPT4gZS5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMud3JhcHBlciAmJiBjLndyYXBwZXIuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQ09BVVRIT1JfSU5QVVQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzZXRGb2N1cyhmb2N1cykge1xuICAgIGxldCBmYWxsYmFjayA9IGZhbHNlO1xuICAgIGNvbnN0IGZvY3VzRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT04pIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24ubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5FRElUT1IpIHtcbiAgICAgIGlmICh0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkubGVuZ3RoID4gMCAmJiAhdGhpcy5pc1ZhbGlkTWVzc2FnZSgpKSB7XG4gICAgICAgICAgLy8gdGhlcmUgaXMgbGlrZWx5IGEgY29tbWl0IG1lc3NhZ2UgdGVtcGxhdGUgcHJlc2VudFxuICAgICAgICAgIC8vIHdlIHdhbnQgdGhlIGN1cnNvciB0byBiZSBhdCB0aGUgYmVnaW5uaW5nLCBub3QgYXQgdGhlIGFuZCBvZiB0aGUgdGVtcGxhdGVcbiAgICAgICAgICB0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5nZXQoKS5nZXRNb2RlbCgpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT04pIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvbW1pdEJ1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPQVVUSE9SX0lOUFVUKSB7XG4gICAgICBpZiAodGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3Lmxhc3RGb2N1cykge1xuICAgICAgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT04pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5DT0FVVEhPUl9JTlBVVCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkVESVRPUik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZhbGxiYWNrICYmIHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGNvbnN0IGYgPSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzO1xuXG4gICAgbGV0IG5leHQgPSBudWxsO1xuICAgIHN3aXRjaCAoZm9jdXMpIHtcbiAgICBjYXNlIGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OOlxuICAgICAgbmV4dCA9IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkVESVRPUjpcbiAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIG5leHQgPSBmLkNPQVVUSE9SX0lOUFVUO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBuZXh0ID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICBuZXh0ID0gZi5DT01NSVRfQlVUVE9OO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09BVVRIT1JfSU5QVVQ6XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc01lcmdpbmcpIHtcbiAgICAgICAgbmV4dCA9IGYuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkpIHtcbiAgICAgICAgbmV4dCA9IGYuQ09NTUlUX0JVVFRPTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQgPSBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkFCT1JUX01FUkdFX0JVVFRPTjpcbiAgICAgIG5leHQgPSB0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkgPyBmLkNPTU1JVF9CVVRUT04gOiBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPTU1JVF9CVVRUT046XG4gICAgICBuZXh0ID0gUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV4dCk7XG4gIH1cblxuICByZXRyZWF0Rm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuY29uc3RydWN0b3IuZm9jdXM7XG5cbiAgICBsZXQgcHJldmlvdXMgPSBudWxsO1xuICAgIHN3aXRjaCAoZm9jdXMpIHtcbiAgICBjYXNlIGYuQ09NTUlUX0JVVFRPTjpcbiAgICAgIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBwcmV2aW91cyA9IGYuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5DT0FVVEhPUl9JTlBVVDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5FRElUT1I7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQUJPUlRfTUVSR0VfQlVUVE9OOlxuICAgICAgcHJldmlvdXMgPSB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0ID8gZi5DT0FVVEhPUl9JTlBVVCA6IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPQVVUSE9SX0lOUFVUOlxuICAgICAgcHJldmlvdXMgPSBmLkVESVRPUjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5FRElUT1I6XG4gICAgICBwcmV2aW91cyA9IGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjpcbiAgICAgIHByZXZpb3VzID0gU3RhZ2luZ1ZpZXcubGFzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcmV2aW91cyk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFtRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFbkQsTUFBTUEsYUFBYSxHQUFHLEdBQUc7O0FBRXpCO0FBQ0E7QUFDQSxJQUFJQyxnQkFBZ0I7QUFFTCxNQUFNQyxVQUFVLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBd0N0REMsV0FBVyxDQUFDQyxLQUFLLEVBQUVDLE9BQU8sRUFBRTtJQUMxQixLQUFLLENBQUNELEtBQUssRUFBRUMsT0FBTyxDQUFDO0lBQ3JCLElBQUFDLGlCQUFRLEVBQ04sSUFBSSxFQUNK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