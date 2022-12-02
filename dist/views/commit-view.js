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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jb21taXQtdmlldy5qcyJdLCJuYW1lcyI6WyJUT09MVElQX0RFTEFZIiwiRmFrZUtleURvd25FdmVudCIsIkNvbW1pdFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhdGUiLCJzaG93V29ya2luZyIsInNob3dDb0F1dGhvcklucHV0Iiwic2hvd0NvQXV0aG9yRm9ybSIsImNvQXV0aG9ySW5wdXQiLCJ0aW1lb3V0SGFuZGxlIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwicmVmQ29tbWl0UHJldmlld0J1dHRvbiIsInJlZkV4cGFuZEJ1dHRvbiIsInJlZkNvbW1pdEJ1dHRvbiIsInJlZkhhcmRXcmFwQnV0dG9uIiwicmVmQWJvcnRNZXJnZUJ1dHRvbiIsInJlZkNvQXV0aG9yVG9nZ2xlIiwicmVmQ29BdXRob3JTZWxlY3QiLCJyZWZDb0F1dGhvckZvcm0iLCJyZWZFZGl0b3JDb21wb25lbnQiLCJyZWZFZGl0b3JNb2RlbCIsInN1YnMiLCJwcm94eUtleUNvZGUiLCJrZXlDb2RlIiwiZSIsImlzRW1wdHkiLCJDdXN0b21FdmVudCIsImtDb2RlIiwiZmFrZUV2ZW50IiwiZ2V0IiwiaGFuZGxlS2V5RG93biIsImRlZmF1bHRQcmV2ZW50ZWQiLCJhYm9ydEtleUJpbmRpbmciLCJVTlNBRkVfY29tcG9uZW50V2lsbE1vdW50Iiwic2NoZWR1bGVTaG93V29ya2luZyIsImFkZCIsImNvbmZpZyIsIm9uRGlkQ2hhbmdlIiwiZm9yY2VVcGRhdGUiLCJtZXNzYWdlQnVmZmVyIiwicmVuZGVyIiwicmVtYWluaW5nQ2hhcnNDbGFzc05hbWUiLCJyZW1haW5pbmdDaGFyYWN0ZXJzIiwicGFyc2VJbnQiLCJnZXRSZW1haW5pbmdDaGFyYWN0ZXJzIiwibWF4aW11bUNoYXJhY3RlckxpbWl0Iiwic2hvd0Fib3J0TWVyZ2VCdXR0b24iLCJpc01lcmdpbmciLCJtb2RLZXkiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJzZXR0ZXIiLCJjb21tYW5kcyIsImNvbW1pdCIsImFtZW5kTGFzdENvbW1pdCIsInRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvciIsImV4Y2x1ZGVDb0F1dGhvciIsImFjdGl2YXRlQ29tbWl0UHJldmlldyIsInN0YWdlZENoYW5nZXNFeGlzdCIsInRvZ2dsZUNvbW1pdFByZXZpZXciLCJjb21taXRQcmV2aWV3QWN0aXZlIiwiZGVhY3RpdmF0ZUNvbW1pdEJveCIsIndvcmtzcGFjZSIsImRpZE1vdmVDdXJzb3IiLCJmb2N1c2VkIiwidG9nZ2xlQ29BdXRob3JJbnB1dCIsInJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbiIsInRvb2x0aXBzIiwidG9nZ2xlSGFyZFdyYXAiLCJyZW5kZXJIYXJkV3JhcEljb24iLCJyZW5kZXJDb0F1dGhvckZvcm0iLCJyZW5kZXJDb0F1dGhvcklucHV0IiwiYWJvcnRNZXJnZSIsImNvbW1pdElzRW5hYmxlZCIsImNvbW1pdEJ1dHRvblRleHQiLCJzdmdQYXRoIiwidXNlclN0b3JlIiwic3RvcmUiLCJnZXRVc2VycyIsIm1lbnRpb25hYmxlVXNlcnMiLCJtYXRjaEF1dGhvcnMiLCJyZW5kZXJDb0F1dGhvckxpc3RJdGVtIiwicmVuZGVyQ29BdXRob3JWYWx1ZSIsIm9uU2VsZWN0ZWRDb0F1dGhvcnNDaGFuZ2VkIiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJzaW5nbGVMaW5lTWVzc2FnZSIsImdldFRleHQiLCJzcGxpdCIsIkxJTkVfRU5ESU5HX1JFR0VYIiwibGVuZ3RoIiwiaGFyZFdyYXAiLCJub3RBcHBsaWNhYmxlIiwic3ZnUGF0aHMiLCJoYXJkV3JhcEVuYWJsZWQiLCJwYXRoMSIsInBhdGgyIiwiaGFyZFdyYXBEaXNhYmxlZCIsImhpZGRlbiIsInN1Ym1pdE5ld0NvQXV0aG9yIiwiY2FuY2VsTmV3Q29BdXRob3IiLCJuZXdBdXRob3IiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsImhpZGVOZXdBdXRob3JGb3JtIiwic2V0U3RhdGUiLCJtYXAiLCJjIiwiZm9jdXMiLCJVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImN1cnJlbnRTZXR0aW5nIiwic2V0IiwiYXV0aG9yIiwiZ2V0Rm9jdXNlZE9wdGlvbiIsImdldE9yIiwiaXNOZXciLCJleGNsdWRlZCIsImdldEVtYWlsIiwiZXZlbnQiLCJhbWVuZCIsInByZXBhcmVUb0NvbW1pdCIsImF0b20iLCJpc1JlbGVhc2VkVmVyc2lvbiIsInNldEZvY3VzIiwiRURJVE9SIiwiZWRpdG9yIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJyb3ciLCJsaW5lVGV4dEZvckJ1ZmZlclJvdyIsInRvU3RyaW5nIiwiaXNDb21taXR0aW5nIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImlzVmFsaWRNZXNzYWdlIiwicmVwbGFjZSIsInRyaW0iLCJtZXJnZUNvbmZsaWN0c0V4aXN0IiwibGFzdENvbW1pdCIsImlzUHJlc2VudCIsImN1cnJlbnRCcmFuY2giLCJpc0RldGFjaGVkIiwiZ2V0TmFtZSIsImF1dGhvcnMiLCJmaWx0ZXJUZXh0Iiwic2VsZWN0ZWRBdXRob3JzIiwibWF0Y2hlZEF1dGhvcnMiLCJmaWx0ZXIiLCJpbmRleCIsImlzQWxyZWFkeVNlbGVjdGVkIiwiZmluZCIsInNlbGVjdGVkIiwibWF0Y2hlcyIsIm1hdGNoZXNGaWx0ZXIiLCJnZXRMb2dpbiIsImdldEZ1bGxOYW1lIiwic29tZSIsImZpZWxkIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwicHVzaCIsIkF1dGhvciIsImNyZWF0ZU5ldyIsInJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCIsImZpZWxkTmFtZSIsInZhbHVlIiwiaGFzTG9naW4iLCJmdWxsTmFtZSIsImhhc0ZvY3VzIiwiZWxlbWVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiZ2V0Rm9jdXMiLCJidXR0b24iLCJDT01NSVRfUFJFVklFV19CVVRUT04iLCJBQk9SVF9NRVJHRV9CVVRUT04iLCJDT01NSVRfQlVUVE9OIiwid3JhcHBlciIsIkNPQVVUSE9SX0lOUFVUIiwiZmFsbGJhY2siLCJmb2N1c0VsZW1lbnQiLCJnZXRNb2RlbCIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwibGFzdEZvY3VzIiwiYWR2YW5jZUZvY3VzRnJvbSIsImYiLCJuZXh0IiwiUmVjZW50Q29tbWl0c1ZpZXciLCJmaXJzdEZvY3VzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXRyZWF0Rm9jdXNGcm9tIiwicHJldmlvdXMiLCJTdGFnaW5nVmlldyIsIlN5bWJvbCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwibnVtYmVyIiwiVXNlclN0b3JlUHJvcFR5cGUiLCJhcnJheU9mIiwiQXV0aG9yUHJvcFR5cGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxhQUFhLEdBQUcsR0FBdEIsQyxDQUVBO0FBQ0E7O0FBQ0EsSUFBSUMsZ0JBQUo7O0FBRWUsTUFBTUMsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUF3Q3REQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7QUFDQSwyQkFDRSxJQURGLEVBRUUsbUJBRkYsRUFFdUIsbUJBRnZCLEVBRTRDLGVBRjVDLEVBRTZELGdCQUY3RCxFQUdFLHFCQUhGLEVBR3lCLFlBSHpCLEVBR3VDLFFBSHZDLEVBR2lELGlCQUhqRCxFQUdvRSxtQ0FIcEUsRUFJRSx3QkFKRixFQUk0Qiw0QkFKNUIsRUFJMEQsaUJBSjFEO0FBT0Es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QVpuQjtBQWFqQnpJLEVBQUFBLG1CQUFtQixFQUFFdUksbUJBQVVHLElBQVYsQ0FBZUQsVUFibkI7QUFjakJ6SixFQUFBQSxxQkFBcUIsRUFBRXVKLG1CQUFVSSxNQUFWLENBQWlCRixVQWR2QjtBQWVqQi9KLEVBQUFBLGFBQWEsRUFBRTZKLG1CQUFVQyxNQUFWLENBQWlCQyxVQWZmO0FBZTJCO0FBQzVDMUgsRUFBQUEsU0FBUyxFQUFFNkgsOEJBQWtCSCxVQWhCWjtBQWlCakJsSCxFQUFBQSxpQkFBaUIsRUFBRWdILG1CQUFVTSxPQUFWLENBQWtCQywwQkFBbEIsQ0FqQkY7QUFrQmpCdEcsRUFBQUEsdUJBQXVCLEVBQUUrRixtQkFBVVEsSUFsQmxCO0FBbUJqQnZKLEVBQUFBLE1BQU0sRUFBRStJLG1CQUFVUSxJQUFWLENBQWVOLFVBbkJOO0FBb0JqQjlILEVBQUFBLFVBQVUsRUFBRTRILG1CQUFVUSxJQUFWLENBQWVOLFVBcEJWO0FBcUJqQjdFLEVBQUFBLGVBQWUsRUFBRTJFLG1CQUFVUSxJQUFWLENBQWVOLFVBckJmO0FBc0JqQi9JLEVBQUFBLGlDQUFpQyxFQUFFNkksbUJBQVVRLElBQVYsQ0FBZU4sVUF0QmpDO0FBdUJqQjNJLEVBQUFBLG1CQUFtQixFQUFFeUksbUJBQVVRLElBQVYsQ0FBZU4sVUF2Qm5CO0FBd0JqQjdJLEVBQUFBLHFCQUFxQixFQUFFMkksbUJBQVVRLElBQVYsQ0FBZU47QUF4QnJCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBTZWxlY3QgZnJvbSAncmVhY3Qtc2VsZWN0JztcblxuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IENvQXV0aG9yRm9ybSBmcm9tICcuL2NvLWF1dGhvci1mb3JtJztcbmltcG9ydCBSZWNlbnRDb21taXRzVmlldyBmcm9tICcuL3JlY2VudC1jb21taXRzLXZpZXcnO1xuaW1wb3J0IFN0YWdpbmdWaWV3IGZyb20gJy4vc3RhZ2luZy12aWV3JztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL21vZGVscy9hdXRob3InO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IHtMSU5FX0VORElOR19SRUdFWCwgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtBdXRob3JQcm9wVHlwZSwgVXNlclN0b3JlUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyfSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IFRPT0xUSVBfREVMQVkgPSAyMDA7XG5cbi8vIEN1c3RvbUV2ZW50IGlzIGEgRE9NIHByaW1pdGl2ZSwgd2hpY2ggdjggY2FuJ3QgYWNjZXNzXG4vLyBzbyB3ZSdyZSBlc3NlbnRpYWxseSBsYXp5IGxvYWRpbmcgdG8ga2VlcCBzbmFwc2hvdHRpbmcgZnJvbSBicmVha2luZy5cbmxldCBGYWtlS2V5RG93bkV2ZW50O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIENPTU1JVF9QUkVWSUVXX0JVVFRPTjogU3ltYm9sKCdjb21taXQtcHJldmlldy1idXR0b24nKSxcbiAgICBFRElUT1I6IFN5bWJvbCgnY29tbWl0LWVkaXRvcicpLFxuICAgIENPQVVUSE9SX0lOUFVUOiBTeW1ib2woJ2NvYXV0aG9yLWlucHV0JyksXG4gICAgQUJPUlRfTUVSR0VfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1hYm9ydC1tZXJnZS1idXR0b24nKSxcbiAgICBDT01NSVRfQlVUVE9OOiBTeW1ib2woJ2NvbW1pdC1idXR0b24nKSxcbiAgfTtcblxuICBzdGF0aWMgZmlyc3RGb2N1cyA9IENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBTeW1ib2woJ2xhc3QtZm9jdXMnKTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGxhc3RDb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzRXhpc3Q6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlc0V4aXN0OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzQ29tbWl0dGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21taXRQcmV2aWV3QWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGRlYWN0aXZhdGVDb21taXRCb3g6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbWF4aW11bUNoYXJhY3RlckxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbWVzc2FnZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAvLyBGSVhNRSBtb3JlIHNwZWNpZmljIHByb3B0eXBlXG4gICAgdXNlclN0b3JlOiBVc2VyU3RvcmVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuYXJyYXlPZihBdXRob3JQcm9wVHlwZSksXG4gICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhYm9ydE1lcmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHByZXBhcmVUb0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlQ29tbWl0UHJldmlldzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhY3RpdmF0ZUNvbW1pdFByZXZpZXc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ3N1Ym1pdE5ld0NvQXV0aG9yJywgJ2NhbmNlbE5ld0NvQXV0aG9yJywgJ2RpZE1vdmVDdXJzb3InLCAndG9nZ2xlSGFyZFdyYXAnLFxuICAgICAgJ3RvZ2dsZUNvQXV0aG9ySW5wdXQnLCAnYWJvcnRNZXJnZScsICdjb21taXQnLCAnYW1lbmRMYXN0Q29tbWl0JywgJ3RvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcicsXG4gICAgICAncmVuZGVyQ29BdXRob3JMaXN0SXRlbScsICdvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZCcsICdleGNsdWRlQ29BdXRob3InLFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2hvd1dvcmtpbmc6IGZhbHNlLFxuICAgICAgc2hvd0NvQXV0aG9ySW5wdXQ6IGZhbHNlLFxuICAgICAgc2hvd0NvQXV0aG9yRm9ybTogZmFsc2UsXG4gICAgICBjb0F1dGhvcklucHV0OiAnJyxcbiAgICB9O1xuXG4gICAgdGhpcy50aW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29tbWl0UHJldmlld0J1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkV4cGFuZEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvbW1pdEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkhhcmRXcmFwQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkNvQXV0aG9yVG9nZ2xlID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmQ29BdXRob3JTZWxlY3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZDb0F1dGhvckZvcm0gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3JDb21wb25lbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3JNb2RlbCA9IG5ldyBSZWZIb2xkZXIoKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBwcm94eUtleUNvZGUoa2V5Q29kZSkge1xuICAgIHJldHVybiBlID0+IHtcbiAgICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0LmlzRW1wdHkoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghRmFrZUtleURvd25FdmVudCkge1xuICAgICAgICBGYWtlS2V5RG93bkV2ZW50ID0gY2xhc3MgZXh0ZW5kcyBDdXN0b21FdmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3Ioa0NvZGUpIHtcbiAgICAgICAgICAgIHN1cGVyKCdrZXlkb3duJyk7XG4gICAgICAgICAgICB0aGlzLmtleUNvZGUgPSBrQ29kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZha2VFdmVudCA9IG5ldyBGYWtlS2V5RG93bkV2ZW50KGtleUNvZGUpO1xuICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5nZXQoKS5oYW5kbGVLZXlEb3duKGZha2VFdmVudCk7XG5cbiAgICAgIGlmICghZmFrZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICBVTlNBRkVfY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuc2NoZWR1bGVTaG93V29ya2luZyh0aGlzLnByb3BzKTtcblxuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnByb3BzLmNvbmZpZy5vbkRpZENoYW5nZSgnZ2l0aHViLmF1dG9tYXRpY0NvbW1pdE1lc3NhZ2VXcmFwcGluZycsICgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSksXG4gICAgICB0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIub25EaWRDaGFuZ2UoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCByZW1haW5pbmdDaGFyc0NsYXNzTmFtZSA9ICcnO1xuICAgIGNvbnN0IHJlbWFpbmluZ0NoYXJhY3RlcnMgPSBwYXJzZUludCh0aGlzLmdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKSwgMTApO1xuICAgIGlmIChyZW1haW5pbmdDaGFyYWN0ZXJzIDwgMCkge1xuICAgICAgcmVtYWluaW5nQ2hhcnNDbGFzc05hbWUgPSAnaXMtZXJyb3InO1xuICAgIH0gZWxzZSBpZiAocmVtYWluaW5nQ2hhcmFjdGVycyA8IHRoaXMucHJvcHMubWF4aW11bUNoYXJhY3RlckxpbWl0IC8gNCkge1xuICAgICAgcmVtYWluaW5nQ2hhcnNDbGFzc05hbWUgPSAnaXMtd2FybmluZyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd0Fib3J0TWVyZ2VCdXR0b24gPSB0aGlzLnByb3BzLmlzTWVyZ2luZyB8fCBudWxsO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBjb25zdCBtb2RLZXkgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/ICdDbWQnIDogJ0N0cmwnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXdcIiByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjb21taXRcIiBjYWxsYmFjaz17dGhpcy5jb21taXR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphbWVuZC1sYXN0LWNvbW1pdFwiIGNhbGxiYWNrPXt0aGlzLmFtZW5kTGFzdENvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1leHBhbmRlZC1jb21taXQtbWVzc2FnZS1lZGl0b3JcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yRWRpdG9yXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg0MCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtdXBcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVudGVyXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDEzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC10YWJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtYmFja3NwYWNlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXBhZ2V1cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzMyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzQpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVuZFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtaG9tZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNil9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZGVsZXRlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQ2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1lc2NhcGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMjcpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y28tYXV0aG9yLWV4Y2x1ZGVcIiBjYWxsYmFjaz17dGhpcy5leGNsdWRlQ29BdXRob3J9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdFByZXZpZXdcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpdmVcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5hY3RpdmF0ZUNvbW1pdFByZXZpZXd9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uV3JhcHBlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb21taXRQcmV2aWV3QnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdFByZXZpZXcgZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGJ0blwiXG4gICAgICAgICAgICBkaXNhYmxlZD17IXRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc0V4aXN0fVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy50b2dnbGVDb21taXRQcmV2aWV3fT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNvbW1pdFByZXZpZXdBY3RpdmUgPyAnSGlkZSBBbGwgU3RhZ2VkIENoYW5nZXMnIDogJ1NlZSBBbGwgU3RhZ2VkIENoYW5nZXMnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1lZGl0b3InLCB7J2lzLWV4cGFuZGVkJzogdGhpcy5wcm9wcy5kZWFjdGl2YXRlQ29tbWl0Qm94fSl9PlxuICAgICAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5zZXR0ZXJ9XG4gICAgICAgICAgICByZWZNb2RlbD17dGhpcy5yZWZFZGl0b3JNb2RlbH1cbiAgICAgICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0PVwiQ29tbWl0IG1lc3NhZ2VcIlxuICAgICAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICAgICAgc2hvd0ludmlzaWJsZXM9e2ZhbHNlfVxuICAgICAgICAgICAgYXV0b0hlaWdodD17ZmFsc2V9XG4gICAgICAgICAgICBzY3JvbGxQYXN0RW5kPXtmYWxzZX1cbiAgICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyfVxuICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgIGRpZENoYW5nZUN1cnNvclBvc2l0aW9uPXt0aGlzLmRpZE1vdmVDdXJzb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmQ29BdXRob3JUb2dnbGUuc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JUb2dnbGUnLCB7Zm9jdXNlZDogdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JJbnB1dH0pfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVDb0F1dGhvcklucHV0fT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbigpfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkNvQXV0aG9yVG9nZ2xlfVxuICAgICAgICAgICAgdGl0bGU9e2Ake3RoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQgPyAnUmVtb3ZlJyA6ICdBZGQnfSBjby1hdXRob3JzYH1cbiAgICAgICAgICAgIHNob3dEZWxheT17VE9PTFRJUF9ERUxBWX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZIYXJkV3JhcEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUhhcmRXcmFwfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctaGFyZHdyYXAgaGFyZC13cmFwLWljb25zXCI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJIYXJkV3JhcEljb24oKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZIYXJkV3JhcEJ1dHRvbn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWhhcmR3cmFwLXRvb2x0aXBcIlxuICAgICAgICAgICAgdGl0bGU9XCJUb2dnbGUgaGFyZCB3cmFwIG9uIGNvbW1pdFwiXG4gICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICByZWY9e3RoaXMucmVmRXhwYW5kQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRWaWV3LWV4cGFuZEJ1dHRvbiBpY29uIGljb24tc2NyZWVuLWZ1bGxcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVFeHBhbmRlZENvbW1pdE1lc3NhZ2VFZGl0b3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZFeHBhbmRCdXR0b259XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1leHBhbmRCdXR0b24tdG9vbHRpcFwiXG4gICAgICAgICAgICB0aXRsZT1cIkV4cGFuZCBjb21taXQgbWVzc2FnZSBlZGl0b3JcIlxuICAgICAgICAgICAgc2hvd0RlbGF5PXtUT09MVElQX0RFTEFZfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yRm9ybSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvcklucHV0KCl9XG5cbiAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1iYXJcIj5cbiAgICAgICAgICB7c2hvd0Fib3J0TWVyZ2VCdXR0b24gJiZcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkFib3J0TWVyZ2VCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGdpdGh1Yi1Db21taXRWaWV3LWFib3J0TWVyZ2UgaXMtc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5hYm9ydE1lcmdlfT5BYm9ydCBNZXJnZTwvYnV0dG9uPlxuICAgICAgICAgIH1cblxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb21taXRCdXR0b24uc2V0dGVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uIGdpdGh1Yi1Db21taXRWaWV3LWNvbW1pdCBidG4gYnRuLXByaW1hcnkgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNvbW1pdH1cbiAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5jb21taXRJc0VuYWJsZWQoZmFsc2UpfT57dGhpcy5jb21taXRCdXR0b25UZXh0KCl9PC9idXR0b24+XG4gICAgICAgICAge3RoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSAmJlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkNvbW1pdEJ1dHRvbn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFZpZXctYnV0dG9uLXRvb2x0aXBcIlxuICAgICAgICAgICAgICB0aXRsZT17YCR7bW9kS2V5fS1lbnRlciB0byBjb21taXRgfVxuICAgICAgICAgICAgICBzaG93RGVsYXk9e1RPT0xUSVBfREVMQVl9XG4gICAgICAgICAgICAvPn1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1Db21taXRWaWV3LXJlbWFpbmluZy1jaGFyYWN0ZXJzICR7cmVtYWluaW5nQ2hhcnNDbGFzc05hbWV9YH0+XG4gICAgICAgICAgICB7dGhpcy5nZXRSZW1haW5pbmdDaGFyYWN0ZXJzKCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9vdGVyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvQXV0aG9yVG9nZ2xlSWNvbigpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4gICAgY29uc3Qgc3ZnUGF0aCA9ICdNOS44NzUgMi4xMjVIMTJ2MS43NUg5Ljg3NVY2aC0xLjc1VjMuODc1SDZ2LTEuNzVoMi4xMjVWMGgxLjc1djIuMTI1ek02IDYuNWEuNS41IDAgMCAxLS41LjVoLTVhLjUuNSAwIDAgMS0uNS0uNVY2YzAtMS4zMTYgMi0yIDItMnMuMTE0LS4yMDQgMC0uNWMtLjQyLS4zMS0uNDcyLS43OTUtLjUtMkMxLjU4Ny4yOTMgMi40MzQgMCAzIDBzMS40MTMuMjkzIDEuNSAxLjVjLS4wMjggMS4yMDUtLjA4IDEuNjktLjUgMi0uMTE0LjI5NSAwIC41IDAgLjVzMiAuNjg0IDIgMnYuNXonO1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Db21taXRWaWV3LWNvQXV0aG9yVG9nZ2xlSWNvbicsIHtmb2N1c2VkOiB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0fSl9IHZpZXdCb3g9XCIwIDAgMTIgN1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPHRpdGxlPkFkZCBvciByZW1vdmUgY28tYXV0aG9yczwvdGl0bGU+XG4gICAgICAgIDxwYXRoIGQ9e3N2Z1BhdGh9IC8+XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JJbnB1dCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnVzZXJTdG9yZX0gZmV0Y2hEYXRhPXtzdG9yZSA9PiBzdG9yZS5nZXRVc2VycygpfT5cbiAgICAgICAge21lbnRpb25hYmxlVXNlcnMgPT4gKFxuICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgIHJlZj17dGhpcy5yZWZDb0F1dGhvclNlbGVjdC5zZXR0ZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvciBpbnB1dC10ZXh0YXJlYSBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ28tQXV0aG9yc1wiXG4gICAgICAgICAgICBhcnJvd1JlbmRlcmVyPXtudWxsfVxuICAgICAgICAgICAgb3B0aW9ucz17bWVudGlvbmFibGVVc2Vyc31cbiAgICAgICAgICAgIGxhYmVsS2V5PVwiZnVsbE5hbWVcIlxuICAgICAgICAgICAgdmFsdWVLZXk9XCJlbWFpbFwiXG4gICAgICAgICAgICBmaWx0ZXJPcHRpb25zPXt0aGlzLm1hdGNoQXV0aG9yc31cbiAgICAgICAgICAgIG9wdGlvblJlbmRlcmVyPXt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW19XG4gICAgICAgICAgICB2YWx1ZVJlbmRlcmVyPXt0aGlzLnJlbmRlckNvQXV0aG9yVmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZH1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAgICAgbXVsdGk9e3RydWV9XG4gICAgICAgICAgICBvcGVuT25DbGljaz17ZmFsc2V9XG4gICAgICAgICAgICBvcGVuT25Gb2N1cz17ZmFsc2V9XG4gICAgICAgICAgICB0YWJJbmRleD1cIjVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGFyZFdyYXBJY29uKCkge1xuICAgIGNvbnN0IHNpbmdsZUxpbmVNZXNzYWdlID0gdGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubGVuZ3RoID09PSAxO1xuICAgIGNvbnN0IGhhcmRXcmFwID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJyk7XG4gICAgY29uc3Qgbm90QXBwbGljYWJsZSA9IHRoaXMucHJvcHMuZGVhY3RpdmF0ZUNvbW1pdEJveCB8fCBzaW5nbGVMaW5lTWVzc2FnZTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBjb25zdCBzdmdQYXRocyA9IHtcbiAgICAgIGhhcmRXcmFwRW5hYmxlZDoge1xuICAgICAgICBwYXRoMTogJ003LjA1OCAxMC4yaC0uOTc1djIuNEwyIDlsNC4wODMtMy42djIuNGguOTdsMS4yMDIgMS4yMDNMNy4wNTggMTAuMnptMi41MjUtNC44NjVWNC4yaDIuMzM0djEuMTRsLTEuMTY0IDEuMTY1LTEuMTctMS4xN3onLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgICAgICAgcGF0aDI6ICdNNy44NDIgNi45NGwyLjA2MyAyLjA2My0yLjEyMiAyLjEyLjkwOC45MSAyLjEyMy0yLjEyMyAxLjk4IDEuOTguODUtLjg0OEwxMS41OCA4Ljk4bDIuMTItMi4xMjMtLjgyNC0uODI1LTIuMTIyIDIuMTItMi4wNjItMi4wNnonLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgICAgIH0sXG4gICAgICBoYXJkV3JhcERpc2FibGVkOiB7XG4gICAgICAgIHBhdGgxOiAnTTExLjkxNyA4LjRjMCAuOTktLjc4OCAxLjgtMS43NSAxLjhINi4wODN2Mi40TDIgOWw0LjA4My0zLjZ2Mi40aDMuNVY0LjJoMi4zMzR2NC4yeicsXG4gICAgICB9LFxuICAgIH07XG4gICAgLyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cbiAgICBpZiAobm90QXBwbGljYWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGhhcmRXcmFwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2ljb24nLCAnaGFyZHdyYXAnLCAnaWNvbi1oYXJkd3JhcC1lbmFibGVkJywge2hpZGRlbjogbm90QXBwbGljYWJsZSB8fCAhaGFyZFdyYXB9KX0+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPHBhdGggZD17c3ZnUGF0aHMuaGFyZFdyYXBEaXNhYmxlZC5wYXRoMX0gZmlsbFJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y3goJ2ljb24nLCAnbm8taGFyZHdyYXAnLCAnaWNvbi1oYXJkd3JhcC1kaXNhYmxlZCcsIHtoaWRkZW46IG5vdEFwcGxpY2FibGUgfHwgaGFyZFdyYXB9KX0+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgPGcgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9e3N2Z1BhdGhzLmhhcmRXcmFwRW5hYmxlZC5wYXRoMX0gLz5cbiAgICAgICAgICAgICAgPHBhdGggZmlsbFJ1bGU9XCJub256ZXJvXCIgZD17c3ZnUGF0aHMuaGFyZFdyYXBFbmFibGVkLnBhdGgyfSAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JGb3JtKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zaG93Q29BdXRob3JGb3JtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvQXV0aG9yRm9ybVxuICAgICAgICByZWY9e3RoaXMucmVmQ29BdXRob3JGb3JtLnNldHRlcn1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIG9uU3VibWl0PXt0aGlzLnN1Ym1pdE5ld0NvQXV0aG9yfVxuICAgICAgICBvbkNhbmNlbD17dGhpcy5jYW5jZWxOZXdDb0F1dGhvcn1cbiAgICAgICAgbmFtZT17dGhpcy5zdGF0ZS5jb0F1dGhvcklucHV0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgc3VibWl0TmV3Q29BdXRob3IobmV3QXV0aG9yKSB7XG4gICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyh0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzLCBuZXdBdXRob3IpO1xuICAgIHRoaXMuaGlkZU5ld0F1dGhvckZvcm0oKTtcbiAgfVxuXG4gIGNhbmNlbE5ld0NvQXV0aG9yKCkge1xuICAgIHRoaXMuaGlkZU5ld0F1dGhvckZvcm0oKTtcbiAgfVxuXG4gIGhpZGVOZXdBdXRob3JGb3JtKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dDb0F1dGhvckZvcm06IGZhbHNlfSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmZvY3VzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuICBVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNjaGVkdWxlU2hvd1dvcmtpbmcobmV4dFByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBkaWRNb3ZlQ3Vyc29yKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHRvZ2dsZUhhcmRXcmFwKCkge1xuICAgIGNvbnN0IGN1cnJlbnRTZXR0aW5nID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJyk7XG4gICAgdGhpcy5wcm9wcy5jb25maWcuc2V0KCdnaXRodWIuYXV0b21hdGljQ29tbWl0TWVzc2FnZVdyYXBwaW5nJywgIWN1cnJlbnRTZXR0aW5nKTtcbiAgfVxuXG4gIHRvZ2dsZUNvQXV0aG9ySW5wdXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzaG93Q29BdXRob3JJbnB1dDogIXRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgaW5jcmVtZW50Q291bnRlcignc2hvdy1jby1hdXRob3ItaW5wdXQnKTtcbiAgICAgICAgdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmZvY3VzKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgaW5wdXQgaXMgY2xvc2VkLCByZW1vdmUgYWxsIGNvLWF1dGhvcnNcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhbXSk7XG4gICAgICAgIGluY3JlbWVudENvdW50ZXIoJ2hpZGUtY28tYXV0aG9yLWlucHV0Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBleGNsdWRlQ29BdXRob3IoKSB7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoYyA9PiBjLmdldEZvY3VzZWRPcHRpb24oKSkuZ2V0T3IobnVsbCk7XG4gICAgaWYgKCFhdXRob3IgfHwgYXV0aG9yLmlzTmV3KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZXhjbHVkZWQgPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5leGNsdWRlZFVzZXJzJyk7XG4gICAgaWYgKGV4Y2x1ZGVkICYmIGV4Y2x1ZGVkICE9PSAnJykge1xuICAgICAgZXhjbHVkZWQgKz0gJywgJztcbiAgICB9XG4gICAgZXhjbHVkZWQgKz0gYXV0aG9yLmdldEVtYWlsKCk7XG4gICAgdGhpcy5wcm9wcy5jb25maWcuc2V0KCdnaXRodWIuZXhjbHVkZWRVc2VycycsIGV4Y2x1ZGVkKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgdGhpcy5wcm9wcy5hYm9ydE1lcmdlKCk7XG4gIH1cblxuICBhc3luYyBjb21taXQoZXZlbnQsIGFtZW5kKSB7XG4gICAgaWYgKGF3YWl0IHRoaXMucHJvcHMucHJlcGFyZVRvQ29tbWl0KCkgJiYgdGhpcy5jb21taXRJc0VuYWJsZWQoYW1lbmQpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3BzLmNvbW1pdCh0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpLCB0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzLCBhbWVuZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgLSBlcnJvciB3YXMgdGFrZW4gY2FyZSBvZiBpbiBwaXBlbGluZSBtYW5hZ2VyXG4gICAgICAgIGlmICghYXRvbS5pc1JlbGVhc2VkVmVyc2lvbigpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEZvY3VzKENvbW1pdFZpZXcuZm9jdXMuRURJVE9SKTtcbiAgICB9XG4gIH1cblxuICBhbWVuZExhc3RDb21taXQoKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcignYW1lbmQnKTtcbiAgICB0aGlzLmNvbW1pdChudWxsLCB0cnVlKTtcbiAgfVxuXG4gIGdldFJlbWFpbmluZ0NoYXJhY3RlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yTW9kZWwubWFwKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ID09PSAwKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wcy5tYXhpbXVtQ2hhcmFjdGVyTGltaXQgLSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMCkubGVuZ3RoKS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICfiiJ4nO1xuICAgICAgfVxuICAgIH0pLmdldE9yKHRoaXMucHJvcHMubWF4aW11bUNoYXJhY3RlckxpbWl0IHx8ICcnKTtcbiAgfVxuXG4gIC8vIFdlIGRvbid0IHdhbnQgdGhlIHVzZXIgdG8gc2VlIHRoZSBVSSBmbGlja2VyIGluIHRoZSBjYXNlXG4gIC8vIHRoZSBjb21taXQgdGFrZXMgYSB2ZXJ5IHNtYWxsIHRpbWUgdG8gY29tcGxldGUuIEluc3RlYWQgd2VcbiAgLy8gd2lsbCBvbmx5IHNob3cgdGhlIHdvcmtpbmcgbWVzc2FnZSBpZiB3ZSBhcmUgd29ya2luZyBmb3IgbG9uZ2VyXG4gIC8vIHRoYW4gMSBzZWNvbmQgYXMgcGVyIGh0dHBzOi8vd3d3Lm5uZ3JvdXAuY29tL2FydGljbGVzL3Jlc3BvbnNlLXRpbWVzLTMtaW1wb3J0YW50LWxpbWl0cy9cbiAgLy9cbiAgLy8gVGhlIGNsb3N1cmUgaXMgY3JlYXRlZCB0byByZXN0cmljdCB2YXJpYWJsZSBhY2Nlc3NcbiAgc2NoZWR1bGVTaG93V29ya2luZyhwcm9wcykge1xuICAgIGlmIChwcm9wcy5pc0NvbW1pdHRpbmcpIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zaG93V29ya2luZyAmJiB0aGlzLnRpbWVvdXRIYW5kbGUgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtzaG93V29ya2luZzogdHJ1ZX0pO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEhhbmRsZSk7XG4gICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBudWxsO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1dvcmtpbmc6IGZhbHNlfSk7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZE1lc3NhZ2UoKSB7XG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgYXJlIGF0IGxlYXN0IHNvbWUgbm9uLWNvbW1lbnQgbGluZXMgaW4gdGhlIGNvbW1pdCBtZXNzYWdlLlxuICAgIC8vIENvbW1lbnRlZCBsaW5lcyBhcmUgc3RyaXBwZWQgb3V0IG9mIGNvbW1pdCBtZXNzYWdlcyBieSBnaXQsIGJ5IGRlZmF1bHQgY29uZmlndXJhdGlvbi5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tZXNzYWdlQnVmZmVyLmdldFRleHQoKS5yZXBsYWNlKC9eIy4qJC9nbSwgJycpLnRyaW0oKS5sZW5ndGggIT09IDA7XG4gIH1cblxuICBjb21taXRJc0VuYWJsZWQoYW1lbmQpIHtcbiAgICByZXR1cm4gIXRoaXMucHJvcHMuaXNDb21taXR0aW5nICYmXG4gICAgICAoYW1lbmQgfHwgdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzRXhpc3QpICYmXG4gICAgICAhdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c0V4aXN0ICYmXG4gICAgICB0aGlzLnByb3BzLmxhc3RDb21taXQuaXNQcmVzZW50KCkgJiZcbiAgICAgICh0aGlzLnByb3BzLmRlYWN0aXZhdGVDb21taXRCb3ggfHwgKGFtZW5kIHx8IHRoaXMuaXNWYWxpZE1lc3NhZ2UoKSkpO1xuICB9XG5cbiAgY29tbWl0QnV0dG9uVGV4dCgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93V29ya2luZykge1xuICAgICAgcmV0dXJuICdXb3JraW5nLi4uJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5pc0RldGFjaGVkKCkpIHtcbiAgICAgIHJldHVybiAnQ3JlYXRlIGRldGFjaGVkIGNvbW1pdCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBgQ29tbWl0IHRvICR7dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmdldE5hbWUoKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ0NvbW1pdCc7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRXhwYW5kZWRDb21taXRNZXNzYWdlRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZUV4cGFuZGVkQ29tbWl0TWVzc2FnZUVkaXRvcih0aGlzLnByb3BzLm1lc3NhZ2VCdWZmZXIuZ2V0VGV4dCgpKTtcbiAgfVxuXG4gIG1hdGNoQXV0aG9ycyhhdXRob3JzLCBmaWx0ZXJUZXh0LCBzZWxlY3RlZEF1dGhvcnMpIHtcbiAgICBjb25zdCBtYXRjaGVkQXV0aG9ycyA9IGF1dGhvcnMuZmlsdGVyKChhdXRob3IsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IHNlbGVjdGVkQXV0aG9ycyAmJiBzZWxlY3RlZEF1dGhvcnMuZmluZChzZWxlY3RlZCA9PiBzZWxlY3RlZC5tYXRjaGVzKGF1dGhvcikpO1xuICAgICAgY29uc3QgbWF0Y2hlc0ZpbHRlciA9IFtcbiAgICAgICAgYXV0aG9yLmdldExvZ2luKCksXG4gICAgICAgIGF1dGhvci5nZXRGdWxsTmFtZSgpLFxuICAgICAgICBhdXRob3IuZ2V0RW1haWwoKSxcbiAgICAgIF0uc29tZShmaWVsZCA9PiBmaWVsZCAmJiBmaWVsZC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVGV4dC50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpO1xuXG4gICAgICByZXR1cm4gIWlzQWxyZWFkeVNlbGVjdGVkICYmIG1hdGNoZXNGaWx0ZXI7XG4gICAgfSk7XG4gICAgbWF0Y2hlZEF1dGhvcnMucHVzaChBdXRob3IuY3JlYXRlTmV3KCdBZGQgbmV3IGF1dGhvcicsIGZpbHRlclRleHQpKTtcbiAgICByZXR1cm4gbWF0Y2hlZEF1dGhvcnM7XG4gIH1cblxuICByZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoZmllbGROYW1lLCB2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLUNvbW1pdFZpZXctY29BdXRob3JFZGl0b3ItJHtmaWVsZE5hbWV9YH0+e3ZhbHVlfTwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JMaXN0SXRlbShhdXRob3IpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdnaXRodWItQ29tbWl0Vmlldy1jb0F1dGhvckVkaXRvci1zZWxlY3RMaXN0SXRlbScsIHsnbmV3LWF1dGhvcic6IGF1dGhvci5pc05ldygpfSl9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb0F1dGhvckxpc3RJdGVtRmllbGQoJ25hbWUnLCBhdXRob3IuZ2V0RnVsbE5hbWUoKSl9XG4gICAgICAgIHthdXRob3IuaGFzTG9naW4oKSAmJiB0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnbG9naW4nLCAnQCcgKyBhdXRob3IuZ2V0TG9naW4oKSl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvQXV0aG9yTGlzdEl0ZW1GaWVsZCgnZW1haWwnLCBhdXRob3IuZ2V0RW1haWwoKSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29BdXRob3JWYWx1ZShhdXRob3IpIHtcbiAgICBjb25zdCBmdWxsTmFtZSA9IGF1dGhvci5nZXRGdWxsTmFtZSgpO1xuICAgIGlmIChmdWxsTmFtZSAmJiBmdWxsTmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gPHNwYW4+e2F1dGhvci5nZXRGdWxsTmFtZSgpfTwvc3Bhbj47XG4gICAgfVxuICAgIGlmIChhdXRob3IuaGFzTG9naW4oKSkge1xuICAgICAgcmV0dXJuIDxzcGFuPkB7YXV0aG9yLmdldExvZ2luKCl9PC9zcGFuPjtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4+e2F1dGhvci5nZXRFbWFpbCgpfTwvc3Bhbj47XG4gIH1cblxuICBvblNlbGVjdGVkQ29BdXRob3JzQ2hhbmdlZChzZWxlY3RlZENvQXV0aG9ycykge1xuICAgIGluY3JlbWVudENvdW50ZXIoJ3NlbGVjdGVkLWNvLWF1dGhvcnMtY2hhbmdlZCcpO1xuICAgIGNvbnN0IG5ld0F1dGhvciA9IHNlbGVjdGVkQ29BdXRob3JzLmZpbmQoYXV0aG9yID0+IGF1dGhvci5pc05ldygpKTtcblxuICAgIGlmIChuZXdBdXRob3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NvQXV0aG9ySW5wdXQ6IG5ld0F1dGhvci5nZXRGdWxsTmFtZSgpLCBzaG93Q29BdXRob3JGb3JtOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMoc2VsZWN0ZWRDb0F1dGhvcnMpO1xuICAgIH1cbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKGVsZW1lbnQgPT4gZWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgZ2V0Rm9jdXMoZWxlbWVudCkge1xuICAgIGlmICh0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24ubWFwKGJ1dHRvbiA9PiBidXR0b24uY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5tYXAoZWRpdG9yID0+IGVkaXRvci5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5FRElUT1I7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZDb21taXRCdXR0b24ubWFwKGUgPT4gZS5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfQlVUVE9OO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZkNvQXV0aG9yU2VsZWN0Lm1hcChjID0+IGMud3JhcHBlciAmJiBjLndyYXBwZXIuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZm9jdXMuQ09BVVRIT1JfSU5QVVQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzZXRGb2N1cyhmb2N1cykge1xuICAgIGxldCBmYWxsYmFjayA9IGZhbHNlO1xuICAgIGNvbnN0IGZvY3VzRWxlbWVudCA9IGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT04pIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvbW1pdFByZXZpZXdCdXR0b24ubWFwKGZvY3VzRWxlbWVudCkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5mb2N1cy5FRElUT1IpIHtcbiAgICAgIGlmICh0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMubWVzc2FnZUJ1ZmZlci5nZXRUZXh0KCkubGVuZ3RoID4gMCAmJiAhdGhpcy5pc1ZhbGlkTWVzc2FnZSgpKSB7XG4gICAgICAgICAgLy8gdGhlcmUgaXMgbGlrZWx5IGEgY29tbWl0IG1lc3NhZ2UgdGVtcGxhdGUgcHJlc2VudFxuICAgICAgICAgIC8vIHdlIHdhbnQgdGhlIGN1cnNvciB0byBiZSBhdCB0aGUgYmVnaW5uaW5nLCBub3QgYXQgdGhlIGFuZCBvZiB0aGUgdGVtcGxhdGVcbiAgICAgICAgICB0aGlzLnJlZkVkaXRvckNvbXBvbmVudC5nZXQoKS5nZXRNb2RlbCgpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTikge1xuICAgICAgaWYgKHRoaXMucmVmQWJvcnRNZXJnZUJ1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT04pIHtcbiAgICAgIGlmICh0aGlzLnJlZkNvbW1pdEJ1dHRvbi5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZvY3VzLkNPQVVUSE9SX0lOUFVUKSB7XG4gICAgICBpZiAodGhpcy5yZWZDb0F1dGhvclNlbGVjdC5tYXAoZm9jdXNFbGVtZW50KS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBmYWxsYmFjayA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3Lmxhc3RGb2N1cykge1xuICAgICAgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkNPTU1JVF9CVVRUT04pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkFCT1JUX01FUkdFX0JVVFRPTik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2hvd0NvQXV0aG9ySW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Rm9jdXMoQ29tbWl0Vmlldy5mb2N1cy5DT0FVVEhPUl9JTlBVVCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRGb2N1cyhDb21taXRWaWV3LmZvY3VzLkVESVRPUik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZhbGxiYWNrICYmIHRoaXMucmVmRWRpdG9yQ29tcG9uZW50Lm1hcChmb2N1c0VsZW1lbnQpLmdldE9yKGZhbHNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGNvbnN0IGYgPSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzO1xuXG4gICAgbGV0IG5leHQgPSBudWxsO1xuICAgIHN3aXRjaCAoZm9jdXMpIHtcbiAgICBjYXNlIGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OOlxuICAgICAgbmV4dCA9IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkVESVRPUjpcbiAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIG5leHQgPSBmLkNPQVVUSE9SX0lOUFVUO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBuZXh0ID0gZi5BQk9SVF9NRVJHRV9CVVRUT047XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0SXNFbmFibGVkKGZhbHNlKSkge1xuICAgICAgICBuZXh0ID0gZi5DT01NSVRfQlVUVE9OO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IFJlY2VudENvbW1pdHNWaWV3LmZpcnN0Rm9jdXM7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQ09BVVRIT1JfSU5QVVQ6XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc01lcmdpbmcpIHtcbiAgICAgICAgbmV4dCA9IGYuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkpIHtcbiAgICAgICAgbmV4dCA9IGYuQ09NTUlUX0JVVFRPTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQgPSBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkFCT1JUX01FUkdFX0JVVFRPTjpcbiAgICAgIG5leHQgPSB0aGlzLmNvbW1pdElzRW5hYmxlZChmYWxzZSkgPyBmLkNPTU1JVF9CVVRUT04gOiBSZWNlbnRDb21taXRzVmlldy5maXJzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPTU1JVF9CVVRUT046XG4gICAgICBuZXh0ID0gUmVjZW50Q29tbWl0c1ZpZXcuZmlyc3RGb2N1cztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV4dCk7XG4gIH1cblxuICByZXRyZWF0Rm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuY29uc3RydWN0b3IuZm9jdXM7XG5cbiAgICBsZXQgcHJldmlvdXMgPSBudWxsO1xuICAgIHN3aXRjaCAoZm9jdXMpIHtcbiAgICBjYXNlIGYuQ09NTUlUX0JVVFRPTjpcbiAgICAgIGlmICh0aGlzLnByb3BzLmlzTWVyZ2luZykge1xuICAgICAgICBwcmV2aW91cyA9IGYuQUJPUlRfTUVSR0VfQlVUVE9OO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0KSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5DT0FVVEhPUl9JTlBVVDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpb3VzID0gZi5FRElUT1I7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGYuQUJPUlRfTUVSR0VfQlVUVE9OOlxuICAgICAgcHJldmlvdXMgPSB0aGlzLnN0YXRlLnNob3dDb0F1dGhvcklucHV0ID8gZi5DT0FVVEhPUl9JTlBVVCA6IGYuRURJVE9SO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPQVVUSE9SX0lOUFVUOlxuICAgICAgcHJldmlvdXMgPSBmLkVESVRPUjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZi5FRElUT1I6XG4gICAgICBwcmV2aW91cyA9IGYuQ09NTUlUX1BSRVZJRVdfQlVUVE9OO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBmLkNPTU1JVF9QUkVWSUVXX0JVVFRPTjpcbiAgICAgIHByZXZpb3VzID0gU3RhZ2luZ1ZpZXcubGFzdEZvY3VzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcmV2aW91cyk7XG4gIH1cbn1cbiJdfQ==