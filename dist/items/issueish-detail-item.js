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
    return /*#__PURE__*/_react.default.createElement(_issueishDetailContainer.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbS5qcyJdLCJuYW1lcyI6WyJJc3N1ZWlzaERldGFpbEl0ZW0iLCJDb21wb25lbnQiLCJidWlsZFVSSSIsImhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyIiwiZW5jb2RlT3B0aW9uYWxQYXJhbSIsInBhcmFtIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzRGVzdHJveWVkIiwiZW1pdHRlciIsImVtaXQiLCJpbmRleCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJzZWxlY3RlZFRhYiIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsImNhbGxiYWNrIiwib24iLCJFbWl0dGVyIiwidGl0bGUiLCJpc3N1ZWlzaE51bWJlciIsImhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUiLCJyZXBvc2l0b3J5Iiwid29ya2luZ0RpcmVjdG9yeSIsIlJlcG9zaXRvcnkiLCJhYnNlbnQiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJhZGQiLCJnZXRSZXBvc2l0b3J5Iiwic3RhdGUiLCJpbml0U2VsZWN0ZWRUYWIiLCJpc0Fic2VudCIsInN3aXRjaFRvSXNzdWVpc2giLCJyZWZFZGl0b3IiLCJSZWZIb2xkZXIiLCJvYnNlcnZlIiwiZWRpdG9yIiwiaXNBbGl2ZSIsInJlbmRlciIsIm9uVGFiU2VsZWN0ZWQiLCJvbk9wZW5GaWxlc1RhYiIsIndvcmtzcGFjZSIsImxvZ2luTW9kZWwiLCJoYW5kbGVUaXRsZUNoYW5nZWQiLCJjb21tYW5kcyIsImtleW1hcHMiLCJ0b29sdGlwcyIsImNvbmZpZyIsImRlc3Ryb3kiLCJyZXBvcnRSZWxheUVycm9yIiwicG9vbCIsInByZXYiLCJuZXh0UmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsImdldE1hdGNoaW5nQ29udGV4dCIsInByZXZTdGF0ZSIsInBhY2thZ2UiLCJmcm9tIiwidGFyZ2V0Iiwib25EaWRDaGFuZ2VUaXRsZSIsImNiIiwidGVybWluYXRlUGVuZGluZ1N0YXRlIiwib25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUiLCJvbkRpZERlc3Ryb3kiLCJzZXJpYWxpemUiLCJ1cmkiLCJkZXNlcmlhbGl6ZXIiLCJnZXRUaXRsZSIsIm9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IiLCJtYXAiLCJvcGVuRmlsZXNUYWIiLCJjaGFuZ2VkRmlsZVBhdGgiLCJjaGFuZ2VkRmlsZVBvc2l0aW9uIiwidGFicyIsIkZJTEVTIiwiT1ZFUlZJRVciLCJCVUlMRF9TVEFUVVMiLCJDT01NSVRTIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIldvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwib25lT2YiLCJPYmplY3QiLCJrZXlzIiwiayIsIm9iamVjdCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVlLE1BQU1BLGtCQUFOLFNBQWlDQyxnQkFBakMsQ0FBMkM7QUF5Q3pDLFNBQVJDLFFBQVEsQ0FBQztBQUFDQyxJQUFBQSxJQUFEO0FBQU9DLElBQUFBLEtBQVA7QUFBY0MsSUFBQUEsSUFBZDtBQUFvQkMsSUFBQUEsTUFBcEI7QUFBNEJDLElBQUFBO0FBQTVCLEdBQUQsRUFBdUM7QUFDcEQsVUFBTUMsbUJBQW1CLEdBQUdDLEtBQUssSUFBS0EsS0FBSyxHQUFHQyxrQkFBa0IsQ0FBQ0QsS0FBRCxDQUFyQixHQUErQixFQUExRTs7QUFFQSxXQUFPLDRCQUNMQyxrQkFBa0IsQ0FBQ1AsSUFBRCxDQURiLEdBQ3NCLEdBRHRCLEdBRUxPLGtCQUFrQixDQUFDTixLQUFELENBRmIsR0FFdUIsR0FGdkIsR0FHTE0sa0JBQWtCLENBQUNMLElBQUQsQ0FIYixHQUdzQixHQUh0QixHQUlMSyxr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QixtQkFBVVUsSUFBVixDQUFlUjtBQXhCaEIsQzs7Z0JBUkF2RixrQixrQkFtQ0c7QUFDcEJxQyxFQUFBQSxlQUFlLEVBQUVyQyxrQkFBa0IsQ0FBQ2dGLElBQW5CLENBQXdCRTtBQURyQixDOztnQkFuQ0hsRixrQixnQkF1Q0MsMEYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUsIFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCBSZXBvc2l0b3J5IGZyb20gJy4uL21vZGVscy9yZXBvc2l0b3J5JztcbmltcG9ydCB7Z2V0RW5kcG9pbnR9IGZyb20gJy4uL21vZGVscy9lbmRwb2ludCc7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9pc3N1ZWlzaC1kZXRhaWwtY29udGFpbmVyJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaERldGFpbEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgdGFicyA9IHtcbiAgICBPVkVSVklFVzogMCxcbiAgICBCVUlMRF9TVEFUVVM6IDEsXG4gICAgQ09NTUlUUzogMixcbiAgICBGSUxFUzogMyxcbiAgfVxuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gSXNzdWVpc2ggc2VsZWN0aW9uIGNyaXRlcmlhXG4gICAgLy8gUGFyc2VkIGZyb20gaXRlbSBVUklcbiAgICBob3N0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaXNzdWVpc2hOdW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3b3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQYWNrYWdlIG1vZGVsc1xuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBpbml0U2VsZWN0ZWRUYWI6IFByb3BUeXBlcy5vbmVPZihcbiAgICAgIE9iamVjdC5rZXlzKElzc3VlaXNoRGV0YWlsSXRlbS50YWJzKS5tYXAoayA9PiBJc3N1ZWlzaERldGFpbEl0ZW0udGFic1trXSksXG4gICAgKSxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpbml0U2VsZWN0ZWRUYWI6IElzc3VlaXNoRGV0YWlsSXRlbS50YWJzLk9WRVJWSUVXLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9pc3N1ZWlzaC97aG9zdH0ve293bmVyfS97cmVwb30ve2lzc3VlaXNoTnVtYmVyfT93b3JrZGlyPXt3b3JraW5nRGlyZWN0b3J5fSdcblxuICBzdGF0aWMgYnVpbGRVUkkoe2hvc3QsIG93bmVyLCByZXBvLCBudW1iZXIsIHdvcmtkaXJ9KSB7XG4gICAgY29uc3QgZW5jb2RlT3B0aW9uYWxQYXJhbSA9IHBhcmFtID0+IChwYXJhbSA/IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbSkgOiAnJyk7XG5cbiAgICByZXR1cm4gJ2F0b20tZ2l0aHViOi8vaXNzdWVpc2gvJyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoaG9zdCkgKyAnLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KG93bmVyKSArICcvJyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQocmVwbykgKyAnLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KG51bWJlcikgK1xuICAgICAgJz93b3JrZGlyPScgKyBlbmNvZGVPcHRpb25hbFBhcmFtKHdvcmtkaXIpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3N3aXRjaFRvSXNzdWVpc2gnLCAnaGFuZGxlVGl0bGVDaGFuZ2VkJyk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMudGl0bGUgPSBgJHt0aGlzLnByb3BzLm93bmVyfS8ke3RoaXMucHJvcHMucmVwb30jJHt0aGlzLnByb3BzLmlzc3VlaXNoTnVtYmVyfWA7XG4gICAgdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlID0gZmFsc2U7XG5cbiAgICBjb25zdCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5ID09PSAnJ1xuICAgICAgPyBSZXBvc2l0b3J5LmFic2VudCgpXG4gICAgICA6IHRoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sLmFkZCh0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnkpLmdldFJlcG9zaXRvcnkoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBob3N0OiB0aGlzLnByb3BzLmhvc3QsXG4gICAgICBvd25lcjogdGhpcy5wcm9wcy5vd25lcixcbiAgICAgIHJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgIGlzc3VlaXNoTnVtYmVyOiB0aGlzLnByb3BzLmlzc3VlaXNoTnVtYmVyLFxuICAgICAgcmVwb3NpdG9yeSxcbiAgICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg6ICcnLFxuICAgICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb246IDAsXG4gICAgICBzZWxlY3RlZFRhYjogdGhpcy5wcm9wcy5pbml0U2VsZWN0ZWRUYWIsXG4gICAgfTtcblxuICAgIGlmIChyZXBvc2l0b3J5LmlzQWJzZW50KCkpIHtcbiAgICAgIHRoaXMuc3dpdGNoVG9Jc3N1ZWlzaCh0aGlzLnByb3BzLm93bmVyLCB0aGlzLnByb3BzLnJlcG8sIHRoaXMucHJvcHMuaXNzdWVpc2hOdW1iZXIpO1xuICAgIH1cblxuICAgIHRoaXMucmVmRWRpdG9yID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yLm9ic2VydmUoZWRpdG9yID0+IHtcbiAgICAgIGlmIChlZGl0b3IuaXNBbGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWVtYmVkZGVkLXRleHQtZWRpdG9yJywgZWRpdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPElzc3VlaXNoRGV0YWlsQ29udGFpbmVyXG4gICAgICAgIGVuZHBvaW50PXtnZXRFbmRwb2ludCh0aGlzLnN0YXRlLmhvc3QpfVxuICAgICAgICBvd25lcj17dGhpcy5zdGF0ZS5vd25lcn1cbiAgICAgICAgcmVwbz17dGhpcy5zdGF0ZS5yZXBvfVxuICAgICAgICBpc3N1ZWlzaE51bWJlcj17dGhpcy5zdGF0ZS5pc3N1ZWlzaE51bWJlcn1cbiAgICAgICAgaW5pdENoYW5nZWRGaWxlUGF0aD17dGhpcy5zdGF0ZS5pbml0Q2hhbmdlZEZpbGVQYXRofVxuICAgICAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbj17dGhpcy5zdGF0ZS5pbml0Q2hhbmdlZEZpbGVQb3NpdGlvbn1cbiAgICAgICAgc2VsZWN0ZWRUYWI9e3RoaXMuc3RhdGUuc2VsZWN0ZWRUYWJ9XG4gICAgICAgIG9uVGFiU2VsZWN0ZWQ9e3RoaXMub25UYWJTZWxlY3RlZH1cbiAgICAgICAgb25PcGVuRmlsZXNUYWI9e3RoaXMub25PcGVuRmlsZXNUYWJ9XG5cbiAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5zdGF0ZS5yZXBvc2l0b3J5fVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG5cbiAgICAgICAgb25UaXRsZUNoYW5nZT17dGhpcy5oYW5kbGVUaXRsZUNoYW5nZWR9XG4gICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgZGVzdHJveT17dGhpcy5kZXN0cm95fVxuICAgICAgICBpdGVtVHlwZT17dGhpcy5jb25zdHJ1Y3Rvcn1cbiAgICAgICAgcmVmRWRpdG9yPXt0aGlzLnJlZkVkaXRvcn1cbiAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc3dpdGNoVG9Jc3N1ZWlzaChvd25lciwgcmVwbywgaXNzdWVpc2hOdW1iZXIpIHtcbiAgICBjb25zdCBwb29sID0gdGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2w7XG4gICAgY29uc3QgcHJldiA9IHtcbiAgICAgIG93bmVyOiB0aGlzLnN0YXRlLm93bmVyLFxuICAgICAgcmVwbzogdGhpcy5zdGF0ZS5yZXBvLFxuICAgICAgaXNzdWVpc2hOdW1iZXI6IHRoaXMuc3RhdGUuaXNzdWVpc2hOdW1iZXIsXG4gICAgfTtcblxuICAgIGNvbnN0IG5leHRSZXBvc2l0b3J5ID0gYXdhaXQgdGhpcy5zdGF0ZS5yZXBvc2l0b3J5Lmhhc0dpdEh1YlJlbW90ZSh0aGlzLnN0YXRlLmhvc3QsIG93bmVyLCByZXBvKVxuICAgICAgPyB0aGlzLnN0YXRlLnJlcG9zaXRvcnlcbiAgICAgIDogKGF3YWl0IHBvb2wuZ2V0TWF0Y2hpbmdDb250ZXh0KHRoaXMuc3RhdGUuaG9zdCwgb3duZXIsIHJlcG8pKS5nZXRSZXBvc2l0b3J5KCk7XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoKHByZXZTdGF0ZSwgcHJvcHMpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBvb2wgPT09IHByb3BzLndvcmtkaXJDb250ZXh0UG9vbCAmJlxuICAgICAgICAgIHByZXZTdGF0ZS5vd25lciA9PT0gcHJldi5vd25lciAmJlxuICAgICAgICAgIHByZXZTdGF0ZS5yZXBvID09PSBwcmV2LnJlcG8gJiZcbiAgICAgICAgICBwcmV2U3RhdGUuaXNzdWVpc2hOdW1iZXIgPT09IHByZXYuaXNzdWVpc2hOdW1iZXJcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWRkRXZlbnQoJ29wZW4taXNzdWVpc2gtaW4tcGFuZScsIHtwYWNrYWdlOiAnZ2l0aHViJywgZnJvbTogJ2lzc3VlaXNoLWxpbmsnLCB0YXJnZXQ6ICdjdXJyZW50LXRhYid9KTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICByZXBvLFxuICAgICAgICAgICAgaXNzdWVpc2hOdW1iZXIsXG4gICAgICAgICAgICByZXBvc2l0b3J5OiBuZXh0UmVwb3NpdG9yeSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVUaXRsZUNoYW5nZWQodGl0bGUpIHtcbiAgICBpZiAodGhpcy50aXRsZSAhPT0gdGl0bGUpIHtcbiAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXRpdGxlJywgdGl0bGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkQ2hhbmdlVGl0bGUoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXRpdGxlJywgY2IpO1xuICB9XG5cbiAgdGVybWluYXRlUGVuZGluZ1N0YXRlKCkge1xuICAgIGlmICghdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJyk7XG4gICAgICB0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSA9ICgpID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95Jyk7XG4gICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJpOiBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe1xuICAgICAgICBob3N0OiB0aGlzLnByb3BzLmhvc3QsXG4gICAgICAgIG93bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgICByZXBvOiB0aGlzLnByb3BzLnJlcG8sXG4gICAgICAgIG51bWJlcjogdGhpcy5wcm9wcy5pc3N1ZWlzaE51bWJlcixcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5LFxuICAgICAgfSksXG4gICAgICBzZWxlY3RlZFRhYjogdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYixcbiAgICAgIGRlc2VyaWFsaXplcjogJ0lzc3VlaXNoRGV0YWlsSXRlbScsXG4gICAgfTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLnRpdGxlO1xuICB9XG5cbiAgb2JzZXJ2ZUVtYmVkZGVkVGV4dEVkaXRvcihjYikge1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLmlzQWxpdmUoKSAmJiBjYihlZGl0b3IpKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWVtYmVkZGVkLXRleHQtZWRpdG9yJywgY2IpO1xuICB9XG5cbiAgb3BlbkZpbGVzVGFiKHtjaGFuZ2VkRmlsZVBhdGgsIGNoYW5nZWRGaWxlUG9zaXRpb259KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZFRhYjogSXNzdWVpc2hEZXRhaWxJdGVtLnRhYnMuRklMRVMsXG4gICAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiBjaGFuZ2VkRmlsZVBhdGgsXG4gICAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogY2hhbmdlZEZpbGVQb3NpdGlvbixcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb24tb3Blbi1maWxlcy10YWInLCB7Y2hhbmdlZEZpbGVQYXRoLCBjaGFuZ2VkRmlsZVBvc2l0aW9ufSk7XG4gICAgfSk7XG4gIH1cblxuICBvblRhYlNlbGVjdGVkID0gaW5kZXggPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZFRhYjogaW5kZXgsXG4gICAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiAnJyxcbiAgICAgIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uOiAwLFxuICAgIH0sIHJlc29sdmUpO1xuICB9KTtcblxuICBvbk9wZW5GaWxlc1RhYiA9IGNhbGxiYWNrID0+IHRoaXMuZW1pdHRlci5vbignb24tb3Blbi1maWxlcy10YWInLCBjYWxsYmFjayk7XG59XG4iXX0=