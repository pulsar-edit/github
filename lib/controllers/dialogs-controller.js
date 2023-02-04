"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dialogRequests = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _initDialog = _interopRequireDefault(require("../views/init-dialog"));
var _cloneDialog = _interopRequireDefault(require("../views/clone-dialog"));
var _credentialDialog = _interopRequireDefault(require("../views/credential-dialog"));
var _openIssueishDialog = _interopRequireDefault(require("../views/open-issueish-dialog"));
var _openCommitDialog = _interopRequireDefault(require("../views/open-commit-dialog"));
var _createDialog = _interopRequireDefault(require("../views/create-dialog"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const DIALOG_COMPONENTS = {
  null: NullDialog,
  init: _initDialog.default,
  clone: _cloneDialog.default,
  credential: _credentialDialog.default,
  issueish: _openIssueishDialog.default,
  commit: _openCommitDialog.default,
  create: _createDialog.default,
  publish: _createDialog.default
};
class DialogsController extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      requestInProgress: null,
      requestError: [null, null]
    });
  }
  render() {
    const DialogComponent = DIALOG_COMPONENTS[this.props.request.identifier];
    return _react.default.createElement(DialogComponent, this.getCommonProps());
  }
  getCommonProps() {
    const {
      request
    } = this.props;
    const accept = request.isProgressing ? async (...args) => {
      this.setState({
        requestError: [null, null],
        requestInProgress: request
      });
      try {
        const result = await request.accept(...args);
        this.setState({
          requestInProgress: null
        });
        return result;
      } catch (error) {
        this.setState({
          requestError: [request, error],
          requestInProgress: null
        });
        return undefined;
      }
    } : (...args) => {
      this.setState({
        requestError: [null, null]
      });
      try {
        return request.accept(...args);
      } catch (error) {
        this.setState({
          requestError: [request, error]
        });
        return undefined;
      }
    };
    const wrapped = wrapDialogRequest(request, {
      accept
    });
    return {
      loginModel: this.props.loginModel,
      request: wrapped,
      inProgress: this.state.requestInProgress === request,
      currentWindow: this.props.currentWindow,
      workspace: this.props.workspace,
      commands: this.props.commands,
      config: this.props.config,
      error: this.state.requestError[0] === request ? this.state.requestError[1] : null
    };
  }
}
exports.default = DialogsController;
_defineProperty(DialogsController, "propTypes", {
  // Model
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  request: _propTypes.default.shape({
    identifier: _propTypes.default.string.isRequired,
    isProgressing: _propTypes.default.bool.isRequired
  }).isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});
function NullDialog() {
  return null;
}
class DialogRequest {
  constructor(identifier, params = {}) {
    this.identifier = identifier;
    this.params = params;
    this.isProgressing = false;
    this.accept = () => {};
    this.cancel = () => {};
  }
  onAccept(cb) {
    this.accept = cb;
  }
  onProgressingAccept(cb) {
    this.isProgressing = true;
    this.onAccept(cb);
  }
  onCancel(cb) {
    this.cancel = cb;
  }
  getParams() {
    return this.params;
  }
}
function wrapDialogRequest(original, {
  accept
}) {
  const dup = new DialogRequest(original.identifier, original.params);
  dup.isProgressing = original.isProgressing;
  dup.onAccept(accept);
  dup.onCancel(original.cancel);
  return dup;
}
const dialogRequests = {
  null: {
    identifier: 'null',
    isProgressing: false,
    params: {},
    accept: () => {},
    cancel: () => {}
  },
  init({
    dirPath
  }) {
    return new DialogRequest('init', {
      dirPath
    });
  },
  clone(opts) {
    return new DialogRequest('clone', _objectSpread({
      sourceURL: '',
      destPath: ''
    }, opts));
  },
  credential(opts) {
    return new DialogRequest('credential', _objectSpread({
      includeUsername: false,
      includeRemember: false,
      prompt: 'Please authenticate'
    }, opts));
  },
  issueish() {
    return new DialogRequest('issueish');
  },
  commit() {
    return new DialogRequest('commit');
  },
  create() {
    return new DialogRequest('create');
  },
  publish({
    localDir
  }) {
    return new DialogRequest('publish', {
      localDir
    });
  }
};
exports.dialogRequests = dialogRequests;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJESUFMT0dfQ09NUE9ORU5UUyIsIm51bGwiLCJOdWxsRGlhbG9nIiwiaW5pdCIsIkluaXREaWFsb2ciLCJjbG9uZSIsIkNsb25lRGlhbG9nIiwiY3JlZGVudGlhbCIsIkNyZWRlbnRpYWxEaWFsb2ciLCJpc3N1ZWlzaCIsIk9wZW5Jc3N1ZWlzaERpYWxvZyIsImNvbW1pdCIsIk9wZW5Db21taXREaWFsb2ciLCJjcmVhdGUiLCJDcmVhdGVEaWFsb2ciLCJwdWJsaXNoIiwiRGlhbG9nc0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlcXVlc3RJblByb2dyZXNzIiwicmVxdWVzdEVycm9yIiwicmVuZGVyIiwiRGlhbG9nQ29tcG9uZW50IiwicHJvcHMiLCJyZXF1ZXN0IiwiaWRlbnRpZmllciIsImdldENvbW1vblByb3BzIiwiYWNjZXB0IiwiaXNQcm9ncmVzc2luZyIsImFyZ3MiLCJzZXRTdGF0ZSIsInJlc3VsdCIsImVycm9yIiwidW5kZWZpbmVkIiwid3JhcHBlZCIsIndyYXBEaWFsb2dSZXF1ZXN0IiwibG9naW5Nb2RlbCIsImluUHJvZ3Jlc3MiLCJzdGF0ZSIsImN1cnJlbnRXaW5kb3ciLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImNvbmZpZyIsIkdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImJvb2wiLCJvYmplY3QiLCJEaWFsb2dSZXF1ZXN0IiwiY29uc3RydWN0b3IiLCJwYXJhbXMiLCJjYW5jZWwiLCJvbkFjY2VwdCIsImNiIiwib25Qcm9ncmVzc2luZ0FjY2VwdCIsIm9uQ2FuY2VsIiwiZ2V0UGFyYW1zIiwib3JpZ2luYWwiLCJkdXAiLCJkaWFsb2dSZXF1ZXN0cyIsImRpclBhdGgiLCJvcHRzIiwic291cmNlVVJMIiwiZGVzdFBhdGgiLCJpbmNsdWRlVXNlcm5hbWUiLCJpbmNsdWRlUmVtZW1iZXIiLCJwcm9tcHQiLCJsb2NhbERpciJdLCJzb3VyY2VzIjpbImRpYWxvZ3MtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IEluaXREaWFsb2cgZnJvbSAnLi4vdmlld3MvaW5pdC1kaWFsb2cnO1xuaW1wb3J0IENsb25lRGlhbG9nIGZyb20gJy4uL3ZpZXdzL2Nsb25lLWRpYWxvZyc7XG5pbXBvcnQgQ3JlZGVudGlhbERpYWxvZyBmcm9tICcuLi92aWV3cy9jcmVkZW50aWFsLWRpYWxvZyc7XG5pbXBvcnQgT3Blbklzc3VlaXNoRGlhbG9nIGZyb20gJy4uL3ZpZXdzL29wZW4taXNzdWVpc2gtZGlhbG9nJztcbmltcG9ydCBPcGVuQ29tbWl0RGlhbG9nIGZyb20gJy4uL3ZpZXdzL29wZW4tY29tbWl0LWRpYWxvZyc7XG5pbXBvcnQgQ3JlYXRlRGlhbG9nIGZyb20gJy4uL3ZpZXdzL2NyZWF0ZS1kaWFsb2cnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5jb25zdCBESUFMT0dfQ09NUE9ORU5UUyA9IHtcbiAgbnVsbDogTnVsbERpYWxvZyxcbiAgaW5pdDogSW5pdERpYWxvZyxcbiAgY2xvbmU6IENsb25lRGlhbG9nLFxuICBjcmVkZW50aWFsOiBDcmVkZW50aWFsRGlhbG9nLFxuICBpc3N1ZWlzaDogT3Blbklzc3VlaXNoRGlhbG9nLFxuICBjb21taXQ6IE9wZW5Db21taXREaWFsb2csXG4gIGNyZWF0ZTogQ3JlYXRlRGlhbG9nLFxuICBwdWJsaXNoOiBDcmVhdGVEaWFsb2csXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2dzQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWRlbnRpZmllcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNQcm9ncmVzc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIHJlcXVlc3RJblByb2dyZXNzOiBudWxsLFxuICAgIHJlcXVlc3RFcnJvcjogW251bGwsIG51bGxdLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IERpYWxvZ0NvbXBvbmVudCA9IERJQUxPR19DT01QT05FTlRTW3RoaXMucHJvcHMucmVxdWVzdC5pZGVudGlmaWVyXTtcbiAgICByZXR1cm4gPERpYWxvZ0NvbXBvbmVudCB7Li4udGhpcy5nZXRDb21tb25Qcm9wcygpfSAvPjtcbiAgfVxuXG4gIGdldENvbW1vblByb3BzKCkge1xuICAgIGNvbnN0IHtyZXF1ZXN0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgYWNjZXB0ID0gcmVxdWVzdC5pc1Byb2dyZXNzaW5nXG4gICAgICA/IGFzeW5jICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW251bGwsIG51bGxdLCByZXF1ZXN0SW5Qcm9ncmVzczogcmVxdWVzdH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcXVlc3QuYWNjZXB0KC4uLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RJblByb2dyZXNzOiBudWxsfSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0RXJyb3I6IFtyZXF1ZXN0LCBlcnJvcl0sIHJlcXVlc3RJblByb2dyZXNzOiBudWxsfSk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSA6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW251bGwsIG51bGxdfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3QuYWNjZXB0KC4uLmFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW3JlcXVlc3QsIGVycm9yXX0pO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY29uc3Qgd3JhcHBlZCA9IHdyYXBEaWFsb2dSZXF1ZXN0KHJlcXVlc3QsIHthY2NlcHR9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBsb2dpbk1vZGVsOiB0aGlzLnByb3BzLmxvZ2luTW9kZWwsXG4gICAgICByZXF1ZXN0OiB3cmFwcGVkLFxuICAgICAgaW5Qcm9ncmVzczogdGhpcy5zdGF0ZS5yZXF1ZXN0SW5Qcm9ncmVzcyA9PT0gcmVxdWVzdCxcbiAgICAgIGN1cnJlbnRXaW5kb3c6IHRoaXMucHJvcHMuY3VycmVudFdpbmRvdyxcbiAgICAgIHdvcmtzcGFjZTogdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgICBjb21tYW5kczogdGhpcy5wcm9wcy5jb21tYW5kcyxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcsXG4gICAgICBlcnJvcjogdGhpcy5zdGF0ZS5yZXF1ZXN0RXJyb3JbMF0gPT09IHJlcXVlc3QgPyB0aGlzLnN0YXRlLnJlcXVlc3RFcnJvclsxXSA6IG51bGwsXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBOdWxsRGlhbG9nKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuY2xhc3MgRGlhbG9nUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGlkZW50aWZpZXIsIHBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5pZGVudGlmaWVyID0gaWRlbnRpZmllcjtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICB0aGlzLmlzUHJvZ3Jlc3NpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmFjY2VwdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuY2FuY2VsID0gKCkgPT4ge307XG4gIH1cblxuICBvbkFjY2VwdChjYikge1xuICAgIHRoaXMuYWNjZXB0ID0gY2I7XG4gIH1cblxuICBvblByb2dyZXNzaW5nQWNjZXB0KGNiKSB7XG4gICAgdGhpcy5pc1Byb2dyZXNzaW5nID0gdHJ1ZTtcbiAgICB0aGlzLm9uQWNjZXB0KGNiKTtcbiAgfVxuXG4gIG9uQ2FuY2VsKGNiKSB7XG4gICAgdGhpcy5jYW5jZWwgPSBjYjtcbiAgfVxuXG4gIGdldFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JhcERpYWxvZ1JlcXVlc3Qob3JpZ2luYWwsIHthY2NlcHR9KSB7XG4gIGNvbnN0IGR1cCA9IG5ldyBEaWFsb2dSZXF1ZXN0KG9yaWdpbmFsLmlkZW50aWZpZXIsIG9yaWdpbmFsLnBhcmFtcyk7XG4gIGR1cC5pc1Byb2dyZXNzaW5nID0gb3JpZ2luYWwuaXNQcm9ncmVzc2luZztcbiAgZHVwLm9uQWNjZXB0KGFjY2VwdCk7XG4gIGR1cC5vbkNhbmNlbChvcmlnaW5hbC5jYW5jZWwpO1xuICByZXR1cm4gZHVwO1xufVxuXG5leHBvcnQgY29uc3QgZGlhbG9nUmVxdWVzdHMgPSB7XG4gIG51bGw6IHtcbiAgICBpZGVudGlmaWVyOiAnbnVsbCcsXG4gICAgaXNQcm9ncmVzc2luZzogZmFsc2UsXG4gICAgcGFyYW1zOiB7fSxcbiAgICBhY2NlcHQ6ICgpID0+IHt9LFxuICAgIGNhbmNlbDogKCkgPT4ge30sXG4gIH0sXG5cbiAgaW5pdCh7ZGlyUGF0aH0pIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2luaXQnLCB7ZGlyUGF0aH0pO1xuICB9LFxuXG4gIGNsb25lKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2Nsb25lJywge1xuICAgICAgc291cmNlVVJMOiAnJyxcbiAgICAgIGRlc3RQYXRoOiAnJyxcbiAgICAgIC4uLm9wdHMsXG4gICAgfSk7XG4gIH0sXG5cbiAgY3JlZGVudGlhbChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdjcmVkZW50aWFsJywge1xuICAgICAgaW5jbHVkZVVzZXJuYW1lOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVSZW1lbWJlcjogZmFsc2UsXG4gICAgICBwcm9tcHQ6ICdQbGVhc2UgYXV0aGVudGljYXRlJyxcbiAgICAgIC4uLm9wdHMsXG4gICAgfSk7XG4gIH0sXG5cbiAgaXNzdWVpc2goKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdpc3N1ZWlzaCcpO1xuICB9LFxuXG4gIGNvbW1pdCgpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2NvbW1pdCcpO1xuICB9LFxuXG4gIGNyZWF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2NyZWF0ZScpO1xuICB9LFxuXG4gIHB1Ymxpc2goe2xvY2FsRGlyfSkge1xuICAgIHJldHVybiBuZXcgRGlhbG9nUmVxdWVzdCgncHVibGlzaCcsIHtsb2NhbERpcn0pO1xuICB9LFxufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQXVEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV2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