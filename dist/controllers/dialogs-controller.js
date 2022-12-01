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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9kaWFsb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRElBTE9HX0NPTVBPTkVOVFMiLCJudWxsIiwiTnVsbERpYWxvZyIsImluaXQiLCJJbml0RGlhbG9nIiwiY2xvbmUiLCJDbG9uZURpYWxvZyIsImNyZWRlbnRpYWwiLCJDcmVkZW50aWFsRGlhbG9nIiwiaXNzdWVpc2giLCJPcGVuSXNzdWVpc2hEaWFsb2ciLCJjb21taXQiLCJPcGVuQ29tbWl0RGlhbG9nIiwiY3JlYXRlIiwiQ3JlYXRlRGlhbG9nIiwicHVibGlzaCIsIkRpYWxvZ3NDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZXF1ZXN0SW5Qcm9ncmVzcyIsInJlcXVlc3RFcnJvciIsInJlbmRlciIsIkRpYWxvZ0NvbXBvbmVudCIsInByb3BzIiwicmVxdWVzdCIsImlkZW50aWZpZXIiLCJnZXRDb21tb25Qcm9wcyIsImFjY2VwdCIsImlzUHJvZ3Jlc3NpbmciLCJhcmdzIiwic2V0U3RhdGUiLCJyZXN1bHQiLCJlcnJvciIsInVuZGVmaW5lZCIsIndyYXBwZWQiLCJ3cmFwRGlhbG9nUmVxdWVzdCIsImxvZ2luTW9kZWwiLCJpblByb2dyZXNzIiwic3RhdGUiLCJjdXJyZW50V2luZG93Iiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb25maWciLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJib29sIiwib2JqZWN0IiwiRGlhbG9nUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwicGFyYW1zIiwiY2FuY2VsIiwib25BY2NlcHQiLCJjYiIsIm9uUHJvZ3Jlc3NpbmdBY2NlcHQiLCJvbkNhbmNlbCIsImdldFBhcmFtcyIsIm9yaWdpbmFsIiwiZHVwIiwiZGlhbG9nUmVxdWVzdHMiLCJkaXJQYXRoIiwib3B0cyIsInNvdXJjZVVSTCIsImRlc3RQYXRoIiwiaW5jbHVkZVVz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dkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IEluaXREaWFsb2cgZnJvbSAnLi4vdmlld3MvaW5pdC1kaWFsb2cnO1xuaW1wb3J0IENsb25lRGlhbG9nIGZyb20gJy4uL3ZpZXdzL2Nsb25lLWRpYWxvZyc7XG5pbXBvcnQgQ3JlZGVudGlhbERpYWxvZyBmcm9tICcuLi92aWV3cy9jcmVkZW50aWFsLWRpYWxvZyc7XG5pbXBvcnQgT3Blbklzc3VlaXNoRGlhbG9nIGZyb20gJy4uL3ZpZXdzL29wZW4taXNzdWVpc2gtZGlhbG9nJztcbmltcG9ydCBPcGVuQ29tbWl0RGlhbG9nIGZyb20gJy4uL3ZpZXdzL29wZW4tY29tbWl0LWRpYWxvZyc7XG5pbXBvcnQgQ3JlYXRlRGlhbG9nIGZyb20gJy4uL3ZpZXdzL2NyZWF0ZS1kaWFsb2cnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5jb25zdCBESUFMT0dfQ09NUE9ORU5UUyA9IHtcbiAgbnVsbDogTnVsbERpYWxvZyxcbiAgaW5pdDogSW5pdERpYWxvZyxcbiAgY2xvbmU6IENsb25lRGlhbG9nLFxuICBjcmVkZW50aWFsOiBDcmVkZW50aWFsRGlhbG9nLFxuICBpc3N1ZWlzaDogT3Blbklzc3VlaXNoRGlhbG9nLFxuICBjb21taXQ6IE9wZW5Db21taXREaWFsb2csXG4gIGNyZWF0ZTogQ3JlYXRlRGlhbG9nLFxuICBwdWJsaXNoOiBDcmVhdGVEaWFsb2csXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2dzQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWRlbnRpZmllcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNQcm9ncmVzc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIHJlcXVlc3RJblByb2dyZXNzOiBudWxsLFxuICAgIHJlcXVlc3RFcnJvcjogW251bGwsIG51bGxdLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IERpYWxvZ0NvbXBvbmVudCA9IERJQUxPR19DT01QT05FTlRTW3RoaXMucHJvcHMucmVxdWVzdC5pZGVudGlmaWVyXTtcbiAgICByZXR1cm4gPERpYWxvZ0NvbXBvbmVudCB7Li4udGhpcy5nZXRDb21tb25Qcm9wcygpfSAvPjtcbiAgfVxuXG4gIGdldENvbW1vblByb3BzKCkge1xuICAgIGNvbnN0IHtyZXF1ZXN0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgYWNjZXB0ID0gcmVxdWVzdC5pc1Byb2dyZXNzaW5nXG4gICAgICA/IGFzeW5jICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW251bGwsIG51bGxdLCByZXF1ZXN0SW5Qcm9ncmVzczogcmVxdWVzdH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcXVlc3QuYWNjZXB0KC4uLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RJblByb2dyZXNzOiBudWxsfSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0RXJyb3I6IFtyZXF1ZXN0LCBlcnJvcl0sIHJlcXVlc3RJblByb2dyZXNzOiBudWxsfSk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSA6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW251bGwsIG51bGxdfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3QuYWNjZXB0KC4uLmFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JlcXVlc3RFcnJvcjogW3JlcXVlc3QsIGVycm9yXX0pO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY29uc3Qgd3JhcHBlZCA9IHdyYXBEaWFsb2dSZXF1ZXN0KHJlcXVlc3QsIHthY2NlcHR9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBsb2dpbk1vZGVsOiB0aGlzLnByb3BzLmxvZ2luTW9kZWwsXG4gICAgICByZXF1ZXN0OiB3cmFwcGVkLFxuICAgICAgaW5Qcm9ncmVzczogdGhpcy5zdGF0ZS5yZXF1ZXN0SW5Qcm9ncmVzcyA9PT0gcmVxdWVzdCxcbiAgICAgIGN1cnJlbnRXaW5kb3c6IHRoaXMucHJvcHMuY3VycmVudFdpbmRvdyxcbiAgICAgIHdvcmtzcGFjZTogdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgICBjb21tYW5kczogdGhpcy5wcm9wcy5jb21tYW5kcyxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcsXG4gICAgICBlcnJvcjogdGhpcy5zdGF0ZS5yZXF1ZXN0RXJyb3JbMF0gPT09IHJlcXVlc3QgPyB0aGlzLnN0YXRlLnJlcXVlc3RFcnJvclsxXSA6IG51bGwsXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBOdWxsRGlhbG9nKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuY2xhc3MgRGlhbG9nUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGlkZW50aWZpZXIsIHBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5pZGVudGlmaWVyID0gaWRlbnRpZmllcjtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICB0aGlzLmlzUHJvZ3Jlc3NpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmFjY2VwdCA9ICgpID0+IHt9O1xuICAgIHRoaXMuY2FuY2VsID0gKCkgPT4ge307XG4gIH1cblxuICBvbkFjY2VwdChjYikge1xuICAgIHRoaXMuYWNjZXB0ID0gY2I7XG4gIH1cblxuICBvblByb2dyZXNzaW5nQWNjZXB0KGNiKSB7XG4gICAgdGhpcy5pc1Byb2dyZXNzaW5nID0gdHJ1ZTtcbiAgICB0aGlzLm9uQWNjZXB0KGNiKTtcbiAgfVxuXG4gIG9uQ2FuY2VsKGNiKSB7XG4gICAgdGhpcy5jYW5jZWwgPSBjYjtcbiAgfVxuXG4gIGdldFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JhcERpYWxvZ1JlcXVlc3Qob3JpZ2luYWwsIHthY2NlcHR9KSB7XG4gIGNvbnN0IGR1cCA9IG5ldyBEaWFsb2dSZXF1ZXN0KG9yaWdpbmFsLmlkZW50aWZpZXIsIG9yaWdpbmFsLnBhcmFtcyk7XG4gIGR1cC5pc1Byb2dyZXNzaW5nID0gb3JpZ2luYWwuaXNQcm9ncmVzc2luZztcbiAgZHVwLm9uQWNjZXB0KGFjY2VwdCk7XG4gIGR1cC5vbkNhbmNlbChvcmlnaW5hbC5jYW5jZWwpO1xuICByZXR1cm4gZHVwO1xufVxuXG5leHBvcnQgY29uc3QgZGlhbG9nUmVxdWVzdHMgPSB7XG4gIG51bGw6IHtcbiAgICBpZGVudGlmaWVyOiAnbnVsbCcsXG4gICAgaXNQcm9ncmVzc2luZzogZmFsc2UsXG4gICAgcGFyYW1zOiB7fSxcbiAgICBhY2NlcHQ6ICgpID0+IHt9LFxuICAgIGNhbmNlbDogKCkgPT4ge30sXG4gIH0sXG5cbiAgaW5pdCh7ZGlyUGF0aH0pIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2luaXQnLCB7ZGlyUGF0aH0pO1xuICB9LFxuXG4gIGNsb25lKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2Nsb25lJywge1xuICAgICAgc291cmNlVVJMOiAnJyxcbiAgICAgIGRlc3RQYXRoOiAnJyxcbiAgICAgIC4uLm9wdHMsXG4gICAgfSk7XG4gIH0sXG5cbiAgY3JlZGVudGlhbChvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdjcmVkZW50aWFsJywge1xuICAgICAgaW5jbHVkZVVzZXJuYW1lOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVSZW1lbWJlcjogZmFsc2UsXG4gICAgICBwcm9tcHQ6ICdQbGVhc2UgYXV0aGVudGljYXRlJyxcbiAgICAgIC4uLm9wdHMsXG4gICAgfSk7XG4gIH0sXG5cbiAgaXNzdWVpc2goKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdpc3N1ZWlzaCcpO1xuICB9LFxuXG4gIGNvbW1pdCgpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2NvbW1pdCcpO1xuICB9LFxuXG4gIGNyZWF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ2NyZWF0ZScpO1xuICB9LFxuXG4gIHB1Ymxpc2goe2xvY2FsRGlyfSkge1xuICAgIHJldHVybiBuZXcgRGlhbG9nUmVxdWVzdCgncHVibGlzaCcsIHtsb2NhbERpcn0pO1xuICB9LFxufTtcbiJdfQ==