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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDcmVhdGVEaWFsb2ciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwibG9naW5Nb2RlbCIsIkdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJyZXF1ZXN0IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiZXJyb3IiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJpblByb2dyZXNzIiwiYm9vbCIsImN1cnJlbnRXaW5kb3ciLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImNvbmZpZyIsImNyZWF0ZVJlcG9zaXRvcnkiLCJvd25lcklEIiwibmFtZSIsInZpc2liaWxpdHkiLCJsb2NhbFBhdGgiLCJwcm90b2NvbCIsInNvdXJjZVJlbW90ZU5hbWUiLCJjbG9uZSIsInJlbGF5RW52aXJvbm1lbnQiLCJmcyIsImVuc3VyZURpciIsInJlc3VsdCIsImNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvbiIsInNvdXJjZVVSTCIsInJlcG9zaXRvcnkiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJwdWJsaXNoUmVwb3NpdG9yeSIsImRlZmF1bHRCcmFuY2hOYW1lIiwid2FzRW1wdHkiLCJpc0VtcHR5IiwiaW5pdCIsImJyYW5jaFNldCIsImdldEJyYW5jaGVzIiwiYnJhbmNoTmFtZXMiLCJTZXQiLCJnZXROYW1lcyIsImhhcyIsImhlYWQiLCJnZXRIZWFkQnJhbmNoIiwiaXNQcmVzZW50IiwiZ2V0TmFtZSIsInJlbW90ZSIsImFkZFJlbW90ZSIsInB1c2giLCJzZXRVcHN0cmVhbSJdLCJzb3VyY2VzIjpbImNyZWF0ZS1kaWFsb2cuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgQ3JlYXRlRGlhbG9nQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvY3JlYXRlLWRpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvY3JlYXRlLXJlcG9zaXRvcnknO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG4gICAgaW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjdXJyZW50V2luZG93OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPENyZWF0ZURpYWxvZ0NvbnRhaW5lciB7Li4udGhpcy5wcm9wc30gLz47XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVJlcG9zaXRvcnkoXG4gIHtvd25lcklELCBuYW1lLCB2aXNpYmlsaXR5LCBsb2NhbFBhdGgsIHByb3RvY29sLCBzb3VyY2VSZW1vdGVOYW1lfSxcbiAge2Nsb25lLCByZWxheUVudmlyb25tZW50fSxcbikge1xuICBhd2FpdCBmcy5lbnN1cmVEaXIobG9jYWxQYXRoLCAwbzc1NSk7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvbihyZWxheUVudmlyb25tZW50LCB7bmFtZSwgb3duZXJJRCwgdmlzaWJpbGl0eX0pO1xuICBjb25zdCBzb3VyY2VVUkwgPSByZXN1bHQuY3JlYXRlUmVwb3NpdG9yeS5yZXBvc2l0b3J5W3Byb3RvY29sID09PSAnc3NoJyA/ICdzc2hVcmwnIDogJ3VybCddO1xuICBhd2FpdCBjbG9uZShzb3VyY2VVUkwsIGxvY2FsUGF0aCwgc291cmNlUmVtb3RlTmFtZSk7XG4gIGFkZEV2ZW50KCdjcmVhdGUtZ2l0aHViLXJlcG9zaXRvcnknLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1Ymxpc2hSZXBvc2l0b3J5KFxuICB7b3duZXJJRCwgbmFtZSwgdmlzaWJpbGl0eSwgcHJvdG9jb2wsIHNvdXJjZVJlbW90ZU5hbWV9LFxuICB7cmVwb3NpdG9yeSwgcmVsYXlFbnZpcm9ubWVudH0sXG4pIHtcbiAgbGV0IGRlZmF1bHRCcmFuY2hOYW1lLCB3YXNFbXB0eTtcbiAgaWYgKHJlcG9zaXRvcnkuaXNFbXB0eSgpKSB7XG4gICAgd2FzRW1wdHkgPSB0cnVlO1xuICAgIGF3YWl0IHJlcG9zaXRvcnkuaW5pdCgpO1xuICAgIGRlZmF1bHRCcmFuY2hOYW1lID0gJ21hc3Rlcic7XG4gIH0gZWxzZSB7XG4gICAgd2FzRW1wdHkgPSBmYWxzZTtcbiAgICBjb25zdCBicmFuY2hTZXQgPSBhd2FpdCByZXBvc2l0b3J5LmdldEJyYW5jaGVzKCk7XG4gICAgY29uc3QgYnJhbmNoTmFtZXMgPSBuZXcgU2V0KGJyYW5jaFNldC5nZXROYW1lcygpKTtcbiAgICBpZiAoYnJhbmNoTmFtZXMuaGFzKCdtYXN0ZXInKSkge1xuICAgICAgZGVmYXVsdEJyYW5jaE5hbWUgPSAnbWFzdGVyJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaGVhZCA9IGJyYW5jaFNldC5nZXRIZWFkQnJhbmNoKCk7XG4gICAgICBpZiAoaGVhZC5pc1ByZXNlbnQoKSkge1xuICAgICAgICBkZWZhdWx0QnJhbmNoTmFtZSA9IGhlYWQuZ2V0TmFtZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWRlZmF1bHRCcmFuY2hOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIHRoZSBkZXNpcmVkIGRlZmF1bHQgYnJhbmNoIGZyb20gdGhlIHJlcG9zaXRvcnknKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvbihyZWxheUVudmlyb25tZW50LCB7bmFtZSwgb3duZXJJRCwgdmlzaWJpbGl0eX0pO1xuICBjb25zdCBzb3VyY2VVUkwgPSByZXN1bHQuY3JlYXRlUmVwb3NpdG9yeS5yZXBvc2l0b3J5W3Byb3RvY29sID09PSAnc3NoJyA/ICdzc2hVcmwnIDogJ3VybCddO1xuICBjb25zdCByZW1vdGUgPSBhd2FpdCByZXBvc2l0b3J5LmFkZFJlbW90ZShzb3VyY2VSZW1vdGVOYW1lLCBzb3VyY2VVUkwpO1xuICBpZiAod2FzRW1wdHkpIHtcbiAgICBhZGRFdmVudCgncHVibGlzaC1naXRodWItcmVwb3NpdG9yeScsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IHJlcG9zaXRvcnkucHVzaChkZWZhdWx0QnJhbmNoTmFtZSwge3JlbW90ZSwgc2V0VXBzdHJlYW06IHRydWV9KTtcbiAgICBhZGRFdmVudCgnaW5pdC1wdWJsaXNoLWdpdGh1Yi1yZXBvc2l0b3J5Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUEyQztBQUFBO0FBQUE7QUFBQTtBQUU1QixNQUFNQSxZQUFZLFNBQVNDLGNBQUssQ0FBQ0Ms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