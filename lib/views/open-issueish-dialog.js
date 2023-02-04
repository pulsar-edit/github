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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJU1NVRUlTSF9VUkxfUkVHRVgiLCJPcGVuSXNzdWVpc2hEaWFsb2ciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc3N1ZWlzaFVSTCIsInVybCIsImdldFRleHQiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3QiLCJhY2NlcHQiLCJlbmFibGVkIiwiaXNFbXB0eSIsInN0YXRlIiwiYWNjZXB0RW5hYmxlZCIsInNldFN0YXRlIiwiVGV4dEJ1ZmZlciIsInN1YiIsIm9uRGlkQ2hhbmdlIiwiZGlkQ2hhbmdlVVJMIiwidGFiR3JvdXAiLCJUYWJHcm91cCIsInJlbmRlciIsImNhbmNlbCIsImluUHJvZ3Jlc3MiLCJlcnJvciIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiY29tcG9uZW50RGlkTW91bnQiLCJhdXRvZm9jdXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJwYXJzZVVybCIsImdldElzc3VlaXNoVXJsIiwibWF0Y2hlcyIsIm1hdGNoIiwiX2Z1bGwiLCJyZXBvT3duZXIiLCJyZXBvTmFtZSIsImlzc3VlaXNoTnVtYmVyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJnZXRQYXJhbXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJvYmplY3QiLCJvcGVuSXNzdWVpc2hJdGVtIiwid29ya2RpciIsImV4ZWMiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwidXJpIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiYnVpbGRVUkkiLCJpdGVtIiwib3BlbiIsInNlYXJjaEFsbFBhbmVzIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiZnJvbSJdLCJzb3VyY2VzIjpbIm9wZW4taXNzdWVpc2gtZGlhbG9nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgVGFiR3JvdXAgZnJvbSAnLi4vdGFiLWdyb3VwJztcbmltcG9ydCBEaWFsb2dWaWV3IGZyb20gJy4vZGlhbG9nLXZpZXcnO1xuaW1wb3J0IHtUYWJiYWJsZVRleHRFZGl0b3J9IGZyb20gJy4vdGFiYmFibGUnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBJU1NVRUlTSF9VUkxfUkVHRVggPSAvXig/Omh0dHBzPzpcXC9cXC8pPyhnaXRodWIuY29tKVxcLyhbXi9dKylcXC8oW14vXSspXFwvKD86aXNzdWVzfHB1bGwpXFwvKFxcZCspLztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3Blbklzc3VlaXNoRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbFxuICAgIHJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBnZXRQYXJhbXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBhY2NlcHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBjYW5jZWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBpblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBlcnJvcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoRXJyb3IpLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMudXJsID0gbmV3IFRleHRCdWZmZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY2NlcHRFbmFibGVkOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5zdWIgPSB0aGlzLnVybC5vbkRpZENoYW5nZSh0aGlzLmRpZENoYW5nZVVSTCk7XG5cbiAgICB0aGlzLnRhYkdyb3VwID0gbmV3IFRhYkdyb3VwKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dWaWV3XG4gICAgICAgIGFjY2VwdEVuYWJsZWQ9e3RoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZH1cbiAgICAgICAgYWNjZXB0Q2xhc3NOYW1lPVwiaWNvbiBpY29uLWdpdC1wdWxsLXJlcXVlc3RcIlxuICAgICAgICBhY2NlcHRUZXh0PVwiT3BlbiBJc3N1ZSBvciBQdWxsIFJlcXVlc3RcIlxuICAgICAgICBhY2NlcHQ9e3RoaXMuYWNjZXB0fVxuICAgICAgICBjYW5jZWw9e3RoaXMucHJvcHMucmVxdWVzdC5jYW5jZWx9XG4gICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICBpblByb2dyZXNzPXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgIGVycm9yPXt0aGlzLnByb3BzLmVycm9yfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+XG5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dMYWJlbFwiPlxuICAgICAgICAgIElzc3VlIG9yIHB1bGwgcmVxdWVzdCBVUkw6XG4gICAgICAgICAgPFRhYmJhYmxlVGV4dEVkaXRvclxuICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGF1dG9mb2N1c1xuICAgICAgICAgICAgbWluaVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLU9wZW5Jc3N1ZWlzaC11cmxcIlxuICAgICAgICAgICAgYnVmZmVyPXt0aGlzLnVybH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICA8L0RpYWxvZ1ZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudGFiR3JvdXAuYXV0b2ZvY3VzKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gIH1cblxuICBhY2NlcHQgPSAoKSA9PiB7XG4gICAgY29uc3QgaXNzdWVpc2hVUkwgPSB0aGlzLnVybC5nZXRUZXh0KCk7XG4gICAgaWYgKGlzc3VlaXNoVVJMLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcXVlc3QuYWNjZXB0KGlzc3VlaXNoVVJMKTtcbiAgfVxuXG4gIHBhcnNlVXJsKCkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0SXNzdWVpc2hVcmwoKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdXJsLm1hdGNoKElTU1VFSVNIX1VSTF9SRUdFWCk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IFtfZnVsbCwgcmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJdID0gbWF0Y2hlczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHJldHVybiB7cmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJ9O1xuICB9XG5cbiAgZGlkQ2hhbmdlVVJMID0gKCkgPT4ge1xuICAgIGNvbnN0IGVuYWJsZWQgPSAhdGhpcy51cmwuaXNFbXB0eSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmFjY2VwdEVuYWJsZWQgIT09IGVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FjY2VwdEVuYWJsZWQ6IGVuYWJsZWR9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5Jc3N1ZWlzaEl0ZW0oaXNzdWVpc2hVUkwsIHt3b3Jrc3BhY2UsIHdvcmtkaXJ9KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBJU1NVRUlTSF9VUkxfUkVHRVguZXhlYyhpc3N1ZWlzaFVSTCk7XG4gIGlmICghbWF0Y2hlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgaXNzdWUgb3IgcHVsbCByZXF1ZXN0IFVSTCcpO1xuICB9XG4gIGNvbnN0IFssIGhvc3QsIG93bmVyLCByZXBvLCBudW1iZXJdID0gbWF0Y2hlcztcbiAgY29uc3QgdXJpID0gSXNzdWVpc2hEZXRhaWxJdGVtLmJ1aWxkVVJJKHtob3N0LCBvd25lciwgcmVwbywgbnVtYmVyLCB3b3JrZGlyfSk7XG4gIGNvbnN0IGl0ZW0gPSBhd2FpdCB3b3Jrc3BhY2Uub3Blbih1cmksIHtzZWFyY2hBbGxQYW5lczogdHJ1ZX0pO1xuICBhZGRFdmVudCgnb3Blbi1pc3N1ZWlzaC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiAnZGlhbG9nJ30pO1xuICByZXR1cm4gaXRlbTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMkM7QUFBQTtBQUFBO0FBQUE7QUFFM0MsTUFBTUEsa0JBQWtCLEdBQUcseUVBQXlFO0FBRXJGLE1BQU1DLGtCQUFrQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWdCOURDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsZ0NBbUROLE1BQU07TUFDYixNQUFNQyxXQUFXLEdBQUcsSUFBSSxDQUFDQyxHQUFHLENBQUNDLE9BQU8sRUFBRTtNQUN0QyxJQUFJRixXQUFXLENBQUNHLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDNUIsT0FBT0MsT0FBTyxDQUFDQyxPQUFPLEVBQUU7TUFDMUI7TUFFQSxPQUFPLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxPQUFPLENBQUNDLE1BQU0sQ0FBQ1AsV0FBVyxDQUFDO0lBQy9DLENBQUM7SUFBQSxzQ0FZYyxNQUFNO01BQ25CLE1BQU1RLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQ1AsR0FBRyxDQUFDUSxPQUFPLEVBQUU7TUFDbkMsSUFBSSxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsYUFBYSxLQUFLSCxPQUFPLEVBQUU7UUFDeEMsSUFBSSxDQUFDSSxRQUFRLENBQUM7VUFBQ0QsYUFBYSxFQUFFSDtRQUFPLENBQUMsQ0FBQztNQUN6QztJQUNGLENBQUM7SUF6RUMsSUFBSSxDQUFDUCxHQUFHLEdBQUcsSUFBSVksZ0JBQVUsRUFBRTtJQUUzQixJQUFJLENBQUNILEtBQUssR0FBRztNQUNYQyxhQUFhLEVBQUU7SUFDakIsQ0FBQztJQUVELElBQUksQ0FBQ0csR0FBRyxHQUFHLElBQUksQ0FBQ2IsR0FBRyxDQUFDYyxXQUFXLENBQUMsSUFBSSxDQUFDQyxZQUFZLENBQUM7SUFFbEQsSUFBSSxDQUFDQyxRQUFRLEdBQUcsSUFBSUMsaUJBQVEsRUFBRTtFQUNoQztFQUVBQyxNQUFNLEdBQUc7SUFDUCxPQUNFLDZCQUFDLG1CQUFVO01BQ1QsYUFBYSxFQUFFLElBQUksQ0FBQ1QsS0FBSyxDQUFDQyxhQUFjO01BQ3hDLGVBQWUsRUFBQyw0QkFBNEI7TUFDNUMsVUFBVSxFQUFDLDRCQUE0QjtNQUN2QyxNQUFNLEVBQUUsSUFBSSxDQUFDSixNQUFPO01BQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUNSLEtBQUssQ0FBQ08sT0FBTyxDQUFDYyxNQUFPO01BQ2xDLFFBQVEsRUFBRSxJQUFJLENBQUNILFFBQVM7TUFDeEIsVUFBVSxFQUFFLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ3NCLFVBQVc7TUFDbEMsS0FBSyxFQUFFLElBQUksQ0FBQ3RCLEtBQUssQ0FBQ3VCLEtBQU07TUFDeEIsU0FBUyxFQUFFLElBQUksQ0FBQ3ZCLEtBQUssQ0FBQ3dCLFNBQVU7TUFDaEMsUUFBUSxFQUFFLElBQUksQ0FBQ3hCLEtBQUssQ0FBQ3lCO0lBQVMsR0FFOUI7TUFBTyxTQUFTLEVBQUM7SUFBb0IsaUNBRW5DLDZCQUFDLDRCQUFrQjtNQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDUCxRQUFTO01BQ3hCLFFBQVEsRUFBRSxJQUFJLENBQUNsQixLQUFLLENBQUN5QixRQUFTO01BQzlCLFNBQVM7TUFDVCxJQUFJO01BQ0osU0FBUyxFQUFDLHlCQUF5QjtNQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDdkI7SUFBSSxFQUNqQixDQUNJLENBRUc7RUFFakI7RUFFQXdCLGlCQUFpQixHQUFHO0lBQ2xCLElBQUksQ0FBQ1IsUUFBUSxDQUFDUyxTQUFTLEVBQUU7RUFDM0I7RUFFQUMsb0JBQW9CLEdBQUc7SUFDckIsSUFBSSxDQUFDYixHQUFHLENBQUNjLE9BQU8sRUFBRTtFQUNwQjtFQVdBQyxRQUFRLEdBQUc7SUFDVCxNQUFNNUIsR0FBRyxHQUFHLElBQUksQ0FBQzZCLGNBQWMsRUFBRTtJQUNqQyxNQUFNQyxPQUFPLEdBQUc5QixHQUFHLENBQUMrQixLQUFLLENBQUN0QyxrQkFBa0IsQ0FBQztJQUM3QyxJQUFJLENBQUNxQyxPQUFPLEVBQUU7TUFDWixPQUFPLEtBQUs7SUFDZDtJQUNBLE1BQU0sQ0FBQ0UsS0FBSyxFQUFFQyxTQUFTLEVBQUVDLFFBQVEsRUFBRUMsY0FBYyxDQUFDLEdBQUdMLE9BQU8sQ0FBQyxDQUFDO0lBQzlELE9BQU87TUFBQ0csU0FBUztNQUFFQyxRQUFRO01BQUVDO0lBQWMsQ0FBQztFQUM5QztBQVFGO0FBQUM7QUFBQSxnQkE3Rm9CekMsa0JBQWtCLGVBQ2xCO0VBQ2pCO0VBQ0FXLE9BQU8sRUFBRStCLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUN2QkMsU0FBUyxFQUFFRixrQkFBUyxDQUFDRyxJQUFJLENBQUNDLFVBQVU7SUFDcENsQyxNQUFNLEVBQUU4QixrQkFBUyxDQUFDRyxJQUFJLENBQUNDLFVBQVU7SUFDakNyQixNQUFNLEVBQUVpQixrQkFBUyxDQUFDRyxJQUFJLENBQUNDO0VBQ3pCLENBQUMsQ0FBQyxDQUFDQSxVQUFVO0VBQ2JwQixVQUFVLEVBQUVnQixrQkFBUyxDQUFDSyxJQUFJO0VBQzFCcEIsS0FBSyxFQUFFZSxrQkFBUyxDQUFDTSxVQUFVLENBQUNDLEtBQUssQ0FBQztFQUVsQztFQUNBckIsU0FBUyxFQUFFYyxrQkFBUyxDQUFDUSxNQUFNLENBQUNKLFVBQVU7RUFDdENqQixRQUFRLEVBQUVhLGtCQUFTLENBQUNRLE1BQU0sQ0FBQ0o7QUFDN0IsQ0FBQztBQWlGSSxlQUFlSyxnQkFBZ0IsQ0FBQzlDLFdBQVcsRUFBRTtFQUFDdUIsU0FBUztFQUFFd0I7QUFBTyxDQUFDLEVBQUU7RUFDeEUsTUFBTWhCLE9BQU8sR0FBR3JDLGtCQUFrQixDQUFDc0QsSUFBSSxDQUFDaEQsV0FBVyxDQUFDO0VBQ3BELElBQUksQ0FBQytCLE9BQU8sRUFBRTtJQUNaLE1BQU0sSUFBSWEsS0FBSyxDQUFDLHVDQUF1QyxDQUFDO0VBQzFEO0VBQ0EsTUFBTSxHQUFHSyxJQUFJLEVBQUVDLEtBQUssRUFBRUMsSUFBSSxFQUFFQyxNQUFNLENBQUMsR0FBR3JCLE9BQU87RUFDN0MsTUFBTXNCLEdBQUcsR0FBR0MsMkJBQWtCLENBQUNDLFFBQVEsQ0FBQztJQUFDTixJQUFJO0lBQUVDLEtBQUs7SUFBRUMsSUFBSTtJQUFFQyxNQUFNO0lBQUVMO0VBQU8sQ0FBQyxDQUFDO0VBQzdFLE1BQU1TLElBQUksR0FBRyxNQUFNakMsU0FBUyxDQUFDa0MsSUFBSSxDQUFDSixHQUFHLEVBQUU7SUFBQ0ssY0FBYyxFQUFFO0VBQUksQ0FBQyxDQUFDO0VBQzlELElBQUFDLHVCQUFRLEVBQUMsdUJBQXVCLEVBQUU7SUFBQ0MsT0FBTyxFQUFFLFFBQVE7SUFBRUMsSUFBSSxFQUFFO0VBQVEsQ0FBQyxDQUFDO0VBQ3RFLE9BQU9MLElBQUk7QUFDYiJ9