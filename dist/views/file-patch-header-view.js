"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _changedFileItem = _interopRequireDefault(require("../items/changed-file-item"));

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilePatchHeaderView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "togglePatchCollapse", () => {
      if (this.props.isCollapsed) {
        (0, _reporterProxy.addEvent)('expand-file-patch', {
          component: this.constructor.name,
          package: 'github'
        });
        this.props.triggerExpand();
      } else {
        (0, _reporterProxy.addEvent)('collapse-file-patch', {
          component: this.constructor.name,
          package: 'github'
        });
        this.props.triggerCollapse();
      }
    });

    this.refMirrorButton = new _refHolder.default();
    this.refOpenFileButton = new _refHolder.default();
  }

  render() {
    return _react.default.createElement("header", {
      className: "github-FilePatchView-header"
    }, this.renderCollapseButton(), _react.default.createElement("span", {
      className: "github-FilePatchView-title"
    }, this.renderTitle()), this.renderButtonGroup());
  }

  renderCollapseButton() {
    if (this.props.itemType === _changedFileItem.default) {
      return null;
    }

    const icon = this.props.isCollapsed ? 'chevron-right' : 'chevron-down';
    return _react.default.createElement("button", {
      className: "github-FilePatchView-collapseButton",
      onClick: this.togglePatchCollapse
    }, _react.default.createElement(_octicon.default, {
      className: "github-FilePatchView-collapseButtonIcon",
      icon: icon
    }));
  }

  renderTitle() {
    if (this.props.itemType === _changedFileItem.default) {
      const status = this.props.stagingStatus;
      return _react.default.createElement("span", null, status[0].toUpperCase(), status.slice(1), " Changes for ", this.renderDisplayPath());
    } else {
      return this.renderDisplayPath();
    }
  }

  renderDisplayPath() {
    if (this.props.newPath && this.props.newPath !== this.props.relPath) {
      const oldPath = this.renderPath(this.props.relPath);
      const newPath = this.renderPath(this.props.newPath);
      return _react.default.createElement("span", null, oldPath, " ", _react.default.createElement("span", null, "\u2192"), " ", newPath);
    } else {
      return this.renderPath(this.props.relPath);
    }
  }

  renderPath(filePath) {
    const dirname = _path.default.dirname(filePath);

    const basename = _path.default.basename(filePath);

    if (dirname === '.') {
      return _react.default.createElement("span", {
        className: "gitub-FilePatchHeaderView-basename"
      }, basename);
    } else {
      return _react.default.createElement("span", null, dirname, _path.default.sep, _react.default.createElement("span", {
        className: "gitub-FilePatchHeaderView-basename"
      }, basename));
    }
  }

  renderButtonGroup() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    } else {
      return _react.default.createElement("span", {
        className: "btn-group"
      }, this.renderUndoDiscardButton(), this.renderMirrorPatchButton(), this.renderOpenFileButton(), this.renderToggleFileButton());
    }
  }

  renderUndoDiscardButton() {
    const unstagedChangedFileItem = this.props.itemType === _changedFileItem.default && this.props.stagingStatus === 'unstaged';

    if (unstagedChangedFileItem && this.props.hasUndoHistory) {
      return _react.default.createElement("button", {
        className: "btn icon icon-history",
        onClick: this.props.undoLastDiscard
      }, "Undo Discard");
    } else {
      return null;
    }
  }

  renderMirrorPatchButton() {
    if (!this.props.isPartiallyStaged) {
      return null;
    }

    const attrs = this.props.stagingStatus === 'unstaged' ? {
      iconClass: 'icon-tasklist',
      buttonText: 'View Staged'
    } : {
      iconClass: 'icon-list-unordered',
      buttonText: 'View Unstaged'
    };
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
      ref: this.refMirrorButton.setter,
      className: (0, _classnames.default)('btn', 'icon', attrs.iconClass),
      onClick: this.props.diveIntoMirrorPatch
    }, attrs.buttonText));
  }

  renderOpenFileButton() {
    let buttonText = 'Jump To File';

    if (this.props.hasMultipleFileSelections) {
      buttonText += 's';
    }

    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
      ref: this.refOpenFileButton.setter,
      className: "btn icon icon-code github-FilePatchHeaderView-jumpToFileButton",
      onClick: this.props.openFile
    }, buttonText));
  }

  renderToggleFileButton() {
    const attrs = this.props.stagingStatus === 'unstaged' ? {
      buttonClass: 'icon-move-down',
      buttonText: 'Stage File'
    } : {
      buttonClass: 'icon-move-up',
      buttonText: 'Unstage File'
    };
    return _react.default.createElement("button", {
      className: (0, _classnames.default)('btn', 'icon', attrs.buttonClass),
      onClick: this.props.toggleFile
    }, attrs.buttonText);
  }

}

exports.default = FilePatchHeaderView;

_defineProperty(FilePatchHeaderView, "propTypes", {
  relPath: _propTypes.default.string.isRequired,
  newPath: _propTypes.default.string,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  isPartiallyStaged: _propTypes.default.bool,
  hasUndoHistory: _propTypes.default.bool,
  hasMultipleFileSelections: _propTypes.default.bool.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  diveIntoMirrorPatch: _propTypes.default.func.isRequired,
  openFile: _propTypes.default.func.isRequired,
  // should probably change 'toggleFile' to 'toggleFileStagingStatus'
  // because the addition of another toggling function makes the old name confusing.
  toggleFile: _propTypes.default.func.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired,
  isCollapsed: _propTypes.default.bool.isRequired,
  triggerExpand: _propTypes.default.func.isRequired,
  triggerCollapse: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9maWxlLXBhdGNoLWhlYWRlci12aWV3LmpzIl0sIm5hbWVzIjpbIkZpbGVQYXRjaEhlYWRlclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJpc0NvbGxhcHNlZCIsImNvbXBvbmVudCIsIm5hbWUiLCJwYWNrYWdlIiwidHJpZ2dlckV4cGFuZCIsInRyaWdnZXJDb2xsYXBzZSIsInJlZk1pcnJvckJ1dHRvbiIsIlJlZkhvbGRlciIsInJlZk9wZW5GaWxlQnV0dG9uIiwicmVuZGVyIiwicmVuZGVyQ29sbGFwc2VCdXR0b24iLCJyZW5kZXJUaXRsZSIsInJlbmRlckJ1dHRvbkdyb3VwIiwiaXRlbVR5cGUiLCJDaGFuZ2VkRmlsZUl0ZW0iLCJpY29uIiwidG9nZ2xlUGF0Y2hDb2xsYXBzZSIsInN0YXR1cyIsInN0YWdpbmdTdGF0dXMiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVuZGVyRGlzcGxheVBhdGgiLCJuZXdQYXRoIiwicmVsUGF0aCIsIm9sZFBhdGgiLCJyZW5kZXJQYXRoIiwiZmlsZVBhdGgiLCJkaXJuYW1lIiwicGF0aCIsImJhc2VuYW1lIiwic2VwIiwiQ29tbWl0RGV0YWlsSXRlbSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsInJlbmRlclVuZG9EaXNjYXJkQnV0dG9uIiwicmVuZGVyTWlycm9yUGF0Y2hCdXR0b24iLCJyZW5kZXJPcGVuRmlsZUJ1dHRvbiIsInJlbmRlclRvZ2dsZUZpbGVCdXR0b24iLCJ1bnN0YWdlZENoYW5nZWRGaWxlSXRlbSIsImhhc1VuZG9IaXN0b3J5IiwidW5kb0xhc3REaXNjYXJkIiwiaXNQYXJ0aWFsbHlTdGFnZWQiLCJhdHRycyIsImljb25DbGFzcyIsImJ1dHRvblRleHQiLCJzZXR0ZXIiLCJkaXZlSW50b01pcnJvclBhdGNoIiwiaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyIsIm9wZW5GaWxlIiwiYnV0dG9uQ2xhc3MiLCJ0b2dnbGVGaWxlIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwiYm9vbCIsInRvb2x0aXBzIiwib2JqZWN0IiwiZnVuYyIsIkl0ZW1UeXBlUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVlLE1BQU1BLG1CQUFOLFNBQWtDQyxlQUFNQyxTQUF4QyxDQUFrRDtBQXlCL0RDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLGlEQW1CRyxNQUFNO0FBQzFCLFVBQUksS0FBS0EsS0FBTCxDQUFXQyxXQUFmLEVBQTRCO0FBQzFCLHFDQUFTLG1CQUFULEVBQThCO0FBQUNDLFVBQUFBLFNBQVMsRUFBRSxLQUFLSCxXQUFMLENBQWlCSSxJQUE3QjtBQUFtQ0MsVUFBQUEsT0FBTyxFQUFFO0FBQTVDLFNBQTlCO0FBQ0EsYUFBS0osS0FBTCxDQUFXSyxhQUFYO0FBQ0QsT0FIRCxNQUdPO0FBQ0wscUNBQVMscUJBQVQsRUFBZ0M7QUFBQ0gsVUFBQUEsU0FBUyxFQUFFLEtBQUtILFdBQUwsQ0FBaUJJLElBQTdCO0FBQW1DQyxVQUFBQSxPQUFPLEVBQUU7QUFBNUMsU0FBaEM7QUFDQSxhQUFLSixLQUFMLENBQVdNLGVBQVg7QUFDRDtBQUNGLEtBM0JrQjs7QUFHakIsU0FBS0MsZUFBTCxHQUF1QixJQUFJQyxrQkFBSixFQUF2QjtBQUNBLFNBQUtDLGlCQUFMLEdBQXlCLElBQUlELGtCQUFKLEVBQXpCO0FBQ0Q7O0FBRURFLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0U7QUFBUSxNQUFBLFNBQVMsRUFBQztBQUFsQixPQUNHLEtBQUtDLG9CQUFMLEVBREgsRUFFRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQ0csS0FBS0MsV0FBTCxFQURILENBRkYsRUFLRyxLQUFLQyxpQkFBTCxFQUxILENBREY7QUFTRDs7QUFZREYs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QVhuQjtBQVlqQkwsRUFBQUEsUUFBUSxFQUFFRyxtQkFBVU8sSUFBVixDQUFlTCxVQVpSO0FBYWpCO0FBQ0E7QUFDQUgsRUFBQUEsVUFBVSxFQUFFQyxtQkFBVU8sSUFBVixDQUFlTCxVQWZWO0FBaUJqQnZDLEVBQUFBLFFBQVEsRUFBRTZDLDZCQUFpQk4sVUFqQlY7QUFtQmpCcEQsRUFBQUEsV0FBVyxFQUFFa0QsbUJBQVVJLElBQVYsQ0FBZUYsVUFuQlg7QUFvQmpCaEQsRUFBQUEsYUFBYSxFQUFFOEMsbUJBQVVPLElBQVYsQ0FBZUwsVUFwQmI7QUFxQmpCL0MsRUFBQUEsZUFBZSxFQUFFNkMsbUJBQVVPLElBQVYsQ0FBZUw7QUFyQmYsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQge0l0ZW1UeXBlUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUGF0Y2hIZWFkZXJWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZWxQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbmV3UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG4gICAgaXNQYXJ0aWFsbHlTdGFnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXZlSW50b01pcnJvclBhdGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5GaWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIC8vIHNob3VsZCBwcm9iYWJseSBjaGFuZ2UgJ3RvZ2dsZUZpbGUnIHRvICd0b2dnbGVGaWxlU3RhZ2luZ1N0YXR1cydcbiAgICAvLyBiZWNhdXNlIHRoZSBhZGRpdGlvbiBvZiBhbm90aGVyIHRvZ2dsaW5nIGZ1bmN0aW9uIG1ha2VzIHRoZSBvbGQgbmFtZSBjb25mdXNpbmcuXG4gICAgdG9nZ2xlRmlsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICBpc0NvbGxhcHNlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB0cmlnZ2VyRXhwYW5kOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHRyaWdnZXJDb2xsYXBzZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmTWlycm9yQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmT3BlbkZpbGVCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctaGVhZGVyXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbGxhcHNlQnV0dG9uKCl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LXRpdGxlXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyVGl0bGUoKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICB7dGhpcy5yZW5kZXJCdXR0b25Hcm91cCgpfVxuICAgICAgPC9oZWFkZXI+XG4gICAgKTtcbiAgfVxuXG4gIHRvZ2dsZVBhdGNoQ29sbGFwc2UgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNDb2xsYXBzZWQpIHtcbiAgICAgIGFkZEV2ZW50KCdleHBhbmQtZmlsZS1wYXRjaCcsIHtjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZSwgcGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgIHRoaXMucHJvcHMudHJpZ2dlckV4cGFuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRFdmVudCgnY29sbGFwc2UtZmlsZS1wYXRjaCcsIHtjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZSwgcGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgIHRoaXMucHJvcHMudHJpZ2dlckNvbGxhcHNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENoYW5nZWRGaWxlSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGljb24gPSB0aGlzLnByb3BzLmlzQ29sbGFwc2VkID8gJ2NoZXZyb24tcmlnaHQnIDogJ2NoZXZyb24tZG93bic7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29sbGFwc2VCdXR0b25cIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVBhdGNoQ29sbGFwc2V9PlxuICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb2xsYXBzZUJ1dHRvbkljb25cIiBpY29uPXtpY29ufSAvPlxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRpdGxlKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDaGFuZ2VkRmlsZUl0ZW0pIHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPntzdGF0dXNbMF0udG9VcHBlckNhc2UoKX17c3RhdHVzLnNsaWNlKDEpfSBDaGFuZ2VzIGZvciB7dGhpcy5yZW5kZXJEaXNwbGF5UGF0aCgpfTwvc3Bhbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckRpc3BsYXlQYXRoKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGlzcGxheVBhdGgoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubmV3UGF0aCAmJiB0aGlzLnByb3BzLm5ld1BhdGggIT09IHRoaXMucHJvcHMucmVsUGF0aCkge1xuICAgICAgY29uc3Qgb2xkUGF0aCA9IHRoaXMucmVuZGVyUGF0aCh0aGlzLnByb3BzLnJlbFBhdGgpO1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHRoaXMucmVuZGVyUGF0aCh0aGlzLnByb3BzLm5ld1BhdGgpO1xuICAgICAgcmV0dXJuIDxzcGFuPntvbGRQYXRofSA8c3Bhbj7ihpI8L3NwYW4+IHtuZXdQYXRofTwvc3Bhbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclBhdGgodGhpcy5wcm9wcy5yZWxQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQYXRoKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgY29uc3QgYmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKTtcblxuICAgIGlmIChkaXJuYW1lID09PSAnLicpIHtcbiAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJnaXR1Yi1GaWxlUGF0Y2hIZWFkZXJWaWV3LWJhc2VuYW1lXCI+e2Jhc2VuYW1lfTwvc3Bhbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHtkaXJuYW1lfXtwYXRoLnNlcH08c3BhbiBjbGFzc05hbWU9XCJnaXR1Yi1GaWxlUGF0Y2hIZWFkZXJWaWV3LWJhc2VuYW1lXCI+e2Jhc2VuYW1lfTwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJCdXR0b25Hcm91cCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ29tbWl0RGV0YWlsSXRlbSB8fCB0aGlzLnByb3BzLml0ZW1UeXBlID09PSBJc3N1ZWlzaERldGFpbEl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJVbmRvRGlzY2FyZEJ1dHRvbigpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlck1pcnJvclBhdGNoQnV0dG9uKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyT3BlbkZpbGVCdXR0b24oKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUb2dnbGVGaWxlQnV0dG9uKCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVW5kb0Rpc2NhcmRCdXR0b24oKSB7XG4gICAgY29uc3QgdW5zdGFnZWRDaGFuZ2VkRmlsZUl0ZW0gPSB0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDaGFuZ2VkRmlsZUl0ZW0gJiYgdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnO1xuICAgIGlmICh1bnN0YWdlZENoYW5nZWRGaWxlSXRlbSAmJiB0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24taGlzdG9yeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkfT5cbiAgICAgICAgVW5kbyBEaXNjYXJkXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTWlycm9yUGF0Y2hCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmlzUGFydGlhbGx5U3RhZ2VkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGljb25DbGFzczogJ2ljb24tdGFza2xpc3QnLFxuICAgICAgICBidXR0b25UZXh0OiAnVmlldyBTdGFnZWQnLFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIGljb25DbGFzczogJ2ljb24tbGlzdC11bm9yZGVyZWQnLFxuICAgICAgICBidXR0b25UZXh0OiAnVmlldyBVbnN0YWdlZCcsXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHJlZj17dGhpcy5yZWZNaXJyb3JCdXR0b24uc2V0dGVyfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2J0bicsICdpY29uJywgYXR0cnMuaWNvbkNsYXNzKX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmRpdmVJbnRvTWlycm9yUGF0Y2h9PlxuICAgICAgICAgIHthdHRycy5idXR0b25UZXh0fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck9wZW5GaWxlQnV0dG9uKCkge1xuICAgIGxldCBidXR0b25UZXh0ID0gJ0p1bXAgVG8gRmlsZSc7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucykge1xuICAgICAgYnV0dG9uVGV4dCArPSAncyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHJlZj17dGhpcy5yZWZPcGVuRmlsZUJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1jb2RlIGdpdGh1Yi1GaWxlUGF0Y2hIZWFkZXJWaWV3LWp1bXBUb0ZpbGVCdXR0b25cIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub3BlbkZpbGV9PlxuICAgICAgICAgIHtidXR0b25UZXh0fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRvZ2dsZUZpbGVCdXR0b24oKSB7XG4gICAgY29uc3QgYXR0cnMgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgID8ge1xuICAgICAgICBidXR0b25DbGFzczogJ2ljb24tbW92ZS1kb3duJyxcbiAgICAgICAgYnV0dG9uVGV4dDogJ1N0YWdlIEZpbGUnLFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIGJ1dHRvbkNsYXNzOiAnaWNvbi1tb3ZlLXVwJyxcbiAgICAgICAgYnV0dG9uVGV4dDogJ1Vuc3RhZ2UgRmlsZScsXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtjeCgnYnRuJywgJ2ljb24nLCBhdHRycy5idXR0b25DbGFzcyl9IG9uQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlRmlsZX0+XG4gICAgICAgIHthdHRycy5idXR0b25UZXh0fVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIl19