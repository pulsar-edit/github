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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1saW5rLmpzIl0sIm5hbWVzIjpbIklzc3VlaXNoTGluayIsInVybCIsImNoaWxkcmVuIiwib3RoZXJzIiwiY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJoYW5kbGVDbGlja0V2ZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm5vZGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInNoaWZ0S2V5Iiwib3Blbklzc3VlaXNoTGlua0luTmV3VGFiIiwiYWN0aXZhdGUiLCJtZXRhS2V5IiwiY3RybEtleSIsIm9wZW5MaW5rSW5Ccm93c2VyIiwib3B0aW9ucyIsInVyaSIsImdldEF0b21VcmlGb3JHaXRodWJVcmwiLCJvcGVuSW5OZXdUYWIiLCJzaGVsbCIsIm9wZW5FeHRlcm5hbCIsInBhY2thZ2UiLCJmcm9tIiwiZ2l0aHViVXJsIiwiZ2V0VXJpRm9yRGF0YSIsImdldERhdGFGcm9tR2l0aHViVXJsIiwiaG9zdG5hbWUiLCJwYXRobmFtZSIsInBhcnNlIiwicmVwb093bmVyIiwicmVwb05hbWUiLCJ0eXBlIiwiaXNzdWVpc2hOdW1iZXIiLCJzcGxpdCIsImZpbHRlciIsInMiLCJwYXJzZUludCIsImluY2x1ZGVzIiwiaXNOYU4iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJhdG9tIiwid29ya3NwYWNlIiwib3BlbiIsImFjdGl2YXRlSXRlbSIsInRoZW4iLCJ0YXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTtBQUNlLFNBQVNBLFlBQVQsT0FBa0Q7QUFBQSxNQUE1QjtBQUFDQyxJQUFBQSxHQUFEO0FBQU1DLElBQUFBO0FBQU4sR0FBNEI7QUFBQSxNQUFUQyxNQUFTOztBQUMvRCxXQUFTQyxZ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Q0wsV0FBT08sNEJBQW1CQyxRQUFuQixDQUE0QjtBQUNqQ0MsTUFBQUEsSUFBSSxFQUFFLFlBRDJCO0FBRWpDQyxNQUFBQSxLQUFLLEVBQUViLFNBRjBCO0FBR2pDYyxNQUFBQSxJQUFJLEVBQUViLFFBSDJCO0FBSWpDYyxNQUFBQSxNQUFNLEVBQUVaO0FBSnlCLEtBQTVCLENBQVA7QUFNRDtBQUNGOztBQUVELFNBQVNkLFlBQVQsQ0FBc0JGLEdBQXRCLEVBQTJCO0FBQUNMLEVBQUFBO0FBQUQsSUFBYTtBQUFDQSxFQUFBQSxRQUFRLEVBQUU7QUFBWCxDQUF4QyxFQUEwRDtBQUN4RCxTQUFPa0MsSUFBSSxDQUFDQyxTQUFMLENBQWVDLElBQWYsQ0FBb0IvQixHQUFwQixFQUF5QjtBQUFDZ0MsSUFBQUEsWUFBWSxFQUFFckM7QUFBZixHQUF6QixFQUFtRHNDLElBQW5ELENBQXdELE1BQU07QUFDbkUsaUNBQVMsdUJBQVQsRUFBa0M7QUFBQzVCLE1BQUFBLE9BQU8sRUFBRSxRQUFWO0FBQW9CQyxNQUFBQSxJQUFJLEVBQUUsZUFBMUI7QUFBMkM0QixNQUFBQSxNQUFNLEVBQUU7QUFBbkQsS0FBbEM7QUFDRCxHQUZNLENBQVA7QUFHRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCB7c2hlbGx9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJc3N1ZWlzaExpbmsoe3VybCwgY2hpbGRyZW4sIC4uLm90aGVyc30pIHtcbiAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgaGFuZGxlQ2xpY2tFdmVudChldmVudCwgdXJsKTtcbiAgfVxuXG4gIHJldHVybiA8YSB7Li4ub3RoZXJzfSBvbkNsaWNrPXtjbGlja0hhbmRsZXJ9PntjaGlsZHJlbn08L2E+O1xufVxuXG5Jc3N1ZWlzaExpbmsucHJvcFR5cGVzID0ge1xuICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxufTtcblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQ2xpY2tFdmVudChldmVudCwgdXJsKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICBpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgcmV0dXJuIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYih1cmwsIHthY3RpdmF0ZTogIShldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkpfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gT3BlbiBpbiBicm93c2VyIGlmIHNoaWZ0IGtleSBoZWxkXG4gICAgcmV0dXJuIG9wZW5MaW5rSW5Ccm93c2VyKHVybCk7XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYih1cmwsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB1cmkgPSBnZXRBdG9tVXJpRm9yR2l0aHViVXJsKHVybCk7XG4gIGlmICh1cmkpIHtcbiAgICByZXR1cm4gb3BlbkluTmV3VGFiKHVyaSwgb3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5MaW5rSW5Ccm93c2VyKHVyaSkge1xuICBhd2FpdCBzaGVsbC5vcGVuRXh0ZXJuYWwodXJpKTtcbiAgYWRkRXZlbnQoJ29wZW4taXNzdWVpc2gtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgZnJvbTogJ2lzc3VlaXNoLWxpbmsnfSk7XG59XG5cbmZ1bmN0aW9uIGdldEF0b21VcmlGb3JHaXRodWJVcmwoZ2l0aHViVXJsKSB7XG4gIHJldHVybiBnZXRVcmlGb3JEYXRhKGdldERhdGFGcm9tR2l0aHViVXJsKGdpdGh1YlVybCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YUZyb21HaXRodWJVcmwoZ2l0aHViVXJsKSB7XG4gIGNvbnN0IHtob3N0bmFtZSwgcGF0aG5hbWV9ID0gdXJsLnBhcnNlKGdpdGh1YlVybCk7XG4gIGNvbnN0IFtyZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcl0gPSBwYXRobmFtZS5zcGxpdCgnLycpLmZpbHRlcihzID0+IHMpO1xuICByZXR1cm4ge2hvc3RuYW1lLCByZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcjogcGFyc2VJbnQoaXNzdWVpc2hOdW1iZXIsIDEwKX07XG59XG5cbmZ1bmN0aW9uIGdldFVyaUZvckRhdGEoe2hvc3RuYW1lLCByZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcn0pIHtcbiAgaWYgKGhvc3RuYW1lICE9PSAnZ2l0aHViLmNvbScgfHwgIVsncHVsbCcsICdpc3N1ZXMnXS5pbmNsdWRlcyh0eXBlKSB8fCAhaXNzdWVpc2hOdW1iZXIgfHwgaXNOYU4oaXNzdWVpc2hOdW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiAnZ2l0aHViLmNvbScsXG4gICAgICBvd25lcjogcmVwb093bmVyLFxuICAgICAgcmVwbzogcmVwb05hbWUsXG4gICAgICBudW1iZXI6IGlzc3VlaXNoTnVtYmVyLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9wZW5Jbk5ld1RhYih1cmksIHthY3RpdmF0ZX0gPSB7YWN0aXZhdGU6IHRydWV9KSB7XG4gIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHVyaSwge2FjdGl2YXRlSXRlbTogYWN0aXZhdGV9KS50aGVuKCgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1pc3N1ZWlzaC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiAnaXNzdWVpc2gtbGluaycsIHRhcmdldDogJ25ldy10YWInfSk7XG4gIH0pO1xufVxuIl19