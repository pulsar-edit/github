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