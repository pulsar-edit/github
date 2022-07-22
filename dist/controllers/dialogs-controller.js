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
    return /*#__PURE__*/_react.default.createElement(DialogComponent, this.getCommonProps());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9kaWFsb2dzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRElBTE9HX0NPTVBPTkVOVFMiLCJudWxsIiwiTnVsbERpYWxvZyIsImluaXQiLCJJbml0RGlhbG9nIiwiY2xvbmUiLCJDbG9uZURpYWxvZyIsImNyZWRlbnRpYWwiLCJDcmVkZW50aWFsRGlhbG9nIiwiaXNzdWVpc2giLCJPcGVuSXNzdWVpc2hEaWFsb2ciLCJjb21taXQiLCJPcGVuQ29tbWl0RGlhbG9nIiwiY3JlYXRlIiwiQ3JlYXRlRGlhbG9nIiwicHVibGlzaCIsIkRpYWxvZ3NDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZXF1ZXN0SW5Qcm9ncmVzcyIsInJlcXVlc3RFcnJvciIsInJlbmRlciIsIkRpYWxvZ0NvbXBvbmVudCIsInByb3BzIiwicmVxdWVzdCIsImlkZW50aWZpZXIiLCJnZXRDb21tb25Qcm9wcyIsImFjY2VwdCIsImlzUHJvZ3Jlc3NpbmciLCJhcmdzIiwic2V0U3RhdGUiLCJyZXN1bHQiLCJlcnJvciIsInVuZGVmaW5lZCIsIndyYXBwZWQiLCJ3cmFwRGlhbG9nUmVxdWVzdCIsImxvZ2luTW9kZWwiLCJpblByb2dyZXNzIiwic3RhdGUiLCJjdXJyZW50V2luZG93Iiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb25maWciLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJib29sIiwib2JqZWN0IiwiRGlhbG9nUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwicGFyYW1zIiwiY2FuY2VsIiwib25BY2NlcHQiLCJjYiIsIm9uUHJvZ3Jlc3NpbmdBY2NlcHQiLCJvbkNhbmNlbCIsImdldFBhcmFtcyIsIm9yaWdpbmFsIiwiZHVwIiwiZGlhbG9nUmVxdWVzdHMiLCJkaXJQYXRoIiwib3B0cyIsInNvdXJjZVVSTCIsImRlc3RQYXRoIiwiaW5jbHVkZVVz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QXZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBJbml0RGlhbG9nIGZyb20gJy4uL3ZpZXdzL2luaXQtZGlhbG9nJztcbmltcG9ydCBDbG9uZURpYWxvZyBmcm9tICcuLi92aWV3cy9jbG9uZS1kaWFsb2cnO1xuaW1wb3J0IENyZWRlbnRpYWxEaWFsb2cgZnJvbSAnLi4vdmlld3MvY3JlZGVudGlhbC1kaWFsb2cnO1xuaW1wb3J0IE9wZW5Jc3N1ZWlzaERpYWxvZyBmcm9tICcuLi92aWV3cy9vcGVuLWlzc3VlaXNoLWRpYWxvZyc7XG5pbXBvcnQgT3BlbkNvbW1pdERpYWxvZyBmcm9tICcuLi92aWV3cy9vcGVuLWNvbW1pdC1kaWFsb2cnO1xuaW1wb3J0IENyZWF0ZURpYWxvZyBmcm9tICcuLi92aWV3cy9jcmVhdGUtZGlhbG9nJztcbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuY29uc3QgRElBTE9HX0NPTVBPTkVOVFMgPSB7XG4gIG51bGw6IE51bGxEaWFsb2csXG4gIGluaXQ6IEluaXREaWFsb2csXG4gIGNsb25lOiBDbG9uZURpYWxvZyxcbiAgY3JlZGVudGlhbDogQ3JlZGVudGlhbERpYWxvZyxcbiAgaXNzdWVpc2g6IE9wZW5Jc3N1ZWlzaERpYWxvZyxcbiAgY29tbWl0OiBPcGVuQ29tbWl0RGlhbG9nLFxuICBjcmVhdGU6IENyZWF0ZURpYWxvZyxcbiAgcHVibGlzaDogQ3JlYXRlRGlhbG9nLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nc0NvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkZW50aWZpZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlzUHJvZ3Jlc3Npbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjdXJyZW50V2luZG93OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICByZXF1ZXN0SW5Qcm9ncmVzczogbnVsbCxcbiAgICByZXF1ZXN0RXJyb3I6IFtudWxsLCBudWxsXSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBEaWFsb2dDb21wb25lbnQgPSBESUFMT0dfQ09NUE9ORU5UU1t0aGlzLnByb3BzLnJlcXVlc3QuaWRlbnRpZmllcl07XG4gICAgcmV0dXJuIDxEaWFsb2dDb21wb25lbnQgey4uLnRoaXMuZ2V0Q29tbW9uUHJvcHMoKX0gLz47XG4gIH1cblxuICBnZXRDb21tb25Qcm9wcygpIHtcbiAgICBjb25zdCB7cmVxdWVzdH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGFjY2VwdCA9IHJlcXVlc3QuaXNQcm9ncmVzc2luZ1xuICAgICAgPyBhc3luYyAoLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0RXJyb3I6IFtudWxsLCBudWxsXSwgcmVxdWVzdEluUHJvZ3Jlc3M6IHJlcXVlc3R9KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXF1ZXN0LmFjY2VwdCguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0SW5Qcm9ncmVzczogbnVsbH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVxdWVzdEVycm9yOiBbcmVxdWVzdCwgZXJyb3JdLCByZXF1ZXN0SW5Qcm9ncmVzczogbnVsbH0pO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gOiAoLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0RXJyb3I6IFtudWxsLCBudWxsXX0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1ZXN0LmFjY2VwdCguLi5hcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0RXJyb3I6IFtyZXF1ZXN0LCBlcnJvcl19KTtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIGNvbnN0IHdyYXBwZWQgPSB3cmFwRGlhbG9nUmVxdWVzdChyZXF1ZXN0LCB7YWNjZXB0fSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9naW5Nb2RlbDogdGhpcy5wcm9wcy5sb2dpbk1vZGVsLFxuICAgICAgcmVxdWVzdDogd3JhcHBlZCxcbiAgICAgIGluUHJvZ3Jlc3M6IHRoaXMuc3RhdGUucmVxdWVzdEluUHJvZ3Jlc3MgPT09IHJlcXVlc3QsXG4gICAgICBjdXJyZW50V2luZG93OiB0aGlzLnByb3BzLmN1cnJlbnRXaW5kb3csXG4gICAgICB3b3Jrc3BhY2U6IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgICAgY29tbWFuZHM6IHRoaXMucHJvcHMuY29tbWFuZHMsXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLFxuICAgICAgZXJyb3I6IHRoaXMuc3RhdGUucmVxdWVzdEVycm9yWzBdID09PSByZXF1ZXN0ID8gdGhpcy5zdGF0ZS5yZXF1ZXN0RXJyb3JbMV0gOiBudWxsLFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gTnVsbERpYWxvZygpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmNsYXNzIERpYWxvZ1JlcXVlc3Qge1xuICBjb25zdHJ1Y3RvcihpZGVudGlmaWVyLCBwYXJhbXMgPSB7fSkge1xuICAgIHRoaXMuaWRlbnRpZmllciA9IGlkZW50aWZpZXI7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgdGhpcy5pc1Byb2dyZXNzaW5nID0gZmFsc2U7XG4gICAgdGhpcy5hY2NlcHQgPSAoKSA9PiB7fTtcbiAgICB0aGlzLmNhbmNlbCA9ICgpID0+IHt9O1xuICB9XG5cbiAgb25BY2NlcHQoY2IpIHtcbiAgICB0aGlzLmFjY2VwdCA9IGNiO1xuICB9XG5cbiAgb25Qcm9ncmVzc2luZ0FjY2VwdChjYikge1xuICAgIHRoaXMuaXNQcm9ncmVzc2luZyA9IHRydWU7XG4gICAgdGhpcy5vbkFjY2VwdChjYik7XG4gIH1cblxuICBvbkNhbmNlbChjYikge1xuICAgIHRoaXMuY2FuY2VsID0gY2I7XG4gIH1cblxuICBnZXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBEaWFsb2dSZXF1ZXN0KG9yaWdpbmFsLCB7YWNjZXB0fSkge1xuICBjb25zdCBkdXAgPSBuZXcgRGlhbG9nUmVxdWVzdChvcmlnaW5hbC5pZGVudGlmaWVyLCBvcmlnaW5hbC5wYXJhbXMpO1xuICBkdXAuaXNQcm9ncmVzc2luZyA9IG9yaWdpbmFsLmlzUHJvZ3Jlc3Npbmc7XG4gIGR1cC5vbkFjY2VwdChhY2NlcHQpO1xuICBkdXAub25DYW5jZWwob3JpZ2luYWwuY2FuY2VsKTtcbiAgcmV0dXJuIGR1cDtcbn1cblxuZXhwb3J0IGNvbnN0IGRpYWxvZ1JlcXVlc3RzID0ge1xuICBudWxsOiB7XG4gICAgaWRlbnRpZmllcjogJ251bGwnLFxuICAgIGlzUHJvZ3Jlc3Npbmc6IGZhbHNlLFxuICAgIHBhcmFtczoge30sXG4gICAgYWNjZXB0OiAoKSA9PiB7fSxcbiAgICBjYW5jZWw6ICgpID0+IHt9LFxuICB9LFxuXG4gIGluaXQoe2RpclBhdGh9KSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdpbml0Jywge2RpclBhdGh9KTtcbiAgfSxcblxuICBjbG9uZShvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdjbG9uZScsIHtcbiAgICAgIHNvdXJjZVVSTDogJycsXG4gICAgICBkZXN0UGF0aDogJycsXG4gICAgICAuLi5vcHRzLFxuICAgIH0pO1xuICB9LFxuXG4gIGNyZWRlbnRpYWwob3B0cykge1xuICAgIHJldHVybiBuZXcgRGlhbG9nUmVxdWVzdCgnY3JlZGVudGlhbCcsIHtcbiAgICAgIGluY2x1ZGVVc2VybmFtZTogZmFsc2UsXG4gICAgICBpbmNsdWRlUmVtZW1iZXI6IGZhbHNlLFxuICAgICAgcHJvbXB0OiAnUGxlYXNlIGF1dGhlbnRpY2F0ZScsXG4gICAgICAuLi5vcHRzLFxuICAgIH0pO1xuICB9LFxuXG4gIGlzc3VlaXNoKCkge1xuICAgIHJldHVybiBuZXcgRGlhbG9nUmVxdWVzdCgnaXNzdWVpc2gnKTtcbiAgfSxcblxuICBjb21taXQoKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdjb21taXQnKTtcbiAgfSxcblxuICBjcmVhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEaWFsb2dSZXF1ZXN0KCdjcmVhdGUnKTtcbiAgfSxcblxuICBwdWJsaXNoKHtsb2NhbERpcn0pIHtcbiAgICByZXR1cm4gbmV3IERpYWxvZ1JlcXVlc3QoJ3B1Ymxpc2gnLCB7bG9jYWxEaXJ9KTtcbiAgfSxcbn07XG4iXX0=