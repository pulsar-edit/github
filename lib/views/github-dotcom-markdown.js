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