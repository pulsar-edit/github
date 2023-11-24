"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _electron = require("electron");

var _atom = require("atom");

var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _reporterProxy = require("../reporter-proxy");

var _commands = _interopRequireWildcard(require("../atom/commands"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const remote = require('@electron/remote');

const {
  Menu,
  MenuItem
} = remote;

class ActionableReviewView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onCancel", () => {
      if (this.buffer.getText() === this.props.originalContent.body) {
        this.setState({
          editing: false
        });
      } else {
        const choice = this.props.confirm({
          message: 'Are you sure you want to discard your unsaved changes?',
          buttons: ['OK', 'Cancel']
        });

        if (choice === 0) {
          this.setState({
            editing: false
          });
        }
      }
    });

    _defineProperty(this, "onSubmitUpdate", async () => {
      const text = this.buffer.getText();

      if (text === this.props.originalContent.body || text === '') {
        this.setState({
          editing: false
        });
        return;
      }

      try {
        await this.props.contentUpdater(this.props.originalContent.id, text);
        this.setState({
          editing: false
        });
      } catch (e) {
        this.buffer.setText(text);
      }
    });

    _defineProperty(this, "reportAbuse", async (commentUrl, author) => {
      const url = 'https://github.com/contact/report-content?report=' + `${encodeURIComponent(author)}&content_url=${encodeURIComponent(commentUrl)}`;
      await _electron.shell.openExternal(url);
      (0, _reporterProxy.addEvent)('report-abuse', {
        package: 'github',
        component: this.constructor.name
      });
    });

    _defineProperty(this, "openOnGitHub", async url => {
      await _electron.shell.openExternal(url);
      (0, _reporterProxy.addEvent)('open-comment-in-browser', {
        package: 'github',
        component: this.constructor.name
      });
    });

    _defineProperty(this, "showActionsMenu", (event, content, author) => {
      event.preventDefault();
      const menu = this.props.createMenu();

      if (content.viewerCanUpdate) {
        menu.append(this.props.createMenuItem({
          label: 'Edit',
          click: () => this.setState({
            editing: true
          })
        }));
      }

      menu.append(this.props.createMenuItem({
        label: 'Open on GitHub',
        click: () => this.openOnGitHub(content.url)
      }));
      menu.append(this.props.createMenuItem({
        label: 'Report abuse',
        click: () => this.reportAbuse(content.url, author.login)
      }));
      menu.popup(remote.getCurrentWindow());
    });

    this.refEditor = new _refHolder.default();
    this.refRoot = new _refHolder.default();
    this.buffer = new _atom.TextBuffer();
    this.state = {
      editing: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      this.buffer.setText(this.props.originalContent.body);
      this.refEditor.map(e => e.getElement().focus());
    }
  }

  render() {
    return this.state.editing ? this.renderEditor() : this.props.render(this.showActionsMenu);
  }

  renderEditor() {
    const className = (0, _classnames.default)('github-Review-editable', {
      'github-Review-editable--disabled': this.props.isPosting
    });
    return _react.default.createElement("div", {
      className: className,
      ref: this.refRoot.setter
    }, this.renderCommands(), _react.default.createElement(_atomTextEditor.default, {
      buffer: this.buffer,
      lineNumberGutterVisible: false,
      softWrapped: true,
      autoHeight: true,
      readOnly: this.props.isPosting,
      refModel: this.refEditor
    }), _react.default.createElement("footer", {
      className: "github-Review-editable-footer"
    }, _react.default.createElement("button", {
      className: "github-Review-editableCancelButton btn btn-sm",
      title: "Cancel editing comment",
      disabled: this.props.isPosting,
      onClick: this.onCancel
    }, "Cancel"), _react.default.createElement("button", {
      className: "github-Review-updateCommentButton btn btn-sm btn-primary",
      title: "Update comment",
      disabled: this.props.isPosting,
      onClick: this.onSubmitUpdate
    }, "Update comment")));
  }

  renderCommands() {
    return _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, _react.default.createElement(_commands.Command, {
      command: "github:submit-comment",
      callback: this.onSubmitUpdate
    }), _react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.onCancel
    }));
  }

}

exports.default = ActionableReviewView;

_defineProperty(ActionableReviewView, "propTypes", {
  // Model
  originalContent: _propTypes.default.object.isRequired,
  isPosting: _propTypes.default.bool,
  // Atom environment
  commands: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  // Action methods
  contentUpdater: _propTypes.default.func.isRequired,
  createMenu: _propTypes.default.func,
  createMenuItem: _propTypes.default.func,
  // Render prop
  render: _propTypes.default.func.isRequired
});

_defineProperty(ActionableReviewView, "defaultProps", {
  createMenu:
  /* istanbul ignore next */
  () => new Menu(),
  createMenuItem:
  /* istanbul ignore next */
  (...args) => new MenuItem(...args)
});