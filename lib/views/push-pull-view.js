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