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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9hY3Rpb25hYmxlLXJldmlldy12aWV3LmpzIl0sIm5hbWVzIjpbIk1lbnUiLCJNZW51SXRlbSIsInJlbW90ZSIsIkFjdGlvbmFibGVSZXZpZXdWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYnVmZmVyIiwiZ2V0VGV4dCIsIm9yaWdpbmFsQ29udGVudCIsImJvZHkiLCJzZXRTdGF0ZSIsImVkaXRpbmciLCJjaG9pY2UiLCJjb25maXJtIiwibWVzc2FnZSIsImJ1dHRvbnMiLCJ0ZXh0IiwiY29udGVudFVwZGF0ZXIiLCJpZCIsImUiLCJzZXRUZXh0IiwiY29tbWVudFVybCIsImF1dGhvciIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwicGFja2FnZSIsImNvbXBvbmVudCIsIm5hbWUiLCJldmVudCIsImNvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm1lbnUiLCJjcmVhdGVNZW51Iiwidmlld2VyQ2FuVXBkYXRlIiwiYXBwZW5kIiwiY3JlYXRlTWVudUl0ZW0iLCJsYWJlbCIsImNsaWNrIiwib3Blbk9uR2l0SHViIiwicmVwb3J0QWJ1c2UiLCJsb2dpbiIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyIsInJlZkVkaXRvciIsIlJlZkhvbGRlciIsInJlZlJvb3QiLCJUZXh0QnVmZmVyIiwic3RhdGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJtYXAiLCJnZXRFbGVtZW50IiwiZm9jdXMiLCJyZW5kZXIiLCJyZW5kZXJFZGl0b3IiLCJzaG93QWN0aW9uc01lbnUiLCJjbGFzc05hbWUiLCJpc1Bvc3RpbmciLCJzZXR0ZXIiLCJyZW5kZXJDb21tYW5kcyIsIm9uQ2FuY2VsIiwib25TdWJtaXRVcGRhdGUiLCJjb21tYW5kcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVu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LElBQUlwQyxJQUFKLEVBRHpCO0FBRXBCdUMsRUFBQUEsY0FBYztBQUFFO0FBQTJCLEdBQUMsR0FBR2tDLElBQUosS0FBYSxJQUFJeEUsUUFBSixDQUFhLEdBQUd3RSxJQUFoQjtBQUZwQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge3JlbW90ZSwgc2hlbGx9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5jb25zdCB7TWVudSwgTWVudUl0ZW19ID0gcmVtb3RlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb25hYmxlUmV2aWV3VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICBvcmlnaW5hbENvbnRlbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc1Bvc3Rpbmc6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgY29udGVudFVwZGF0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY3JlYXRlTWVudTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY3JlYXRlTWVudUl0ZW06IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gUmVuZGVyIHByb3BcbiAgICByZW5kZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNyZWF0ZU1lbnU6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICgpID0+IG5ldyBNZW51KCksXG4gICAgY3JlYXRlTWVudUl0ZW06IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICguLi5hcmdzKSA9PiBuZXcgTWVudUl0ZW0oLi4uYXJncyksXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7ZWRpdGluZzogZmFsc2V9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZyAmJiAhcHJldlN0YXRlLmVkaXRpbmcpIHtcbiAgICAgIHRoaXMuYnVmZmVyLnNldFRleHQodGhpcy5wcm9wcy5vcmlnaW5hbENvbnRlbnQuYm9keSk7XG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZSA9PiBlLmdldEVsZW1lbnQoKS5mb2N1cygpKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZWRpdGluZyA/IHRoaXMucmVuZGVyRWRpdG9yKCkgOiB0aGlzLnByb3BzLnJlbmRlcih0aGlzLnNob3dBY3Rpb25zTWVudSk7XG4gIH1cblxuICByZW5kZXJFZGl0b3IoKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gY3goJ2dpdGh1Yi1SZXZpZXctZWRpdGFibGUnLCB7J2dpdGh1Yi1SZXZpZXctZWRpdGFibGUtLWRpc2FibGVkJzogdGhpcy5wcm9wcy5pc1Bvc3Rpbmd9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgICBidWZmZXI9e3RoaXMuYnVmZmVyfVxuICAgICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cbiAgICAgICAgICBhdXRvSGVpZ2h0PXt0cnVlfVxuICAgICAgICAgIHJlYWRPbmx5PXt0aGlzLnByb3BzLmlzUG9zdGluZ31cbiAgICAgICAgICByZWZNb2RlbD17dGhpcy5yZWZFZGl0b3J9XG4gICAgICAgIC8+XG4gICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0YWJsZS1mb290ZXJcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWVkaXRhYmxlQ2FuY2VsQnV0dG9uIGJ0biBidG4tc21cIlxuICAgICAgICAgICAgdGl0bGU9XCJDYW5jZWwgZWRpdGluZyBjb21tZW50XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmlzUG9zdGluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DYW5jZWx9PlxuICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy11cGRhdGVDb21tZW50QnV0dG9uIGJ0biBidG4tc20gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgdGl0bGU9XCJVcGRhdGUgY29tbWVudFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5pc1Bvc3Rpbmd9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9uU3VibWl0VXBkYXRlfT5cbiAgICAgICAgICAgIFVwZGF0ZSBjb21tZW50XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZm9vdGVyPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdWJtaXQtY29tbWVudFwiIGNhbGxiYWNrPXt0aGlzLm9uU3VibWl0VXBkYXRlfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjYW5jZWxcIiBjYWxsYmFjaz17dGhpcy5vbkNhbmNlbH0gLz5cbiAgICAgIDwvQ29tbWFuZHM+XG4gICAgKTtcbiAgfVxuXG4gIG9uQ2FuY2VsID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmJ1ZmZlci5nZXRUZXh0KCkgPT09IHRoaXMucHJvcHMub3JpZ2luYWxDb250ZW50LmJvZHkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IGZhbHNlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNob2ljZSA9IHRoaXMucHJvcHMuY29uZmlybSh7XG4gICAgICAgIG1lc3NhZ2U6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGlzY2FyZCB5b3VyIHVuc2F2ZWQgY2hhbmdlcz8nLFxuICAgICAgICBidXR0b25zOiBbJ09LJywgJ0NhbmNlbCddLFxuICAgICAgfSk7XG4gICAgICBpZiAoY2hvaWNlID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IGZhbHNlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25TdWJtaXRVcGRhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuYnVmZmVyLmdldFRleHQoKTtcbiAgICBpZiAodGV4dCA9PT0gdGhpcy5wcm9wcy5vcmlnaW5hbENvbnRlbnQuYm9keSB8fCB0ZXh0ID09PSAnJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZzogZmFsc2V9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jb250ZW50VXBkYXRlcih0aGlzLnByb3BzLm9yaWdpbmFsQ29udGVudC5pZCwgdGV4dCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtlZGl0aW5nOiBmYWxzZX0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuYnVmZmVyLnNldFRleHQodGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcmVwb3J0QWJ1c2UgPSBhc3luYyAoY29tbWVudFVybCwgYXV0aG9yKSA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9jb250YWN0L3JlcG9ydC1jb250ZW50P3JlcG9ydD0nICtcbiAgICAgIGAke2VuY29kZVVSSUNvbXBvbmVudChhdXRob3IpfSZjb250ZW50X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChjb21tZW50VXJsKX1gO1xuXG4gICAgYXdhaXQgc2hlbGwub3BlbkV4dGVybmFsKHVybCk7XG4gICAgYWRkRXZlbnQoJ3JlcG9ydC1hYnVzZScsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9wZW5PbkdpdEh1YiA9IGFzeW5jIHVybCA9PiB7XG4gICAgYXdhaXQgc2hlbGwub3BlbkV4dGVybmFsKHVybCk7XG4gICAgYWRkRXZlbnQoJ29wZW4tY29tbWVudC1pbi1icm93c2VyJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgc2hvd0FjdGlvbnNNZW51ID0gKGV2ZW50LCBjb250ZW50LCBhdXRob3IpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgbWVudSA9IHRoaXMucHJvcHMuY3JlYXRlTWVudSgpO1xuXG4gICAgaWYgKGNvbnRlbnQudmlld2VyQ2FuVXBkYXRlKSB7XG4gICAgICBtZW51LmFwcGVuZCh0aGlzLnByb3BzLmNyZWF0ZU1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdFZGl0JyxcbiAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc2V0U3RhdGUoe2VkaXRpbmc6IHRydWV9KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBtZW51LmFwcGVuZCh0aGlzLnByb3BzLmNyZWF0ZU1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnT3BlbiBvbiBHaXRIdWInLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMub3Blbk9uR2l0SHViKGNvbnRlbnQudXJsKSxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZCh0aGlzLnByb3BzLmNyZWF0ZU1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVwb3J0IGFidXNlJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnJlcG9ydEFidXNlKGNvbnRlbnQudXJsLCBhdXRob3IubG9naW4pLFxuICAgIH0pKTtcblxuICAgIG1lbnUucG9wdXAocmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKSk7XG4gIH1cbn1cbiJdfQ==