"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.openIssueishItem = openIssueishItem;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _tabbable = require("./tabbable");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ISSUEISH_URL_REGEX = /^(?:https?:\/\/)?(github.com)\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/;

class OpenIssueishDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const issueishURL = this.url.getText();

      if (issueishURL.length === 0) {
        return Promise.resolve();
      }

      return this.props.request.accept(issueishURL);
    });

    _defineProperty(this, "didChangeURL", () => {
      const enabled = !this.url.isEmpty();

      if (this.state.acceptEnabled !== enabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });

    this.url = new _atom.TextBuffer();
    this.state = {
      acceptEnabled: false
    };
    this.sub = this.url.onDidChange(this.didChangeURL);
    this.tabGroup = new _tabGroup.default();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_dialogView.default, {
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-git-pull-request",
      acceptText: "Open Issue or Pull Request",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Issue or pull request URL:", /*#__PURE__*/_react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      className: "github-OpenIssueish-url",
      buffer: this.url
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  parseUrl() {
    const url = this.getIssueishUrl();
    const matches = url.match(ISSUEISH_URL_REGEX);

    if (!matches) {
      return false;
    }

    const [_full, repoOwner, repoName, issueishNumber] = matches; // eslint-disable-line no-unused-vars

    return {
      repoOwner,
      repoName,
      issueishNumber
    };
  }

}

exports.default = OpenIssueishDialog;

_defineProperty(OpenIssueishDialog, "propTypes", {
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

async function openIssueishItem(issueishURL, {
  workspace,
  workdir
}) {
  const matches = ISSUEISH_URL_REGEX.exec(issueishURL);

  if (!matches) {
    throw new Error('Not a valid issue or pull request URL');
  }

  const [, host, owner, repo, number] = matches;

  const uri = _issueishDetailItem.default.buildURI({
    host,
    owner,
    repo,
    number,
    workdir
  });

  const item = await workspace.open(uri, {
    searchAllPanes: true
  });
  (0, _reporterProxy.addEvent)('open-issueish-in-pane', {
    package: 'github',
    from: 'dialog'
  });
  return item;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9vcGVuLWlzc3VlaXNoLWRpYWxvZy5qcyJdLCJuYW1lcyI6WyJJU1NVRUlTSF9VUkxfUkVHRVgiLCJPcGVuSXNzdWVpc2hEaWFsb2ciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc3N1ZWlzaFVSTCIsInVybCIsImdldFRleHQiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3QiLCJhY2NlcHQiLCJlbmFibGVkIiwiaXNFbXB0eSIsInN0YXRlIiwiYWNjZXB0RW5hYmxlZCIsInNldFN0YXRlIiwiVGV4dEJ1ZmZlciIsInN1YiIsIm9uRGlkQ2hhbmdlIiwiZGlkQ2hhbmdlVVJMIiwidGFiR3JvdXAiLCJUYWJHcm91cCIsInJlbmRlciIsImNhbmNlbCIsImluUHJvZ3Jlc3MiLCJlcnJvciIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiY29tcG9uZW50RGlkTW91bnQiLCJhdXRvZm9jdXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJwYXJzZVVybCIsImdldElzc3VlaXNoVXJsIiwibWF0Y2hlcyIsIm1hdGNoIiwiX2Z1bGwiLCJyZXBvT3duZXIiLCJyZXBvTmFtZSIsImlzc3VlaXNoTnVtYmVyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJnZXRQYXJhbXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJvYmplY3QiLCJvcGVuSXNzdWVpc2hJdGVtIiwid29ya2RpciIsImV4ZWMiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwidXJpIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiYnVpbGRVUkkiLCJpdGVtIiwib3BlbiIsInNlYXJjaEFsbFBhbmVzIiwicGFja2FnZSIsImZyb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztB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QUFBQSxJQUFkO0FBQW9CQyxJQUFBQSxNQUFwQjtBQUE0QkwsSUFBQUE7QUFBNUIsR0FBNUIsQ0FBWjs7QUFDQSxRQUFNUyxJQUFJLEdBQUcsTUFBTWpDLFNBQVMsQ0FBQ2tDLElBQVYsQ0FBZUosR0FBZixFQUFvQjtBQUFDSyxJQUFBQSxjQUFjLEVBQUU7QUFBakIsR0FBcEIsQ0FBbkI7QUFDQSwrQkFBUyx1QkFBVCxFQUFrQztBQUFDQyxJQUFBQSxPQUFPLEVBQUUsUUFBVjtBQUFvQkMsSUFBQUEsSUFBSSxFQUFFO0FBQTFCLEdBQWxDO0FBQ0EsU0FBT0osSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBUYWJHcm91cCBmcm9tICcuLi90YWItZ3JvdXAnO1xuaW1wb3J0IERpYWxvZ1ZpZXcgZnJvbSAnLi9kaWFsb2ctdmlldyc7XG5pbXBvcnQge1RhYmJhYmxlVGV4dEVkaXRvcn0gZnJvbSAnLi90YWJiYWJsZSc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IElTU1VFSVNIX1VSTF9SRUdFWCA9IC9eKD86aHR0cHM/OlxcL1xcLyk/KGdpdGh1Yi5jb20pXFwvKFteL10rKVxcLyhbXi9dKylcXC8oPzppc3N1ZXN8cHVsbClcXC8oXFxkKykvO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcGVuSXNzdWVpc2hEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFBhcmFtczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy51cmwgPSBuZXcgVGV4dEJ1ZmZlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjY2VwdEVuYWJsZWQ6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLnN1YiA9IHRoaXMudXJsLm9uRGlkQ2hhbmdlKHRoaXMuZGlkQ2hhbmdlVVJMKTtcblxuICAgIHRoaXMudGFiR3JvdXAgPSBuZXcgVGFiR3JvdXAoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERpYWxvZ1ZpZXdcbiAgICAgICAgYWNjZXB0RW5hYmxlZD17dGhpcy5zdGF0ZS5hY2NlcHRFbmFibGVkfVxuICAgICAgICBhY2NlcHRDbGFzc05hbWU9XCJpY29uIGljb24tZ2l0LXB1bGwtcmVxdWVzdFwiXG4gICAgICAgIGFjY2VwdFRleHQ9XCJPcGVuIElzc3VlIG9yIFB1bGwgUmVxdWVzdFwiXG4gICAgICAgIGFjY2VwdD17dGhpcy5hY2NlcHR9XG4gICAgICAgIGNhbmNlbD17dGhpcy5wcm9wcy5yZXF1ZXN0LmNhbmNlbH1cbiAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgIGluUHJvZ3Jlc3M9e3RoaXMucHJvcHMuaW5Qcm9ncmVzc31cbiAgICAgICAgZXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfT5cblxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsXCI+XG4gICAgICAgICAgSXNzdWUgb3IgcHVsbCByZXF1ZXN0IFVSTDpcbiAgICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgICB0YWJHcm91cD17dGhpcy50YWJHcm91cH1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgYXV0b2ZvY3VzXG4gICAgICAgICAgICBtaW5pXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItT3Blbklzc3VlaXNoLXVybFwiXG4gICAgICAgICAgICBidWZmZXI9e3RoaXMudXJsfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgIDwvRGlhbG9nVmlldz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50YWJHcm91cC5hdXRvZm9jdXMoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFjY2VwdCA9ICgpID0+IHtcbiAgICBjb25zdCBpc3N1ZWlzaFVSTCA9IHRoaXMudXJsLmdldFRleHQoKTtcbiAgICBpZiAoaXNzdWVpc2hVUkwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVxdWVzdC5hY2NlcHQoaXNzdWVpc2hVUkwpO1xuICB9XG5cbiAgcGFyc2VVcmwoKSB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5nZXRJc3N1ZWlzaFVybCgpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSB1cmwubWF0Y2goSVNTVUVJU0hfVVJMX1JFR0VYKTtcbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgW19mdWxsLCByZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcl0gPSBtYXRjaGVzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgcmV0dXJuIHtyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcn07XG4gIH1cblxuICBkaWRDaGFuZ2VVUkwgPSAoKSA9PiB7XG4gICAgY29uc3QgZW5hYmxlZCA9ICF0aGlzLnVybC5pc0VtcHR5KCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZCAhPT0gZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7YWNjZXB0RW5hYmxlZDogZW5hYmxlZH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3Blbklzc3VlaXNoSXRlbShpc3N1ZWlzaFVSTCwge3dvcmtzcGFjZSwgd29ya2Rpcn0pIHtcbiAgY29uc3QgbWF0Y2hlcyA9IElTU1VFSVNIX1VSTF9SRUdFWC5leGVjKGlzc3VlaXNoVVJMKTtcbiAgaWYgKCFtYXRjaGVzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBpc3N1ZSBvciBwdWxsIHJlcXVlc3QgVVJMJyk7XG4gIH1cbiAgY29uc3QgWywgaG9zdCwgb3duZXIsIHJlcG8sIG51bWJlcl0gPSBtYXRjaGVzO1xuICBjb25zdCB1cmkgPSBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe2hvc3QsIG93bmVyLCByZXBvLCBudW1iZXIsIHdvcmtkaXJ9KTtcbiAgY29uc3QgaXRlbSA9IGF3YWl0IHdvcmtzcGFjZS5vcGVuKHVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlfSk7XG4gIGFkZEV2ZW50KCdvcGVuLWlzc3VlaXNoLWluLXBhbmUnLCB7cGFja2FnZTogJ2dpdGh1YicsIGZyb206ICdkaWFsb2cnfSk7XG4gIHJldHVybiBpdGVtO1xufVxuIl19