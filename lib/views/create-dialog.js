"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRepository = createRepository;
exports.publishRepository = publishRepository;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _createDialogContainer = _interopRequireDefault(require("../containers/create-dialog-container"));

var _createRepository = _interopRequireDefault(require("../mutations/create-repository"));

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CreateDialog extends _react.default.Component {
  render() {
    return _react.default.createElement(_createDialogContainer.default, this.props);
  }

}

exports.default = CreateDialog;

_defineProperty(CreateDialog, "propTypes", {
  // Model
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  request: _propTypes.default.object.isRequired,
  error: _propTypes.default.instanceOf(Error),
  inProgress: _propTypes.default.bool.isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});

async function createRepository({
  ownerID,
  name,
  visibility,
  localPath,
  protocol,
  sourceRemoteName
}, {
  clone,
  relayEnvironment
}) {
  await _fsExtra.default.ensureDir(localPath, 0o755);
  const result = await (0, _createRepository.default)(relayEnvironment, {
    name,
    ownerID,
    visibility
  });
  const sourceURL = result.createRepository.repository[protocol === 'ssh' ? 'sshUrl' : 'url'];
  await clone(sourceURL, localPath, sourceRemoteName);
  (0, _reporterProxy.addEvent)('create-github-repository', {
    package: 'github'
  });
}

async function publishRepository({
  ownerID,
  name,
  visibility,
  protocol,
  sourceRemoteName
}, {
  repository,
  relayEnvironment
}) {
  let defaultBranchName, wasEmpty;

  if (repository.isEmpty()) {
    wasEmpty = true;
    await repository.init();
    defaultBranchName = 'master';
  } else {
    wasEmpty = false;
    const branchSet = await repository.getBranches();
    const branchNames = new Set(branchSet.getNames());

    if (branchNames.has('master')) {
      defaultBranchName = 'master';
    } else {
      const head = branchSet.getHeadBranch();

      if (head.isPresent()) {
        defaultBranchName = head.getName();
      }
    }
  }

  if (!defaultBranchName) {
    throw new Error('Unable to determine the desired default branch from the repository');
  }

  const result = await (0, _createRepository.default)(relayEnvironment, {
    name,
    ownerID,
    visibility
  });
  const sourceURL = result.createRepository.repository[protocol === 'ssh' ? 'sshUrl' : 'url'];
  const remote = await repository.addRemote(sourceRemoteName, sourceURL);

  if (wasEmpty) {
    (0, _reporterProxy.addEvent)('publish-github-repository', {
      package: 'github'
    });
  } else {
    await repository.push(defaultBranchName, {
      remote,
      setUpstream: true
    });
    (0, _reporterProxy.addEvent)('init-publish-github-repository', {
      package: 'github'
    });
  }
}