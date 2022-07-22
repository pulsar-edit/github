"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IssueishLink;
exports.getDataFromGithubUrl = getDataFromGithubUrl;
exports.handleClickEvent = handleClickEvent;
exports.openIssueishLinkInNewTab = openIssueishLinkInNewTab;
exports.openLinkInBrowser = openLinkInBrowser;

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

  return /*#__PURE__*/_react.default.createElement("a", _extends({}, others, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1saW5rLmpzIl0sIm5hbWVzIjpbIklzc3VlaXNoTGluayIsInVybCIsImNoaWxkcmVuIiwib3RoZXJzIiwiY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJoYW5kbGVDbGlja0V2ZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm5vZGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInNoaWZ0S2V5Iiwib3Blbklzc3VlaXNoTGlua0luTmV3VGFiIiwiYWN0aXZhdGUiLCJtZXRhS2V5IiwiY3RybEtleSIsIm9wZW5MaW5rSW5Ccm93c2VyIiwib3B0aW9ucyIsInVyaSIsImdldEF0b21VcmlGb3JHaXRodWJVcmwiLCJvcGVuSW5OZXdUYWIiLCJzaGVsbCIsIm9wZW5FeHRlcm5hbCIsInBhY2thZ2UiLCJmcm9tIiwiZ2l0aHViVXJsIiwiZ2V0VXJpRm9yRGF0YSIsImdldERhdGFGcm9tR2l0aHViVXJsIiwiaG9zdG5hbWUiLCJwYXRobmFtZSIsInBhcnNlIiwicmVwb093bmVyIiwicmVwb05hbWUiLCJ0eXBlIiwiaXNzdWVpc2hOdW1iZXIiLCJzcGxpdCIsImZpbHRlciIsInMiLCJwYXJzZUludCIsImluY2x1ZGVzIiwiaXNOYU4iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJhdG9tIiwid29ya3NwYWNlIiwib3BlbiIsImFjdGl2YXRlSXRlbSIsInRoZW4iLCJ0YXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTtBQUNlLFNBQVNBLFlBQVQsT0FBa0Q7QUFBQSxNQUE1QjtBQUFDQyxJQUFBQSxHQUFEO0FBQU1DLElBQUFBO0FBQU4sR0FBNEI7QUFBQSxNQUFUQyxNQUFTOztBQUMvRCxXQUFTQyxZ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QUNMLFdBQU9PLDRCQUFtQkMsUUFBbkIsQ0FBNEI7QUFDakNDLE1BQUFBLElBQUksRUFBRSxZQUQyQjtBQUVqQ0MsTUFBQUEsS0FBSyxFQUFFYixTQUYwQjtBQUdqQ2MsTUFBQUEsSUFBSSxFQUFFYixRQUgyQjtBQUlqQ2MsTUFBQUEsTUFBTSxFQUFFWjtBQUp5QixLQUE1QixDQUFQO0FBTUQ7QUFDRjs7QUFFRCxTQUFTZCxZQUFULENBQXNCRixHQUF0QixFQUEyQjtBQUFDTCxFQUFBQTtBQUFELElBQWE7QUFBQ0EsRUFBQUEsUUFBUSxFQUFFO0FBQVgsQ0FBeEMsRUFBMEQ7QUFDeEQsU0FBT2tDLElBQUksQ0FBQ0MsU0FBTCxDQUFlQyxJQUFmLENBQW9CL0IsR0FBcEIsRUFBeUI7QUFBQ2dDLElBQUFBLFlBQVksRUFBRXJDO0FBQWYsR0FBekIsRUFBbURzQyxJQUFuRCxDQUF3RCxNQUFNO0FBQ25FLGlDQUFTLHVCQUFULEVBQWtDO0FBQUM1QixNQUFBQSxPQUFPLEVBQUUsUUFBVjtBQUFvQkMsTUFBQUEsSUFBSSxFQUFFLGVBQTFCO0FBQTJDNEIsTUFBQUEsTUFBTSxFQUFFO0FBQW5ELEtBQWxDO0FBQ0QsR0FGTSxDQUFQO0FBR0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQge3NoZWxsfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXNzdWVpc2hMaW5rKHt1cmwsIGNoaWxkcmVuLCAuLi5vdGhlcnN9KSB7XG4gIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihldmVudCkge1xuICAgIGhhbmRsZUNsaWNrRXZlbnQoZXZlbnQsIHVybCk7XG4gIH1cblxuICByZXR1cm4gPGEgey4uLm90aGVyc30gb25DbGljaz17Y2xpY2tIYW5kbGVyfT57Y2hpbGRyZW59PC9hPjtcbn1cblxuSXNzdWVpc2hMaW5rLnByb3BUeXBlcyA9IHtcbiAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZSxcbn07XG5cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUNsaWNrRXZlbnQoZXZlbnQsIHVybCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgaWYgKCFldmVudC5zaGlmdEtleSkge1xuICAgIHJldHVybiBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIodXJsLCB7YWN0aXZhdGU6ICEoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5KX0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE9wZW4gaW4gYnJvd3NlciBpZiBzaGlmdCBrZXkgaGVsZFxuICAgIHJldHVybiBvcGVuTGlua0luQnJvd3Nlcih1cmwpO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbmV4cG9ydCBmdW5jdGlvbiBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIodXJsLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgdXJpID0gZ2V0QXRvbVVyaUZvckdpdGh1YlVybCh1cmwpO1xuICBpZiAodXJpKSB7XG4gICAgcmV0dXJuIG9wZW5Jbk5ld1RhYih1cmksIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuTGlua0luQnJvd3Nlcih1cmkpIHtcbiAgYXdhaXQgc2hlbGwub3BlbkV4dGVybmFsKHVyaSk7XG4gIGFkZEV2ZW50KCdvcGVuLWlzc3VlaXNoLWluLWJyb3dzZXInLCB7cGFja2FnZTogJ2dpdGh1YicsIGZyb206ICdpc3N1ZWlzaC1saW5rJ30pO1xufVxuXG5mdW5jdGlvbiBnZXRBdG9tVXJpRm9yR2l0aHViVXJsKGdpdGh1YlVybCkge1xuICByZXR1cm4gZ2V0VXJpRm9yRGF0YShnZXREYXRhRnJvbUdpdGh1YlVybChnaXRodWJVcmwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFGcm9tR2l0aHViVXJsKGdpdGh1YlVybCkge1xuICBjb25zdCB7aG9zdG5hbWUsIHBhdGhuYW1lfSA9IHVybC5wYXJzZShnaXRodWJVcmwpO1xuICBjb25zdCBbcmVwb093bmVyLCByZXBvTmFtZSwgdHlwZSwgaXNzdWVpc2hOdW1iZXJdID0gcGF0aG5hbWUuc3BsaXQoJy8nKS5maWx0ZXIocyA9PiBzKTtcbiAgcmV0dXJuIHtob3N0bmFtZSwgcmVwb093bmVyLCByZXBvTmFtZSwgdHlwZSwgaXNzdWVpc2hOdW1iZXI6IHBhcnNlSW50KGlzc3VlaXNoTnVtYmVyLCAxMCl9O1xufVxuXG5mdW5jdGlvbiBnZXRVcmlGb3JEYXRhKHtob3N0bmFtZSwgcmVwb093bmVyLCByZXBvTmFtZSwgdHlwZSwgaXNzdWVpc2hOdW1iZXJ9KSB7XG4gIGlmIChob3N0bmFtZSAhPT0gJ2dpdGh1Yi5jb20nIHx8ICFbJ3B1bGwnLCAnaXNzdWVzJ10uaW5jbHVkZXModHlwZSkgfHwgIWlzc3VlaXNoTnVtYmVyIHx8IGlzTmFOKGlzc3VlaXNoTnVtYmVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe1xuICAgICAgaG9zdDogJ2dpdGh1Yi5jb20nLFxuICAgICAgb3duZXI6IHJlcG9Pd25lcixcbiAgICAgIHJlcG86IHJlcG9OYW1lLFxuICAgICAgbnVtYmVyOiBpc3N1ZWlzaE51bWJlcixcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvcGVuSW5OZXdUYWIodXJpLCB7YWN0aXZhdGV9ID0ge2FjdGl2YXRlOiB0cnVlfSkge1xuICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbih1cmksIHthY3RpdmF0ZUl0ZW06IGFjdGl2YXRlfSkudGhlbigoKSA9PiB7XG4gICAgYWRkRXZlbnQoJ29wZW4taXNzdWVpc2gtaW4tcGFuZScsIHtwYWNrYWdlOiAnZ2l0aHViJywgZnJvbTogJ2lzc3VlaXNoLWxpbmsnLCB0YXJnZXQ6ICduZXctdGFiJ30pO1xuICB9KTtcbn1cbiJdfQ==