"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemTypePropType = exports.UserStorePropType = exports.MergeConflictItemPropType = exports.MultiFilePatchPropType = exports.FilePatchItemPropType = exports.IssueishPropType = exports.RefresherPropType = exports.OperationStateObserverPropType = exports.EnableableOperationPropType = exports.RangePropType = exports.PointPropType = exports.RefHolderPropType = exports.RelayConnectionPropType = exports.AuthorPropType = exports.CommitPropType = exports.BranchSetPropType = exports.RemoteSetPropType = exports.SearchPropType = exports.BranchPropType = exports.EndpointPropType = exports.RemotePropType = exports.GithubLoginModelPropType = exports.WorkdirContextPoolPropType = exports.DOMNodePropType = exports.TokenPropType = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TokenPropType = _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.symbol, _propTypes.default.instanceOf(Error)]);

exports.TokenPropType = TokenPropType;

const DOMNodePropType = (props, propName, componentName) => {
  if (props[propName] instanceof HTMLElement) {
    return null;
  } else {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Value is not DOM element.`);
  }
};

exports.DOMNodePropType = DOMNodePropType;

const WorkdirContextPoolPropType = _propTypes.default.shape({
  getContext: _propTypes.default.func.isRequired
});

exports.WorkdirContextPoolPropType = WorkdirContextPoolPropType;

const GithubLoginModelPropType = _propTypes.default.shape({
  getToken: _propTypes.default.func.isRequired,
  setToken: _propTypes.default.func.isRequired,
  removeToken: _propTypes.default.func.isRequired,
  getScopes: _propTypes.default.func.isRequired,
  onDidUpdate: _propTypes.default.func.isRequired
});

exports.GithubLoginModelPropType = GithubLoginModelPropType;

const RemotePropType = _propTypes.default.shape({
  getName: _propTypes.default.func.isRequired,
  getUrl: _propTypes.default.func.isRequired,
  isGithubRepo: _propTypes.default.func.isRequired,
  getOwner: _propTypes.default.func.isRequired,
  getRepo: _propTypes.default.func.isRequired,
  getEndpoint: _propTypes.default.func.isRequired
});

exports.RemotePropType = RemotePropType;

const EndpointPropType = _propTypes.default.shape({
  getGraphQLRoot: _propTypes.default.func.isRequired,
  getRestRoot: _propTypes.default.func.isRequired,
  getRestURI: _propTypes.default.func.isRequired
});

exports.EndpointPropType = EndpointPropType;

const BranchPropType = _propTypes.default.shape({
  getName: _propTypes.default.func.isRequired,
  isDetached: _propTypes.default.func.isRequired,
  isPresent: _propTypes.default.func.isRequired
});

exports.BranchPropType = BranchPropType;

const SearchPropType = _propTypes.default.shape({
  getName: _propTypes.default.func.isRequired,
  createQuery: _propTypes.default.func.isRequired
});

exports.SearchPropType = SearchPropType;

const RemoteSetPropType = _propTypes.default.shape({
  withName: _propTypes.default.func.isRequired,
  isEmpty: _propTypes.default.func.isRequired,
  size: _propTypes.default.func.isRequired,
  [Symbol.iterator]: _propTypes.default.func.isRequired
});

exports.RemoteSetPropType = RemoteSetPropType;

const BranchSetPropType = _propTypes.default.shape({
  getNames: _propTypes.default.func.isRequired,
  getPullTargets: _propTypes.default.func.isRequired,
  getPushSources: _propTypes.default.func.isRequired
});

exports.BranchSetPropType = BranchSetPropType;

const CommitPropType = _propTypes.default.shape({
  getSha: _propTypes.default.func.isRequired,
  getMessageSubject: _propTypes.default.func.isRequired,
  isUnbornRef: _propTypes.default.func.isRequired,
  isPresent: _propTypes.default.func.isRequired
});

exports.CommitPropType = CommitPropType;

const AuthorPropType = _propTypes.default.shape({
  getEmail: _propTypes.default.func.isRequired,
  getFullName: _propTypes.default.func.isRequired,
  getAvatarUrl: _propTypes.default.func.isRequired
});

exports.AuthorPropType = AuthorPropType;

const RelayConnectionPropType = nodePropType => _propTypes.default.shape({
  edges: _propTypes.default.arrayOf(_propTypes.default.shape({
    cursor: _propTypes.default.string,
    node: nodePropType
  })),
  pageInfo: _propTypes.default.shape({
    endCursor: _propTypes.default.string,
    hasNextPage: _propTypes.default.bool,
    hasPreviousPage: _propTypes.default.bool,
    startCursor: _propTypes.default.string
  }),
  totalCount: _propTypes.default.number
});

exports.RelayConnectionPropType = RelayConnectionPropType;

const RefHolderPropType = _propTypes.default.shape({
  isEmpty: _propTypes.default.func.isRequired,
  get: _propTypes.default.func.isRequired,
  setter: _propTypes.default.func.isRequired,
  observe: _propTypes.default.func.isRequired
});

exports.RefHolderPropType = RefHolderPropType;

const PointPropType = _propTypes.default.shape({
  row: _propTypes.default.number.isRequired,
  column: _propTypes.default.number.isRequired,
  isEqual: _propTypes.default.func.isRequired
});

exports.PointPropType = PointPropType;

const RangePropType = _propTypes.default.shape({
  start: PointPropType.isRequired,
  end: PointPropType.isRequired,
  isEqual: _propTypes.default.func.isRequired
});

exports.RangePropType = RangePropType;

const EnableableOperationPropType = _propTypes.default.shape({
  isEnabled: _propTypes.default.func.isRequired,
  run: _propTypes.default.func.isRequired,
  getMessage: _propTypes.default.func.isRequired,
  why: _propTypes.default.func.isRequired
});

exports.EnableableOperationPropType = EnableableOperationPropType;

const OperationStateObserverPropType = _propTypes.default.shape({
  onDidComplete: _propTypes.default.func.isRequired,
  dispose: _propTypes.default.func.isRequired
});

exports.OperationStateObserverPropType = OperationStateObserverPropType;

const RefresherPropType = _propTypes.default.shape({
  setRetryCallback: _propTypes.default.func.isRequired,
  trigger: _propTypes.default.func.isRequired,
  deregister: _propTypes.default.func.isRequired
});

exports.RefresherPropType = RefresherPropType;

const IssueishPropType = _propTypes.default.shape({
  getNumber: _propTypes.default.func.isRequired,
  getTitle: _propTypes.default.func.isRequired,
  getGitHubURL: _propTypes.default.func.isRequired,
  getAuthorLogin: _propTypes.default.func.isRequired,
  getAuthorAvatarURL: _propTypes.default.func.isRequired,
  getCreatedAt: _propTypes.default.func.isRequired,
  getHeadRefName: _propTypes.default.func.isRequired,
  getHeadRepositoryID: _propTypes.default.func.isRequired,
  getStatusCounts: _propTypes.default.func.isRequired
});

exports.IssueishPropType = IssueishPropType;

const FilePatchItemPropType = _propTypes.default.shape({
  filePath: _propTypes.default.string.isRequired,
  status: _propTypes.default.string.isRequired
});

exports.FilePatchItemPropType = FilePatchItemPropType;

const MultiFilePatchPropType = _propTypes.default.shape({
  getFilePatches: _propTypes.default.func.isRequired
});

exports.MultiFilePatchPropType = MultiFilePatchPropType;
const statusNames = ['added', 'deleted', 'modified', 'typechange', 'equivalent'];

const MergeConflictItemPropType = _propTypes.default.shape({
  filePath: _propTypes.default.string.isRequired,
  status: _propTypes.default.shape({
    file: _propTypes.default.oneOf(statusNames).isRequired,
    ours: _propTypes.default.oneOf(statusNames).isRequired,
    theirs: _propTypes.default.oneOf(statusNames).isRequired
  }).isRequired
});

exports.MergeConflictItemPropType = MergeConflictItemPropType;

const UserStorePropType = _propTypes.default.shape({
  getUsers: _propTypes.default.func.isRequired,
  onDidUpdate: _propTypes.default.func.isRequired
}); // Require item classes lazily to prevent circular imports


exports.UserStorePropType = UserStorePropType;
let lazyItemConstructors = null;

function createItemTypePropType(required) {
  return function (props, propName, componentName) {
    if (lazyItemConstructors === null) {
      lazyItemConstructors = new Set();

      for (const itemPath of ['./items/changed-file-item', './items/commit-preview-item', './items/commit-detail-item', './items/issueish-detail-item']) {
        lazyItemConstructors.add(require(itemPath).default);
      }
    }

    if (props[propName] === undefined || props[propName] === null) {
      /* istanbul ignore else */
      if (required) {
        return new Error(`Missing required prop ${propName} on component ${componentName}.`);
      } else {
        return undefined;
      }
    }
    /* istanbul ignore if */


    if (!lazyItemConstructors.has(props[propName])) {
      const choices = Array.from(lazyItemConstructors, each => each.name).join(', ');
      return new Error(`Invalid prop "${propName}" supplied to ${componentName}. Must be one of ${choices}.`);
    }

    return undefined;
  };
}

const ItemTypePropType = createItemTypePropType(false);
exports.ItemTypePropType = ItemTypePropType;
ItemTypePropType.isRequired = createItemTypePropType(true);