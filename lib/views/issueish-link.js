"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IssueishLink;
exports.handleClickEvent = handleClickEvent;
exports.openIssueishLinkInNewTab = openIssueishLinkInNewTab;
exports.openLinkInBrowser = openLinkInBrowser;
exports.getDataFromGithubUrl = getDataFromGithubUrl;

var _url = _interopRequireDefault(require("url"));

var _electron = require("electron");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// eslint-disable-next-line no-shadow
function IssueishLink(_ref) {
  let {
    url,
    children
  } = _ref,
      others = _objectWithoutProperties(_ref, ["url", "children"]);

  function clickHandler(event) {
    handleClickEvent(event, url);
  }

  return _react.default.createElement("a", _extends({}, others, {
    onClick: clickHandler
  }), children);
}

IssueishLink.propTypes = {
  url: _propTypes.default.string.isRequired,
  children: _propTypes.default.node
}; // eslint-disable-next-line no-shadow

function handleClickEvent(event, url) {
  event.preventDefault();
  event.stopPropagation();

  if (!event.shiftKey) {
    return openIssueishLinkInNewTab(url, {
      activate: !(event.metaKey || event.ctrlKey)
    });
  } else {
    // Open in browser if shift key held
    return openLinkInBrowser(url);
  }
} // eslint-disable-next-line no-shadow


function openIssueishLinkInNewTab(url, options = {}) {
  const uri = getAtomUriForGithubUrl(url);

  if (uri) {
    return openInNewTab(uri, options);
  } else {
    return null;
  }
}

async function openLinkInBrowser(uri) {
  await _electron.shell.openExternal(uri);
  (0, _reporterProxy.addEvent)('open-issueish-in-browser', {
    package: 'github',
    from: 'issueish-link'
  });
}

function getAtomUriForGithubUrl(githubUrl) {
  return getUriForData(getDataFromGithubUrl(githubUrl));
}

function getDataFromGithubUrl(githubUrl) {
  const {
    hostname,
    pathname
  } = _url.default.parse(githubUrl);

  const [repoOwner, repoName, type, issueishNumber] = pathname.split('/').filter(s => s);
  return {
    hostname,
    repoOwner,
    repoName,
    type,
    issueishNumber: parseInt(issueishNumber, 10)
  };
}

function getUriForData({
  hostname,
  repoOwner,
  repoName,
  type,
  issueishNumber
}) {
  if (hostname !== 'github.com' || !['pull', 'issues'].includes(type) || !issueishNumber || isNaN(issueishNumber)) {
    return null;
  } else {
    return _issueishDetailItem.default.buildURI({
      host: 'github.com',
      owner: repoOwner,
      repo: repoName,
      number: issueishNumber
    });
  }
}

function openInNewTab(uri, {
  activate
} = {
  activate: true
}) {
  return atom.workspace.open(uri, {
    activateItem: activate
  }).then(() => {
    (0, _reporterProxy.addEvent)('open-issueish-in-pane', {
      package: 'github',
      from: 'issueish-link',
      target: 'new-tab'
    });
  });
}