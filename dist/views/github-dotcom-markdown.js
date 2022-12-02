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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duLmpzIl0sIm5hbWVzIjpbIkJhcmVHaXRodWJEb3Rjb21NYXJrZG93biIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZXZlbnQiLCJ0YXJnZXQiLCJkYXRhc2V0IiwidXJsIiwicHJvcHMiLCJoYW5kbGVDbGlja0V2ZW50Iiwib3Blbklzc3VlaXNoTGlua0luTmV3VGFiIiwicmVwb093bmVyIiwicmVwb05hbWUiLCJpc3N1ZWlzaE51bWJlciIsInN3aXRjaFRvSXNzdWVpc2giLCJvcGVuTGlua0luQnJvd3NlciIsImdldEF0dHJpYnV0ZSIsImNvbXBvbmVudERpZE1vdW50IiwiY29tbWFuZFN1YnNjcmlwdGlvbnMiLCJhdG9tIiwiY29tbWFuZHMiLCJhZGQiLCJSZWFjdERvbSIsImZpbmRET01Ob2RlIiwib3BlbkxpbmtJbk5ld1RhYiIsIm9wZW5MaW5rSW5UaGlzVGFiIiwic2V0dXBDb21wb25lbnRIYW5kbGVycyIsInNldHVwVG9vbHRpcEhhbmRsZXJzIiwiY29tcG9uZW50RGlkVXBkYXRlIiwiY29tcG9uZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUNsaWNrIiwiY29tcG9uZW50SGFuZGxlcnMiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvb2x0aXBTdWJzY3JpcHRpb25zIiwiZGlzcG9zZSIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsIm5vZGUiLCJpdGVtIiwiVXNlck1lbnRpb25Ub29sdGlwSXRlbSIsInRleHRDb250ZW50IiwicmVsYXlFbnZpcm9ubWVudCIsInRvb2x0aXBzIiwidHJpZ2dlciIsImRlbGF5IiwiY2xhc3MiLCJkZXN0cm95IiwiSXNzdWVpc2hUb29sdGlwSXRlbSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVuZGVyIiwiY2xhc3NOYW1lIiwiYyIsIl9faHRtbCIsImh0bWwiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiZnVuYyIsIkdpdGh1YkRvdGNvbU1hcmtkb3duIiwibGFzdE1hcmtkb3duIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJtYXJrZG93biJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVPLE1BQU1BLHdCQUFOLFNBQXVDQyxlQUFNQyxTQUE3QyxDQUF1RDtBQUFBO0FBQUE7O0FBQUEseUNBc0Y5Q0MsS0FBSyxJQUFJO0FBQ3JCLFVBQUlBLEtBQUssQ0FBQ0MsTUFBTixDQUFhQyxPQUFiLENBQXFCQyxHQUF6QixFQUE4QjtBQUM1QixlQUFPLEtBQUtDLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEJMLEtBQTVCLEVBQW1DQSxLQUFLLENBQUNDLE1BQU4sQ0FBYUMsT0FBYixDQUFxQkMsR0FBeEQsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sSUFBUDtBQUNEO0FBQ0YsS0E1RjJEOztBQUFBLDhDQThGekNILEtBQUssSUFBSTtBQUMxQixhQUFPLEtBQUtJLEtBQUwsQ0FBV0Usd0JBQVgsQ0FBb0NOLEtBQUssQ0FBQ0MsTUFBTixDQUFhQyxPQUFiLENBQXFCQyxHQUF6RCxDQUFQO0FBQ0QsS0FoRzJEOztBQUFBLCtDQWtHeENILEtBQUssSUFBSTtBQUMzQixZQUFNO0FBQUNPLFFBQUFBLFNBQUQ7QUFBWUMsUUFBQUEsUUFBWjtBQUFzQkMsUUFBQUE7QUFBdEIsVUFBd0Msd0NBQXFCVCxLQUFLLENBQUNDLE1BQU4sQ0FBYUMsT0FBYixDQUFxQkMsR0FBMUMsQ0FBOUM7QUFDQSxXQUFLQyxLQUFMLENBQVdNLGdCQUFYLENBQTRCSCxTQUE1QixFQUF1Q0MsUUFBdkMsRUFBaURDLGNBQWpEO0FBQ0QsS0FyRzJEOztBQUFBLCtDQXVHeENULEtBQUssSUFBSTtBQUMzQixhQUFPLEtBQUtJLEtBQUwsQ0FBV08saUJBQVgs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RTtBQUZBLEtBTndEO0FBQUE7O0FBV2pDLFNBQXhCUSx3QkFBd0IsQ0FBQ3hELEtBQUQsRUFBUXlELEtBQVIsRUFBZTtBQUM1QyxRQUFJekQsS0FBSyxDQUFDZ0QsSUFBVixFQUFnQjtBQUNkLGFBQU87QUFBQ0EsUUFBQUEsSUFBSSxFQUFFaEQsS0FBSyxDQUFDZ0Q7QUFBYixPQUFQO0FBQ0Q7O0FBRUQsUUFBSWhELEtBQUssQ0FBQzBELFFBQU4sSUFBa0IxRCxLQUFLLENBQUMwRCxRQUFOLEtBQW1CRCxLQUFLLENBQUNGLFlBQS9DLEVBQTZEO0FBQzNELGFBQU87QUFBQ1AsUUFBQUEsSUFBSSxFQUFFLDZCQUFlaEQsS0FBSyxDQUFDMEQsUUFBckIsQ0FBUDtBQUF1Q0gsUUFBQUEsWUFBWSxFQUFFdkQsS0FBSyxDQUFDMEQ7QUFBM0QsT0FBUDtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNEOztBQUVEZCxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLHlCQUFELENBQWtCLFFBQWxCLFFBQ0dSLGdCQUFnQixJQUNmLDZCQUFDLHdCQUFEO0FBQ0UsTUFBQSxnQkFBZ0IsRUFBRUE7QUFEcEIsT0FFTSxLQUFLcEMsS0FGWDtBQUdFLE1BQUEsSUFBSSxFQUFFLEtBQUt5RCxLQUFMLENBQVdUO0FBSG5CLE9BRkosQ0FERjtBQVdEOztBQW5DK0Q7Ozs7Z0JBQTdDTSxvQixlQUNBO0FBQ2pCSSxFQUFBQSxRQUFRLEVBQUVULG1CQUFVRyxNQURIO0FBRWpCSixFQUFBQSxJQUFJLEVBQUVDLG1CQUFVRztBQUZDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2hhbmRsZUNsaWNrRXZlbnQsIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiwgb3BlbkxpbmtJbkJyb3dzZXIsIGdldERhdGFGcm9tR2l0aHViVXJsfSBmcm9tICcuL2lzc3VlaXNoLWxpbmsnO1xuaW1wb3J0IFVzZXJNZW50aW9uVG9vbHRpcEl0ZW0gZnJvbSAnLi4vaXRlbXMvdXNlci1tZW50aW9uLXRvb2x0aXAtaXRlbSc7XG5pbXBvcnQgSXNzdWVpc2hUb29sdGlwSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC10b29sdGlwLWl0ZW0nO1xuaW1wb3J0IFJlbGF5RW52aXJvbm1lbnQgZnJvbSAnLi9yZWxheS1lbnZpcm9ubWVudCc7XG5pbXBvcnQge3JlbmRlck1hcmtkb3dufSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVHaXRodWJEb3Rjb21NYXJrZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVsYXlFbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIGh0bWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlQ2xpY2tFdmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuTGlua0luQnJvd3NlcjogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsYXNzTmFtZTogJycsXG4gICAgaGFuZGxlQ2xpY2tFdmVudCxcbiAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIsXG4gICAgb3BlbkxpbmtJbkJyb3dzZXIsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmNvbW1hbmRTdWJzY3JpcHRpb25zID0gYXRvbS5jb21tYW5kcy5hZGQoUmVhY3REb20uZmluZERPTU5vZGUodGhpcyksIHtcbiAgICAgICdnaXRodWI6b3Blbi1saW5rLWluLW5ldy10YWInOiB0aGlzLm9wZW5MaW5rSW5OZXdUYWIsXG4gICAgICAnZ2l0aHViOm9wZW4tbGluay1pbi1icm93c2VyJzogdGhpcy5vcGVuTGlua0luQnJvd3NlcixcbiAgICAgICdnaXRodWI6b3Blbi1saW5rLWluLXRoaXMtdGFiJzogdGhpcy5vcGVuTGlua0luVGhpc1RhYixcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwQ29tcG9uZW50SGFuZGxlcnMoKTtcbiAgICB0aGlzLnNldHVwVG9vbHRpcEhhbmRsZXJzKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zZXR1cFRvb2x0aXBIYW5kbGVycygpO1xuICB9XG5cbiAgc2V0dXBDb21wb25lbnRIYW5kbGVycygpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgIHRoaXMuY29tcG9uZW50SGFuZGxlcnMgPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0dXBUb29sdGlwSGFuZGxlcnMoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy51c2VyLW1lbnRpb24nKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IG5ldyBVc2VyTWVudGlvblRvb2x0aXBJdGVtKG5vZGUudGV4dENvbnRlbnQsIHRoaXMucHJvcHMucmVsYXlFbnZpcm9ubWVudCk7XG4gICAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZChub2RlLCB7XG4gICAgICAgIHRyaWdnZXI6ICdob3ZlcicsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBjbGFzczogJ2dpdGh1Yi1Qb3BvdmVyJyxcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IGl0ZW0uZGVzdHJveSgpKSk7XG4gICAgfSk7XG4gICAgdGhpcy5jb21wb25lbnQucXVlcnlTZWxlY3RvckFsbCgnLmlzc3VlLWxpbmsnKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IG5ldyBJc3N1ZWlzaFRvb2x0aXBJdGVtKG5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJyksIHRoaXMucHJvcHMucmVsYXlFbnZpcm9ubWVudCk7XG4gICAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZChub2RlLCB7XG4gICAgICAgIHRyaWdnZXI6ICdob3ZlcicsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBjbGFzczogJ2dpdGh1Yi1Qb3BvdmVyJyxcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IGl0ZW0uZGVzdHJveSgpKSk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNvbW1hbmRTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmNvbXBvbmVudEhhbmRsZXJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRvb2x0aXBTdWJzY3JpcHRpb25zICYmIHRoaXMudG9vbHRpcFN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1Eb3RDb21NYXJrZG93bkh0bWwgbmF0aXZlLWtleS1iaW5kaW5ncyAke3RoaXMucHJvcHMuY2xhc3NOYW1lfWB9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICByZWY9e2MgPT4geyB0aGlzLmNvbXBvbmVudCA9IGM7IH19XG4gICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLmh0bWx9fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2sgPSBldmVudCA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5kYXRhc2V0LnVybCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuaGFuZGxlQ2xpY2tFdmVudChldmVudCwgZXZlbnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgb3BlbkxpbmtJbk5ld1RhYiA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIoZXZlbnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgfVxuXG4gIG9wZW5MaW5rSW5UaGlzVGFiID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHtyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcn0gPSBnZXREYXRhRnJvbUdpdGh1YlVybChldmVudC50YXJnZXQuZGF0YXNldC51cmwpO1xuICAgIHRoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaChyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcik7XG4gIH1cblxuICBvcGVuTGlua0luQnJvd3NlciA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuTGlua0luQnJvd3NlcihldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YkRvdGNvbU1hcmtkb3duIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZG93bjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBodG1sOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgbGFzdE1hcmtkb3duOiBudWxsLFxuICAgIGh0bWw6IG51bGwsXG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGlmIChwcm9wcy5odG1sKSB7XG4gICAgICByZXR1cm4ge2h0bWw6IHByb3BzLmh0bWx9O1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5tYXJrZG93biAmJiBwcm9wcy5tYXJrZG93biAhPT0gc3RhdGUubGFzdE1hcmtkb3duKSB7XG4gICAgICByZXR1cm4ge2h0bWw6IHJlbmRlck1hcmtkb3duKHByb3BzLm1hcmtkb3duKSwgbGFzdE1hcmtkb3duOiBwcm9wcy5tYXJrZG93bn07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWxheUVudmlyb25tZW50LkNvbnN1bWVyPlxuICAgICAgICB7cmVsYXlFbnZpcm9ubWVudCA9PiAoXG4gICAgICAgICAgPEJhcmVHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgcmVsYXlFbnZpcm9ubWVudD17cmVsYXlFbnZpcm9ubWVudH1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgICAgaHRtbD17dGhpcy5zdGF0ZS5odG1sfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L1JlbGF5RW52aXJvbm1lbnQuQ29uc3VtZXI+XG4gICAgKTtcbiAgfVxufVxuIl19