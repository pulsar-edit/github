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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wdXNoLXB1bGwtdmlldy5qcyJdLCJuYW1lcyI6WyJnZXRJY29uQ2xhc3MiLCJpY29uIiwiYW5pbWF0aW9uIiwiUHVzaFB1bGxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY2xpY2tFdmVudCIsImlzU3luY2luZyIsInB1c2giLCJmb3JjZSIsIm1ldGFLZXkiLCJjdHJsS2V5Iiwic2V0VXBzdHJlYW0iLCJjdXJyZW50UmVtb3RlIiwiaXNQcmVzZW50IiwicHVsbCIsImZldGNoIiwicmVmVGlsZU5vZGUiLCJSZWZIb2xkZXIiLCJnZXRUaWxlU3RhdGVzIiwibW9kS2V5IiwicHJvY2VzcyIsInBsYXRmb3JtIiwiZmV0Y2hpbmciLCJ0b29sdGlwIiwidGV4dCIsImljb25BbmltYXRpb24iLCJwdWxsaW5nIiwicHVzaGluZyIsImFoZWFkIiwib25DbGljayIsIm9uQ2xpY2tQdXNoIiwiYWhlYWRDb3VudCIsImJlaGluZCIsIm9uQ2xpY2tQdWxsIiwiYmVoaW5kQ291bnQiLCJhaGVhZEJlaGluZCIsIm9uQ2xpY2tQdXNoUHVsbCIsInNlY29uZGFyeUljb24iLCJzZWNvbmRhcnlUZXh0IiwicHVibGlzaGVkIiwib25DbGlja0ZldGNoIiwidW5wdWJsaXNoZWQiLCJvbkNsaWNrUHVibGlzaCIsIm5vUmVtb3RlIiwiZGV0YWNoZWQiLCJyZW5kZXIiLCJpc0FoZWFkIiwiaXNCZWhpbmQiLCJpc1VucHVibGlzaGVkIiwiaXNEZXRhY2hlZCIsImN1cnJlbnRCcmFuY2giLCJpc0ZldGNoaW5nIiwiaXNQdWxsaW5nIiwiaXNQdXNoaW5nIiwiaGFzT3JpZ2luIiwib3JpZ2luRXhpc3RzIiwidGlsZVN0YXRlcyIsInRpbGVTdGF0ZSIsInNldHRlciIsInRvb2x0aXBNYW5hZ2VyIiwiYXRvbSIsInRvb2x0aXBzIiwiaG92ZXJEZWZhdWx0cyIsImRlbGF5Iiwic2hvdyIsImhpZGUiLCJCcmFuY2hQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJSZW1vdGVQcm9wVHlwZSIsIlByb3BUeXBlcyIsImJvb2wiLCJudW1iZXIiLCJmdW5jIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSxZQUFULENBQXNCQyxJQUF0QixFQUE0QkMsU0FBNUIsRUFBdUM7QUFDckMsU0FBTyx5QkFDTCxzQkFESyxFQUVMLE1BRkssRUFHSixRQUFPRCxJQUFLLEVBSFIsRUFJTDtBQUFDLEtBQUUsV0FBVUMsU0FBVSxFQUF0QixHQUEwQixDQUFDLENBQUNBO0FBQTdCLEdBSkssQ0FBUDtBQU1EOztBQUVjLE1BQU1DLFlBQU4sU0FBMkJDLGVBQU1DLFNBQWpDLENBQTJDO0FBMEJ4REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIseUNBTUxDLFVBQVUsSUFBSTtBQUMxQixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFdBQUtGLEtBQUwsQ0FBV0csSUFBWCxDQUFnQjtBQUNkQyxRQUFBQSxLQUFLLEVBQUVILFVBQVUsQ0FBQ0ksT0FBWCxJQUFzQkosVUFBVSxDQUFDSyxPQUQxQjtBQUVkQyxRQUFBQSxXQUFXLEVBQUUsQ0FBQyxLQUFLUCxLQUFMLENBQVdRLGFBQVgsQ0FBeUJDLFNBQXpCO0FBRkEsT0FBaEI7QUFJRCxLQWRrQjs7QUFBQSx5Q0FnQkxSLFVBQVUsSUFBSTtBQUMxQixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFdBQUtGLEtBQUwsQ0FBV1UsSUFBWDtBQUNELEtBckJrQjs7QUFBQSw2Q0F1QkRULFVBQVUsSUFBSTtBQUM5QixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFVBQUlELFVBQVUsQ0FBQ0ksT0FBWCxJQUFzQkosVUFBVSxDQUFDSyxPQUFyQyxFQUE4QztBQUM1QyxhQUFLTixLQUFMLENBQVdHLElBQVgsQ0FBZ0I7QUFDZEMsVUFBQUEsS0FBSyxFQUFFO0FBRE8sU0FBaEI7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLSixLQUFMLENBQVdVLElBQVg7QUFDRDtBQUNGLEtBbENrQjs7QUFBQSw0Q0FvQ0ZULFVBQVUsSUFBSTtBQUM3QixVQUFJLEtBQUtELEtBQUwsQ0FBV0UsU0FBZixFQUEwQjtBQUN4QjtBQUNEOztBQUNELFdBQUtGLEtBQUwsQ0FBV0csSUFBWCxDQUFnQjtBQUNkSSxRQUFBQSxXQUFXLEVBQUUsQ0FBQyxLQUFLUCxLQUFMLENBQVdRLGFBQVgsQ0FBeUJDLFNBQXpCO0FBREEsT0FBaEI7QUFHRCxLQTNDa0I7O0FBQUEsMENBNkNKUixVQUFVLElBQUk7QUFDM0IsVUFBSSxLQUFLRCxLQUFMLENBQVdFLFNBQWYsRUFBMEI7QUFDeEI7QUFDRDs7QUFDRCxXQUFLRixLQUFMLENBQVdXLEtBQVg7QUFDRCxLQWxEa0I7O0FBR2pCLFNBQUtDLFdBQUwsR0FBbUIsSUFBSUMsa0JBQUosRUFBbkI7QUFDRDs7QUFnRERDLEVBQUFBLGFBQWEsR0FBRztBQUNkLFVBQU1DLE1BQU0sR0FBR0MsT0FBTyxDQUFDQyxRQUFSLEtBQXFCLFFBQXJCLEdBQWdDLEtBQWhDLEdBQXdDLE1BQXZEO0FBQ0EsV0FBTztBQUNMQyxNQUFBQSxRQUFRLEVBQUU7QUFDUkMsUUFBQUEsT0FBTyxFQUFFLHNCQUREO0FBRVJ6QixRQUFBQSxJQUFJLEVBQUUsTUFGRTtBQUdSMEIsUUFBQUEsSUFBSSxFQUFFLFVBSEU7QUFJUkMsUUFBQUEsYUFBYSxFQUFFO0FBSlAsT0FETDtBQU9MQyxNQUFBQSxPQUFPLEVBQUU7QUFDUEgsUUFBQUEsT0FBTyxFQUFFLHFCQURGO0FBRVB6QixRQUFBQSxJQUFJLEVBQUUsWUFGQztBQUdQMEIsUUFBQUEsSUFBSSxFQUFFLFNBSEM7QUFJUEMsUUFBQUEsYUFBYSxFQUFFO0FBSlIsT0FQSjtBQWFMRSxNQUFBQSxPQUFPLEVBQUU7QUFDUEosUUFBQUEsT0FBTyxFQUFFLG1CQURGO0FBRVB6QixRQUFBQSxJQUFJLEVBQUUsVUFGQztBQUdQMEIsUUFBQUEsSUFBSSxFQUFFLFNBSEM7QUFJUEMsUUFBQUEsYUFBYSxFQUFFO0FBSlIsT0FiSjtBQW1CTEcsTUFBQUEsS0FBSyxFQUFFO0FBQ0xDLFFBQUFBLE9BQU8sRUFBRSxLQUFLQyxXQURUO0FBRUxQLFFBQUFBLE9BQU8sRUFBRyxzQkFBcUJKLE1BQU8sZ0RBRmpDO0FBR0xyQixRQUFBQSxJQUFJLEVBQUUsVUFIRDtBQUlMMEIsUUFBQUEsSUFBSSxFQUFHLFFBQU8sS0FBS3BCLEtBQUwsQ0FBVzJCLFVBQVc7QUFKL0IsT0FuQkY7QUF5QkxDLE1BQUFBLE1BQU0sRUFBRTtBQUNOSCxRQUFBQSxPQUFPLEVBQUUsS0FBS0ksV0FEUjtBQUVOVixRQUFBQSxPQUFPLEVBQUUseUNBRkg7QUFHTnpCLFFBQUFBLElBQUksRUFBRSxZQUhBO0FBSU4wQixRQUFBQSxJQUFJLEVBQUcsUUFBTyxLQUFLcEIsS0FBTCxDQUFXOEIsV0FBWTtBQUovQixPQXpCSDtBQStCTEMsTUFBQUEsV0FBVyxFQUFFO0FBQ1hOLFFBQUFBLE9BQU8sRUFBRSxLQUFLTyxlQURIO0FBRVhiLFFBQUFBLE9BQU8sRUFBRyxzQkFBcUJKLE1BQU8sZ0RBRjNCO0FBR1hyQixRQUFBQSxJQUFJLEVBQUUsWUFISztBQUlYMEIsUUFBQUEsSUFBSSxFQUFHLFFBQU8sS0FBS3BCLEtBQUwsQ0FBVzhCLFdBQVksRUFKMUI7QUFLWEcsUUFBQUEsYUFBYSxFQUFFLFVBTEo7QUFNWEMsUUFBQUEsYUFBYSxFQUFHLEdBQUUsS0FBS2xDLEtBQUwsQ0FBVzJCLFVBQVc7QUFON0IsT0EvQlI7QUF1Q0xRLE1BQUFBLFNBQVMsRUFBRTtBQUNUVixRQUFBQSxPQUFPLEVBQUUsS0FBS1csWUFETDtBQUVUakIsUUFBQUEsT0FBTyxFQUFFLDBDQUZBO0FBR1R6QixRQUFBQSxJQUFJLEVBQUUsTUFIRztBQUlUMEIsUUFBQUEsSUFBSSxFQUFFO0FBSkcsT0F2Q047QUE2Q0xpQixNQUFBQSxXQUFXLEVBQUU7QUFDWFosUUFBQUEsT0FBTyxFQUFFLEtBQUthLGNBREg7QUFFWG5CLFFBQUFBLE9BQU8sRUFBRSxvRUFGRTtBQUdYekIsUUFBQUEsSUFBSSxFQUFFLGNBSEs7QUFJWDBCLFFBQUFBLElBQUksRUFBRTtBQUpLLE9BN0NSO0FBbURMbUIsTUFBQUEsUUFBUSxFQUFFO0FBQ1JwQixRQUFBQSxPQUFPLEVBQUUsbUNBREQ7QUFFUnpCLFFBQUFBLElBQUksRUFBRSxNQUZFO0FBR1IwQixRQUFBQSxJQUFJLEVBQUU7QUFIRSxPQW5ETDtBQXdETG9CLE1BQUFBLFFBQVEsRUFBRTtBQUNSckIsUUFBQUEsT0FBTyxFQUFFLHdEQUREO0FBRVJ6QixRQUFBQSxJQUFJLEVBQUUsTUFGRTtBQUdSMEIsUUFBQUEsSUFBSSxFQUFFO0FBSEU7QUF4REwsS0FBUDtBQThERDs7QUFFRHFCLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLE9BQU8sR0FBRyxLQUFLMUMsS0FBTCxDQUFXMkIsVUFBWCxHQUF3QixDQUF4QztBQUNBLFVBQU1nQixRQUFRLEdBQUcsS0FBSzNDLEtBQUwsQ0FBVzhCLFdBQVgsR0FBeUIsQ0FBMUM7QUFDQSxVQUFNYyxhQUFhLEdBQUcsQ0FBQyxLQUFLNUMsS0FBTCxDQUFXUSxhQUFYLENBQXlCQyxTQUF6QixFQUF2QjtBQUNBLFVBQU1vQyxVQUFVLEdBQUcsS0FBSzdDLEtBQUwsQ0FBVzhDLGFBQVgsQ0FBeUJELFVBQXpCLEVBQW5CO0FBQ0EsVUFBTUUsVUFBVSxHQUFHLEtBQUsvQyxLQUFMLENBQVcrQyxVQUE5QjtBQUNBLFVBQU1DLFNBQVMsR0FBRyxLQUFLaEQsS0FBTCxDQUFXZ0QsU0FBN0I7QUFDQSxVQUFNQyxTQUFTLEdBQUcsS0FBS2pELEtBQUwsQ0FBV2lELFNBQTdCO0FBQ0EsVUFBTUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLbEQsS0FBTCxDQUFXbUQsWUFBL0I7QUFFQSxVQUFNQyxVQUFVLEdBQUcsS0FBS3RDLGFBQUwsRUFBbkI7QUFFQSxRQUFJdUMsU0FBSjs7QUFFQSxRQUFJTixVQUFKLEVBQWdCO0FBQ2RNLE1BQUFBLFNBQVMsR0FBR0QsVUFBVSxDQUFDbEMsUUFBdkI7QUFDRCxLQUZELE1BRU8sSUFBSThCLFNBQUosRUFBZTtBQUNwQkssTUFBQUEsU0FBUyxHQUFHRCxVQUFVLENBQUM5QixPQUF2QjtBQUNELEtBRk0sTUFFQSxJQUFJMkIsU0FBSixFQUFlO0FBQ3BCSSxNQUFBQSxTQUFTLEdBQUdELFVBQVUsQ0FBQzdCLE9BQXZCO0FBQ0QsS0FGTSxNQUVBLElBQUltQixPQUFPLElBQUksQ0FBQ0MsUUFBWixJQUF3QixDQUFDQyxhQUE3QixFQUE0QztBQUNqRFMsTUFBQUEsU0FBUyxHQUFHRCxVQUFVLENBQUM1QixLQUF2QjtBQUNELEtBRk0sTUFFQSxJQUFJbUIsUUFBUSxJQUFJLENBQUNELE9BQWIsSUFBd0IsQ0FBQ0UsYUFBN0IsRUFBNEM7QUFDakRTLE1BQUFBLFNBQVMsR0FBR0QsVUFBVSxDQUFDeEIsTUFBdkI7QUFDRCxLQUZNLE1BRUEsSUFBSWUsUUFBUSxJQUFJRCxPQUFaLElBQXVCLENBQUNFLGFBQTVCLEVBQTJDO0FBQ2hEUyxNQUFBQSxTQUFTLEdBQUdELFVBQVUsQ0FBQ3JCLFdBQXZCO0FBQ0QsS0FGTSxNQUVBLElBQUksQ0FBQ1ksUUFBRCxJQUFhLENBQUNELE9BQWQsSUFBeUIsQ0FBQ0UsYUFBMUIsSUFBMkMsQ0FBQ0MsVUFBaEQsRUFBNEQ7QUFDakVRLE1BQUFBLFNBQVMsR0FBR0QsVUFBVSxDQUFDakIsU0FBdkI7QUFDRCxLQUZNLE1BRUEsSUFBSVMsYUFBYSxJQUFJLENBQUNDLFVBQWxCLElBQWdDSyxTQUFwQyxFQUErQztBQUNwREcsTUFBQUEsU0FBUyxHQUFHRCxVQUFVLENBQUNmLFdBQXZCO0FBQ0QsS0FGTSxNQUVBLElBQUlPLGFBQWEsSUFBSSxDQUFDQyxVQUFsQixJQUFnQyxDQUFDSyxTQUFyQyxFQUFnRDtBQUNyREcsTUFBQUEsU0FBUyxHQUFHRCxVQUFVLENBQUNiLFFBQXZCO0FBQ0QsS0FGTSxNQUVBLElBQUlNLFVBQUosRUFBZ0I7QUFDckJRLE1BQUFBLFNBQVMsR0FBR0QsVUFBVSxDQUFDWixRQUF2QjtBQUNEOztBQUVELFdBQ0U7QUFDRSxNQUFBLE9BQU8sRUFBRWEsU0FBUyxDQUFDNUIsT0FEckI7QUFFRSxNQUFBLEdBQUcsRUFBRSxLQUFLYixXQUFMLENBQWlCMEMsTUFGeEI7QUFHRSxNQUFBLFNBQVMsRUFBRSx5QkFBRyxpQkFBSCxFQUFzQixjQUF0QixFQUFzQztBQUFDLGtDQUEwQlQ7QUFBM0IsT0FBdEM7QUFIYixPQUlHUSxTQUFTLElBQ1IsNkJBQUMsZUFBRCxRQUNFLDJDQUNHQSxTQUFTLENBQUNuQixhQUFWLElBQ0M7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUV6QyxZQUFZLENBQUM0RCxTQUFTLENBQUNwQixhQUFYO0FBQTdCLE1BREYsRUFFR29CLFNBQVMsQ0FBQ25CLGFBRmIsQ0FGSixFQU9FO0FBQU0sTUFBQSxTQUFTLEVBQUV6QyxZQUFZLENBQUM0RCxTQUFTLENBQUMzRCxJQUFYLEVBQWlCMkQsU0FBUyxDQUFDaEMsYUFBM0I7QUFBN0IsTUFQRixFQVFHZ0MsU0FBUyxDQUFDakMsSUFSYixDQURGLEVBV0UsNkJBQUMsZ0JBQUQ7QUFDRSxNQUFBLEdBQUcsRUFBQyxTQUROO0FBRUUsTUFBQSxPQUFPLEVBQUUsS0FBS3BCLEtBQUwsQ0FBV3VELGNBRnRCO0FBR0UsTUFBQSxNQUFNLEVBQUUsS0FBSzNDLFdBSGY7QUFJRSxNQUFBLEtBQUssRUFBRyxzREFBcUR5QyxTQUFTLENBQUNsQyxPQUFRLFFBSmpGO0FBS0UsTUFBQSxTQUFTLEVBQUVxQyxJQUFJLENBQUNDLFFBQUwsQ0FBY0MsYUFBZCxDQUE0QkMsS0FBNUIsQ0FBa0NDLElBTC9DO0FBTUUsTUFBQSxTQUFTLEVBQUVKLElBQUksQ0FBQ0MsUUFBTCxDQUFjQyxhQUFkLENBQTRCQyxLQUE1QixDQUFrQ0U7QUFOL0MsTUFYRixDQUxKLENBREY7QUE2QkQ7O0FBak51RDs7OztnQkFBckNqRSxZLGVBQ0E7QUFDakJrRCxFQUFBQSxhQUFhLEVBQUVnQiwyQkFBZUMsVUFEYjtBQUVqQnZELEVBQUFBLGFBQWEsRUFBRXdELDJCQUFlRCxVQUZiO0FBR2pCN0QsRUFBQUEsU0FBUyxFQUFFK0QsbUJBQVVDLElBSEo7QUFJakJuQixFQUFBQSxVQUFVLEVBQUVrQixtQkFBVUMsSUFKTDtBQUtqQmxCLEVBQUFBLFNBQVMsRUFBRWlCLG1CQUFVQyxJQUxKO0FBTWpCakIsRUFBQUEsU0FBUyxFQUFFZ0IsbUJBQVVDLElBTko7QUFPakJwQyxFQUFBQSxXQUFXLEVBQUVtQyxtQkFBVUUsTUFQTjtBQVFqQnhDLEVBQUFBLFVBQVUsRUFBRXNDLG1CQUFVRSxNQVJMO0FBU2pCaEUsRUFBQUEsSUFBSSxFQUFFOEQsbUJBQVVHLElBQVYsQ0FBZUwsVUFUSjtBQVVqQnJELEVBQUFBLElBQUksRUFBRXVELG1CQUFVRyxJQUFWLENBQWVMLFVBVko7QUFXakJwRCxFQUFBQSxLQUFLLEVBQUVzRCxtQkFBVUcsSUFBVixDQUFlTCxVQVhMO0FBWWpCWixFQUFBQSxZQUFZLEVBQUVjLG1CQUFVQyxJQVpQO0FBYWpCWCxFQUFBQSxjQUFjLEVBQUVVLG1CQUFVSSxNQUFWLENBQWlCTjtBQWJoQixDOztnQkFEQW5FLFksa0JBaUJHO0FBQ3BCTSxFQUFBQSxTQUFTLEVBQUUsS0FEUztBQUVwQjZDLEVBQUFBLFVBQVUsRUFBRSxLQUZRO0FBR3BCQyxFQUFBQSxTQUFTLEVBQUUsS0FIUztBQUlwQkMsRUFBQUEsU0FBUyxFQUFFLEtBSlM7QUFLcEJuQixFQUFBQSxXQUFXLEVBQUUsQ0FMTztBQU1wQkgsRUFBQUEsVUFBVSxFQUFFO0FBTlEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQge1JlbW90ZVByb3BUeXBlLCBCcmFuY2hQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9hdG9tL3Rvb2x0aXAnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmZ1bmN0aW9uIGdldEljb25DbGFzcyhpY29uLCBhbmltYXRpb24pIHtcbiAgcmV0dXJuIGN4KFxuICAgICdnaXRodWItUHVzaFB1bGwtaWNvbicsXG4gICAgJ2ljb24nLFxuICAgIGBpY29uLSR7aWNvbn1gLFxuICAgIHtbYGFuaW1hdGUtJHthbmltYXRpb259YF06ICEhYW5pbWF0aW9ufSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaFB1bGxWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRSZW1vdGU6IFJlbW90ZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgaXNTeW5jaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpc0ZldGNoaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpc1B1bGxpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzUHVzaGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgYmVoaW5kQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgYWhlYWRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBwdXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHB1bGw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3JpZ2luRXhpc3RzOiBQcm9wVHlwZXMuYm9vbCxcbiAgICB0b29sdGlwTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc1N5bmNpbmc6IGZhbHNlLFxuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgIGlzUHVsbGluZzogZmFsc2UsXG4gICAgaXNQdXNoaW5nOiBmYWxzZSxcbiAgICBiZWhpbmRDb3VudDogMCxcbiAgICBhaGVhZENvdW50OiAwLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZlRpbGVOb2RlID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgb25DbGlja1B1c2ggPSBjbGlja0V2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1N5bmNpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5wdXNoKHtcbiAgICAgIGZvcmNlOiBjbGlja0V2ZW50Lm1ldGFLZXkgfHwgY2xpY2tFdmVudC5jdHJsS2V5LFxuICAgICAgc2V0VXBzdHJlYW06ICF0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCksXG4gICAgfSk7XG4gIH1cblxuICBvbkNsaWNrUHVsbCA9IGNsaWNrRXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmlzU3luY2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLnB1bGwoKTtcbiAgfVxuXG4gIG9uQ2xpY2tQdXNoUHVsbCA9IGNsaWNrRXZlbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmlzU3luY2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2xpY2tFdmVudC5tZXRhS2V5IHx8IGNsaWNrRXZlbnQuY3RybEtleSkge1xuICAgICAgdGhpcy5wcm9wcy5wdXNoKHtcbiAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5wdWxsKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGlja1B1Ymxpc2ggPSBjbGlja0V2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1N5bmNpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5wdXNoKHtcbiAgICAgIHNldFVwc3RyZWFtOiAhdGhpcy5wcm9wcy5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpLFxuICAgIH0pO1xuICB9XG5cbiAgb25DbGlja0ZldGNoID0gY2xpY2tFdmVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTeW5jaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMuZmV0Y2goKTtcbiAgfVxuXG4gIGdldFRpbGVTdGF0ZXMoKSB7XG4gICAgY29uc3QgbW9kS2V5ID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyAnQ21kJyA6ICdDdHJsJztcbiAgICByZXR1cm4ge1xuICAgICAgZmV0Y2hpbmc6IHtcbiAgICAgICAgdG9vbHRpcDogJ0ZldGNoaW5nIGZyb20gcmVtb3RlJyxcbiAgICAgICAgaWNvbjogJ3N5bmMnLFxuICAgICAgICB0ZXh0OiAnRmV0Y2hpbmcnLFxuICAgICAgICBpY29uQW5pbWF0aW9uOiAncm90YXRlJyxcbiAgICAgIH0sXG4gICAgICBwdWxsaW5nOiB7XG4gICAgICAgIHRvb2x0aXA6ICdQdWxsaW5nIGZyb20gcmVtb3RlJyxcbiAgICAgICAgaWNvbjogJ2Fycm93LWRvd24nLFxuICAgICAgICB0ZXh0OiAnUHVsbGluZycsXG4gICAgICAgIGljb25BbmltYXRpb246ICdkb3duJyxcbiAgICAgIH0sXG4gICAgICBwdXNoaW5nOiB7XG4gICAgICAgIHRvb2x0aXA6ICdQdXNoaW5nIHRvIHJlbW90ZScsXG4gICAgICAgIGljb246ICdhcnJvdy11cCcsXG4gICAgICAgIHRleHQ6ICdQdXNoaW5nJyxcbiAgICAgICAgaWNvbkFuaW1hdGlvbjogJ3VwJyxcbiAgICAgIH0sXG4gICAgICBhaGVhZDoge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2tQdXNoLFxuICAgICAgICB0b29sdGlwOiBgQ2xpY2sgdG8gcHVzaDxiciAvPiR7bW9kS2V5fS1jbGljayB0byBmb3JjZSBwdXNoPGJyIC8+UmlnaHQtY2xpY2sgZm9yIG1vcmVgLFxuICAgICAgICBpY29uOiAnYXJyb3ctdXAnLFxuICAgICAgICB0ZXh0OiBgUHVzaCAke3RoaXMucHJvcHMuYWhlYWRDb3VudH1gLFxuICAgICAgfSxcbiAgICAgIGJlaGluZDoge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2tQdWxsLFxuICAgICAgICB0b29sdGlwOiAnQ2xpY2sgdG8gcHVsbDxiciAvPlJpZ2h0LWNsaWNrIGZvciBtb3JlJyxcbiAgICAgICAgaWNvbjogJ2Fycm93LWRvd24nLFxuICAgICAgICB0ZXh0OiBgUHVsbCAke3RoaXMucHJvcHMuYmVoaW5kQ291bnR9YCxcbiAgICAgIH0sXG4gICAgICBhaGVhZEJlaGluZDoge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2tQdXNoUHVsbCxcbiAgICAgICAgdG9vbHRpcDogYENsaWNrIHRvIHB1bGw8YnIgLz4ke21vZEtleX0tY2xpY2sgdG8gZm9yY2UgcHVzaDxiciAvPlJpZ2h0LWNsaWNrIGZvciBtb3JlYCxcbiAgICAgICAgaWNvbjogJ2Fycm93LWRvd24nLFxuICAgICAgICB0ZXh0OiBgUHVsbCAke3RoaXMucHJvcHMuYmVoaW5kQ291bnR9YCxcbiAgICAgICAgc2Vjb25kYXJ5SWNvbjogJ2Fycm93LXVwJyxcbiAgICAgICAgc2Vjb25kYXJ5VGV4dDogYCR7dGhpcy5wcm9wcy5haGVhZENvdW50fSBgLFxuICAgICAgfSxcbiAgICAgIHB1Ymxpc2hlZDoge1xuICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2tGZXRjaCxcbiAgICAgICAgdG9vbHRpcDogJ0NsaWNrIHRvIGZldGNoPGJyIC8+UmlnaHQtY2xpY2sgZm9yIG1vcmUnLFxuICAgICAgICBpY29uOiAnc3luYycsXG4gICAgICAgIHRleHQ6ICdGZXRjaCcsXG4gICAgICB9LFxuICAgICAgdW5wdWJsaXNoZWQ6IHtcbiAgICAgICAgb25DbGljazogdGhpcy5vbkNsaWNrUHVibGlzaCxcbiAgICAgICAgdG9vbHRpcDogJ0NsaWNrIHRvIHNldCB1cCBhIHJlbW90ZSB0cmFja2luZyBicmFuY2g8YnIgLz5SaWdodC1jbGljayBmb3IgbW9yZScsXG4gICAgICAgIGljb246ICdjbG91ZC11cGxvYWQnLFxuICAgICAgICB0ZXh0OiAnUHVibGlzaCcsXG4gICAgICB9LFxuICAgICAgbm9SZW1vdGU6IHtcbiAgICAgICAgdG9vbHRpcDogJ1RoZXJlIGlzIG5vIHJlbW90ZSBuYW1lZCBcIm9yaWdpblwiJyxcbiAgICAgICAgaWNvbjogJ3N0b3AnLFxuICAgICAgICB0ZXh0OiAnTm8gcmVtb3RlJyxcbiAgICAgIH0sXG4gICAgICBkZXRhY2hlZDoge1xuICAgICAgICB0b29sdGlwOiAnQ3JlYXRlIGEgYnJhbmNoIGlmIHlvdSB3aXNoIHRvIHB1c2ggeW91ciB3b3JrIGFueXdoZXJlJyxcbiAgICAgICAgaWNvbjogJ3N0b3AnLFxuICAgICAgICB0ZXh0OiAnTm90IG9uIGJyYW5jaCcsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNBaGVhZCA9IHRoaXMucHJvcHMuYWhlYWRDb3VudCA+IDA7XG4gICAgY29uc3QgaXNCZWhpbmQgPSB0aGlzLnByb3BzLmJlaGluZENvdW50ID4gMDtcbiAgICBjb25zdCBpc1VucHVibGlzaGVkID0gIXRoaXMucHJvcHMuY3VycmVudFJlbW90ZS5pc1ByZXNlbnQoKTtcbiAgICBjb25zdCBpc0RldGFjaGVkID0gdGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKTtcbiAgICBjb25zdCBpc0ZldGNoaW5nID0gdGhpcy5wcm9wcy5pc0ZldGNoaW5nO1xuICAgIGNvbnN0IGlzUHVsbGluZyA9IHRoaXMucHJvcHMuaXNQdWxsaW5nO1xuICAgIGNvbnN0IGlzUHVzaGluZyA9IHRoaXMucHJvcHMuaXNQdXNoaW5nO1xuICAgIGNvbnN0IGhhc09yaWdpbiA9ICEhdGhpcy5wcm9wcy5vcmlnaW5FeGlzdHM7XG5cbiAgICBjb25zdCB0aWxlU3RhdGVzID0gdGhpcy5nZXRUaWxlU3RhdGVzKCk7XG5cbiAgICBsZXQgdGlsZVN0YXRlO1xuXG4gICAgaWYgKGlzRmV0Y2hpbmcpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMuZmV0Y2hpbmc7XG4gICAgfSBlbHNlIGlmIChpc1B1bGxpbmcpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMucHVsbGluZztcbiAgICB9IGVsc2UgaWYgKGlzUHVzaGluZykge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5wdXNoaW5nO1xuICAgIH0gZWxzZSBpZiAoaXNBaGVhZCAmJiAhaXNCZWhpbmQgJiYgIWlzVW5wdWJsaXNoZWQpIHtcbiAgICAgIHRpbGVTdGF0ZSA9IHRpbGVTdGF0ZXMuYWhlYWQ7XG4gICAgfSBlbHNlIGlmIChpc0JlaGluZCAmJiAhaXNBaGVhZCAmJiAhaXNVbnB1Ymxpc2hlZCkge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5iZWhpbmQ7XG4gICAgfSBlbHNlIGlmIChpc0JlaGluZCAmJiBpc0FoZWFkICYmICFpc1VucHVibGlzaGVkKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLmFoZWFkQmVoaW5kO1xuICAgIH0gZWxzZSBpZiAoIWlzQmVoaW5kICYmICFpc0FoZWFkICYmICFpc1VucHVibGlzaGVkICYmICFpc0RldGFjaGVkKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLnB1Ymxpc2hlZDtcbiAgICB9IGVsc2UgaWYgKGlzVW5wdWJsaXNoZWQgJiYgIWlzRGV0YWNoZWQgJiYgaGFzT3JpZ2luKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLnVucHVibGlzaGVkO1xuICAgIH0gZWxzZSBpZiAoaXNVbnB1Ymxpc2hlZCAmJiAhaXNEZXRhY2hlZCAmJiAhaGFzT3JpZ2luKSB7XG4gICAgICB0aWxlU3RhdGUgPSB0aWxlU3RhdGVzLm5vUmVtb3RlO1xuICAgIH0gZWxzZSBpZiAoaXNEZXRhY2hlZCkge1xuICAgICAgdGlsZVN0YXRlID0gdGlsZVN0YXRlcy5kZXRhY2hlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBvbkNsaWNrPXt0aWxlU3RhdGUub25DbGlja31cbiAgICAgICAgcmVmPXt0aGlzLnJlZlRpbGVOb2RlLnNldHRlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLVB1c2hQdWxsJywgJ2lubGluZS1ibG9jaycsIHsnZ2l0aHViLWJyYW5jaC1kZXRhY2hlZCc6IGlzRGV0YWNoZWR9KX0+XG4gICAgICAgIHt0aWxlU3RhdGUgJiYgKFxuICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICB7dGlsZVN0YXRlLnNlY29uZGFyeVRleHQgJiYgKFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnZXRJY29uQ2xhc3ModGlsZVN0YXRlLnNlY29uZGFyeUljb24pfSAvPlxuICAgICAgICAgICAgICAgICAge3RpbGVTdGF0ZS5zZWNvbmRhcnlUZXh0fVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnZXRJY29uQ2xhc3ModGlsZVN0YXRlLmljb24sIHRpbGVTdGF0ZS5pY29uQW5pbWF0aW9uKX0gLz5cbiAgICAgICAgICAgICAge3RpbGVTdGF0ZS50ZXh0fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAga2V5PVwidG9vbHRpcFwiXG4gICAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcE1hbmFnZXJ9XG4gICAgICAgICAgICAgIHRhcmdldD17dGhpcy5yZWZUaWxlTm9kZX1cbiAgICAgICAgICAgICAgdGl0bGU9e2A8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogbGVmdDsgbGluZS1oZWlnaHQ6IDEuMmVtO1wiPiR7dGlsZVN0YXRlLnRvb2x0aXB9PC9kaXY+YH1cbiAgICAgICAgICAgICAgc2hvd0RlbGF5PXthdG9tLnRvb2x0aXBzLmhvdmVyRGVmYXVsdHMuZGVsYXkuc2hvd31cbiAgICAgICAgICAgICAgaGlkZURlbGF5PXthdG9tLnRvb2x0aXBzLmhvdmVyRGVmYXVsdHMuZGVsYXkuaGlkZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==