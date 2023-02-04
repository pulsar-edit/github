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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlUGF0Y2hIZWFkZXJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNDb2xsYXBzZWQiLCJhZGRFdmVudCIsImNvbXBvbmVudCIsIm5hbWUiLCJwYWNrYWdlIiwidHJpZ2dlckV4cGFuZCIsInRyaWdnZXJDb2xsYXBzZSIsInJlZk1pcnJvckJ1dHRvbiIsIlJlZkhvbGRlciIsInJlZk9wZW5GaWxlQnV0dG9uIiwicmVuZGVyIiwicmVuZGVyQ29sbGFwc2VCdXR0b24iLCJyZW5kZXJUaXRsZSIsInJlbmRlckJ1dHRvbkdyb3VwIiwiaXRlbVR5cGUiLCJDaGFuZ2VkRmlsZUl0ZW0iLCJpY29uIiwidG9nZ2xlUGF0Y2hDb2xsYXBzZSIsInN0YXR1cyIsInN0YWdpbmdTdGF0dXMiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVuZGVyRGlzcGxheVBhdGgiLCJuZXdQYXRoIiwicmVsUGF0aCIsIm9sZFBhdGgiLCJyZW5kZXJQYXRoIiwiZmlsZVBhdGgiLCJkaXJuYW1lIiwicGF0aCIsImJhc2VuYW1lIiwic2VwIiwiQ29tbWl0RGV0YWlsSXRlbSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsInJlbmRlclVuZG9EaXNjYXJkQnV0dG9uIiwicmVuZGVyTWlycm9yUGF0Y2hCdXR0b24iLCJyZW5kZXJPcGVuRmlsZUJ1dHRvbiIsInJlbmRlclRvZ2dsZUZpbGVCdXR0b24iLCJ1bnN0YWdlZENoYW5nZWRGaWxlSXRlbSIsImhhc1VuZG9IaXN0b3J5IiwidW5kb0xhc3REaXNjYXJkIiwiaXNQYXJ0aWFsbHlTdGFnZWQiLCJhdHRycyIsImljb25DbGFzcyIsImJ1dHRvblRleHQiLCJzZXR0ZXIiLCJjeCIsImRpdmVJbnRvTWlycm9yUGF0Y2giLCJoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zIiwib3BlbkZpbGUiLCJidXR0b25DbGFzcyIsInRvZ2dsZUZpbGUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib25lT2YiLCJib29sIiwidG9vbHRpcHMiLCJvYmplY3QiLCJmdW5jIiwiSXRlbVR5cGVQcm9wVHlwZSJdLCJzb3VyY2VzIjpbImZpbGUtcGF0Y2gtaGVhZGVyLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCB7SXRlbVR5cGVQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVQYXRjaEhlYWRlclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlbFBhdGg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBuZXdQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHN0YWdpbmdTdGF0dXM6IFByb3BUeXBlcy5vbmVPZihbJ3N0YWdlZCcsICd1bnN0YWdlZCddKSxcbiAgICBpc1BhcnRpYWxseVN0YWdlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLFxuICAgIGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnM6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRpdmVJbnRvTWlycm9yUGF0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgLy8gc2hvdWxkIHByb2JhYmx5IGNoYW5nZSAndG9nZ2xlRmlsZScgdG8gJ3RvZ2dsZUZpbGVTdGFnaW5nU3RhdHVzJ1xuICAgIC8vIGJlY2F1c2UgdGhlIGFkZGl0aW9uIG9mIGFub3RoZXIgdG9nZ2xpbmcgZnVuY3Rpb24gbWFrZXMgdGhlIG9sZCBuYW1lIGNvbmZ1c2luZy5cbiAgICB0b2dnbGVGaWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgaXRlbVR5cGU6IEl0ZW1UeXBlUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIGlzQ29sbGFwc2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHRyaWdnZXJFeHBhbmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdHJpZ2dlckNvbGxhcHNlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZNaXJyb3JCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZPcGVuRmlsZUJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1oZWFkZXJcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ29sbGFwc2VCdXR0b24oKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctdGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUaXRsZSgpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHt0aGlzLnJlbmRlckJ1dHRvbkdyb3VwKCl9XG4gICAgICA8L2hlYWRlcj5cbiAgICApO1xuICB9XG5cbiAgdG9nZ2xlUGF0Y2hDb2xsYXBzZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc0NvbGxhcHNlZCkge1xuICAgICAgYWRkRXZlbnQoJ2V4cGFuZC1maWxlLXBhdGNoJywge2NvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgdGhpcy5wcm9wcy50cmlnZ2VyRXhwYW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEV2ZW50KCdjb2xsYXBzZS1maWxlLXBhdGNoJywge2NvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgdGhpcy5wcm9wcy50cmlnZ2VyQ29sbGFwc2UoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb2xsYXBzZUJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ2hhbmdlZEZpbGVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaWNvbiA9IHRoaXMucHJvcHMuaXNDb2xsYXBzZWQgPyAnY2hldnJvbi1yaWdodCcgOiAnY2hldnJvbi1kb3duJztcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb2xsYXBzZUJ1dHRvblwiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlUGF0Y2hDb2xsYXBzZX0+XG4gICAgICAgIDxPY3RpY29uIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbGxhcHNlQnV0dG9uSWNvblwiIGljb249e2ljb259IC8+XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGl0bGUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENoYW5nZWRGaWxlSXRlbSkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+e3N0YXR1c1swXS50b1VwcGVyQ2FzZSgpfXtzdGF0dXMuc2xpY2UoMSl9IENoYW5nZXMgZm9yIHt0aGlzLnJlbmRlckRpc3BsYXlQYXRoKCl9PC9zcGFuPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRGlzcGxheVBhdGgoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJEaXNwbGF5UGF0aCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5uZXdQYXRoICYmIHRoaXMucHJvcHMubmV3UGF0aCAhPT0gdGhpcy5wcm9wcy5yZWxQYXRoKSB7XG4gICAgICBjb25zdCBvbGRQYXRoID0gdGhpcy5yZW5kZXJQYXRoKHRoaXMucHJvcHMucmVsUGF0aCk7XG4gICAgICBjb25zdCBuZXdQYXRoID0gdGhpcy5yZW5kZXJQYXRoKHRoaXMucHJvcHMubmV3UGF0aCk7XG4gICAgICByZXR1cm4gPHNwYW4+e29sZFBhdGh9IDxzcGFuPuKGkjwvc3Bhbj4ge25ld1BhdGh9PC9zcGFuPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUGF0aCh0aGlzLnByb3BzLnJlbFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBhdGgoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICBjb25zdCBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpO1xuXG4gICAgaWYgKGRpcm5hbWUgPT09ICcuJykge1xuICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cImdpdHViLUZpbGVQYXRjaEhlYWRlclZpZXctYmFzZW5hbWVcIj57YmFzZW5hbWV9PC9zcGFuPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAge2Rpcm5hbWV9e3BhdGguc2VwfTxzcGFuIGNsYXNzTmFtZT1cImdpdHViLUZpbGVQYXRjaEhlYWRlclZpZXctYmFzZW5hbWVcIj57YmFzZW5hbWV9PC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckJ1dHRvbkdyb3VwKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclVuZG9EaXNjYXJkQnV0dG9uKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyTWlycm9yUGF0Y2hCdXR0b24oKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJPcGVuRmlsZUJ1dHRvbigpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclRvZ2dsZUZpbGVCdXR0b24oKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJVbmRvRGlzY2FyZEJ1dHRvbigpIHtcbiAgICBjb25zdCB1bnN0YWdlZENoYW5nZWRGaWxlSXRlbSA9IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENoYW5nZWRGaWxlSXRlbSAmJiB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCc7XG4gICAgaWYgKHVuc3RhZ2VkQ2hhbmdlZEZpbGVJdGVtICYmIHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1oaXN0b3J5XCIgb25DbGljaz17dGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmR9PlxuICAgICAgICBVbmRvIERpc2NhcmRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJNaXJyb3JQYXRjaEJ1dHRvbigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuaXNQYXJ0aWFsbHlTdGFnZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICA/IHtcbiAgICAgICAgaWNvbkNsYXNzOiAnaWNvbi10YXNrbGlzdCcsXG4gICAgICAgIGJ1dHRvblRleHQ6ICdWaWV3IFN0YWdlZCcsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgaWNvbkNsYXNzOiAnaWNvbi1saXN0LXVub3JkZXJlZCcsXG4gICAgICAgIGJ1dHRvblRleHQ6ICdWaWV3IFVuc3RhZ2VkJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgcmVmPXt0aGlzLnJlZk1pcnJvckJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgY2xhc3NOYW1lPXtjeCgnYnRuJywgJ2ljb24nLCBhdHRycy5pY29uQ2xhc3MpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMuZGl2ZUludG9NaXJyb3JQYXRjaH0+XG4gICAgICAgICAge2F0dHJzLmJ1dHRvblRleHR9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyT3BlbkZpbGVCdXR0b24oKSB7XG4gICAgbGV0IGJ1dHRvblRleHQgPSAnSnVtcCBUbyBGaWxlJztcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zKSB7XG4gICAgICBidXR0b25UZXh0ICs9ICdzJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgcmVmPXt0aGlzLnJlZk9wZW5GaWxlQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gaWNvbiBpY29uLWNvZGUgZ2l0aHViLUZpbGVQYXRjaEhlYWRlclZpZXctanVtcFRvRmlsZUJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vcGVuRmlsZX0+XG4gICAgICAgICAge2J1dHRvblRleHR9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVG9nZ2xlRmlsZUJ1dHRvbigpIHtcbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGJ1dHRvbkNsYXNzOiAnaWNvbi1tb3ZlLWRvd24nLFxuICAgICAgICBidXR0b25UZXh0OiAnU3RhZ2UgRmlsZScsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgYnV0dG9uQ2xhc3M6ICdpY29uLW1vdmUtdXAnLFxuICAgICAgICBidXR0b25UZXh0OiAnVW5zdGFnZSBGaWxlJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2N4KCdidG4nLCAnaWNvbicsIGF0dHJzLmJ1dHRvbkNsYXNzKX0gb25DbGljaz17dGhpcy5wcm9wcy50b2dnbGVGaWxlfT5cbiAgICAgICAge2F0dHJzLmJ1dHRvblRleHR9XG4gICAgICA8L2J1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