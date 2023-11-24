"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

var _repository = _interopRequireDefault(require("../models/repository"));

var _endpoint = require("../models/endpoint");

var _issueishDetailContainer = _interopRequireDefault(require("../containers/issueish-detail-container"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IssueishDetailItem extends _react.Component {
  static buildURI({
    host,
    owner,
    repo,
    number,
    workdir
  }) {
    const encodeOptionalParam = param => param ? encodeURIComponent(param) : '';

    return 'atom-github://issueish/' + encodeURIComponent(host) + '/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/' + encodeURIComponent(number) + '?workdir=' + encodeOptionalParam(workdir);
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "destroy", () => {
      /* istanbul ignore else */
      if (!this.isDestroyed) {
        this.emitter.emit('did-destroy');
        this.isDestroyed = true;
      }
    });

    _defineProperty(this, "onTabSelected", index => new Promise(resolve => {
      this.setState({
        selectedTab: index,
        initChangedFilePath: '',
        initChangedFilePosition: 0
      }, resolve);
    }));

    _defineProperty(this, "onOpenFilesTab", callback => this.emitter.on('on-open-files-tab', callback));

    (0, _helpers.autobind)(this, 'switchToIssueish', 'handleTitleChanged');
    this.emitter = new _eventKit.Emitter();
    this.title = `${this.props.owner}/${this.props.repo}#${this.props.issueishNumber}`;
    this.hasTerminatedPendingState = false;
    const repository = this.props.workingDirectory === '' ? _repository.default.absent() : this.props.workdirContextPool.add(this.props.workingDirectory).getRepository();
    this.state = {
      host: this.props.host,
      owner: this.props.owner,
      repo: this.props.repo,
      issueishNumber: this.props.issueishNumber,
      repository,
      initChangedFilePath: '',
      initChangedFilePosition: 0,
      selectedTab: this.props.initSelectedTab
    };

    if (repository.isAbsent()) {
      this.switchToIssueish(this.props.owner, this.props.repo, this.props.issueishNumber);
    }

    this.refEditor = new _refHolder.default();
    this.refEditor.observe(editor => {
      if (editor.isAlive()) {
        this.emitter.emit('did-change-embedded-text-editor', editor);
      }
    });
  }

  render() {
    return _react.default.createElement(_issueishDetailContainer.default, {
      endpoint: (0, _endpoint.getEndpoint)(this.state.host),
      owner: this.state.owner,
      repo: this.state.repo,
      issueishNumber: this.state.issueishNumber,
      initChangedFilePath: this.state.initChangedFilePath,
      initChangedFilePosition: this.state.initChangedFilePosition,
      selectedTab: this.state.selectedTab,
      onTabSelected: this.onTabSelected,
      onOpenFilesTab: this.onOpenFilesTab,
      repository: this.state.repository,
      workspace: this.props.workspace,
      loginModel: this.props.loginModel,
      onTitleChange: this.handleTitleChanged,
      switchToIssueish: this.switchToIssueish,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      destroy: this.destroy,
      itemType: this.constructor,
      refEditor: this.refEditor,
      reportRelayError: this.props.reportRelayError
    });
  }

  async switchToIssueish(owner, repo, issueishNumber) {
    const pool = this.props.workdirContextPool;
    const prev = {
      owner: this.state.owner,
      repo: this.state.repo,
      issueishNumber: this.state.issueishNumber
    };
    const nextRepository = (await this.state.repository.hasGitHubRemote(this.state.host, owner, repo)) ? this.state.repository : (await pool.getMatchingContext(this.state.host, owner, repo)).getRepository();
    await new Promise(resolve => {
      this.setState((prevState, props) => {
        if (pool === props.workdirContextPool && prevState.owner === prev.owner && prevState.repo === prev.repo && prevState.issueishNumber === prev.issueishNumber) {
          (0, _reporterProxy.addEvent)('open-issueish-in-pane', {
            package: 'github',
            from: 'issueish-link',
            target: 'current-tab'
          });
          return {
            owner,
            repo,
            issueishNumber,
            repository: nextRepository
          };
        }

        return {};
      }, resolve);
    });
  }

  handleTitleChanged(title) {
    if (this.title !== title) {
      this.title = title;
      this.emitter.emit('did-change-title', title);
    }
  }

  onDidChangeTitle(cb) {
    return this.emitter.on('did-change-title', cb);
  }

  terminatePendingState() {
    if (!this.hasTerminatedPendingState) {
      this.emitter.emit('did-terminate-pending-state');
      this.hasTerminatedPendingState = true;
    }
  }

  onDidTerminatePendingState(callback) {
    return this.emitter.on('did-terminate-pending-state', callback);
  }

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }

  serialize() {
    return {
      uri: IssueishDetailItem.buildURI({
        host: this.props.host,
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.issueishNumber,
        workdir: this.props.workingDirectory
      }),
      selectedTab: this.state.selectedTab,
      deserializer: 'IssueishDetailItem'
    };
  }

  getTitle() {
    return this.title;
  }

  observeEmbeddedTextEditor(cb) {
    this.refEditor.map(editor => editor.isAlive() && cb(editor));
    return this.emitter.on('did-change-embedded-text-editor', cb);
  }

  openFilesTab({
    changedFilePath,
    changedFilePosition
  }) {
    this.setState({
      selectedTab: IssueishDetailItem.tabs.FILES,
      initChangedFilePath: changedFilePath,
      initChangedFilePosition: changedFilePosition
    }, () => {
      this.emitter.emit('on-open-files-tab', {
        changedFilePath,
        changedFilePosition
      });
    });
  }

}

exports.default = IssueishDetailItem;

_defineProperty(IssueishDetailItem, "tabs", {
  OVERVIEW: 0,
  BUILD_STATUS: 1,
  COMMITS: 2,
  FILES: 3
});

_defineProperty(IssueishDetailItem, "propTypes", {
  // Issueish selection criteria
  // Parsed from item URI
  host: _propTypes.default.string.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  issueishNumber: _propTypes.default.number.isRequired,
  workingDirectory: _propTypes.default.string.isRequired,
  // Package models
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  initSelectedTab: _propTypes.default.oneOf(Object.keys(IssueishDetailItem.tabs).map(k => IssueishDetailItem.tabs[k])),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});

_defineProperty(IssueishDetailItem, "defaultProps", {
  initSelectedTab: IssueishDetailItem.tabs.OVERVIEW
});

_defineProperty(IssueishDetailItem, "uriPattern", 'atom-github://issueish/{host}/{owner}/{repo}/{issueishNumber}?workdir={workingDirectory}');