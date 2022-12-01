"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openIssueishItem = openIssueishItem;
exports.default = void 0;

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
    return _react.default.createElement(_dialogView.default, {
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
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Issue or pull request URL:", _react.default.createElement(_tabbable.TabbableTextEditor, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9vcGVuLWlzc3VlaXNoLWRpYWxvZy5qcyJdLCJuYW1lcyI6WyJJU1NVRUlTSF9VUkxfUkVHRVgiLCJPcGVuSXNzdWVpc2hEaWFsb2ciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc3N1ZWlzaFVSTCIsInVybCIsImdldFRleHQiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3QiLCJhY2NlcHQiLCJlbmFibGVkIiwiaXNFbXB0eSIsInN0YXRlIiwiYWNjZXB0RW5hYmxlZCIsInNldFN0YXRlIiwiVGV4dEJ1ZmZlciIsInN1YiIsIm9uRGlkQ2hhbmdlIiwiZGlkQ2hhbmdlVVJMIiwidGFiR3JvdXAiLCJUYWJHcm91cCIsInJlbmRlciIsImNhbmNlbCIsImluUHJvZ3Jlc3MiLCJlcnJvciIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiY29tcG9uZW50RGlkTW91bnQiLCJhdXRvZm9jdXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJwYXJzZVVybCIsImdldElzc3VlaXNoVXJsIiwibWF0Y2hlcyIsIm1hdGNoIiwiX2Z1bGwiLCJyZXBvT3duZXIiLCJyZXBvTmFtZSIsImlzc3VlaXNoTnVtYmVyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJnZXRQYXJhbXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJvYmplY3QiLCJvcGVuSXNzdWVpc2hJdGVtIiwid29ya2RpciIsImV4ZWMiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwidXJpIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiYnVpbGRVUkkiLCJpdGVtIiwib3BlbiIsInNlYXJjaEFsbFBhbmVzIiwicGFja2FnZSIsImZyb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztB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QUEsSUFBZDtBQUFvQkMsSUFBQUEsTUFBcEI7QUFBNEJMLElBQUFBO0FBQTVCLEdBQTVCLENBQVo7O0FBQ0EsUUFBTVMsSUFBSSxHQUFHLE1BQU1qQyxTQUFTLENBQUNrQyxJQUFWLENBQWVKLEdBQWYsRUFBb0I7QUFBQ0ssSUFBQUEsY0FBYyxFQUFFO0FBQWpCLEdBQXBCLENBQW5CO0FBQ0EsK0JBQVMsdUJBQVQsRUFBa0M7QUFBQ0MsSUFBQUEsT0FBTyxFQUFFLFFBQVY7QUFBb0JDLElBQUFBLElBQUksRUFBRTtBQUExQixHQUFsQztBQUNBLFNBQU9KLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgVGFiR3JvdXAgZnJvbSAnLi4vdGFiLWdyb3VwJztcbmltcG9ydCBEaWFsb2dWaWV3IGZyb20gJy4vZGlhbG9nLXZpZXcnO1xuaW1wb3J0IHtUYWJiYWJsZVRleHRFZGl0b3J9IGZyb20gJy4vdGFiYmFibGUnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBJU1NVRUlTSF9VUkxfUkVHRVggPSAvXig/Omh0dHBzPzpcXC9cXC8pPyhnaXRodWIuY29tKVxcLyhbXi9dKylcXC8oW14vXSspXFwvKD86aXNzdWVzfHB1bGwpXFwvKFxcZCspLztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3Blbklzc3VlaXNoRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbFxuICAgIHJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBnZXRQYXJhbXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBhY2NlcHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBjYW5jZWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBpblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBlcnJvcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoRXJyb3IpLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMudXJsID0gbmV3IFRleHRCdWZmZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY2NlcHRFbmFibGVkOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5zdWIgPSB0aGlzLnVybC5vbkRpZENoYW5nZSh0aGlzLmRpZENoYW5nZVVSTCk7XG5cbiAgICB0aGlzLnRhYkdyb3VwID0gbmV3IFRhYkdyb3VwKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dWaWV3XG4gICAgICAgIGFjY2VwdEVuYWJsZWQ9e3RoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZH1cbiAgICAgICAgYWNjZXB0Q2xhc3NOYW1lPVwiaWNvbiBpY29uLWdpdC1wdWxsLXJlcXVlc3RcIlxuICAgICAgICBhY2NlcHRUZXh0PVwiT3BlbiBJc3N1ZSBvciBQdWxsIFJlcXVlc3RcIlxuICAgICAgICBhY2NlcHQ9e3RoaXMuYWNjZXB0fVxuICAgICAgICBjYW5jZWw9e3RoaXMucHJvcHMucmVxdWVzdC5jYW5jZWx9XG4gICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICBpblByb2dyZXNzPXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgIGVycm9yPXt0aGlzLnByb3BzLmVycm9yfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+XG5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dMYWJlbFwiPlxuICAgICAgICAgIElzc3VlIG9yIHB1bGwgcmVxdWVzdCBVUkw6XG4gICAgICAgICAgPFRhYmJhYmxlVGV4dEVkaXRvclxuICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGF1dG9mb2N1c1xuICAgICAgICAgICAgbWluaVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLU9wZW5Jc3N1ZWlzaC11cmxcIlxuICAgICAgICAgICAgYnVmZmVyPXt0aGlzLnVybH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICA8L0RpYWxvZ1ZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudGFiR3JvdXAuYXV0b2ZvY3VzKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gIH1cblxuICBhY2NlcHQgPSAoKSA9PiB7XG4gICAgY29uc3QgaXNzdWVpc2hVUkwgPSB0aGlzLnVybC5nZXRUZXh0KCk7XG4gICAgaWYgKGlzc3VlaXNoVVJMLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcXVlc3QuYWNjZXB0KGlzc3VlaXNoVVJMKTtcbiAgfVxuXG4gIHBhcnNlVXJsKCkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0SXNzdWVpc2hVcmwoKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdXJsLm1hdGNoKElTU1VFSVNIX1VSTF9SRUdFWCk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IFtfZnVsbCwgcmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJdID0gbWF0Y2hlczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHJldHVybiB7cmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJ9O1xuICB9XG5cbiAgZGlkQ2hhbmdlVVJMID0gKCkgPT4ge1xuICAgIGNvbnN0IGVuYWJsZWQgPSAhdGhpcy51cmwuaXNFbXB0eSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmFjY2VwdEVuYWJsZWQgIT09IGVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FjY2VwdEVuYWJsZWQ6IGVuYWJsZWR9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5Jc3N1ZWlzaEl0ZW0oaXNzdWVpc2hVUkwsIHt3b3Jrc3BhY2UsIHdvcmtkaXJ9KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBJU1NVRUlTSF9VUkxfUkVHRVguZXhlYyhpc3N1ZWlzaFVSTCk7XG4gIGlmICghbWF0Y2hlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgaXNzdWUgb3IgcHVsbCByZXF1ZXN0IFVSTCcpO1xuICB9XG4gIGNvbnN0IFssIGhvc3QsIG93bmVyLCByZXBvLCBudW1iZXJdID0gbWF0Y2hlcztcbiAgY29uc3QgdXJpID0gSXNzdWVpc2hEZXRhaWxJdGVtLmJ1aWxkVVJJKHtob3N0LCBvd25lciwgcmVwbywgbnVtYmVyLCB3b3JrZGlyfSk7XG4gIGNvbnN0IGl0ZW0gPSBhd2FpdCB3b3Jrc3BhY2Uub3Blbih1cmksIHtzZWFyY2hBbGxQYW5lczogdHJ1ZX0pO1xuICBhZGRFdmVudCgnb3Blbi1pc3N1ZWlzaC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiAnZGlhbG9nJ30pO1xuICByZXR1cm4gaXRlbTtcbn1cbiJdfQ==