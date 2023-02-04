"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _dialogView = _interopRequireDefault(require("./dialog-view"));
var _tabGroup = _interopRequireDefault(require("../tab-group"));
var _tabbable = require("./tabbable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CredentialDialog extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "accept", () => {
      if (!this.canSignIn()) {
        return Promise.resolve();
      }
      const request = this.props.request;
      const params = request.getParams();
      const payload = {
        password: this.state.password
      };
      if (params.includeUsername) {
        payload.username = this.state.username;
      }
      if (params.includeRemember) {
        payload.remember = this.state.remember;
      }
      return request.accept(payload);
    });
    _defineProperty(this, "didChangeUsername", e => this.setState({
      username: e.target.value
    }));
    _defineProperty(this, "didChangePassword", e => this.setState({
      password: e.target.value
    }));
    _defineProperty(this, "didChangeRemember", e => this.setState({
      remember: e.target.checked
    }));
    _defineProperty(this, "toggleShowPassword", () => this.setState({
      showPassword: !this.state.showPassword
    }));
    this.tabGroup = new _tabGroup.default();
    this.state = {
      username: '',
      password: '',
      remember: false,
      showPassword: false
    };
  }
  render() {
    const request = this.props.request;
    const params = request.getParams();
    return _react.default.createElement(_dialogView.default, {
      prompt: params.prompt,
      acceptEnabled: this.canSignIn(),
      acceptText: "Sign in",
      accept: this.accept,
      cancel: request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, params.includeUsername && _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal"
    }, "Username:", _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      type: "text",
      className: "input-text native-key-bindings github-Credential-username",
      value: this.state.username,
      onChange: this.didChangeUsername
    })), _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal"
    }, "Password:", _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      type: this.state.showPassword ? 'text' : 'password',
      className: "input-text native-key-bindings github-Credential-password",
      value: this.state.password,
      onChange: this.didChangePassword
    }), _react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "github-Dialog--insetButton github-Credential-visibility",
      onClick: this.toggleShowPassword
    }, this.state.showPassword ? 'Hide' : 'Show')), params.includeRemember && _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal github-Credential-rememberLabel"
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "input-checkbox github-Credential-remember",
      type: "checkbox",
      checked: this.state.remember,
      onChange: this.didChangeRemember
    }), "Remember"));
  }
  componentDidMount() {
    this.tabGroup.autofocus();
  }
  canSignIn() {
    return !this.props.request.getParams().includeUsername || this.state.username.length > 0;
  }
}
exports.default = CredentialDialog;
_defineProperty(CredentialDialog, "propTypes", {
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  inProgress: _propTypes.default.bool,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDcmVkZW50aWFsRGlhbG9nIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY2FuU2lnbkluIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXF1ZXN0IiwicGFyYW1zIiwiZ2V0UGFyYW1zIiwicGF5bG9hZCIsInBhc3N3b3JkIiwic3RhdGUiLCJpbmNsdWRlVXNlcm5hbWUiLCJ1c2VybmFtZSIsImluY2x1ZGVSZW1lbWJlciIsInJlbWVtYmVyIiwiYWNjZXB0IiwiZSIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjaGVja2VkIiwic2hvd1Bhc3N3b3JkIiwidGFiR3JvdXAiLCJUYWJHcm91cCIsInJlbmRlciIsInByb21wdCIsImNhbmNlbCIsImluUHJvZ3Jlc3MiLCJlcnJvciIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiZGlkQ2hhbmdlVXNlcm5hbWUiLCJkaWRDaGFuZ2VQYXNzd29yZCIsInRvZ2dsZVNob3dQYXNzd29yZCIsImRpZENoYW5nZVJlbWVtYmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJhdXRvZm9jdXMiLCJsZW5ndGgiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImluc3RhbmNlT2YiLCJFcnJvciIsIm9iamVjdCJdLCJzb3VyY2VzIjpbImNyZWRlbnRpYWwtZGlhbG9nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgRGlhbG9nVmlldyBmcm9tICcuL2RpYWxvZy12aWV3JztcbmltcG9ydCBUYWJHcm91cCBmcm9tICcuLi90YWItZ3JvdXAnO1xuaW1wb3J0IHtUYWJiYWJsZUlucHV0LCBUYWJiYWJsZUJ1dHRvbn0gZnJvbSAnLi90YWJiYWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWRlbnRpYWxEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFBhcmFtczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy50YWJHcm91cCA9IG5ldyBUYWJHcm91cCgpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgIHJlbWVtYmVyOiBmYWxzZSxcbiAgICAgIHNob3dQYXNzd29yZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5wcm9wcy5yZXF1ZXN0O1xuICAgIGNvbnN0IHBhcmFtcyA9IHJlcXVlc3QuZ2V0UGFyYW1zKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERpYWxvZ1ZpZXdcbiAgICAgICAgcHJvbXB0PXtwYXJhbXMucHJvbXB0fVxuICAgICAgICBhY2NlcHRFbmFibGVkPXt0aGlzLmNhblNpZ25JbigpfVxuICAgICAgICBhY2NlcHRUZXh0PVwiU2lnbiBpblwiXG4gICAgICAgIGFjY2VwdD17dGhpcy5hY2NlcHR9XG4gICAgICAgIGNhbmNlbD17cmVxdWVzdC5jYW5jZWx9XG4gICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICBpblByb2dyZXNzPXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgIGVycm9yPXt0aGlzLnByb3BzLmVycm9yfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+XG5cbiAgICAgICAge3BhcmFtcy5pbmNsdWRlVXNlcm5hbWUgJiYgKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nTGFiZWwgZ2l0aHViLURpYWxvZ0xhYmVsLS1ob3Jpem9udGFsXCI+XG4gICAgICAgICAgICBVc2VybmFtZTpcbiAgICAgICAgICAgIDxUYWJiYWJsZUlucHV0XG4gICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgYXV0b2ZvY3VzXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dCBuYXRpdmUta2V5LWJpbmRpbmdzIGdpdGh1Yi1DcmVkZW50aWFsLXVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmRpZENoYW5nZVVzZXJuYW1lfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApfVxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsIGdpdGh1Yi1EaWFsb2dMYWJlbC0taG9yaXpvbnRhbFwiPlxuICAgICAgICAgIFBhc3N3b3JkOlxuICAgICAgICAgIDxUYWJiYWJsZUlucHV0XG4gICAgICAgICAgICB0YWJHcm91cD17dGhpcy50YWJHcm91cH1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgYXV0b2ZvY3VzXG4gICAgICAgICAgICB0eXBlPXt0aGlzLnN0YXRlLnNob3dQYXNzd29yZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10ZXh0IG5hdGl2ZS1rZXktYmluZGluZ3MgZ2l0aHViLUNyZWRlbnRpYWwtcGFzc3dvcmRcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucGFzc3dvcmR9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5kaWRDaGFuZ2VQYXNzd29yZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUYWJiYWJsZUJ1dHRvblxuICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2ctLWluc2V0QnV0dG9uIGdpdGh1Yi1DcmVkZW50aWFsLXZpc2liaWxpdHlcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVTaG93UGFzc3dvcmR9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuc2hvd1Bhc3N3b3JkID8gJ0hpZGUnIDogJ1Nob3cnfVxuICAgICAgICAgIDwvVGFiYmFibGVCdXR0b24+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIHtwYXJhbXMuaW5jbHVkZVJlbWVtYmVyICYmIChcbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsIGdpdGh1Yi1EaWFsb2dMYWJlbC0taG9yaXpvbnRhbCBnaXRodWItQ3JlZGVudGlhbC1yZW1lbWJlckxhYmVsXCI+XG4gICAgICAgICAgICA8VGFiYmFibGVJbnB1dFxuICAgICAgICAgICAgICB0YWJHcm91cD17dGhpcy50YWJHcm91cH1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LWNoZWNrYm94IGdpdGh1Yi1DcmVkZW50aWFsLXJlbWVtYmVyXCJcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5yZW1lbWJlcn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuZGlkQ2hhbmdlUmVtZW1iZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgUmVtZW1iZXJcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApfVxuXG4gICAgICA8L0RpYWxvZ1ZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudGFiR3JvdXAuYXV0b2ZvY3VzKCk7XG4gIH1cblxuICBhY2NlcHQgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmNhblNpZ25JbigpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMucHJvcHMucmVxdWVzdDtcbiAgICBjb25zdCBwYXJhbXMgPSByZXF1ZXN0LmdldFBhcmFtcygpO1xuXG4gICAgY29uc3QgcGF5bG9hZCA9IHtwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZH07XG5cbiAgICBpZiAocGFyYW1zLmluY2x1ZGVVc2VybmFtZSkge1xuICAgICAgcGF5bG9hZC51c2VybmFtZSA9IHRoaXMuc3RhdGUudXNlcm5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5pbmNsdWRlUmVtZW1iZXIpIHtcbiAgICAgIHBheWxvYWQucmVtZW1iZXIgPSB0aGlzLnN0YXRlLnJlbWVtYmVyO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0LmFjY2VwdChwYXlsb2FkKTtcbiAgfVxuXG4gIGRpZENoYW5nZVVzZXJuYW1lID0gZSA9PiB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogZS50YXJnZXQudmFsdWV9KTtcblxuICBkaWRDaGFuZ2VQYXNzd29yZCA9IGUgPT4gdGhpcy5zZXRTdGF0ZSh7cGFzc3dvcmQ6IGUudGFyZ2V0LnZhbHVlfSk7XG5cbiAgZGlkQ2hhbmdlUmVtZW1iZXIgPSBlID0+IHRoaXMuc2V0U3RhdGUoe3JlbWVtYmVyOiBlLnRhcmdldC5jaGVja2VkfSk7XG5cbiAgdG9nZ2xlU2hvd1Bhc3N3b3JkID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7c2hvd1Bhc3N3b3JkOiAhdGhpcy5zdGF0ZS5zaG93UGFzc3dvcmR9KTtcblxuICBjYW5TaWduSW4oKSB7XG4gICAgcmV0dXJuICF0aGlzLnByb3BzLnJlcXVlc3QuZ2V0UGFyYW1zKCkuaW5jbHVkZVVzZXJuYW1lIHx8IHRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoID4gMDtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQXlEO0FBQUE7QUFBQTtBQUFBO0FBRTFDLE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWdCNURDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsZ0NBb0ZOLE1BQU07TUFDYixJQUFJLENBQUMsSUFBSSxDQUFDQyxTQUFTLEVBQUUsRUFBRTtRQUNyQixPQUFPQyxPQUFPLENBQUNDLE9BQU8sRUFBRTtNQUMxQjtNQUVBLE1BQU1DLE9BQU8sR0FBRyxJQUFJLENBQUNKLEtBQUssQ0FBQ0ksT0FBTztNQUNsQyxNQUFNQyxNQUFNLEdBQUdELE9BQU8sQ0FBQ0UsU0FBUyxFQUFFO01BRWxDLE1BQU1DLE9BQU8sR0FBRztRQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDQyxLQUFLLENBQUNEO01BQVEsQ0FBQztNQUUvQyxJQUFJSCxNQUFNLENBQUNLLGVBQWUsRUFBRTtR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