"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GithubLoginView extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'handleLoginClick', 'handleCancelTokenClick', 'handleSubmitTokenClick', 'handleSubmitToken', 'handleTokenChange');
    this.state = {
      loggingIn: false,
      token: ''
    };
  }

  render() {
    let subview;

    if (this.state.loggingIn) {
      subview = this.renderTokenInput();
    } else {
      subview = this.renderLogin();
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GithubLoginView"
    }, subview);
  }

  renderLogin() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GithubLoginView-Subview"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mark-github"
    }), /*#__PURE__*/_react.default.createElement("h1", null, "Log in to GitHub"), this.props.children, /*#__PURE__*/_react.default.createElement("button", {
      onClick: this.handleLoginClick,
      className: "btn btn-primary icon icon-octoface"
    }, "Login"));
  }

  renderTokenInput() {
    return /*#__PURE__*/_react.default.createElement("form", {
      className: "github-GithubLoginView-Subview",
      onSubmit: this.handleSubmitToken
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mark-github"
    }), /*#__PURE__*/_react.default.createElement("h1", null, "Enter Token"), /*#__PURE__*/_react.default.createElement("ol", null, /*#__PURE__*/_react.default.createElement("li", null, "Visit ", /*#__PURE__*/_react.default.createElement("a", {
      href: "https://github.atom.io/login"
    }, "github.atom.io/login"), " to generate an authentication token."), /*#__PURE__*/_react.default.createElement("li", null, "Enter the token below:")), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "input-text native-key-bindings",
      placeholder: "Enter your token...",
      value: this.state.token,
      onChange: this.handleTokenChange
    }), /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      onClick: this.handleCancelTokenClick,
      className: "btn icon icon-remove-close"
    }, "Cancel")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("button", {
      type: "submit",
      onClick: this.handleSubmitTokenClick,
      className: "btn btn-primary icon icon-check"
    }, "Login"))));
  }

  handleLoginClick() {
    this.setState({
      loggingIn: true
    });
  }

  handleCancelTokenClick(e) {
    e.preventDefault();
    this.setState({
      loggingIn: false
    });
  }

  handleSubmitTokenClick(e) {
    e.preventDefault();
    this.handleSubmitToken();
  }

  handleSubmitToken() {
    this.props.onLogin(this.state.token);
  }

  handleTokenChange(e) {
    this.setState({
      token: e.target.value
    });
  }

}

exports.default = GithubLoginView;

_defineProperty(GithubLoginView, "propTypes", {
  children: _propTypes.default.node,
  onLogin: _propTypes.default.func
});

_defineProperty(GithubLoginView, "defaultProps", {
  children: /*#__PURE__*/_react.default.createElement("div", {
    className: "initialize-repo-description"
  }, /*#__PURE__*/_react.default.createElement("span", null, "Log in to GitHub to access PR information and more!")),
  onLogin: token => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItbG9naW4tdmlldy5qcyJdLCJuYW1lcyI6WyJHaXRodWJMb2dpblZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhdGUiLCJsb2dnaW5nSW4iLCJ0b2tlbiIsInJlbmRlciIsInN1YnZpZXciLCJyZW5kZXJUb2tlbklucHV0IiwicmVuZGVyTG9naW4iLCJjaGlsZHJlbiIsImhhbmRsZUxvZ2luQ2xpY2siLCJoYW5kbGVTdWJtaXRUb2tlbiIsImhhbmRsZVRva2VuQ2hhbmdlIiwiaGFuZGxlQ2FuY2VsVG9rZW5DbGljayIsImhhbmRsZVN1Ym1pdFRva2VuQ2xpY2siLCJzZXRTdGF0ZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uTG9naW4iLCJ0YXJnZXQiLCJ2YWx1ZSIsIlByb3BUeXBlcyIsIm5vZGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7OztBQUVlLE1BQU1BLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBYzNEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7QUFDQSwyQkFDRSxJQURGLEVBRUUsa0JBRkYsRUFFc0Isd0JBRnRCLEVBRWdELHdCQUZoRCxFQUUwRSxtQkFGMUUsRUFFK0YsbUJBRi9GO0FBSUEsU0FBS0MsS0FBTCxHQUFhO0FBQ1hDLE1BQUFBLFNBQVMsRUFBRSxLQURBO0FBRVhDLE1BQUFBLEtBQUssRUFBRTtBQUZJLEtBQWI7QUFJRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsUUFBSUMsT0FBSjs7QUFDQSxRQUFJLEtBQUtKLEtBQUwsQ0FBV0MsU0FBZixFQUEwQjtBQUN4QkcsTUFBQUEsT0FBTyxHQUFHLEtBQUtDLGdCQUFMLEVBQVY7QUFDRCxLQUZELE1BRU87QUFDTEQsTUFBQUEsT0FBTyxHQUFHLEtBQUtFLFdBQUwsRUFBVjtBQUNEOztBQUVELHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHRixPQURILENBREY7QUFLRDs7QUFFREUsRUFBQUEsV0FBVyxHQUFHO0FBQ1osd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixNQURGLGVBRUUsNERBRkYsRUFHRyxLQUFLUixLQUFMLENBQVdTLFFBSGQsZUFJRTtBQUFRLE1BQUEsT0FBTyxFQUFFLEtBQUtDLGdCQUF0QjtBQUF3QyxNQUFBLFNBQVMsRUFBQztBQUFsRCxlQUpGLENBREY7QUFVRDs7QUFFREgsRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsd0JBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBQyxnQ0FBaEI7QUFBaUQsTUFBQSxRQUFRLEVBQUUsS0FBS0k7QUFBaEUsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE1BREYsZUFFRSx1REFGRixlQUdFLHNEQUNFLGdFQUFVO0FBQUcsTUFBQSxJQUFJLEVBQUM7QUFBUiw4QkFBViwwQ0FERixlQUdFLGtFQUhGLENBSEYsZUFTRTtBQUNFLE1BQUEsSUFBSSxFQUFDLE1BRFA7QUFFRSxNQUFBLFNBQVMsRUFBQyxnQ0FGWjtBQUdFLE1BQUEsV0FBVyxFQUFDLHFCQUhkO0FBSUUsTUFBQSxLQUFLLEVBQUUsS0FBS1QsS0FBTCxDQUFXRSxLQUpwQjtBQUtFLE1BQUEsUUFBUSxFQUFFLEtBQUtRO0FBTGpCLE1BVEYsZUFnQkUsc0RBQ0Usc0RBQ0U7QUFBUSxNQUFBLElBQUksRUFBQyxRQUFiO0FBQXNCLE1BQUEsT0FBTyxFQUFFLEtBQUtDLHNCQUFwQztBQUE0RCxNQUFBLFNBQVMsRUFBQztBQUF0RSxnQkFERixDQURGLGVBTUUsc0RBQ0U7QUFDRSxNQUFBLElBQUksRUFBQyxRQURQO0FBQ2dCLE1BQUEsT0FBTyxFQUFFLEtBQUtDLHNCQUQ5QjtBQUNzRCxNQUFBLFNBQVMsRUFBQztBQURoRSxlQURGLENBTkYsQ0FoQkYsQ0FERjtBQWdDRDs7QUFFREosRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsU0FBS0ssUUFBTCxDQUFjO0FBQUNaLE1BQUFBLFNBQVMsRUFBRTtBQUFaLEtBQWQ7QUFDRDs7QUFFRFUsRUFBQUEsc0JBQXNCLENBQUNHLENBQUQsRUFBSTtBQUN4QkEsSUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0EsU0FBS0YsUUFBTCxDQUFjO0FBQUNaLE1BQUFBLFNBQVMsRUFBRTtBQUFaLEtBQWQ7QUFDRDs7QUFFRFcsRUFBQUEsc0JBQXNCLENBQUNFLENBQUQsRUFBSTtBQUN4QkEsSUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0EsU0FBS04saUJBQUw7QUFDRDs7QUFFREEsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsU0FBS1gsS0FBTCxDQUFXa0IsT0FBWCxDQUFtQixLQUFLaEIsS0FBTCxDQUFXRSxLQUE5QjtBQUNEOztBQUVEUSxFQUFBQSxpQkFBaUIsQ0FBQ0ksQ0FBRCxFQUFJO0FBQ25CLFNBQUtELFFBQUwsQ0FBYztBQUFDWCxNQUFBQSxLQUFLLEVBQUVZLENBQUMsQ0FBQ0csTUFBRixDQUFTQztBQUFqQixLQUFkO0FBQ0Q7O0FBN0cwRDs7OztnQkFBeEN4QixlLGVBQ0E7QUFDakJhLEVBQUFBLFFBQVEsRUFBRVksbUJBQVVDLElBREg7QUFFakJKLEVBQUFBLE9BQU8sRUFBRUcsbUJBQVVFO0FBRkYsQzs7Z0JBREEzQixlLGtCQU1HO0FBQ3BCYSxFQUFBQSxRQUFRLGVBQ1Y7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFLGlHQURGLENBRnNCO0FBS3BCUyxFQUFBQSxPQUFPLEVBQUVkLEtBQUssSUFBSSxDQUFFO0FBTEEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViTG9naW5WaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gICAgb25Mb2dpbjogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNoaWxkcmVuOlxuICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgIDxzcGFuPkxvZyBpbiB0byBHaXRIdWIgdG8gYWNjZXNzIFBSIGluZm9ybWF0aW9uIGFuZCBtb3JlITwvc3Bhbj5cbiAgPC9kaXY+LFxuICAgIG9uTG9naW46IHRva2VuID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2hhbmRsZUxvZ2luQ2xpY2snLCAnaGFuZGxlQ2FuY2VsVG9rZW5DbGljaycsICdoYW5kbGVTdWJtaXRUb2tlbkNsaWNrJywgJ2hhbmRsZVN1Ym1pdFRva2VuJywgJ2hhbmRsZVRva2VuQ2hhbmdlJyxcbiAgICApO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBsb2dnaW5nSW46IGZhbHNlLFxuICAgICAgdG9rZW46ICcnLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHN1YnZpZXc7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9nZ2luZ0luKSB7XG4gICAgICBzdWJ2aWV3ID0gdGhpcy5yZW5kZXJUb2tlbklucHV0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YnZpZXcgPSB0aGlzLnJlbmRlckxvZ2luKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdGh1YkxvZ2luVmlld1wiPlxuICAgICAgICB7c3Vidmlld31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJMb2dpbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0aHViTG9naW5WaWV3LVN1YnZpZXdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgICA8aDE+TG9nIGluIHRvIEdpdEh1YjwvaDE+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9naW5DbGlja30gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGljb24gaWNvbi1vY3RvZmFjZVwiPlxuICAgICAgICAgIExvZ2luXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRva2VuSW5wdXQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRodWJMb2dpblZpZXctU3Vidmlld1wiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdFRva2VufT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgICA8aDE+RW50ZXIgVG9rZW48L2gxPlxuICAgICAgICA8b2w+XG4gICAgICAgICAgPGxpPlZpc2l0IDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5hdG9tLmlvL2xvZ2luXCI+Z2l0aHViLmF0b20uaW8vbG9naW48L2E+IHRvIGdlbmVyYXRlXG4gICAgICAgICAgYW4gYXV0aGVudGljYXRpb24gdG9rZW4uPC9saT5cbiAgICAgICAgICA8bGk+RW50ZXIgdGhlIHRva2VuIGJlbG93OjwvbGk+XG4gICAgICAgIDwvb2w+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXRleHQgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIHRva2VuLi4uXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS50b2tlbn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUb2tlbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2FuY2VsVG9rZW5DbGlja30gY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1yZW1vdmUtY2xvc2VcIj5cbiAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0VG9rZW5DbGlja30gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGljb24gaWNvbi1jaGVja1wiPlxuICAgICAgICAgICAgICAgIExvZ2luXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVMb2dpbkNsaWNrKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2xvZ2dpbmdJbjogdHJ1ZX0pO1xuICB9XG5cbiAgaGFuZGxlQ2FuY2VsVG9rZW5DbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2xvZ2dpbmdJbjogZmFsc2V9KTtcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdFRva2VuQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdFRva2VuKCk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXRUb2tlbigpIHtcbiAgICB0aGlzLnByb3BzLm9uTG9naW4odGhpcy5zdGF0ZS50b2tlbik7XG4gIH1cblxuICBoYW5kbGVUb2tlbkNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dG9rZW46IGUudGFyZ2V0LnZhbHVlfSk7XG4gIH1cbn1cbiJdfQ==