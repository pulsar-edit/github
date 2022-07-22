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

const {
  Menu,
  MenuItem
} = _electron.remote;

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
      menu.popup(_electron.remote.getCurrentWindow());
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: className,
      ref: this.refRoot.setter
    }, this.renderCommands(), /*#__PURE__*/_react.default.createElement(_atomTextEditor.default, {
      buffer: this.buffer,
      lineNumberGutterVisible: false,
      softWrapped: true,
      autoHeight: true,
      readOnly: this.props.isPosting,
      refModel: this.refEditor
    }), /*#__PURE__*/_react.default.createElement("footer", {
      className: "github-Review-editable-footer"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "github-Review-editableCancelButton btn btn-sm",
      title: "Cancel editing comment",
      disabled: this.props.isPosting,
      onClick: this.onCancel
    }, "Cancel"), /*#__PURE__*/_react.default.createElement("button", {
      className: "github-Review-updateCommentButton btn btn-sm btn-primary",
      title: "Update comment",
      disabled: this.props.isPosting,
      onClick: this.onSubmitUpdate
    }, "Update comment")));
  }

  renderCommands() {
    return /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:submit-comment",
      callback: this.onSubmitUpdate
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9hY3Rpb25hYmxlLXJldmlldy12aWV3LmpzIl0sIm5hbWVzIjpbIk1lbnUiLCJNZW51SXRlbSIsInJlbW90ZSIsIkFjdGlvbmFibGVSZXZpZXdWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYnVmZmVyIiwiZ2V0VGV4dCIsIm9yaWdpbmFsQ29udGVudCIsImJvZHkiLCJzZXRTdGF0ZSIsImVkaXRpbmciLCJjaG9pY2UiLCJjb25maXJtIiwibWVzc2FnZSIsImJ1dHRvbnMiLCJ0ZXh0IiwiY29udGVudFVwZGF0ZXIiLCJpZCIsImUiLCJzZXRUZXh0IiwiY29tbWVudFVybCIsImF1dGhvciIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwicGFja2FnZSIsImNvbXBvbmVudCIsIm5hbWUiLCJldmVudCIsImNvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1lbnUiLCJjcmVhdGVNZW51Iiwidmlld2VyQ2FuVXBkYXRlIiwiYXBwZW5kIiwiY3JlYXRlTWVudUl0ZW0iLCJsYWJlbCIsImNsaWNrIiwib3Blbk9uR2l0SHViIiwicmVwb3J0QWJ1c2UiLCJsb2dpbiIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyIsInJlZkVkaXRvciIsIlJlZkhvbGRlciIsInJlZlJvb3QiLCJUZXh0QnVmZmVyIiwic3RhdGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJtYXAiLCJnZXRFbGVtZW50IiwiZm9jdXMiLCJyZW5kZXIiLCJyZW5kZXJFZGl0b3IiLCJzaG93QWN0aW9uc01lbnUiLCJjbGFzc05hbWUiLCJpc1Bvc3RpbmciLCJzZXR0ZXIiLCJyZW5kZXJDb21tYW5kcyIsIm9uQ2FuY2VsIiwib25TdWJtaXRVcGRhdGUiLCJjb21tYW5kcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVu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UUFBTSxJQUFJcEMsSUFBSixFQUR6QjtBQUVwQnVDLEVBQUFBLGNBQWM7QUFBRTtBQUEyQixHQUFDLEdBQUdrQyxJQUFKLEtBQWEsSUFBSXhFLFFBQUosQ0FBYSxHQUFHd0UsSUFBaEI7QUFGcEMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtyZW1vdGUsIHNoZWxsfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuY29uc3Qge01lbnUsIE1lbnVJdGVtfSA9IHJlbW90ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aW9uYWJsZVJldmlld1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgb3JpZ2luYWxDb250ZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNQb3N0aW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIGNvbnRlbnRVcGRhdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNyZWF0ZU1lbnU6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNyZWF0ZU1lbnVJdGVtOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIC8vIFJlbmRlciBwcm9wXG4gICAgcmVuZGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjcmVhdGVNZW51OiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoKSA9PiBuZXcgTWVudSgpLFxuICAgIGNyZWF0ZU1lbnVJdGVtOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoLi4uYXJncykgPT4gbmV3IE1lbnVJdGVtKC4uLmFyZ3MpLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZWZFZGl0b3IgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge2VkaXRpbmc6IGZhbHNlfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcgJiYgIXByZXZTdGF0ZS5lZGl0aW5nKSB7XG4gICAgICB0aGlzLmJ1ZmZlci5zZXRUZXh0KHRoaXMucHJvcHMub3JpZ2luYWxDb250ZW50LmJvZHkpO1xuICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGUgPT4gZS5nZXRFbGVtZW50KCkuZm9jdXMoKSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmVkaXRpbmcgPyB0aGlzLnJlbmRlckVkaXRvcigpIDogdGhpcy5wcm9wcy5yZW5kZXIodGhpcy5zaG93QWN0aW9uc01lbnUpO1xuICB9XG5cbiAgcmVuZGVyRWRpdG9yKCkge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN4KCdnaXRodWItUmV2aWV3LWVkaXRhYmxlJywgeydnaXRodWItUmV2aWV3LWVkaXRhYmxlLS1kaXNhYmxlZCc6IHRoaXMucHJvcHMuaXNQb3N0aW5nfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgICAgYnVmZmVyPXt0aGlzLmJ1ZmZlcn1cbiAgICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG4gICAgICAgICAgYXV0b0hlaWdodD17dHJ1ZX1cbiAgICAgICAgICByZWFkT25seT17dGhpcy5wcm9wcy5pc1Bvc3Rpbmd9XG4gICAgICAgICAgcmVmTW9kZWw9e3RoaXMucmVmRWRpdG9yfVxuICAgICAgICAvPlxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZWRpdGFibGUtZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0YWJsZUNhbmNlbEJ1dHRvbiBidG4gYnRuLXNtXCJcbiAgICAgICAgICAgIHRpdGxlPVwiQ2FuY2VsIGVkaXRpbmcgY29tbWVudFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5pc1Bvc3Rpbmd9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctdXBkYXRlQ29tbWVudEJ1dHRvbiBidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIHRpdGxlPVwiVXBkYXRlIGNvbW1lbnRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuaXNQb3N0aW5nfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vblN1Ym1pdFVwZGF0ZX0+XG4gICAgICAgICAgICBVcGRhdGUgY29tbWVudFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VibWl0LWNvbW1lbnRcIiBjYWxsYmFjaz17dGhpcy5vblN1Ym1pdFVwZGF0ZX0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y2FuY2VsXCIgY2FsbGJhY2s9e3RoaXMub25DYW5jZWx9IC8+XG4gICAgICA8L0NvbW1hbmRzPlxuICAgICk7XG4gIH1cblxuICBvbkNhbmNlbCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5idWZmZXIuZ2V0VGV4dCgpID09PSB0aGlzLnByb3BzLm9yaWdpbmFsQ29udGVudC5ib2R5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgICBtZXNzYWdlOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRpc2NhcmQgeW91ciB1bnNhdmVkIGNoYW5nZXM/JyxcbiAgICAgICAgYnV0dG9uczogWydPSycsICdDYW5jZWwnXSxcbiAgICAgIH0pO1xuICAgICAgaWYgKGNob2ljZSA9PT0gMCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uU3VibWl0VXBkYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLmJ1ZmZlci5nZXRUZXh0KCk7XG4gICAgaWYgKHRleHQgPT09IHRoaXMucHJvcHMub3JpZ2luYWxDb250ZW50LmJvZHkgfHwgdGV4dCA9PT0gJycpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IGZhbHNlfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuY29udGVudFVwZGF0ZXIodGhpcy5wcm9wcy5vcmlnaW5hbENvbnRlbnQuaWQsIHRleHQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZzogZmFsc2V9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmJ1ZmZlci5zZXRUZXh0KHRleHQpO1xuICAgIH1cbiAgfVxuXG4gIHJlcG9ydEFidXNlID0gYXN5bmMgKGNvbW1lbnRVcmwsIGF1dGhvcikgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vY29udGFjdC9yZXBvcnQtY29udGVudD9yZXBvcnQ9JyArXG4gICAgICBgJHtlbmNvZGVVUklDb21wb25lbnQoYXV0aG9yKX0mY29udGVudF91cmw9JHtlbmNvZGVVUklDb21wb25lbnQoY29tbWVudFVybCl9YDtcblxuICAgIGF3YWl0IHNoZWxsLm9wZW5FeHRlcm5hbCh1cmwpO1xuICAgIGFkZEV2ZW50KCdyZXBvcnQtYWJ1c2UnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBvcGVuT25HaXRIdWIgPSBhc3luYyB1cmwgPT4ge1xuICAgIGF3YWl0IHNoZWxsLm9wZW5FeHRlcm5hbCh1cmwpO1xuICAgIGFkZEV2ZW50KCdvcGVuLWNvbW1lbnQtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIHNob3dBY3Rpb25zTWVudSA9IChldmVudCwgY29udGVudCwgYXV0aG9yKSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSB0aGlzLnByb3BzLmNyZWF0ZU1lbnUoKTtcblxuICAgIGlmIChjb250ZW50LnZpZXdlckNhblVwZGF0ZSkge1xuICAgICAgbWVudS5hcHBlbmQodGhpcy5wcm9wcy5jcmVhdGVNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnRWRpdCcsXG4gICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiB0cnVlfSksXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgbWVudS5hcHBlbmQodGhpcy5wcm9wcy5jcmVhdGVNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ09wZW4gb24gR2l0SHViJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLm9wZW5PbkdpdEh1Yihjb250ZW50LnVybCksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQodGhpcy5wcm9wcy5jcmVhdGVNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1JlcG9ydCBhYnVzZScsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5yZXBvcnRBYnVzZShjb250ZW50LnVybCwgYXV0aG9yLmxvZ2luKSxcbiAgICB9KSk7XG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9XG59XG4iXX0=