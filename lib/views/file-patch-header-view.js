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