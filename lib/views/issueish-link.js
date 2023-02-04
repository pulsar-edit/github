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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
};

// eslint-disable-next-line no-shadow
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
}

// eslint-disable-next-line no-shadow
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJc3N1ZWlzaExpbmsiLCJ1cmwiLCJjaGlsZHJlbiIsIm90aGVycyIsImNsaWNrSGFuZGxlciIsImV2ZW50IiwiaGFuZGxlQ2xpY2tFdmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJub2RlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsIm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiIsImFjdGl2YXRlIiwibWV0YUtleSIsImN0cmxLZXkiLCJvcGVuTGlua0luQnJvd3NlciIsIm9wdGlvbnMiLCJ1cmkiLCJnZXRBdG9tVXJpRm9yR2l0aHViVXJsIiwib3BlbkluTmV3VGFiIiwic2hlbGwiLCJvcGVuRXh0ZXJuYWwiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJmcm9tIiwiZ2l0aHViVXJsIiwiZ2V0VXJpRm9yRGF0YSIsImdldERhdGFGcm9tR2l0aHViVXJsIiwiaG9zdG5hbWUiLCJwYXRobmFtZSIsInBhcnNlIiwicmVwb093bmVyIiwicmVwb05hbWUiLCJ0eXBlIiwiaXNzdWVpc2hOdW1iZXIiLCJzcGxpdCIsImZpbHRlciIsInMiLCJwYXJzZUludCIsImluY2x1ZGVzIiwiaXNOYU4iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJhdG9tIiwid29ya3NwYWNlIiwib3BlbiIsImFjdGl2YXRlSXRlbSIsInRoZW4iLCJ0YXJnZXQiXSwic291cmNlcyI6WyJpc3N1ZWlzaC1saW5rLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCB7c2hlbGx9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJc3N1ZWlzaExpbmsoe3VybCwgY2hpbGRyZW4sIC4uLm90aGVyc30pIHtcbiAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgaGFuZGxlQ2xpY2tFdmVudChldmVudCwgdXJsKTtcbiAgfVxuXG4gIHJldHVybiA8YSB7Li4ub3RoZXJzfSBvbkNsaWNrPXtjbGlja0hhbmRsZXJ9PntjaGlsZHJlbn08L2E+O1xufVxuXG5Jc3N1ZWlzaExpbmsucHJvcFR5cGVzID0ge1xuICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxufTtcblxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQ2xpY2tFdmVudChldmVudCwgdXJsKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICBpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgcmV0dXJuIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYih1cmwsIHthY3RpdmF0ZTogIShldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkpfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gT3BlbiBpbiBicm93c2VyIGlmIHNoaWZ0IGtleSBoZWxkXG4gICAgcmV0dXJuIG9wZW5MaW5rSW5Ccm93c2VyKHVybCk7XG4gIH1cbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYih1cmwsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCB1cmkgPSBnZXRBdG9tVXJpRm9yR2l0aHViVXJsKHVybCk7XG4gIGlmICh1cmkpIHtcbiAgICByZXR1cm4gb3BlbkluTmV3VGFiKHVyaSwgb3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5MaW5rSW5Ccm93c2VyKHVyaSkge1xuICBhd2FpdCBzaGVsbC5vcGVuRXh0ZXJuYWwodXJpKTtcbiAgYWRkRXZlbnQoJ29wZW4taXNzdWVpc2gtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgZnJvbTogJ2lzc3VlaXNoLWxpbmsnfSk7XG59XG5cbmZ1bmN0aW9uIGdldEF0b21VcmlGb3JHaXRodWJVcmwoZ2l0aHViVXJsKSB7XG4gIHJldHVybiBnZXRVcmlGb3JEYXRhKGdldERhdGFGcm9tR2l0aHViVXJsKGdpdGh1YlVybCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YUZyb21HaXRodWJVcmwoZ2l0aHViVXJsKSB7XG4gIGNvbnN0IHtob3N0bmFtZSwgcGF0aG5hbWV9ID0gdXJsLnBhcnNlKGdpdGh1YlVybCk7XG4gIGNvbnN0IFtyZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcl0gPSBwYXRobmFtZS5zcGxpdCgnLycpLmZpbHRlcihzID0+IHMpO1xuICByZXR1cm4ge2hvc3RuYW1lLCByZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcjogcGFyc2VJbnQoaXNzdWVpc2hOdW1iZXIsIDEwKX07XG59XG5cbmZ1bmN0aW9uIGdldFVyaUZvckRhdGEoe2hvc3RuYW1lLCByZXBvT3duZXIsIHJlcG9OYW1lLCB0eXBlLCBpc3N1ZWlzaE51bWJlcn0pIHtcbiAgaWYgKGhvc3RuYW1lICE9PSAnZ2l0aHViLmNvbScgfHwgIVsncHVsbCcsICdpc3N1ZXMnXS5pbmNsdWRlcyh0eXBlKSB8fCAhaXNzdWVpc2hOdW1iZXIgfHwgaXNOYU4oaXNzdWVpc2hOdW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiAnZ2l0aHViLmNvbScsXG4gICAgICBvd25lcjogcmVwb093bmVyLFxuICAgICAgcmVwbzogcmVwb05hbWUsXG4gICAgICBudW1iZXI6IGlzc3VlaXNoTnVtYmVyLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9wZW5Jbk5ld1RhYih1cmksIHthY3RpdmF0ZX0gPSB7YWN0aXZhdGU6IHRydWV9KSB7XG4gIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHVyaSwge2FjdGl2YXRlSXRlbTogYWN0aXZhdGV9KS50aGVuKCgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1pc3N1ZWlzaC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiAnaXNzdWVpc2gtbGluaycsIHRhcmdldDogJ25ldy10YWInfSk7XG4gIH0pO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQTJDO0FBQUE7QUFBQTtBQUFBO0FBRTNDO0FBQ2UsU0FBU0EsWUFBWSxPQUE2QjtFQUFBLElBQTVCO01BQUNDLEdBQUc7TUFBRUM7SUFBbUIsQ0FBQztJQUFQQyxNQUFNO0VBQzVELFNBQVNDLFlBQVksQ0FBQ0MsS0FBSyxFQUFFO0lBQzNCQyxnQkFBZ0IsQ0FBQ0QsS0FBSyxFQUFFSixHQUFHLENBQUM7RUFDOUI7RUFFQSxPQUFPLCtDQUFPRSxNQUFNO0lBQUUsT0FBTyxFQUFFQztFQUFhLElBQUVGLFFBQVEsQ0FBSztBQUM3RDtBQUVBRixZQUFZLENBQUNPLFNBQVMsR0FBRztFQUN2Qk4sR0FBRyxFQUFFTyxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDaENSLFFBQVEsRUFBRU0sa0JBQVMsQ0FBQ0c7QUFDdEIsQ0FBQzs7QUFHRDtBQUNPLFNBQVNMLGdCQUFnQixDQUFDRCxLQUFLLEVBQUVKLEdBQUcsRUFBRTtFQUMzQ0ksS0FBSyxDQUFDTyxjQUFjLEVBQUU7RUFDdEJQLEtBQUssQ0FBQ1EsZUFBZSxFQUFFO0VBQ3ZCLElBQUksQ0FBQ1IsS0FBSyxDQUFDUyxRQUFRLEVBQUU7SUFDbkIsT0FBT0Msd0JBQXdCLENBQUNkLEdBQUcsRUFBRTtNQUFDZSxRQUFRLEVBQUUsRUFBRVgsS0FBSyxDQUFDWSxPQUFPLElBQUlaLEtBQUssQ0FBQ2EsT0FBTztJQUFDLENBQUMsQ0FBQztFQUNyRixDQUFDLE1BQU07SUFDTDtJQUNBLE9BQU9DLGlCQUFpQixDQUFDbEIsR0FBRyxDQUFDO0VBQy9CO0FBQ0Y7O0FBRUE7QUFDTyxTQUFTYyx3QkFBd0IsQ0FBQ2QsR0FBRyxFQUFFbUIsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0VBQzFELE1BQU1DLEdBQUcsR0FBR0Msc0JBQXNCLENBQUNyQixHQUFHLENBQUM7RUFDdkMsSUFBSW9CLEdBQUcsRUFBRTtJQUNQLE9BQU9FLFlBQVksQ0FBQ0YsR0FBRyxFQUFFRCxPQUFPLENBQUM7RUFDbkMsQ0FBQyxNQUFNO0lBQ0wsT0FBTyxJQUFJO0VBQ2I7QUFDRjtBQUVPLGVBQWVELGlCQUFpQixDQUFDRSxHQUFHLEVBQUU7RUFDM0MsTUFBTUcsZUFBSyxDQUFDQyxZQUFZLENBQUNKLEdBQUcsQ0FBQztFQUM3QixJQUFBSyx1QkFBUSxFQUFDLDBCQUEwQixFQUFFO0lBQUNDLE9BQU8sRUFBRSxRQUFRO0lBQUVDLElBQUksRUFBRTtFQUFlLENBQUMsQ0FBQztBQUNsRjtBQUVBLFNBQVNOLHNCQUFzQixDQUFDTyxTQUFTLEVBQUU7RUFDekMsT0FBT0MsYUFBYSxDQUFDQyxvQkFBb0IsQ0FBQ0YsU0FBUyxDQUFDLENBQUM7QUFDdkQ7QUFFTyxTQUFTRSxvQkFBb0IsQ0FBQ0YsU0FBUyxFQUFFO0VBQzlDLE1BQU07SUFBQ0csUUFBUTtJQUFFQztFQUFRLENBQUMsR0FBR2hDLFlBQUcsQ0FBQ2lDLEtBQUssQ0FBQ0wsU0FBUyxDQUFDO0VBQ2pELE1BQU0sQ0FBQ00sU0FBUyxFQUFFQyxRQUFRLEVBQUVDLElBQUksRUFBRUMsY0FBYyxDQUFDLEdBQUdMLFFBQVEsQ0FBQ00sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxNQUFNLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxDQUFDO0VBQ3RGLE9BQU87SUFBQ1QsUUFBUTtJQUFFRyxTQUFTO0lBQUVDLFFBQVE7SUFBRUMsSUFBSTtJQUFFQyxjQUFjLEVBQUVJLFFBQVEsQ0FBQ0osY0FBYyxFQUFFLEVBQUU7RUFBQyxDQUFDO0FBQzVGO0FBRUEsU0FBU1IsYUFBYSxDQUFDO0VBQUNFLFFBQVE7RUFBRUcsU0FBUztFQUFFQyxRQUFRO0VBQUVDLElBQUk7RUFBRUM7QUFBYyxDQUFDLEVBQUU7RUFDNUUsSUFBSU4sUUFBUSxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDVyxRQUFRLENBQUNOLElBQUksQ0FBQyxJQUFJLENBQUNDLGNBQWMsSUFBSU0sS0FBSyxDQUFDTixjQUFjLENBQUMsRUFBRTtJQUMvRyxPQUFPLElBQUk7RUFDYixDQUFDLE1BQU07SUFDTCxPQUFPTywyQkFBa0IsQ0FBQ0MsUUFBUSxDQUFDO01BQ2pDQyxJQUFJLEVBQUUsWUFBWTtNQUNsQkMsS0FBSyxFQUFFYixTQUFTO01BQ2hCYyxJQUFJLEVBQUViLFFBQVE7TUFDZGMsTUFBTSxFQUFFWjtJQUNWLENBQUMsQ0FBQztFQUNKO0FBQ0Y7QUFFQSxTQUFTZixZQUFZLENBQUNGLEdBQUcsRUFBRTtFQUFDTDtBQUFRLENBQUMsR0FBRztFQUFDQSxRQUFRLEVBQUU7QUFBSSxDQUFDLEVBQUU7RUFDeEQsT0FBT21DLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxJQUFJLENBQUNoQyxHQUFHLEVBQUU7SUFBQ2lDLFlBQVksRUFBRXRDO0VBQVEsQ0FBQyxDQUFDLENBQUN1QyxJQUFJLENBQUMsTUFBTTtJQUNuRSxJQUFBN0IsdUJBQVEsRUFBQyx1QkFBdUIsRUFBRTtNQUFDQyxPQUFPLEVBQUUsUUFBUTtNQUFFQyxJQUFJLEVBQUUsZUFBZTtNQUFFNEIsTUFBTSxFQUFFO0lBQVMsQ0FBQyxDQUFDO0VBQ2xHLENBQUMsQ0FBQztBQUNKIn0=