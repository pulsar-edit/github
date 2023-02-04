"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareGithubDotcomMarkdown = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _issueishLink = require("./issueish-link");
var _userMentionTooltipItem = _interopRequireDefault(require("../items/user-mention-tooltip-item"));
var _issueishTooltipItem = _interopRequireDefault(require("../items/issueish-tooltip-item"));
var _relayEnvironment = _interopRequireDefault(require("./relay-environment"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareGithubDotcomMarkdown extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleClick", event => {
      if (event.target.dataset.url) {
        return this.props.handleClickEvent(event, event.target.dataset.url);
      } else {
        return null;
      }
    });
    _defineProperty(this, "openLinkInNewTab", event => {
      return this.props.openIssueishLinkInNewTab(event.target.dataset.url);
    });
    _defineProperty(this, "openLinkInThisTab", event => {
      const {
        repoOwner,
        repoName,
        issueishNumber
      } = (0, _issueishLink.getDataFromGithubUrl)(event.target.dataset.url);
      this.props.switchToIssueish(repoOwner, repoName, issueishNumber);
    });
    _defineProperty(this, "openLinkInBrowser", event => {
      return this.props.openLinkInBrowser(event.target.getAttribute('href'));
    });
  }
  componentDidMount() {
    this.commandSubscriptions = atom.commands.add(_reactDom.default.findDOMNode(this), {
      'github:open-link-in-new-tab': this.openLinkInNewTab,
      'github:open-link-in-browser': this.openLinkInBrowser,
      'github:open-link-in-this-tab': this.openLinkInThisTab
    });
    this.setupComponentHandlers();
    this.setupTooltipHandlers();
  }
  componentDidUpdate() {
    this.setupTooltipHandlers();
  }
  setupComponentHandlers() {
    this.component.addEventListener('click', this.handleClick);
    this.componentHandlers = new _eventKit.Disposable(() => {
      this.component.removeEventListener('click', this.handleClick);
    });
  }
  setupTooltipHandlers() {
    if (this.tooltipSubscriptions) {
      this.tooltipSubscriptions.dispose();
    }
    this.tooltipSubscriptions = new _eventKit.CompositeDisposable();
    this.component.querySelectorAll('.user-mention').forEach(node => {
      const item = new _userMentionTooltipItem.default(node.textContent, this.props.relayEnvironment);
      this.tooltipSubscriptions.add(atom.tooltips.add(node, {
        trigger: 'hover',
        delay: 0,
        class: 'github-Popover',
        item
      }));
      this.tooltipSubscriptions.add(new _eventKit.Disposable(() => item.destroy()));
    });
    this.component.querySelectorAll('.issue-link').forEach(node => {
      const item = new _issueishTooltipItem.default(node.getAttribute('href'), this.props.relayEnvironment);
      this.tooltipSubscriptions.add(atom.tooltips.add(node, {
        trigger: 'hover',
        delay: 0,
        class: 'github-Popover',
        item
      }));
      this.tooltipSubscriptions.add(new _eventKit.Disposable(() => item.destroy()));
    });
  }
  componentWillUnmount() {
    this.commandSubscriptions.dispose();
    this.componentHandlers.dispose();
    this.tooltipSubscriptions && this.tooltipSubscriptions.dispose();
  }
  render() {
    return _react.default.createElement("div", {
      className: `github-DotComMarkdownHtml native-key-bindings ${this.props.className}`,
      tabIndex: "-1",
      ref: c => {
        this.component = c;
      },
      dangerouslySetInnerHTML: {
        __html: this.props.html
      }
    });
  }
}
exports.BareGithubDotcomMarkdown = BareGithubDotcomMarkdown;
_defineProperty(BareGithubDotcomMarkdown, "propTypes", {
  relayEnvironment: _propTypes.default.object.isRequired,
  className: _propTypes.default.string,
  html: _propTypes.default.string.isRequired,
  switchToIssueish: _propTypes.default.func.isRequired,
  handleClickEvent: _propTypes.default.func,
  openIssueishLinkInNewTab: _propTypes.default.func,
  openLinkInBrowser: _propTypes.default.func
});
_defineProperty(BareGithubDotcomMarkdown, "defaultProps", {
  className: '',
  handleClickEvent: _issueishLink.handleClickEvent,
  openIssueishLinkInNewTab: _issueishLink.openIssueishLinkInNewTab,
  openLinkInBrowser: _issueishLink.openLinkInBrowser
});
class GithubDotcomMarkdown extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      lastMarkdown: null,
      html: null
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.html) {
      return {
        html: props.html
      };
    }
    if (props.markdown && props.markdown !== state.lastMarkdown) {
      return {
        html: (0, _helpers.renderMarkdown)(props.markdown),
        lastMarkdown: props.markdown
      };
    }
    return null;
  }
  render() {
    return _react.default.createElement(_relayEnvironment.default.Consumer, null, relayEnvironment => _react.default.createElement(BareGithubDotcomMarkdown, _extends({
      relayEnvironment: relayEnvironment
    }, this.props, {
      html: this.state.html
    })));
  }
}
exports.default = GithubDotcomMarkdown;
_defineProperty(GithubDotcomMarkdown, "propTypes", {
  markdown: _propTypes.default.string,
  html: _propTypes.default.string
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlR2l0aHViRG90Y29tTWFya2Rvd24iLCJSZWFjdCIsIkNvbXBvbmVudCIsImV2ZW50IiwidGFyZ2V0IiwiZGF0YXNldCIsInVybCIsInByb3BzIiwiaGFuZGxlQ2xpY2tFdmVudCIsIm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiIsInJlcG9Pd25lciIsInJlcG9OYW1lIiwiaXNzdWVpc2hOdW1iZXIiLCJnZXREYXRhRnJvbUdpdGh1YlVybCIsInN3aXRjaFRvSXNzdWVpc2giLCJvcGVuTGlua0luQnJvd3NlciIsImdldEF0dHJpYnV0ZSIsImNvbXBvbmVudERpZE1vdW50IiwiY29tbWFuZFN1YnNjcmlwdGlvbnMiLCJhdG9tIiwiY29tbWFuZHMiLCJhZGQiLCJSZWFjdERvbSIsImZpbmRET01Ob2RlIiwib3BlbkxpbmtJbk5ld1RhYiIsIm9wZW5MaW5rSW5UaGlzVGFiIiwic2V0dXBDb21wb25lbnRIYW5kbGVycyIsInNldHVwVG9vbHRpcEhhbmRsZXJzIiwiY29tcG9uZW50RGlkVXBkYXRlIiwiY29tcG9uZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUNsaWNrIiwiY29tcG9uZW50SGFuZGxlcnMiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvb2x0aXBTdWJzY3JpcHRpb25zIiwiZGlzcG9zZSIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJpdGVtIiwiVXNlck1lbnRpb25Ub29sdGlwSXRlbSIsInRleHRDb250ZW50IiwicmVsYXlFbnZpcm9ubWVudCIsInRvb2x0aXBzIiwidHJpZ2dlciIsImRlbGF5IiwiY2xhc3MiLCJkZXN0cm95IiwiSXNzdWVpc2hUb29sdGlwSXRlbSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVuZGVyIiwiY2xhc3NOYW1lIiwiYyIsIl9faHRtbCIsImh0bWwiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiZnVuYyIsIkdpdGh1YkRvdGNvbU1hcmtkb3duIiwibGFzdE1hcmtkb3duIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJtYXJrZG93biIsInJlbmRlck1hcmtkb3duIl0sInNvdXJjZXMiOlsiZ2l0aHViLWRvdGNvbS1tYXJrZG93bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2hhbmRsZUNsaWNrRXZlbnQsIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiwgb3BlbkxpbmtJbkJyb3dzZXIsIGdldERhdGFGcm9tR2l0aHViVXJsfSBmcm9tICcuL2lzc3VlaXNoLWxpbmsnO1xuaW1wb3J0IFVzZXJNZW50aW9uVG9vbHRpcEl0ZW0gZnJvbSAnLi4vaXRlbXMvdXNlci1tZW50aW9uLXRvb2x0aXAtaXRlbSc7XG5pbXBvcnQgSXNzdWVpc2hUb29sdGlwSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC10b29sdGlwLWl0ZW0nO1xuaW1wb3J0IFJlbGF5RW52aXJvbm1lbnQgZnJvbSAnLi9yZWxheS1lbnZpcm9ubWVudCc7XG5pbXBvcnQge3JlbmRlck1hcmtkb3dufSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVHaXRodWJEb3Rjb21NYXJrZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVsYXlFbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIGh0bWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlQ2xpY2tFdmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuTGlua0luQnJvd3NlcjogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsYXNzTmFtZTogJycsXG4gICAgaGFuZGxlQ2xpY2tFdmVudCxcbiAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIsXG4gICAgb3BlbkxpbmtJbkJyb3dzZXIsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmNvbW1hbmRTdWJzY3JpcHRpb25zID0gYXRvbS5jb21tYW5kcy5hZGQoUmVhY3REb20uZmluZERPTU5vZGUodGhpcyksIHtcbiAgICAgICdnaXRodWI6b3Blbi1saW5rLWluLW5ldy10YWInOiB0aGlzLm9wZW5MaW5rSW5OZXdUYWIsXG4gICAgICAnZ2l0aHViOm9wZW4tbGluay1pbi1icm93c2VyJzogdGhpcy5vcGVuTGlua0luQnJvd3NlcixcbiAgICAgICdnaXRodWI6b3Blbi1saW5rLWluLXRoaXMtdGFiJzogdGhpcy5vcGVuTGlua0luVGhpc1RhYixcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwQ29tcG9uZW50SGFuZGxlcnMoKTtcbiAgICB0aGlzLnNldHVwVG9vbHRpcEhhbmRsZXJzKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zZXR1cFRvb2x0aXBIYW5kbGVycygpO1xuICB9XG5cbiAgc2V0dXBDb21wb25lbnRIYW5kbGVycygpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgIHRoaXMuY29tcG9uZW50SGFuZGxlcnMgPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBUb29sdGlwSGFuZGxlcnMoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy51c2VyLW1lbnRpb24nKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IG5ldyBVc2VyTWVudGlvblRvb2x0aXBJdGVtKG5vZGUudGV4dENvbnRlbnQsIHRoaXMucHJvcHMucmVsYXlFbnZpcm9ubWVudCk7XG4gICAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZChub2RlLCB7XG4gICAgICAgIHRyaWdnZXI6ICdob3ZlcicsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBjbGFzczogJ2dpdGh1Yi1Qb3BvdmVyJyxcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IGl0ZW0uZGVzdHJveSgpKSk7XG4gICAgfSk7XG4gICAgdGhpcy5jb21wb25lbnQucXVlcnlTZWxlY3RvckFsbCgnLmlzc3VlLWxpbmsnKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IG5ldyBJc3N1ZWlzaFRvb2x0aXBJdGVtKG5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJyksIHRoaXMucHJvcHMucmVsYXlFbnZpcm9ubWVudCk7XG4gICAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZChub2RlLCB7XG4gICAgICAgIHRyaWdnZXI6ICdob3ZlcicsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBjbGFzczogJ2dpdGh1Yi1Qb3BvdmVyJyxcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IGl0ZW0uZGVzdHJveSgpKSk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNvbW1hbmRTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmNvbXBvbmVudEhhbmRsZXJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zICYmIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1Eb3RDb21NYXJrZG93bkh0bWwgbmF0aXZlLWtleS1iaW5kaW5ncyAke3RoaXMucHJvcHMuY2xhc3NOYW1lfWB9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICByZWY9e2MgPT4geyB0aGlzLmNvbXBvbmVudCA9IGM7IH19XG4gICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLmh0bWx9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2sgPSBldmVudCA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5kYXRhc2V0LnVybCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuaGFuZGxlQ2xpY2tFdmVudChldmVudCwgZXZlbnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgb3BlbkxpbmtJbk5ld1RhYiA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIoZXZlbnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgfVxuXG4gIG9wZW5MaW5rSW5UaGlzVGFiID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHtyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcn0gPSBnZXREYXRhRnJvbUdpdGh1YlVybChldmVudC50YXJnZXQuZGF0YXNldC51cmwpO1xuICAgIHRoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaChyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcik7XG4gIH1cblxuICBvcGVuTGlua0luQnJvd3NlciA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuTGlua0luQnJvd3NlcihldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YkRvdGNvbU1hcmtkb3duIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZG93bjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBodG1sOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgbGFzdE1hcmtkb3duOiBudWxsLFxuICAgIGh0bWw6IG51bGwsXG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGlmIChwcm9wcy5odG1sKSB7XG4gICAgICByZXR1cm4ge2h0bWw6IHByb3BzLmh0bWx9O1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5tYXJrZG93biAmJiBwcm9wcy5tYXJrZG93biAhPT0gc3RhdGUubGFzdE1hcmtkb3duKSB7XG4gICAgICByZXR1cm4ge2h0bWw6IHJlbmRlck1hcmtkb3duKHByb3BzLm1hcmtkb3duKSwgbGFzdE1hcmtkb3duOiBwcm9wcy5tYXJrZG93bn07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWxheUVudmlyb25tZW50LkNvbnN1bWVyPlxuICAgICAgICB7cmVsYXlFbnZpcm9ubWVudCA9PiAoXG4gICAgICAgICAgPEJhcmVHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgcmVsYXlFbnZpcm9ubWVudD17cmVsYXlFbnZpcm9ubWVudH1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgICAgaHRtbD17dGhpcy5zdGF0ZS5odG1sfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L1JlbGF5RW52aXJvbm1lbnQuQ29uc3VtZXI+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVuQyxNQUFNQSx3QkFBd0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEscUNBc0Y5Q0MsS0FBSyxJQUFJO01BQ3JCLElBQUlBLEtBQUssQ0FBQ0MsTUFBTSxDQUFDQyxPQUFPLENBQUNDLEdBQUcsRUFBRTtRQUM1QixPQUFPLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxnQkFBZ0IsQ0FBQ0wsS0FBSyxFQUFFQSxLQUFLLENBQUNDLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxHQUFHLENBQUM7TUFDckUsQ0FBQyxNQUFNO1FBQ0wsT0FBTyxJQUFJO01BQ2I7SUFDRixDQUFDO0lBQUEsMENBRWtCSCxLQUFLLElBQUk7TUFDMUIsT0FBTyxJQUFJLENBQUNJLEtBQUssQ0FBQ0Usd0JBQXdCLENBQUNOLEtBQUssQ0FBQ0MsTUFBTSxDQUFDQyxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUN0RSxDQUFDO0lB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