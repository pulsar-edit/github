"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes2 = require("../prop-types");

var _tooltip = _interopRequireDefault(require("../atom/tooltip"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getIconClass(icon, animation) {
  return (0, _classnames.default)('github-PushPull-icon', 'icon', `icon-${icon}`, {
    [`animate-${animation}`]: !!animation
  });
}

class PushPullView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onClickPush", clickEvent => {
      if (this.props.isSyncing) {
        return;
      }

      this.props.push({
        force: clickEvent.metaKey || clickEvent.ctrlKey,
        setUpstream: !this.props.currentRemote.isPresent()
      });
    });

    _defineProperty(this, "onClickPull", clickEvent => {
      if (this.props.isSyncing) {
        return;
      }

      this.props.pull();
    });

    _defineProperty(this, "onClickPushPull", clickEvent => {
      if (this.props.isSyncing) {
        return;
      }

      if (clickEvent.metaKey || clickEvent.ctrlKey) {
        this.props.push({
          force: true
        });
      } else {
        this.props.pull();
      }
    });

    _defineProperty(this, "onClickPublish", clickEvent => {
      if (this.props.isSyncing) {
        return;
      }

      this.props.push({
        setUpstream: !this.props.currentRemote.isPresent()
      });
    });

    _defineProperty(this, "onClickFetch", clickEvent => {
      if (this.props.isSyncing) {
        return;
      }

      this.props.fetch();
    });

    this.refTileNode = new _refHolder.default();
  }

  getTileStates() {
    const modKey = process.platform === 'darwin' ? 'Cmd' : 'Ctrl';
    return {
      fetching: {
        tooltip: 'Fetching from remote',
        icon: 'sync',
        text: 'Fetching',
        iconAnimation: 'rotate'
      },
      pulling: {
        tooltip: 'Pulling from remote',
        icon: 'arrow-down',
        text: 'Pulling',
        iconAnimation: 'down'
      },
      pushing: {
        tooltip: 'Pushing to remote',
        icon: 'arrow-up',
        text: 'Pushing',
        iconAnimation: 'up'
      },
      ahead: {
        onClick: this.onClickPush,
        tooltip: `Click to push<br />${modKey}-click to force push<br />Right-click for more`,
        icon: 'arrow-up',
        text: `Push ${this.props.aheadCount}`
      },
      behind: {
        onClick: this.onClickPull,
        tooltip: 'Click to pull<br />Right-click for more',
        icon: 'arrow-down',
        text: `Pull ${this.props.behindCount}`
      },
      aheadBehind: {
        onClick: this.onClickPushPull,
        tooltip: `Click to pull<br />${modKey}-click to force push<br />Right-click for more`,
        icon: 'arrow-down',
        text: `Pull ${this.props.behindCount}`,
        secondaryIcon: 'arrow-up',
        secondaryText: `${this.props.aheadCount} `
      },
      published: {
        onClick: this.onClickFetch,
        tooltip: 'Click to fetch<br />Right-click for more',
        icon: 'sync',
        text: 'Fetch'
      },
      unpublished: {
        onClick: this.onClickPublish,
        tooltip: 'Click to set up a remote tracking branch<br />Right-click for more',
        icon: 'cloud-upload',
        text: 'Publish'
      },
      noRemote: {
        tooltip: 'There is no remote named "origin"',
        icon: 'stop',
        text: 'No remote'
      },
      detached: {
        tooltip: 'Create a branch if you wish to push your work anywhere',
        icon: 'stop',
        text: 'Not on branch'
      }
    };
  }

  render() {
    const isAhead = this.props.aheadCount > 0;
    const isBehind = this.props.behindCount > 0;
    const isUnpublished = !this.props.currentRemote.isPresent();
    const isDetached = this.props.currentBranch.isDetached();
    const isFetching = this.props.isFetching;
    const isPulling = this.props.isPulling;
    const isPushing = this.props.isPushing;
    const hasOrigin = !!this.props.originExists;
    const tileStates = this.getTileStates();
    let tileState;

    if (isFetching) {
      tileState = tileStates.fetching;
    } else if (isPulling) {
      tileState = tileStates.pulling;
    } else if (isPushing) {
      tileState = tileStates.pushing;
    } else if (isAhead && !isBehind && !isUnpublished) {
      tileState = tileStates.ahead;
    } else if (isBehind && !isAhead && !isUnpublished) {
      tileState = tileStates.behind;
    } else if (isBehind && isAhead && !isUnpublished) {
      tileState = tileStates.aheadBehind;
    } else if (!isBehind && !isAhead && !isUnpublished && !isDetached) {
      tileState = tileStates.published;
    } else if (isUnpublished && !isDetached && hasOrigin) {
      tileState = tileStates.unpublished;
    } else if (isUnpublished && !isDetached && !hasOrigin) {
      tileState = tileStates.noRemote;
    } else if (isDetached) {
      tileState = tileStates.detached;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      onClick: tileState.onClick,
      ref: this.refTileNode.setter,
      className: (0, _classnames.default)('github-PushPull', 'inline-block', {
        'github-branch-detached': isDetached
      })
    }, tileState && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, tileState.secondaryText && /*#__PURE__*/_react.default.createElement("span", {
      className: "secondary"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: getIconClass(tileState.secondaryIcon)
    }), tileState.secondaryText), /*#__PURE__*/_react.default.createElement("span", {
      className: getIconClass(tileState.icon, tileState.iconAnimation)
    }), tileState.text), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      key: "tooltip",
      manager: this.props.tooltipManager,
      target: this.refTileNode,
      title: `<div style="text-align: left; line-height: 1.2em;">${tileState.tooltip}</div>`,
      showDelay: atom.tooltips.hoverDefaults.delay.show,
      hideDelay: atom.tooltips.hoverDefaults.delay.hide
    })));
  }

}

exports.default = PushPullView;

_defineProperty(PushPullView, "propTypes", {
  currentBranch: _propTypes2.BranchPropType.isRequired,
  currentRemote: _propTypes2.RemotePropType.isRequired,
  isSyncing: _propTypes.default.bool,
  isFetching: _propTypes.default.bool,
  isPulling: _propTypes.default.bool,
  isPushing: _propTypes.default.bool,
  behindCount: _propTypes.default.number,
  aheadCount: _propTypes.default.number,
  push: _propTypes.default.func.isRequired,
  pull: _propTypes.default.func.isRequired,
  fetch: _propTypes.default.func.isRequired,
  originExists: _propTypes.default.bool,
  tooltipManager: _propTypes.default.object.isRequired
});

_defineProperty(PushPullView, "defaultProps", {
  isSyncing: false,
  isFetching: false,
  isPulling: false,
  isPushing: false,
  behindCount: 0,
  aheadCount: 0
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wdXNoLXB1bGwtdmlldy5qcyJdLCJuYW1lcyI6WyJnZXRJY29uQ2xhc3MiLCJpY29uIiwiYW5pbWF0aW9uIiwiUHVzaFB1bGxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY2xpY2tFdmVudCIsImlzU3luY2luZyIsInB1c2giLCJmb3JjZSIsIm1ldGFLZXkiLCJjdHJsS2V5Iiwic2V0VXBzdHJlYW0iLCJjdXJyZW50UmVtb3RlIiwiaXNQcmVzZW50IiwicHVsbCIsImZldGNoIiwicmVmVGlsZU5vZGUiLCJSZWZIb2xkZXIiLCJnZXRUaWxlU3RhdGVzIiwibW9kS2V5IiwicHJvY2VzcyIsInBsYXRmb3JtIiwiZmV0Y2hpbmciLCJ0b29sdGlwIiwidGV4dCIsImljb25BbmltYXRpb24iLCJwdWxsaW5nIiwicHVzaGluZyIsImFoZWFkIiwib25DbGljayIsIm9uQ2xpY2tQdXNoIiwiYWhlYWRDb3VudCIsImJlaGluZCIsIm9uQ2xpY2tQdWxsIiwiYmVoaW5kQ291bnQiLCJhaGVhZEJlaGluZCIsIm9uQ2xpY2tQdXNoUHVsbCIsInNlY29uZGFyeUljb24iLCJzZWNvbmRhcnlUZXh0IiwicHVibGlzaGVkIiwib25DbGlja0ZldGNoIiwidW5wdWJsaXNoZWQiLCJvbkNsaWNrUHVibGlzaCIsIm5vUmVtb3RlIiwiZGV0YWNoZWQiLCJyZW5kZXIiLCJpc0FoZWFkIiwiaXNCZWhpbmQiLCJpc1VucHVibGlzaGVkIiwiaXNEZXRhY2hlZCIsImN1cnJlbnRCcmFuY2giLCJpc0ZldGNoaW5nIiwiaXNQdWxsaW5nIiwiaXNQdXNoaW5nIiwiaGFzT3JpZ2luIiwib3JpZ2luRXhpc3RzIiwidGlsZVN0YXRlcyIsInRpbGVTdGF0ZSIsInNldHRlciIsInRvb2x0aXBNYW5hZ2VyIiwiYXRvbSIsInRvb2x0aXBzIiwiaG92ZXJEZWZhdWx0cyIsImRlbGF5Iiwic2hvdyIsImhpZGUiLCJCcmFuY2hQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJSZW1vdGVQcm9wVHlwZSIsIlByb3BUeXBlcyIsImJvb2wiLCJudW1iZXIiLCJmdW5jIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxZQUFULENBQXNCQyxJQUF0QixFQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsU0FBTyx5QkFDTCxzQkFESyxFQUVMLE1BRkssRUFHSixRQUFPRCxJQUFLLEVBSFIsRUFJTDtBQUFDLEtBQUUsV0FBVUMsU0FBVSxFQUF0QixHQUEwQixDQUFDLENBQUNBO0FBQTdCLEdBSkssQ0FBUDtBQU1EOztBQUVjLE1BQU1DLFlBQU4sU0FBMkJDLGVBQU1DLFNBQWpDLENBQTJDO0FBMEJ4REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIseUNBTUxDLFVBQVUsSUFBSTtBQUMxQixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFdBQUtGLEtBQUwsQ0FBV0csSUFBWCxDQUFnQjtBQUNkQyxRQUFBQSxLQUFLLEVBQUVILFVBQVUsQ0FBQ0ksT0FBWCxJQUFzQkosVUFBVSxDQUFDSyxPQUQxQjtBQUVkQyxRQUFBQSxXQUFXLEVBQUUsQ0FBQyxLQUFLUCxLQUFMLENBQVdRLGFBQVgsQ0FBeUJDLFNBQXpCO0FBRkEsT0FBaEI7QUFJRCxLQWRrQjs7QUFBQSx5Q0FnQkxSLFVBQVUsSUFBSTtBQUMxQixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFdBQUtGLEtBQUwsQ0FBV1UsSUFBWDtBQUNELEtBckJrQjs7QUFBQSw2Q0F1QkRULFVBQVUsSUFBSTtBQUM5QixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFVBQUlELFVBQVUsQ0FBQ0ksT0FBWCxJQUFzQkosVUFBVSxDQUFDSyxPQUFy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QUFyQ2pFLFksZUFDQTtBQUNqQmtELEVBQUFBLGFBQWEsRUFBRWdCLDJCQUFlQyxVQURiO0FBRWpCdkQsRUFBQUEsYUFBYSxFQUFFd0QsMkJBQWVELFVBRmI7QUFHakI3RCxFQUFBQSxTQUFTLEVBQUUrRCxtQkFBVUMsSUFISjtBQUlqQm5CLEVBQUFBLFVBQVUsRUFBRWtCLG1CQUFVQyxJQUpMO0FBS2pCbEIsRUFBQUEsU0FBUyxFQUFFaUIsbUJBQVVDLElBTEo7QUFNakJqQixFQUFBQSxTQUFTLEVBQUVnQixtQkFBVUMsSUFOSjtBQU9qQnBDLEVBQUFBLFdBQVcsRUFBRW1DLG1CQUFVRSxNQVBOO0FBUWpCeEMsRUFBQUEsVUFBVSxFQUFFc0MsbUJBQVVFLE1BUkw7QUFTakJoRSxFQUFBQSxJQUFJLEVBQUU4RCxtQkFBVUcsSUFBVixDQUFlTCxVQVRKO0FBVWpCckQsRUFBQUEsSUFBSSxFQUFFdUQsbUJBQVVHLElBQVYsQ0FBZUwsVUFWSjtBQVdqQnBELEVBQUFBLEtBQUssRUFBRXNELG1CQUFVRyxJQUFWLENBQWVMLFVBWEw7QUFZakJaLEVBQUFBLFlBQVksRUFBRWMsbUJBQVVDLElBWlA7QUFhakJYLEVBQUFBLGNBQWMsRUFBRVUsbUJBQVVJLE1BQVYsQ0FBaUJOO0FBYmhCLEM7O2dCQURBbkUsWSxrQkFpQkc7QUFDcEJNLEVBQUFBLFNBQVMsRUFBRSxLQURTO0FBRXBCNkMsRUFBQUEsVUFBVSxFQUFFLEtBRlE7QUFHcEJDLEVBQUFBLFNBQVMsRUFBRSxLQUhTO0FBSXBCQyxFQUFBQSxTQUFTLEVBQUUsS0FKUztBQUtwQm5CLEVBQUFBLFdBQVcsRUFBRSxDQUxPO0FBTXBCSCxFQUFBQSxVQUFVLEVBQUU7QUFOUSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7UmVtb3RlUHJvcFR5cGUsIEJyYW5jaFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcblxuZnVuY3Rpb24gZ2V0SWNvbkNsYXNzKGljb24sIGFuaW1hdGlvbikge1xuICByZXR1cm4gY3goXG4gICAgJ2dpdGh1Yi1QdXNoUHVsbC1pY29uJyxcbiAgICAnaWNvbicsXG4gICAgYGljb24tJHtpY29ufWAsXG4gICAge1tgYW5pbWF0ZS0ke2FuaW1hdGlvbn1gXTogISFhbmltYXRpb259LFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdXNoUHVsbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGN1cnJlbnRCcmFuY2g6IEJyYW5jaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFJlbW90ZTogUmVtb3RlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBpc1N5bmNpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzRmV0Y2hpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzUHVsbGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgaXNQdXNoaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBiZWhpbmRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBhaGVhZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHB1c2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcHVsbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcmlnaW5FeGlzdHM6IFByb3BUeXBlcy5ib29sLFxuICAgIHRvb2x0aXBNYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGlzU3luY2luZzogZmFsc2UsXG4gICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgaXNQdWxsaW5nOiBmYWxzZSxcbiAgICBpc1B1c2hpbmc6IGZhbHNlLFxuICAgIGJlaGluZENvdW50OiAwLFxuICAgIGFoZWFkQ291bnQ6IDAsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmVGlsZU5vZGUgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBvbkNsaWNrUHVzaCA9IGNsaWNrRXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmlzU3luY2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLnB1c2goe1xuICAgICAgZm9yY2U6IGNsaWNrRXZlbnQubWV0YUtleSB8fCBjbGlja0V2ZW50LmN0cmxLZXksXG4gICAgICBzZXRVcHN0cmVhbTogIXRoaXMucHJvcHMuY3VycmVudFJlbW90ZS5pc1ByZXNlbnQoKSxcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xpY2tQdWxsID0gY2xpY2tFdmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTeW5jaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMucHVsbCgpO1xuICB9XG5cbiAgb25DbGlja1B1c2hQdWxsID0gY2xpY2tFdmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTeW5jaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjbGlja0V2ZW50Lm1ldGFLZXkgfHwgY2xpY2tFdmVudC5jdHJsS2V5KSB7XG4gICAgICB0aGlzLnByb3BzLnB1c2goe1xuICAgICAgICBmb3JjZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLnB1bGwoKTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrUHVibGlzaCA9IGNsaWNrRXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmlzU3luY2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLnB1c2goe1xuICAgICAgc2V0VXBzdHJlYW06ICF0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCksXG4gICAgfSk7XG4gIH1cblxuICBvbkNsaWNrRmV0Y2ggPSBjbGlja0V2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1N5bmNpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5mZXRjaCgpO1xuICB9XG5cbiAgZ2V0VGlsZVN0YXRlcygpIHtcbiAgICBjb25zdCBtb2RLZXkgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/ICdDbWQnIDogJ0N0cmwnO1xuICAgIHJldHVybiB7XG4gICAgICBmZXRjaGluZzoge1xuICAgICAgICB0b29sdGlwOiAnRmV0Y2hpbmcgZnJvbSByZW1vdGUnLFxuICAgICAgICBpY29uOiAnc3luYycsXG4gICAgICAgIHRleHQ6ICdGZXRjaGluZycsXG4gICAgICAgIGljb25BbmltYXRpb246ICdyb3RhdGUnLFxuICAgICAgfSxcbiAgICAgIHB1bGxpbmc6IHtcbiAgICAgICAgdG9vbHRpcDogJ1B1bGxpbmcgZnJvbSByZW1vdGUnLFxuICAgICAgICBpY29uOiAnYXJyb3ctZG93bicsXG4gICAgICAgIHRleHQ6ICdQdWxsaW5nJyxcbiAgICAgICAgaWNvbkFuaW1hdGlvbjogJ2Rvd24nLFxuICAgICAgfSxcbiAgICAgIHB1c2hpbmc6IHtcbiAgICAgICAgdG9vbHRpcDogJ1B1c2hpbmcgdG8gcmVtb3RlJyxcbiAgICAgICAgaWNvbjogJ2Fycm93LXVwJyxcbiAgICAgICAgdGV4dDogJ1B1c2hpbmcnLFxuICAgICAgICBpY29uQW5pbWF0aW9uOiAndXAnLFxuICAgICAgfSxcbiAgICAgIGFoZWFkOiB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGlja1B1c2gsXG4gICAgICAgIHRvb2x0aXA6IGBDbGljayB0byBwdXNoPGJyIC8+JHttb2RLZXl9LWNsaWNrIHRvIGZvcmNlIHB1c2g8YnIgLz5SaWdodC1jbGljayBmb3IgbW9yZWAsXG4gICAgICAgIGljb246ICdhcnJvdy11cCcsXG4gICAgICAgIHRleHQ6IGBQdXNoICR7dGhpcy5wcm9wcy5haGVhZENvdW50fWAsXG4gICAgICB9LFxuICAgICAgYmVoaW5kOiB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGlja1B1bGwsXG4gICAgICAgIHRvb2x0aXA6ICdDbGljayB0byBwdWxsPGJyIC8+UmlnaHQtY2xpY2sgZm9yIG1vcmUnLFxuICAgICAgICBpY29uOiAnYXJyb3ctZG93bicsXG4gICAgICAgIHRleHQ6IGBQdWxsICR7dGhpcy5wcm9wcy5iZWhpbmRDb3VudH1gLFxuICAgICAgfSxcbiAgICAgIGFoZWFkQmVoaW5kOiB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGlja1B1c2hQdWxsLFxuICAgICAgICB0b29sdGlwOiBgQ2xpY2sgdG8gcHVsbDxiciAvPiR7bW9kS2V5fS1jbGljayB0byBmb3JjZSBwdXNoPGJyIC8+UmlnaHQtY2xpY2sgZm9yIG1vcmVgLFxuICAgICAgICBpY29uOiAnYXJyb3ctZG93bicsXG4gICAgICAgIHRleHQ6IGBQdWxsICR7dGhpcy5wcm9wcy5iZWhpbmRDb3VudH1gLFxuICAgICAgICBzZWNvbmRhcnlJY29uOiAnYXJyb3ctdXAnLFxuICAgICAgICBzZWNvbmRhcnlUZXh0OiBgJHt0aGlzLnByb3BzLmFoZWFkQ291bnR9IGAsXG4gICAgICB9LFxuICAgICAgcHVibGlzaGVkOiB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGlja0ZldGNoLFxuICAgICAgICB0b29sdGlwOiAnQ2xpY2sgdG8gZmV0Y2g8YnIgLz5SaWdodC1jbGljayBmb3IgbW9yZScsXG4gICAgICAgIGljb246ICdzeW5jJyxcbiAgICAgICAgdGV4dDogJ0ZldGNoJyxcbiAgICAgIH0sXG4gICAgICB1bnB1Ymxpc2hlZDoge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2tQdWJsaXNoLFxuICAgICAgICB0b29sdGlwOiAnQ2xpY2sgdG8gc2V0IHVwIGEgcmVtb3RlIHRyYWNraW5nIGJyYW5jaDxiciAvPlJpZ2h0LWNsaWNrIGZvciBtb3JlJyxcbiAgICAgICAgaWNvbjogJ2Nsb3VkLXVwbG9hZCcsXG4gICAgICAgIHRleHQ6ICdQdWJsaXNoJyxcbiAgICAgIH0sXG4gICAgICBub1JlbW90ZToge1xuICAgICAgICB0b29sdGlwOiAnVGhlcmUgaXMgbm8gcmVtb3RlIG5hbWVkIFwib3JpZ2luXCInLFxuICAgICAgICBpY29uOiAnc3RvcCcsXG4gICAgICAgIHRleHQ6ICdObyByZW1vdGUnLFxuICAgICAgfSxcbiAgICAgIGRldGFjaGVkOiB7XG4gICAgICAgIHRvb2x0aXA6ICdDcmVhdGUgYSBicmFuY2ggaWYgeW91IHdpc2ggdG8gcHVzaCB5b3VyIHdvcmsgYW55d2hlcmUnLFxuICAgICAgICBpY29uOiAnc3RvcCcsXG4gICAgICAgIHRleHQ6ICdOb3Qgb24gYnJhbmNoJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc0FoZWFkID0gdGhpcy5wcm9wcy5haGVhZENvdW50ID4gMDtcbiAgICBjb25zdCBpc0JlaGluZCA9IHRoaXMucHJvcHMuYmVoaW5kQ291bnQgPiAwO1xuICAgIGNvbnN0IGlzVW5wdWJsaXNoZWQgPSAhdGhpcy5wcm9wcy5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpO1xuICAgIGNvbnN0IGlzRGV0YWNoZWQgPSB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpO1xuICAgIGNvbnN0IGlzRmV0Y2hpbmcgPSB0aGlzLnByb3BzLmlzRmV0Y2hpbmc7XG4gICAgY29uc3QgaXNQdWxsaW5nID0gdGhpcy5wcm9wcy5pc1B1bGxpbmc7XG4gICAgY29uc3QgaXNQdXNoaW5nID0gdGhpcy5wcm9wcy5pc1B1c2hpbmc7XG4gICAgY29uc3QgaGFzT3JpZ2luID0gISF0aGlzLnByb3BzLm9yaWdpbkV4aXN0cztcblxuICAgIGNvbnN0IHRpbGVTdGF0ZXMgPSB0aGlzLmdldFRpbGVTdGF0ZXMoKTtcblxuICAgIGxldCB0aWxlU3RhdGU7XG5cbiAgICBpZiAoaXNGZXRjaGluZykge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5mZXRjaGluZztcbiAgICB9IGVsc2UgaWYgKGlzUHVsbGluZykge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5wdWxsaW5nO1xuICAgIH0gZWxzZSBpZiAoaXNQdXNoaW5nKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLnB1c2hpbmc7XG4gICAgfSBlbHNlIGlmIChpc0FoZWFkICYmICFpc0JlaGluZCAmJiAhaXNVbnB1Ymxpc2hlZCkge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5haGVhZDtcbiAgICB9IGVsc2UgaWYgKGlzQmVoaW5kICYmICFpc0FoZWFkICYmICFpc1VucHVibGlzaGVkKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLmJlaGluZDtcbiAgICB9IGVsc2UgaWYgKGlzQmVoaW5kICYmIGlzQWhlYWQgJiYgIWlzVW5wdWJsaXNoZWQpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMuYWhlYWRCZWhpbmQ7XG4gICAgfSBlbHNlIGlmICghaXNCZWhpbmQgJiYgIWlzQWhlYWQgJiYgIWlzVW5wdWJsaXNoZWQgJiYgIWlzRGV0YWNoZWQpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMucHVibGlzaGVkO1xuICAgIH0gZWxzZSBpZiAoaXNVbnB1Ymxpc2hlZCAmJiAhaXNEZXRhY2hlZCAmJiBoYXNPcmlnaW4pIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMudW5wdWJsaXNoZWQ7XG4gICAgfSBlbHNlIGlmIChpc1VucHVibGlzaGVkICYmICFpc0RldGFjaGVkICYmICFoYXNPcmlnaW4pIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMubm9SZW1vdGU7XG4gICAgfSBlbHNlIGlmIChpc0RldGFjaGVkKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLmRldGFjaGVkO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIG9uQ2xpY2s9e3RpbGVTdGF0ZS5vbkNsaWNrfVxuICAgICAgICByZWY9e3RoaXMucmVmVGlsZU5vZGUuc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItUHVzaFB1bGwnLCAnaW5saW5lLWJsb2NrJywgeydnaXRodWItYnJhbmNoLWRldGFjaGVkJzogaXNEZXRhY2hlZH0pfT5cbiAgICAgICAge3RpbGVTdGF0ZSAmJiAoXG4gICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIHt0aWxlU3RhdGUuc2Vjb25kYXJ5VGV4dCAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2dldEljb25DbGFzcyh0aWxlU3RhdGUuc2Vjb25kYXJ5SWNvbil9IC8+XG4gICAgICAgICAgICAgICAgICB7dGlsZVN0YXRlLnNlY29uZGFyeVRleHR9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2dldEljb25DbGFzcyh0aWxlU3RhdGUuaWNvbiwgdGlsZVN0YXRlLmljb25BbmltYXRpb24pfSAvPlxuICAgICAgICAgICAgICB7dGlsZVN0YXRlLnRleHR9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBrZXk9XCJ0b29sdGlwXCJcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwTWFuYWdlcn1cbiAgICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZlRpbGVOb2RlfVxuICAgICAgICAgICAgICB0aXRsZT17YDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBsZWZ0OyBsaW5lLWhlaWdodDogMS4yZW07XCI+JHt0aWxlU3RhdGUudG9vbHRpcH08L2Rpdj5gfVxuICAgICAgICAgICAgICBzaG93RGVsYXk9e2F0b20udG9vbHRpcHMuaG92ZXJEZWZhdWx0cy5kZWxheS5zaG93fVxuICAgICAgICAgICAgICBoaWRlRGVsYXk9e2F0b20udG9vbHRpcHMuaG92ZXJEZWZhdWx0cy5kZWxheS5oaWRlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19