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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TOOLTIP_DELAY = 200; // CustomEvent is a DOM primitive, which v8 can't access
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
  } // eslint-disable-next-line camelcase


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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitView",
      ref: this.refRoot.setter
    }, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:commit",
      callback: this.commit
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:amend-last-commit",
      callback: this.amendLastCommit
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-expanded-commit-message-editor",
      callback: this.toggleExpandedCommitMessageEditor
    })), /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-CommitView-coAuthorEditor"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-down",
      callback: this.proxyKeyCode(40)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-up",
      callback: this.proxyKeyCode(38)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-enter",
      callback: this.proxyKeyCode(13)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-tab",
      callback: this.proxyKeyCode(9)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-backspace",
      callback: this.proxyKeyCode(8)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-pageup",
      callback: this.proxyKeyCode(33)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-pagedown",
      callback: this.proxyKeyCode(34)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-end",
      callback: this.proxyKeyCode(35)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-home",
      callback: this.proxyKeyCode(36)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-delete",
      callback: this.proxyKeyCode(46)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-escape",
      callback: this.proxyKeyCode(27)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:co-author-exclude",
      callback: this.excludeCoAuthor
    })), /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-CommitView-commitPreview"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:dive",
      callback: this.props.activateCommitPreview
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitView-buttonWrapper"
    }, /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refCommitPreviewButton.setter,
      className: "github-CommitView-commitPreview github-CommitView-button btn",
      disabled: !this.props.stagedChangesExist,
      onClick: this.props.toggleCommitPreview
    }, this.props.commitPreviewActive ? 'Hide All Staged Changes' : 'See All Staged Changes')), /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('github-CommitView-editor', {
        'is-expanded': this.props.deactivateCommitBox
      })
    }, /*#__PURE__*/_react.default.createElement(_atomTextEditor.default, {
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
    }), /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refCoAuthorToggle.setter,
      className: (0, _classnames.default)('github-CommitView-coAuthorToggle', {
        focused: this.state.showCoAuthorInput
      }),
      onClick: this.toggleCoAuthorInput
    }, this.renderCoAuthorToggleIcon()), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refCoAuthorToggle,
      title: `${this.state.showCoAuthorInput ? 'Remove' : 'Add'} co-authors`,
      showDelay: TOOLTIP_DELAY
    }), /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refHardWrapButton.setter,
      onClick: this.toggleHardWrap,
      className: "github-CommitView-hardwrap hard-wrap-icons"
    }, this.renderHardWrapIcon()), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refHardWrapButton,
      className: "github-CommitView-hardwrap-tooltip",
      title: "Toggle hard wrap on commit",
      showDelay: TOOLTIP_DELAY
    }), /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refExpandButton.setter,
      className: "github-CommitView-expandButton icon icon-screen-full",
      onClick: this.toggleExpandedCommitMessageEditor
    }), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refExpandButton,
      className: "github-CommitView-expandButton-tooltip",
      title: "Expand commit message editor",
      showDelay: TOOLTIP_DELAY
    })), this.renderCoAuthorForm(), this.renderCoAuthorInput(), /*#__PURE__*/_react.default.createElement("footer", {
      className: "github-CommitView-bar"
    }, showAbortMergeButton && /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refAbortMergeButton.setter,
      className: "btn github-CommitView-button github-CommitView-abortMerge is-secondary",
      onClick: this.abortMerge
    }, "Abort Merge"), /*#__PURE__*/_react.default.createElement("button", {
      ref: this.refCommitButton.setter,
      className: "github-CommitView-button github-CommitView-commit btn btn-primary native-key-bindings",
      onClick: this.commit,
      disabled: !this.commitIsEnabled(false)
    }, this.commitButtonText()), this.commitIsEnabled(false) && /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refCommitButton,
      className: "github-CommitView-button-tooltip",
      title: `${modKey}-enter to commit`,
      showDelay: TOOLTIP_DELAY
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: `github-CommitView-remaining-characters ${remainingCharsClassName}`
    }, this.getRemainingCharacters())));
  }

  renderCoAuthorToggleIcon() {
    /* eslint-disable max-len */
    const svgPath = 'M9.875 2.125H12v1.75H9.875V6h-1.75V3.875H6v-1.75h2.125V0h1.75v2.125zM6 6.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V6c0-1.316 2-2 2-2s.114-.204 0-.5c-.42-.31-.472-.795-.5-2C1.587.293 2.434 0 3 0s1.413.293 1.5 1.5c-.028 1.205-.08 1.69-.5 2-.114.295 0 .5 0 .5s2 .684 2 2v.5z';
    return /*#__PURE__*/_react.default.createElement("svg", {
      className: (0, _classnames.default)('github-CommitView-coAuthorToggleIcon', {
        focused: this.state.showCoAuthorInput
      }),
      viewBox: "0 0 12 7",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/_react.default.createElement("title", null, "Add or remove co-authors"), /*#__PURE__*/_react.default.createElement("path", {
      d: svgPath
    }));
  }

  renderCoAuthorInput() {
    if (!this.state.showCoAuthorInput) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.userStore,
      fetchData: store => store.getUsers()
    }, mentionableUsers => /*#__PURE__*/_react.default.createElement(_reactSelect.default, {
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
      return /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('icon', 'hardwrap', 'icon-hardwrap-enabled', {
          hidden: notApplicable || !hardWrap
        })
      }, /*#__PURE__*/_react.default.createElement("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/_react.default.createElement("path", {
        d: svgPaths.hardWrapDisabled.path1,
        fillRule: "evenodd"
      })));
    } else {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('icon', 'no-hardwrap', 'icon-hardwrap-disabled', {
          hidden: notApplicable || hardWrap
        })
      }, /*#__PURE__*/_react.default.createElement("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/_react.default.createElement("g", {
        fillRule: "evenodd"
      }, /*#__PURE__*/_react.default.createElement("path", {
        d: svgPaths.hardWrapEnabled.path1
      }), /*#__PURE__*/_react.default.createElement("path", {
        fillRule: "nonzero",
        d: svgPaths.hardWrapEnabled.path2
      }))));
    }
  }

  renderCoAuthorForm() {
    if (!this.state.showCoAuthorForm) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_coAuthorForm.default, {
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
  } // eslint-disable-next-line camelcase


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
  } // We don't want the user to see the UI flicker in the case
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

    return /*#__PURE__*/_react.default.createElement("span", {
      className: `github-CommitView-coAuthorEditor-${fieldName}`
    }, value);
  }

  renderCoAuthorListItem(author) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('github-CommitView-coAuthorEditor-selectListItem', {
        'new-author': author.isNew()
      })
    }, this.renderCoAuthorListItemField('name', author.getFullName()), author.hasLogin() && this.renderCoAuthorListItemField('login', '@' + author.getLogin()), this.renderCoAuthorListItemField('email', author.getEmail()));
  }

  renderCoAuthorValue(author) {
    const fullName = author.getFullName();

    if (fullName && fullName.length > 0) {
      return /*#__PURE__*/_react.default.createElement("span", null, author.getFullName());
    }

    if (author.hasLogin()) {
      return /*#__PURE__*/_react.default.createElement("span", null, "@", author.getLogin());
    }

    return /*#__PURE__*/_react.default.createElement("span", null, author.getEmail());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jb21taXQtdmlldy5qcyJdLCJuYW1lcyI6WyJUT09MVElQX0RFTEFZIiwiRmFrZUtleURvd25FdmVudCIsIkNvbW1pdFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhdGUiLCJzaG93V29ya2luZyIsInNob3dDb0F1dGhvcklucHV0Iiwic2hvd0NvQXV0aG9yRm9ybSIsImNvQXV0aG9ySW5wdXQiLCJ0aW1lb3V0SGFuZGxlIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwicmVmQ29tbWl0UHJldmlld0J1dHRvbiIsInJlZkV4cGFuZEJ1dHRvbiIsInJlZkNvbW1pdEJ1dHRvbiIsInJlZkhhcmRXcmFwQnV0dG9uIiwicmVmQWJvcnRNZXJnZUJ1dHRvbiIsInJlZkNvQXV0aG9yVG9nZ2xlIiwicmVmQ29BdXRob3JTZWxlY3QiLCJyZWZDb0F1dGhvckZvcm0iLCJyZWZFZGl0b3JDb21wb25lbnQiLCJyZWZFZGl0b3JNb2RlbCIsInN1YnMiLCJwcm94eUtleUNvZGUiLCJrZXlDb2RlIiwiZSIsImlzRW1wdHkiLCJDdXN0b21FdmVudCIsImtDb2RlIiwiZmFrZUV2ZW50IiwiZ2V0IiwiaGFuZGxlS2V5RG93biIsImRlZmF1bHRQcmV2ZW50ZWQiLCJhYm9ydEtleUJpbmRpbmciLCJVTlNBRkVfY29tcG9uZW50V2lsbE1vdW50Iiwic2NoZWR1bGVTaG93V29ya2luZyIsImFkZCIsImNvbmZpZyIsIm9uRGlkQ2hhbmdlIiwiZm9yY2VVcGRhdGUiLCJtZXNzYWdlQnVmZmVyIiwicmVuZGVyIiwicmVtYWluaW5nQ2hhcnNDbGFzc05hbWUiLCJyZW1haW5pbmdDaGFyYWN0ZXJzIiwicGFyc2VJbnQiLCJnZXRSZW1haW5pbmdDaGFyYWN0ZXJzIiwibWF4aW11bUNoYXJhY3RlckxpbWl0Iiwic2hvd0Fib3J0TWVyZ2VCdXR0b24iLCJpc01lcmdpbmciLCJtb2RLZXkiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJzZXR0ZXIiLCJjb21tYW5kcyIsImNvbW1pdCIsImFtZW5kTGFzdENvbW1pdCIsInRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvciIsImV4Y2x1ZGVDb0F1dGhvciIsImFjdGl2YXRlQ29tbWl0UHJldmlldyIsInN0YWdlZENoYW5nZXNFeGlzdCIsInRvZ2dsZUNvbW1pdFByZXZpZXciLCJjb21taXRQcmV2aWV3QWN0aXZlIiwiZGVhY3RpdmF0ZUNvbW1pdEJveCIsIndvcmtzcGFjZSIsImRpZE1vdmVDdXJzb3IiLCJmb2N1c2VkIiwidG9nZ2xlQ29BdXRob3JJbnB1dCIsInJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbiIsInRvb2x0aXBzIiwidG9nZ2xlSGFyZFdyYXAiLCJyZW5kZXJIYXJkV3JhcEljb24iLCJyZW5kZXJDb0F1dGhvckZvcm0iLCJyZW5kZXJDb0F1dGhvcklucHV0IiwiYWJvcnRNZXJnZSIsImNvbW1pdElzRW5hYmxlZCIsImNvbW1pdEJ1dHRvblRleHQiLCJzdmdQYXRoIiwidXNlclN0b3JlIiwic3RvcmUiLCJnZXRVc2VycyIsIm1lbnRpb25hYmxlVXNlcnMiLCJtYXRjaEF1dGhvcnMiLCJyZW5kZXJDb0F1dGhvckxpc3RJdGVtIiwicmVuZGVyQ29BdXRob3JWYWx1ZSIsIm9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkIiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJzaW5nbGVMaW5lTWVzc2FnZSIsImdldFRleHQiLCJzcGxpdCIsIkxJTkVfRU5ESU5HX1JFR0VYIiwibGVuZ3RoIiwiaGFyZFdyYXAiLCJub3RBcHBsaWNhYmxlIiwic3ZnUGF0aHMiLCJoYXJkV3JhcEVuYWJsZWQiLCJwYXRoMSIsInBhdGgyIiwiaGFyZFdyYXBEaXNhYmxlZCIsImhpZGRlbiIsInN1Ym1pdE5ld0NvQXV0aG9yIiwiY2FuY2VsTmV3Q29BdXRob3IiLCJuZXdBdXRob3IiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsImhpZGVOZXdBdXRob3JGb3JtIiwic2V0U3RhdGUiLCJtYXAiLCJjIiwiZm9jdXMiLCJVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImN1cnJlbnRTZXR0aW5nIiwic2V0IiwiYXV0aG9yIiwiZ2V0Rm9jdXNlZE9wdGlvbiIsImdldE9yIiwiaXNOZXciLCJleGNsdWRlZCIsImdldEVtYWlsIiwiZXZlbnQiLCJhbWVuZCIsInByZXBhcmVUb0NvbW1pdCIsImF0b20iLCJpc1JlbGVhc2VkVmVyc2lvbiIsInNldEZvY3VzIiwiRURJVE9SIiwiZWRpdG9yIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJyb3ciLCJsaW5lVGV4dEZvckJ1ZmZlclJvdyIsInRvU3RyaW5nIiwiaXNDb21taXR0aW5nIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImlzVmFsaWRNZXNzYWdlIiwicmVwbGFjZSIsInRyaW0iLCJtZXJnZUNvbmZsaWN0c0V4aXN0IiwibGFzdENvbW1pdCIsImlzUHJlc2VudCIsImN1cnJlbnRCcmFuY2giLCJpc0RldGFjaGVkIiwiZ2V0TmFtZSIsImF1dGhvcnMiLCJmaWx0ZXJUZXh0Iiwic2VsZWN0ZWRBdXRob3JzIiwibWF0Y2hlZEF1dGhvcnMiLCJmaWx0ZXIiLCJpbmRleCIsImlzQWxyZWFkeVNlbGVjdGVkIiwiZmluZCIsInNlbGVjdGVkIiwibWF0Y2hlcyIsIm1hdGNoZXNGaWx0ZXIiLCJnZXRMb2dpbiIsImdldEZ1bGxOYW1lIiwic29tZSIsImZpZWxkIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwicHVzaCIsIkF1dGhvciIsImNyZWF0ZU5ldyIsInJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCIsImZpZWxkTmFtZSIsInZhbHVlIiwiaGFzTG9naW4iLCJmdWxsTmFtZSIsImhhc0ZvY3VzIiwiZWxlbWVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiZ2V0Rm9jdXMiLCJidXR0b24iLCJDT01NSVRfUFJFVklFV19CVVRUT04iLCJBQk9SVF9NRVJHRV9CVVRUT04iLCJDT01NSVRfQlVUVE9OIiwid3JhcHBlciIsIkNPQVVUSE9SX0lOUFVUIiwiZmFsbGJhY2siLCJmb2N1c0VsZW1lbnQiLCJnZXRNb2RlbCIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwibGFzdEZvY3VzIiwiYWR2YW5jZUZvY3VzRnJvbSIsImYiLCJuZXh0IiwiUmVjZW50Q29tbWl0c1ZpZXciLCJmaXJzdEZvY3VzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXRyZWF0Rm9jdXNGcm9tIiwicHJldmlvdXMiLCJTdGFnaW5nVmlldyIsIlN5bWJvbCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwibnVtYmVyIiwiVXNlclN0b3JlUHJvcFR5cGUiLCJhcnJheU9mIiwiQXV0aG9yUHJvcFR5cGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxhQUFhLEdBQUcsR0FBdEIsQyxDQUVBO0FBQ0E7O0FBQ0EsSUFBSUMsZ0JBQUo7O0FBRWUsTUFBTUMsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUF3Q3REQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7QUFDQSwyQkFDRSxJQURGLEVBRUUsbUJBRkYsRUFFdUIsbUJBRnZCLEVBRTRDLGVBRjVDLEVBRTZELGdCQUY3RCxFQUdFLHFCQUhGLEVBR3lCLFlBSHpCLEVBR3VDLFFBSHZDLEVBR2lELGlCQUhqRCxFQUdvRSxtQ0FIcEUsRUFJRSx3QkFKRixFQUk0Qiw0QkFKNUIsRUFJMEQsaUJBSjFEO0FBT0Es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RUFBRXdJLG1CQUFVRyxJQUFWLENBQWVELFVBWm5CO0FBYWpCekksRUFBQUEsbUJBQW1CLEVBQUV1SSxtQkFBVUcsSUFBVixDQUFlRCxVQWJuQjtBQWNqQnpKLEVBQUFBLHFCQUFxQixFQUFFdUosbUJBQVVJLE1BQVYsQ0FBaUJGLFVBZHZCO0FBZWpCL0osRUFBQUEsYUFBYSxFQUFFNkosbUJBQVVDLE1BQVYsQ0FBaUJDLFVBZmY7QUFlMkI7QUFDNUMxSCxFQUFBQSxTQUFTLEVBQUU2SCw4QkFBa0JILFVBaEJaO0FBaUJqQmxILEVBQUFBLGlCQUFpQixFQUFFZ0gsbUJBQVVNLE9BQVYsQ0FBa0JDLDBCQUFsQixDQWpCRjtBQWtCakJ0RyxFQUFBQSx1QkFBdUIsRUFBRStGLG1CQUFVUSxJQWxCbEI7QUFtQmpCdkosRUFBQUEsTUFBTSxFQUFFK0ksbUJBQVVRLElBQVYsQ0FBZU4sVUFuQk47QUFvQmpCOUgsRUFBQUEsVUFBVSxFQUFFNEgsbUJBQVVRLElBQVYsQ0FBZU4sVUFwQlY7QUFxQmpCN0UsRUFBQUEsZUFBZSxFQUFFMkUsbUJBQVVRLElBQVYsQ0FBZU4sVUFyQmY7QUFzQmpCL0ksRUFBQUEsaUNBQWlDLEVBQUU2SSxtQkFBVVEsSUFBVixDQUFlTixVQXRCakM7QUF1QmpCM0ksRUFBQUEsbUJBQW1CLEVBQUV5SSxtQkFBVVEsSUFBVixDQUFlTixVQXZCbkI7QUF3QmpCN0ksRUFBQUEscUJBQXFCLEVBQUUySSxtQkFBVVEsSUFBVixDQUFlTjtBQXhCckIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QnO1xuXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9hdG9tL3Rvb2x0aXAnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgQ29BdXRob3JGb3JtIGZyb20gJy4vY28tYXV0aG9yLWZvcm0nO1xuaW1wb3J0IFJlY2VudENvbW1pdHNWaWV3IGZyb20gJy4vcmVjZW50LWNvbW1pdHMtdmlldyc7XG5pbXBvcnQgU3RhZ2luZ1ZpZXcgZnJvbSAnLi9zdGFnaW5nLXZpZXcnO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi4vbW9kZWxzL2F1dGhvcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4vb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQge0xJTkVfRU5ESU5HX1JFR0VYLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0F1dGhvclByb3BUeXBlLCBVc2VyU3RvcmVQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXJ9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuY29uc3QgVE9PTFRJUF9ERUxBWSA9IDIwMDtcblxuLy8gQ3VzdG9tRXZlbnQgaXMgYSBET00gcHJpbWl0aXZlLCB3aGljaCB2OCBjYW4ndCBhY2Nlc3Ncbi8vIHNvIHdlJ3JlIGVzc2VudGlhbGx5IGxhenkgbG9hZGluZyB0byBrZWVwIHNuYXBzaG90dGluZyBmcm9tIGJyZWFraW5nLlxubGV0IEZha2VLZXlEb3duRXZlbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgQ09NTUlUX1BSRVZJRVdfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1wcmV2aWV3LWJ1dHRvbicpLFxuICAgIEVESVRPUjogU3ltYm9sKCdjb21taXQtZWRpdG9yJyksXG4gICAgQ09BVVRIT1JfSU5QVVQ6IFN5bWJvbCgnY29hdXRob3ItaW5wdXQnKSxcbiAgICBBQk9SVF9NRVJHRV9CVVRUT046IFN5bWJvbCgnY29tbWl0LWFib3J0LW1lcmdlLWJ1dHRvbicpLFxuICAgIENPTU1JVF9CVVRUT046IFN5bWJvbCgnY29tbWl0LWJ1dHRvbicpLFxuICB9O1xuXG4gIHN0YXRpYyBmaXJzdEZvY3VzID0gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT047XG5cbiAgc3RhdGljIGxhc3RGb2N1cyA9IFN5bWJvbCgnbGFzdC1mb2N1cycpO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgbGFzdENvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHNFeGlzdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzRXhpc3Q6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNDb21taXR0aW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdFByZXZpZXdBY3RpdmU6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZGVhY3RpdmF0ZUNvbW1pdEJveDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBtYXhpbXVtQ2hhcmFjdGVyTGltaXQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBtZXNzYWdlQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsIC8vIEZJWE1FIG1vcmUgc3BlY2lmaWMgcHJvcHR5cGVcbiAgICB1c2VyU3RvcmU6IFVzZXJTdG9yZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5hcnJheU9mKEF1dGhvclByb3BUeXBlKSxcbiAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFib3J0TWVyZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcHJlcGFyZVRvQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b2dnbGVDb21taXRQcmV2aWV3OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFjdGl2YXRlQ29tbWl0UHJldmlldzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnc3VibWl0TmV3Q29BdXRob3InLCAnY2FuY2VsTmV3Q29BdXRob3InLCAnZGlkTW92ZUN1cnNvcicsICd0b2dnbGVIYXJkV3JhcCcsXG4gICAgICAndG9nZ2xlQ29BdXRob3JJbnB1dCcsICdhYm9ydE1lcmdlJywgJ2NvbW1pdCcsICdhbWVuZExhc3RDb21taXQnLCAndG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yJyxcbiAgICAgICdyZW5kZXJDb0F1dGhvckxpc3RJdGVtJywgJ29uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkJywgJ2V4Y2x1ZGVDb0F1dGhvcicsXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzaG93V29ya2luZzogZmFsc2UsXG4gICAgICBzaG93Q29BdXRob3JJbnB1dDogZmFsc2UsXG4gICAgICBzaG93Q29BdXRob3JGb3JtOiBmYWxzZSxcbiAgICAgIGNvQXV0aG9ySW5wdXQ6ICcnLFxuICAgIH07XG5cbiAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRXhwYW5kQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29tbWl0QnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmSGFyZFdyYXBCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29BdXRob3JUb2dnbGUgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvQXV0aG9yRm9ybSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvckNvbXBvbmVudCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvck1vZGVsID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIHByb3h5S2V5Q29kZShrZXlDb2RlKSB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgaWYgKHRoaXMucmVmQ29BdXRob3JTZWxlY3QuaXNFbXB0eSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFGYWtlS2V5RG93bkV2ZW50KSB7XG4gICAgICAgIEZha2VLZXlEb3duRXZlbnQgPSBjbGFzcyBleHRlbmRzIEN1c3RvbUV2ZW50IHtcbiAgICAgICAgICBjb25zdHJ1Y3RvcihrQ29kZSkge1xuICAgICAgICAgICAgc3VwZXIoJ2tleWRvd24nKTtcbiAgICAgICAgICAgIHRoaXMua2V5Q29kZSA9IGtDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFrZUV2ZW50ID0gbmV3IEZha2VLZXlEb3duRXZlbnQoa2V5Q29kZSk7XG4gICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LmdldCgpLmhhbmRsZUtleURvd24oZmFrZUV2ZW50KTtcblxuICAgICAgaWYgKCFmYWtlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBlLmFib3J0S2V5QmluZGluZygpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gIFVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5zY2hlZHVsZVNob3dXb3JraW5nKHRoaXMucHJvcHMpO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMuY29uZmlnLm9uRGlkQ2hhbmdlKCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJywgKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICAgIHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5vbkRpZENoYW5nZSgoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHJlbWFpbmluZ0NoYXJzQ2xhc3NOYW1lID0gJyc7XG4gICAgY29uc3QgcmVtYWluaW5nQ2hhcmFjdGVycyA9IHBhcnNlSW50KHRoaXMuZ2V0UmVtYWluaW5nQ2hhcmFjdGVycygpLCAxMCk7XG4gICAgaWYgKHJlbWFpbmluZ0NoYXJhY3RlcnMgPCAwKSB7XG4gICAgICByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICdpcy1lcnJvcic7XG4gICAgfSBlbHNlIGlmIChyZW1haW5pbmdDaGFyYWN0ZXJzIDwgdGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgLyA0KSB7XG4gICAgICByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICdpcy13YXJuaW5nJztcbiAgICB9XG5cbiAgICBjb25zdCBzaG93QWJvcnRNZXJnZUJ1dHRvbiA9IHRoaXMucHJvcHMuaXNNZXJnaW5nIHx8IG51bGw7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGNvbnN0IG1vZEtleSA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nID8gJ0NtZCcgOiAnQ3RybCc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlld1wiIHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNvbW1pdFwiIGNhbGxiYWNrPXt0aGlzLmNvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFtZW5kLWxhc3QtY29tbWl0XCIgY2FsbGJhY2s9e3RoaXMuYW1lbmRMYXN0Q29tbWl0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWV4cGFuZGVkLWNvbW1pdC1tZXNzYWdlLWVkaXRvclwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy50b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3JcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kb3duXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQwKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC11cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW50ZXJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMTMpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXRhYlwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg5KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1iYWNrc3BhY2VcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZXVwXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDMzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1wYWdlZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW5kXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM1KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1ob21lXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kZWxldGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoNDYpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVzY2FwZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgyNyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjby1hdXRob3ItZXhjbHVkZVwiIGNhbGxiYWNrPXt0aGlzLmV4Y2x1ZGVDb0F1dGhvcn0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0UHJldmlld1wiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGl2ZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmFjdGl2YXRlQ29tbWl0UHJldmlld30gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b25XcmFwcGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0UHJldmlldyBnaXRodWItQ29tbWl0Vmlldy1idXR0b24gYnRuXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzRXhpc3R9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLnRvZ2dsZUNvbW1pdFByZXZpZXd9PlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY29tbWl0UHJldmlld0FjdGl2ZSA/ICdIaWRlIEFsbCBTdGFnZWQgQ2hhbmdlcycgOiAnU2VlIEFsbCBTdGFnZWQgQ2hhbmdlcyd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWVkaXRvcicsIHsnaXMtZXhwYW5kZWQnOiB0aGlzLnByb3BzLmRlYWN0aXZhdGVDb21taXRCb3h9KX0+XG4gICAgICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmRWRpdG9yQ29tcG9uZW50LnNldHRlcn1cbiAgICAgICAgICAgIHJlZk1vZGVsPXt0aGlzLnJlZkVkaXRvck1vZGVsfVxuICAgICAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG4gICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ9XCJDb21taXQgbWVzc2FnZVwiXG4gICAgICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgICAgICBzaG93SW52aXNpYmxlcz17ZmFsc2V9XG4gICAgICAgICAgICBhdXRvSGVpZ2h0PXtmYWxzZX1cbiAgICAgICAgICAgIHNjcm9sbFBhc3RFbmQ9e2ZhbHNlfVxuICAgICAgICAgICAgYnVmZmVyPXt0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXJ9XG4gICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb249e3RoaXMuZGlkTW92ZUN1cnNvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvclRvZ2dsZS5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvclRvZ2dsZScsIHtmb2N1c2VkOiB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0fSl9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUNvQXV0aG9ySW5wdXR9PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JUb2dnbGVJY29uKCl9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmQ29BdXRob3JUb2dnbGV9XG4gICAgICAgICAgICB0aXRsZT17YCR7dGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCA/ICdSZW1vdmUnIDogJ0FkZCd9IGNvLWF1dGhvcnNgfVxuICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkhhcmRXcmFwQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlSGFyZFdyYXB9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1oYXJkd3JhcCBoYXJkLXdyYXAtaWNvbnNcIj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckhhcmRXcmFwSWNvbigpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkhhcmRXcmFwQnV0dG9ufVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctaGFyZHdyYXAtdG9vbHRpcFwiXG4gICAgICAgICAgICB0aXRsZT1cIlRvZ2dsZSBoYXJkIHdyYXAgb24gY29tbWl0XCJcbiAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZFeHBhbmRCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctZXhwYW5kQnV0dG9uIGljb24gaWNvbi1zY3JlZW4tZnVsbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkV4cGFuZEJ1dHRvbn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWV4cGFuZEJ1dHRvbi10b29sdGlwXCJcbiAgICAgICAgICAgIHRpdGxlPVwiRXhwYW5kIGNvbW1pdCBtZXNzYWdlIGVkaXRvclwiXG4gICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JGb3JtKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9ySW5wdXQoKX1cblxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWJhclwiPlxuICAgICAgICAgIHtzaG93QWJvcnRNZXJnZUJ1dHRvbiAmJlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICByZWY9e3RoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBnaXRodWItQ29tbWl0Vmlldy1idXR0b24gZ2l0aHViLUNvbW1pdFZpZXctYWJvcnRNZXJnZSBpcy1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmFib3J0TWVyZ2V9PkFib3J0IE1lcmdlPC9idXR0b24+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b24gZ2l0aHViLUNvbW1pdFZpZXctY29tbWl0IGJ0biBidG4tcHJpbWFyeSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY29tbWl0fVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSl9Pnt0aGlzLmNvbW1pdEJ1dHRvblRleHQoKX08L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpICYmXG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmQ29tbWl0QnV0dG9ufVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1idXR0b24tdG9vbHRpcFwiXG4gICAgICAgICAgICAgIHRpdGxlPXtgJHttb2RLZXl9LWVudGVyIHRvIGNvbW1pdGB9XG4gICAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAgIC8+fVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLUNvbW1pdFZpZXctcmVtYWluaW5nLWNoYXJhY3RlcnMgJHtyZW1haW5pbmdDaGFyc0NsYXNzTmFtZX1gfT5cbiAgICAgICAgICAgIHt0aGlzLmdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb290ZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JUb2dnbGVJY29uKCkge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBjb25zdCBzdmdQYXRoID0gJ005Ljg3NSAyLjEyNUgxMnYxLjc1SDkuODc1VjZoLTEuNzVWMy44NzVINnYtMS43NWgyLjEyNVYwaDEuNzV2Mi4xMjV6TTYgNi41YS41LjUgMCAwIDEtLjUuNWgtNWEuNS41IDAgMCAxLS41LS41VjZjMC0xLjMxNiAyLTIgMi0ycy4xMTQtLjIwNCAwLS41Yy0uNDItLjMxLS40NzItLjc5NS0uNS0yQzEuNTg3LjI5MyAyLjQzNCAwIDMgMHMxLjQxMy4yOTMgMS41IDEuNWMtLjAyOCAxLjIwNS0uMDggMS42OS0uNSAyLS4xMTQuMjk1IDAgLjUgMCAuNXMyIC42ODQgMiAydi41eic7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JUb2dnbGVJY29uJywge2ZvY3VzZWQ6IHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXR9KX0gdmlld0JveD1cIjAgMCAxMiA3XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8dGl0bGU+QWRkIG9yIHJlbW92ZSBjby1hdXRob3JzPC90aXRsZT5cbiAgICAgICAgPHBhdGggZD17c3ZnUGF0aH0gLz5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvcklucHV0KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMudXNlclN0b3JlfSBmZXRjaERhdGE9e3N0b3JlID0+IHN0b3JlLmdldFVzZXJzKCl9PlxuICAgICAgICB7bWVudGlvbmFibGVVc2VycyA9PiAoXG4gICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yIGlucHV0LXRleHRhcmVhIG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDby1BdXRob3JzXCJcbiAgICAgICAgICAgIGFycm93UmVuZGVyZXI9e251bGx9XG4gICAgICAgICAgICBvcHRpb25zPXttZW50aW9uYWJsZVVzZXJzfVxuICAgICAgICAgICAgbGFiZWxLZXk9XCJmdWxsTmFtZVwiXG4gICAgICAgICAgICB2YWx1ZUtleT1cImVtYWlsXCJcbiAgICAgICAgICAgIGZpbHRlck9wdGlvbnM9e3RoaXMubWF0Y2hBdXRob3JzfVxuICAgICAgICAgICAgb3B0aW9uUmVuZGVyZXI9e3RoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbX1cbiAgICAgICAgICAgIHZhbHVlUmVuZGVyZXI9e3RoaXMucmVuZGVyQ29BdXRob3JWYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgICAgICBtdWx0aT17dHJ1ZX1cbiAgICAgICAgICAgIG9wZW5PbkNsaWNrPXtmYWxzZX1cbiAgICAgICAgICAgIG9wZW5PbkZvY3VzPXtmYWxzZX1cbiAgICAgICAgICAgIHRhYkluZGV4PVwiNVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIYXJkV3JhcEljb24oKSB7XG4gICAgY29uc3Qgc2luZ2xlTGluZU1lc3NhZ2UgPSB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5sZW5ndGggPT09IDE7XG4gICAgY29uc3QgaGFyZFdyYXAgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnKTtcbiAgICBjb25zdCBub3RBcHBsaWNhYmxlID0gdGhpcy5wcm9wcy5kZWFjdGl2YXRlQ29tbWl0Qm94IHx8IHNpbmdsZUxpbmVNZXNzYWdlO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGNvbnN0IHN2Z1BhdGhzID0ge1xuICAgICAgaGFyZFdyYXBFbmFibGVkOiB7XG4gICAgICAgIHBhdGgxOiAnTTcuMDU4IDEwLjJoLS45NzV2Mi40TDIgOWw0LjA4My0zLjZ2Mi40aC45N2wxLjIwMiAxLjIwM0w3LjA1OCAxMC4yem0yLjUyNS00Ljg2NVY0LjJoMi4zMzR2MS4xNGwtMS4xNjQgMS4xNjUtMS4xNy0xLjE3eicsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICAgICAgICBwYXRoMjogJ003Ljg0MiA2Ljk0bDIuMDYzIDIuMDYzLTIuMTIyIDIuMTIuOTA4LjkxIDIuMTIzLTIuMTIzIDEuOTggMS45OC44NS0uODQ4TDExLjU4IDguOThsMi4xMi0yLjEyMy0uODI0LS44MjUtMi4xMjIgMi4xMi0yLjA2Mi0yLjA2eicsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICAgICAgfSxcbiAgICAgIGhhcmRXcmFwRGlzYWJsZWQ6IHtcbiAgICAgICAgcGF0aDE6ICdNMTEuOTE3IDguNGMwIC45OS0uNzg4IDEuOC0xLjc1IDEuOEg2LjA4M3YyLjRMMiA5bDQuMDgzLTMuNnYyLjRoMy41VjQuMmgyLjMzNHY0LjJ6JyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuICAgIGlmIChub3RBcHBsaWNhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoaGFyZFdyYXApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnaWNvbicsICdoYXJkd3JhcCcsICdpY29uLWhhcmR3cmFwLWVuYWJsZWQnLCB7aGlkZGVuOiBub3RBcHBsaWNhYmxlIHx8ICFoYXJkV3JhcH0pfT5cbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8cGF0aCBkPXtzdmdQYXRocy5oYXJkV3JhcERpc2FibGVkLnBhdGgxfSBmaWxsUnVsZT1cImV2ZW5vZGRcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnaWNvbicsICduby1oYXJkd3JhcCcsICdpY29uLWhhcmR3cmFwLWRpc2FibGVkJywge2hpZGRlbjogbm90QXBwbGljYWJsZSB8fCBoYXJkV3JhcH0pfT5cbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8ZyBmaWxsUnVsZT1cImV2ZW5vZGRcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD17c3ZnUGF0aHMuaGFyZFdyYXBFbmFibGVkLnBhdGgxfSAvPlxuICAgICAgICAgICAgICA8cGF0aCBmaWxsUnVsZT1cIm5vbnplcm9cIiBkPXtzdmdQYXRocy5oYXJkV3JhcEVuYWJsZWQucGF0aDJ9IC8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckZvcm0oKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNob3dDb0F1dGhvckZvcm0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29BdXRob3JGb3JtXG4gICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvckZvcm0uc2V0dGVyfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgb25TdWJtaXQ9e3RoaXMuc3VibWl0TmV3Q29BdXRob3J9XG4gICAgICAgIG9uQ2FuY2VsPXt0aGlzLmNhbmNlbE5ld0NvQXV0aG9yfVxuICAgICAgICBuYW1lPXt0aGlzLnN0YXRlLmNvQXV0aG9ySW5wdXR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBzdWJtaXROZXdDb0F1dGhvcihuZXdBdXRob3IpIHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKHRoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnMsIG5ld0F1dGhvcik7XG4gICAgdGhpcy5oaWRlTmV3QXV0aG9yRm9ybSgpO1xuICB9XG5cbiAgY2FuY2VsTmV3Q29BdXRob3IoKSB7XG4gICAgdGhpcy5oaWRlTmV3QXV0aG9yRm9ybSgpO1xuICB9XG5cbiAgaGlkZU5ld0F1dGhvckZvcm0oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0NvQXV0aG9yRm9ybTogZmFsc2V9LCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZm9jdXMoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2NoZWR1bGVTaG93V29ya2luZyhuZXh0UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGRpZE1vdmVDdXJzb3IoKSB7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgdG9nZ2xlSGFyZFdyYXAoKSB7XG4gICAgY29uc3QgY3VycmVudFNldHRpbmcgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnKTtcbiAgICB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ2dpdGh1Yi5hdXRvbWF0aWNDb21taXRNZXNzYWdlV3JhcHBpbmcnLCAhY3VycmVudFNldHRpbmcpO1xuICB9XG5cbiAgdG9nZ2xlQ29BdXRob3JJbnB1dCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNob3dDb0F1dGhvcklucHV0OiAhdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCxcbiAgICB9LCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICBpbmNyZW1lbnRDb3VudGVyKCdzaG93LWNvLWF1dGhvci1pbnB1dCcpO1xuICAgICAgICB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZm9jdXMoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBpbnB1dCBpcyBjbG9zZWQsIHJlbW92ZSBhbGwgY28tYXV0aG9yc1xuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKFtdKTtcbiAgICAgICAgaW5jcmVtZW50Q291bnRlcignaGlkZS1jby1hdXRob3ItaW5wdXQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV4Y2x1ZGVDb0F1dGhvcigpIHtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMuZ2V0Rm9jdXNlZE9wdGlvbigpKS5nZXRPcihudWxsKTtcbiAgICBpZiAoIWF1dGhvciB8fCBhdXRob3IuaXNOZXcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBleGNsdWRlZCA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLmV4Y2x1ZGVkVXNlcnMnKTtcbiAgICBpZiAoZXhjbHVkZWQgJiYgZXhjbHVkZWQgIT09ICcnKSB7XG4gICAgICBleGNsdWRlZCArPSAnLCAnO1xuICAgIH1cbiAgICBleGNsdWRlZCArPSBhdXRob3IuZ2V0RW1haWwoKTtcbiAgICB0aGlzLnByb3BzLmNvbmZpZy5zZXQoJ2dpdGh1Yi5leGNsdWRlZFVzZXJzJywgZXhjbHVkZWQpO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICB0aGlzLnByb3BzLmFib3J0TWVyZ2UoKTtcbiAgfVxuXG4gIGFzeW5jIGNvbW1pdChldmVudCwgYW1lbmQpIHtcbiAgICBpZiAoYXdhaXQgdGhpcy5wcm9wcy5wcmVwYXJlVG9Db21taXQoKSAmJiB0aGlzLmNvbW1pdElzRW5hYmxlZChhbWVuZCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMucHJvcHMuY29tbWl0KHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCksIHRoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnMsIGFtZW5kKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyAtIGVycm9yIHdhcyB0YWtlbiBjYXJlIG9mIGluIHBpcGVsaW5lIG1hbmFnZXJcbiAgICAgICAgaWYgKCFhdG9tLmlzUmVsZWFzZWRWZXJzaW9uKCkpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5FRElUT1IpO1xuICAgIH1cbiAgfVxuXG4gIGFtZW5kTGFzdENvbW1pdCgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKCdhbWVuZCcpO1xuICAgIHRoaXMuY29tbWl0KG51bGwsIHRydWUpO1xuICB9XG5cbiAgZ2V0UmVtYWluaW5nQ2hhcmFjdGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3JNb2RlbC5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgPT09IDApIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3BzLm1heGltdW1DaGFyYWN0ZXJMaW1pdCAtIGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygwKS5sZW5ndGgpLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ+KInic7XG4gICAgICB9XG4gICAgfSkuZ2V0T3IodGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgfHwgJycpO1xuICB9XG5cbiAgLy8gV2UgZG9uJ3Qgd2FudCB0aGUgdXNlciB0byBzZWUgdGhlIFVJIGZsaWNrZXIgaW4gdGhlIGNhc2VcbiAgLy8gdGhlIGNvbW1pdCB0YWtlcyBhIHZlcnkgc21hbGwgdGltZSB0byBjb21wbGV0ZS4gSW5zdGVhZCB3ZVxuICAvLyB3aWxsIG9ubHkgc2hvdyB0aGUgd29ya2luZyBtZXNzYWdlIGlmIHdlIGFyZSB3b3JraW5nIGZvciBsb25nZXJcbiAgLy8gdGhhbiAxIHNlY29uZCBhcyBwZXIgaHR0cHM6Ly93d3cubm5ncm91cC5jb20vYXJ0aWNsZXMvcmVzcG9uc2UtdGltZXMtMy1pbXBvcnRhbnQtbGltaXRzL1xuICAvL1xuICAvLyBUaGUgY2xvc3VyZSBpcyBjcmVhdGVkIHRvIHJlc3RyaWN0IHZhcmlhYmxlIGFjY2Vzc1xuICBzY2hlZHVsZVNob3dXb3JraW5nKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLmlzQ29tbWl0dGluZykge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dXb3JraW5nICYmIHRoaXMudGltZW91dEhhbmRsZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dXb3JraW5nOiB0cnVlfSk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SGFuZGxlKTtcbiAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IG51bGw7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93V29ya2luZzogZmFsc2V9KTtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkTWVzc2FnZSgpIHtcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgYXQgbGVhc3Qgc29tZSBub24tY29tbWVudCBsaW5lcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2UuXG4gICAgLy8gQ29tbWVudGVkIGxpbmVzIGFyZSBzdHJpcHBlZCBvdXQgb2YgY29tbWl0IG1lc3NhZ2VzIGJ5IGdpdCwgYnkgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgIHJldHVybiB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLnJlcGxhY2UoL14jLiokL2dtLCAnJykudHJpbSgpLmxlbmd0aCAhPT0gMDtcbiAgfVxuXG4gIGNvbW1pdElzRW5hYmxlZChhbWVuZCkge1xuICAgIHJldHVybiAhdGhpcy5wcm9wcy5pc0NvbW1pdHRpbmcgJiZcbiAgICAgIChhbWVuZCB8fCB0aGlzLnByb3BzLnN0YWdlZENoYW5nZXNFeGlzdCkgJiZcbiAgICAgICF0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzRXhpc3QgJiZcbiAgICAgIHRoaXMucHJvcHMubGFzdENvbW1pdC5pc1ByZXNlbnQoKSAmJlxuICAgICAgKHRoaXMucHJvcHMuZGVhY3RpdmF0ZUNvbW1pdEJveCB8fCAoYW1lbmQgfHwgdGhpcy5pc1ZhbGlkTWVzc2FnZSgpKSk7XG4gIH1cblxuICBjb21taXRCdXR0b25UZXh0KCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNob3dXb3JraW5nKSB7XG4gICAgICByZXR1cm4gJ1dvcmtpbmcuLi4nO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSkge1xuICAgICAgcmV0dXJuICdDcmVhdGUgZGV0YWNoZWQgY29tbWl0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGBDb21taXQgdG8gJHt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnQ29tbWl0JztcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yKHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkpO1xuICB9XG5cbiAgbWF0Y2hBdXRob3JzKGF1dGhvcnMsIGZpbHRlclRleHQsIHNlbGVjdGVkQXV0aG9ycykge1xuICAgIGNvbnN0IG1hdGNoZWRBdXRob3JzID0gYXV0aG9ycy5maWx0ZXIoKGF1dGhvciwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGlzQWxyZWFkeVNlbGVjdGVkID0gc2VsZWN0ZWRBdXRob3JzICYmIHNlbGVjdGVkQXV0aG9ycy5maW5kKHNlbGVjdGVkID0+IHNlbGVjdGVkLm1hdGNoZXMoYXV0aG9yKSk7XG4gICAgICBjb25zdCBtYXRjaGVzRmlsdGVyID0gW1xuICAgICAgICBhdXRob3IuZ2V0TG9naW4oKSxcbiAgICAgICAgYXV0aG9yLmdldEZ1bGxOYW1lKCksXG4gICAgICAgIGF1dGhvci5nZXRFbWFpbCgpLFxuICAgICAgXS5zb21lKGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJUZXh0LnRvTG93ZXJDYXNlKCkpICE9PSAtMSk7XG5cbiAgICAgIHJldHVybiAhaXNBbHJlYWR5U2VsZWN0ZWQgJiYgbWF0Y2hlc0ZpbHRlcjtcbiAgICB9KTtcbiAgICBtYXRjaGVkQXV0aG9ycy5wdXNoKEF1dGhvci5jcmVhdGVOZXcoJ0FkZCBuZXcgYXV0aG9yJywgZmlsdGVyVGV4dCkpO1xuICAgIHJldHVybiBtYXRjaGVkQXV0aG9ycztcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZChmaWVsZE5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvci0ke2ZpZWxkTmFtZX1gfT57dmFsdWV9PC9zcGFuPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckxpc3RJdGVtKGF1dGhvcikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yLXNlbGVjdExpc3RJdGVtJywgeyduZXctYXV0aG9yJzogYXV0aG9yLmlzTmV3KCl9KX0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnbmFtZScsIGF1dGhvci5nZXRGdWxsTmFtZSgpKX1cbiAgICAgICAge2F1dGhvci5oYXNMb2dpbigpICYmIHRoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKCdsb2dpbicsICdAJyArIGF1dGhvci5nZXRMb2dpbigpKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29BdXRob3JMaXN0SXRlbUZpZWxkKCdlbWFpbCcsIGF1dGhvci5nZXRFbWFpbCgpKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvclZhbHVlKGF1dGhvcikge1xuICAgIGNvbnN0IGZ1bGxOYW1lID0gYXV0aG9yLmdldEZ1bGxOYW1lKCk7XG4gICAgaWYgKGZ1bGxOYW1lICYmIGZ1bGxOYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiA8c3Bhbj57YXV0aG9yLmdldEZ1bGxOYW1lKCl9PC9zcGFuPjtcbiAgICB9XG4gICAgaWYgKGF1dGhvci5oYXNMb2dpbigpKSB7XG4gICAgICByZXR1cm4gPHNwYW4+QHthdXRob3IuZ2V0TG9naW4oKX08L3NwYW4+O1xuICAgIH1cblxuICAgIHJldHVybiA8c3Bhbj57YXV0aG9yLmdldEVtYWlsKCl9PC9zcGFuPjtcbiAgfVxuXG4gIG9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkKHNlbGVjdGVkQ29BdXRob3JzKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcignc2VsZWN0ZWQtY28tYXV0aG9ycy1jaGFuZ2VkJyk7XG4gICAgY29uc3QgbmV3QXV0aG9yID0gc2VsZWN0ZWRDb0F1dGhvcnMuZmluZChhdXRob3IgPT4gYXV0aG9yLmlzTmV3KCkpO1xuXG4gICAgaWYgKG5ld0F1dGhvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y29BdXRob3JJbnB1dDogbmV3QXV0aG9yLmdldEZ1bGxOYW1lKCksIHNob3dDb0F1dGhvckZvcm06IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhzZWxlY3RlZENvQXV0aG9ycyk7XG4gICAgfVxuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbi5tYXAoYnV0dG9uID0+IGJ1dHRvbi5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT047XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChlZGl0b3IgPT4gZWRpdG9yLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkVESVRPUjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uLm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkNvbW1pdEJ1dHRvbi5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT047XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmQ29BdXRob3JTZWxlY3QubWFwKGMgPT4gYy53cmFwcGVyICYmIGMud3JhcHBlci5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT0FVVEhPUl9JTlBVVDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgbGV0IGZhbGxiYWNrID0gZmFsc2U7XG4gICAgY29uc3QgZm9jdXNFbGVtZW50ID0gZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9QUkVWSUVXX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkVESVRPUikge1xuICAgICAgaWYgKHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5sZW5ndGggPiAwICYmICF0aGlzLmlzVmFsaWRNZXNzYWdlKCkpIHtcbiAgICAgICAgICAvLyB0aGVyZSBpcyBsaWtlbHkgYSBjb21taXQgbWVzc2FnZSB0ZW1wbGF0ZSBwcmVzZW50XG4gICAgICAgICAgLy8gd2Ugd2FudCB0aGUgY3Vyc29yIHRvIGJlIGF0IHRoZSBiZWdpbm5pbmcsIG5vdCBhdCB0aGUgYW5kIG9mIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgIHRoaXMucmVmRWRpdG9yQ29tcG9uZW50LmdldCgpLmdldE1vZGVsKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OKSB7XG4gICAgICBpZiAodGhpcy5yZWZBYm9ydE1lcmdlQnV0dG9uLm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQ29tbWl0QnV0dG9uLm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZm9jdXMuQ09BVVRIT1JfSU5QVVQpIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcubGFzdEZvY3VzKSB7XG4gICAgICBpZiAodGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX0JVVFRPTik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuQUJPUlRfTUVSR0VfQlVUVE9OKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkNPQVVUSE9SX0lOUFVUKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuRURJVE9SKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmFsbGJhY2sgJiYgdGhpcy5yZWZFZGl0b3JDb21wb25lbnQubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZHZhbmNlRm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuY29uc3RydWN0b3IuZm9jdXM7XG5cbiAgICBsZXQgbmV4dCA9IG51bGw7XG4gICAgc3dpdGNoIChmb2N1cykge1xuICAgIGNhc2UgZi5DT01NSVRfUFJFVklFV19CVVRUT046XG4gICAgICBuZXh0ID0gZi5FRElUT1I7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuRURJVE9SOlxuICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgbmV4dCA9IGYuQ09BVVRIT1JfSU5QVVQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIG5leHQgPSBmLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpKSB7XG4gICAgICAgIG5leHQgPSBmLkNPTU1JVF9CVVRUT047XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0ID0gUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5DT0FVVEhPUl9JTlBVVDpcbiAgICAgIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBuZXh0ID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICBuZXh0ID0gZi5DT01NSVRfQlVUVE9OO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQUJPUlRfTUVSR0VfQlVUVE9OOlxuICAgICAgbmV4dCA9IHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSA/IGYuQ09NTUlUX0JVVFRPTiA6IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09NTUlUX0JVVFRPTjpcbiAgICAgIG5leHQgPSBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXh0KTtcbiAgfVxuXG4gIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBjb25zdCBmID0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cztcblxuICAgIGxldCBwcmV2aW91cyA9IG51bGw7XG4gICAgc3dpdGNoIChmb2N1cykge1xuICAgIGNhc2UgZi5DT01NSVRfQlVUVE9OOlxuICAgICAgaWYgKHRoaXMucHJvcHMuaXNNZXJnaW5nKSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgcHJldmlvdXMgPSBmLkNPQVVUSE9SX0lOUFVUO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmlvdXMgPSBmLkVESVRPUjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5BQk9SVF9NRVJHRV9CVVRUT046XG4gICAgICBwcmV2aW91cyA9IHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQgPyBmLkNPQVVUSE9SX0lOUFVUIDogZi5FRElUT1I7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09BVVRIT1JfSU5QVVQ6XG4gICAgICBwcmV2aW91cyA9IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkVESVRPUjpcbiAgICAgIHByZXZpb3VzID0gZi5DT01NSVRfUFJFVklFV19CVVRUT047XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OOlxuICAgICAgcHJldmlvdXMgPSBTdGFnaW5nVmlldy5sYXN0Rm9jdXM7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByZXZpb3VzKTtcbiAgfVxufVxuIl19