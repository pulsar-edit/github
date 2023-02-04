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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    return _react.default.createElement("div", {
      onClick: tileState.onClick,
      ref: this.refTileNode.setter,
      className: (0, _classnames.default)('github-PushPull', 'inline-block', {
        'github-branch-detached': isDetached
      })
    }, tileState && _react.default.createElement(_react.Fragment, null, _react.default.createElement("span", null, tileState.secondaryText && _react.default.createElement("span", {
      className: "secondary"
    }, _react.default.createElement("span", {
      className: getIconClass(tileState.secondaryIcon)
    }), tileState.secondaryText), _react.default.createElement("span", {
      className: getIconClass(tileState.icon, tileState.iconAnimation)
    }), tileState.text), _react.default.createElement(_tooltip.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRJY29uQ2xhc3MiLCJpY29uIiwiYW5pbWF0aW9uIiwiY3giLCJQdXNoUHVsbFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjbGlja0V2ZW50IiwiaXNTeW5jaW5nIiwicHVzaCIsImZvcmNlIiwibWV0YUtleSIsImN0cmxLZXkiLCJzZXRVcHN0cmVhbSIsImN1cnJlbnRSZW1vdGUiLCJpc1ByZXNlbnQiLCJwdWxsIiwiZmV0Y2giLCJyZWZUaWxlTm9kZSIsIlJlZkhvbGRlciIsImdldFRpbGVTdGF0ZXMiLCJtb2RLZXkiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJmZXRjaGluZyIsInRvb2x0aXAiLCJ0ZXh0IiwiaWNvbkFuaW1hdGlvbiIsInB1bGxpbmciLCJwdXNoaW5nIiwiYWhlYWQiLCJvbkNsaWNrIiwib25DbGlja1B1c2giLCJhaGVhZENvdW50IiwiYmVoaW5kIiwib25DbGlja1B1bGwiLCJiZWhpbmRDb3VudCIsImFoZWFkQmVoaW5kIiwib25DbGlja1B1c2hQdWxsIiwic2Vjb25kYXJ5SWNvbiIsInNlY29uZGFyeVRleHQiLCJwdWJsaXNoZWQiLCJvbkNsaWNrRmV0Y2giLCJ1bnB1Ymxpc2hlZCIsIm9uQ2xpY2tQdWJsaXNoIiwibm9SZW1vdGUiLCJkZXRhY2hlZCIsInJlbmRlciIsImlzQWhlYWQiLCJpc0JlaGluZCIsImlzVW5wdWJsaXNoZWQiLCJpc0RldGFjaGVkIiwiY3VycmVudEJyYW5jaCIsImlzRmV0Y2hpbmciLCJpc1B1bGxpbmciLCJpc1B1c2hpbmciLCJoYXNPcmlnaW4iLCJvcmlnaW5FeGlzdHMiLCJ0aWxlU3RhdGVzIiwidGlsZVN0YXRlIiwic2V0dGVyIiwidG9vbHRpcE1hbmFnZXIiLCJhdG9tIiwidG9vbHRpcHMiLCJob3ZlckRlZmF1bHRzIiwiZGVsYXkiLCJzaG93IiwiaGlkZSIsIkJyYW5jaFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlJlbW90ZVByb3BUeXBlIiwiUHJvcFR5cGVzIiwiYm9vbCIsIm51bWJlciIsImZ1bmMiLCJvYmplY3QiXSwic291cmNlcyI6WyJwdXNoLXB1bGwtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHtSZW1vdGVQcm9wVHlwZSwgQnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuXG5mdW5jdGlvbiBnZXRJY29uQ2xhc3MoaWNvbiwgYW5pbWF0aW9uKSB7XG4gIHJldHVybiBjeChcbiAgICAnZ2l0aHViLVB1c2hQdWxsLWljb24nLFxuICAgICdpY29uJyxcbiAgICBgaWNvbi0ke2ljb259YCxcbiAgICB7W2BhbmltYXRlLSR7YW5pbWF0aW9ufWBdOiAhIWFuaW1hdGlvbn0sXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2hQdWxsVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50UmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGlzU3luY2luZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgaXNGZXRjaGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgaXNQdWxsaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpc1B1c2hpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGJlaGluZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGFoZWFkQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgcHVzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwdWxsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9yaWdpbkV4aXN0czogUHJvcFR5cGVzLmJvb2wsXG4gICAgdG9vbHRpcE1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaXNTeW5jaW5nOiBmYWxzZSxcbiAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICBpc1B1bGxpbmc6IGZhbHNlLFxuICAgIGlzUHVzaGluZzogZmFsc2UsXG4gICAgYmVoaW5kQ291bnQ6IDAsXG4gICAgYWhlYWRDb3VudDogMCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZUaWxlTm9kZSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIG9uQ2xpY2tQdXNoID0gY2xpY2tFdmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTeW5jaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMucHVzaCh7XG4gICAgICBmb3JjZTogY2xpY2tFdmVudC5tZXRhS2V5IHx8IGNsaWNrRXZlbnQuY3RybEtleSxcbiAgICAgIHNldFVwc3RyZWFtOiAhdGhpcy5wcm9wcy5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpLFxuICAgIH0pO1xuICB9XG5cbiAgb25DbGlja1B1bGwgPSBjbGlja0V2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1N5bmNpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5wdWxsKCk7XG4gIH1cblxuICBvbkNsaWNrUHVzaFB1bGwgPSBjbGlja0V2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1N5bmNpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNsaWNrRXZlbnQubWV0YUtleSB8fCBjbGlja0V2ZW50LmN0cmxLZXkpIHtcbiAgICAgIHRoaXMucHJvcHMucHVzaCh7XG4gICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMucHVsbCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2tQdWJsaXNoID0gY2xpY2tFdmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTeW5jaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMucHVzaCh7XG4gICAgICBzZXRVcHN0cmVhbTogIXRoaXMucHJvcHMuY3VycmVudFJlbW90ZS5pc1ByZXNlbnQoKSxcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xpY2tGZXRjaCA9IGNsaWNrRXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmlzU3luY2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLmZldGNoKCk7XG4gIH1cblxuICBnZXRUaWxlU3RhdGVzKCkge1xuICAgIGNvbnN0IG1vZEtleSA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nID8gJ0NtZCcgOiAnQ3RybCc7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZldGNoaW5nOiB7XG4gICAgICAgIHRvb2x0aXA6ICdGZXRjaGluZyBmcm9tIHJlbW90ZScsXG4gICAgICAgIGljb246ICdzeW5jJyxcbiAgICAgICAgdGV4dDogJ0ZldGNoaW5nJyxcbiAgICAgICAgaWNvbkFuaW1hdGlvbjogJ3JvdGF0ZScsXG4gICAgICB9LFxuICAgICAgcHVsbGluZzoge1xuICAgICAgICB0b29sdGlwOiAnUHVsbGluZyBmcm9tIHJlbW90ZScsXG4gICAgICAgIGljb246ICdhcnJvdy1kb3duJyxcbiAgICAgICAgdGV4dDogJ1B1bGxpbmcnLFxuICAgICAgICBpY29uQW5pbWF0aW9uOiAnZG93bicsXG4gICAgICB9LFxuICAgICAgcHVzaGluZzoge1xuICAgICAgICB0b29sdGlwOiAnUHVzaGluZyB0byByZW1vdGUnLFxuICAgICAgICBpY29uOiAnYXJyb3ctdXAnLFxuICAgICAgICB0ZXh0OiAnUHVzaGluZycsXG4gICAgICAgIGljb25BbmltYXRpb246ICd1cCcsXG4gICAgICB9LFxuICAgICAgYWhlYWQ6IHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrUHVzaCxcbiAgICAgICAgdG9vbHRpcDogYENsaWNrIHRvIHB1c2g8YnIgLz4ke21vZEtleX0tY2xpY2sgdG8gZm9yY2UgcHVzaDxiciAvPlJpZ2h0LWNsaWNrIGZvciBtb3JlYCxcbiAgICAgICAgaWNvbjogJ2Fycm93LXVwJyxcbiAgICAgICAgdGV4dDogYFB1c2ggJHt0aGlzLnByb3BzLmFoZWFkQ291bnR9YCxcbiAgICAgIH0sXG4gICAgICBiZWhpbmQ6IHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrUHVsbCxcbiAgICAgICAgdG9vbHRpcDogJ0NsaWNrIHRvIHB1bGw8YnIgLz5SaWdodC1jbGljayBmb3IgbW9yZScsXG4gICAgICAgIGljb246ICdhcnJvdy1kb3duJyxcbiAgICAgICAgdGV4dDogYFB1bGwgJHt0aGlzLnByb3BzLmJlaGluZENvdW50fWAsXG4gICAgICB9LFxuICAgICAgYWhlYWRCZWhpbmQ6IHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrUHVzaFB1bGwsXG4gICAgICAgIHRvb2x0aXA6IGBDbGljayB0byBwdWxsPGJyIC8+JHttb2RLZXl9LWNsaWNrIHRvIGZvcmNlIHB1c2g8YnIgLz5SaWdodC1jbGljayBmb3IgbW9yZWAsXG4gICAgICAgIGljb246ICdhcnJvdy1kb3duJyxcbiAgICAgICAgdGV4dDogYFB1bGwgJHt0aGlzLnByb3BzLmJlaGluZENvdW50fWAsXG4gICAgICAgIHNlY29uZGFyeUljb246ICdhcnJvdy11cCcsXG4gICAgICAgIHNlY29uZGFyeVRleHQ6IGAke3RoaXMucHJvcHMuYWhlYWRDb3VudH0gYCxcbiAgICAgIH0sXG4gICAgICBwdWJsaXNoZWQ6IHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrRmV0Y2gsXG4gICAgICAgIHRvb2x0aXA6ICdDbGljayB0byBmZXRjaDxiciAvPlJpZ2h0LWNsaWNrIGZvciBtb3JlJyxcbiAgICAgICAgaWNvbjogJ3N5bmMnLFxuICAgICAgICB0ZXh0OiAnRmV0Y2gnLFxuICAgICAgfSxcbiAgICAgIHVucHVibGlzaGVkOiB7XG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGlja1B1Ymxpc2gsXG4gICAgICAgIHRvb2x0aXA6ICdDbGljayB0byBzZXQgdXAgYSByZW1vdGUgdHJhY2tpbmcgYnJhbmNoPGJyIC8+UmlnaHQtY2xpY2sgZm9yIG1vcmUnLFxuICAgICAgICBpY29uOiAnY2xvdWQtdXBsb2FkJyxcbiAgICAgICAgdGV4dDogJ1B1Ymxpc2gnLFxuICAgICAgfSxcbiAgICAgIG5vUmVtb3RlOiB7XG4gICAgICAgIHRvb2x0aXA6ICdUaGVyZSBpcyBubyByZW1vdGUgbmFtZWQgXCJvcmlnaW5cIicsXG4gICAgICAgIGljb246ICdzdG9wJyxcbiAgICAgICAgdGV4dDogJ05vIHJlbW90ZScsXG4gICAgICB9LFxuICAgICAgZGV0YWNoZWQ6IHtcbiAgICAgICAgdG9vbHRpcDogJ0NyZWF0ZSBhIGJyYW5jaCBpZiB5b3Ugd2lzaCB0byBwdXNoIHlvdXIgd29yayBhbnl3aGVyZScsXG4gICAgICAgIGljb246ICdzdG9wJyxcbiAgICAgICAgdGV4dDogJ05vdCBvbiBicmFuY2gnLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzQWhlYWQgPSB0aGlzLnByb3BzLmFoZWFkQ291bnQgPiAwO1xuICAgIGNvbnN0IGlzQmVoaW5kID0gdGhpcy5wcm9wcy5iZWhpbmRDb3VudCA+IDA7XG4gICAgY29uc3QgaXNVbnB1Ymxpc2hlZCA9ICF0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCk7XG4gICAgY29uc3QgaXNEZXRhY2hlZCA9IHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5pc0RldGFjaGVkKCk7XG4gICAgY29uc3QgaXNGZXRjaGluZyA9IHRoaXMucHJvcHMuaXNGZXRjaGluZztcbiAgICBjb25zdCBpc1B1bGxpbmcgPSB0aGlzLnByb3BzLmlzUHVsbGluZztcbiAgICBjb25zdCBpc1B1c2hpbmcgPSB0aGlzLnByb3BzLmlzUHVzaGluZztcbiAgICBjb25zdCBoYXNPcmlnaW4gPSAhIXRoaXMucHJvcHMub3JpZ2luRXhpc3RzO1xuXG4gICAgY29uc3QgdGlsZVN0YXRlcyA9IHRoaXMuZ2V0VGlsZVN0YXRlcygpO1xuXG4gICAgbGV0IHRpbGVTdGF0ZTtcblxuICAgIGlmIChpc0ZldGNoaW5nKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLmZldGNoaW5nO1xuICAgIH0gZWxzZSBpZiAoaXNQdWxsaW5nKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLnB1bGxpbmc7XG4gICAgfSBlbHNlIGlmIChpc1B1c2hpbmcpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMucHVzaGluZztcbiAgICB9IGVsc2UgaWYgKGlzQWhlYWQgJiYgIWlzQmVoaW5kICYmICFpc1VucHVibGlzaGVkKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLmFoZWFkO1xuICAgIH0gZWxzZSBpZiAoaXNCZWhpbmQgJiYgIWlzQWhlYWQgJiYgIWlzVW5wdWJsaXNoZWQpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMuYmVoaW5kO1xuICAgIH0gZWxzZSBpZiAoaXNCZWhpbmQgJiYgaXNBaGVhZCAmJiAhaXNVbnB1Ymxpc2hlZCkge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5haGVhZEJlaGluZDtcbiAgICB9IGVsc2UgaWYgKCFpc0JlaGluZCAmJiAhaXNBaGVhZCAmJiAhaXNVbnB1Ymxpc2hlZCAmJiAhaXNEZXRhY2hlZCkge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5wdWJsaXNoZWQ7XG4gICAgfSBlbHNlIGlmIChpc1VucHVibGlzaGVkICYmICFpc0RldGFjaGVkICYmIGhhc09yaWdpbikge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy51bnB1Ymxpc2hlZDtcbiAgICB9IGVsc2UgaWYgKGlzVW5wdWJsaXNoZWQgJiYgIWlzRGV0YWNoZWQgJiYgIWhhc09yaWdpbikge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5ub1JlbW90ZTtcbiAgICB9IGVsc2UgaWYgKGlzRGV0YWNoZWQpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMuZGV0YWNoZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgb25DbGljaz17dGlsZVN0YXRlLm9uQ2xpY2t9XG4gICAgICAgIHJlZj17dGhpcy5yZWZUaWxlTm9kZS5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1QdXNoUHVsbCcsICdpbmxpbmUtYmxvY2snLCB7J2dpdGh1Yi1icmFuY2gtZGV0YWNoZWQnOiBpc0RldGFjaGVkfSl9PlxuICAgICAgICB7dGlsZVN0YXRlICYmIChcbiAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAge3RpbGVTdGF0ZS5zZWNvbmRhcnlUZXh0ICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Z2V0SWNvbkNsYXNzKHRpbGVTdGF0ZS5zZWNvbmRhcnlJY29uKX0gLz5cbiAgICAgICAgICAgICAgICAgIHt0aWxlU3RhdGUuc2Vjb25kYXJ5VGV4dH1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Z2V0SWNvbkNsYXNzKHRpbGVTdGF0ZS5pY29uLCB0aWxlU3RhdGUuaWNvbkFuaW1hdGlvbil9IC8+XG4gICAgICAgICAgICAgIHt0aWxlU3RhdGUudGV4dH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIGtleT1cInRvb2x0aXBcIlxuICAgICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBNYW5hZ2VyfVxuICAgICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmVGlsZU5vZGV9XG4gICAgICAgICAgICAgIHRpdGxlPXtgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGxlZnQ7IGxpbmUtaGVpZ2h0OiAxLjJlbTtcIj4ke3RpbGVTdGF0ZS50b29sdGlwfTwvZGl2PmB9XG4gICAgICAgICAgICAgIHNob3dEZWxheT17YXRvbS50b29sdGlwcy5ob3ZlckRlZmF1bHRzLmRlbGF5LnNob3d9XG4gICAgICAgICAgICAgIGhpZGVEZWxheT17YXRvbS50b29sdGlwcy5ob3ZlckRlZmF1bHRzLmRlbGF5LmhpZGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUE2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFN0MsU0FBU0EsWUFBWSxDQUFDQyxJQUFJLEVBQUVDLFNBQVMsRUFBRTtFQUNyQyxPQUFPLElBQUFDLG1CQUFFLEVBQ1Asc0JBQXNCLEVBQ3RCLE1BQU0sRUFDTCxRQUFPRixJQUFLLEVBQUMsRUFDZDtJQUFDLENBQUUsV0FBVUMsU0FBVSxFQUFDLEdBQUcsQ0FBQyxDQUFDQTtFQUFTLENBQUMsQ0FDeEM7QUFDSDtBQUVlLE1BQU1FLFlBQVksU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUEwQnhEQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixL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