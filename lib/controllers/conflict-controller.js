"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = require("../helpers");

var _source = require("../models/conflicts/source");

var _decoration = _interopRequireDefault(require("../atom/decoration"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const remote = require('@electron/remote');

const {
  Menu,
  MenuItem
} = remote;

class ConflictController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'showResolveMenu');
    this.state = {
      chosenSide: this.props.conflict.getChosenSide()
    };
  }

  resolveAsSequence(sources) {
    this.props.resolveAsSequence(sources);
    this.setState({
      chosenSide: this.props.conflict.getChosenSide()
    });
  }

  revert(side) {
    side.isModified() && side.revert();
    side.isBannerModified() && side.revertBanner();
  }

  showResolveMenu(event) {
    event.preventDefault();
    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Resolve as Ours',
      click: this.resolveAsSequence.bind(this, [_source.OURS])
    }));

    if (this.props.conflict.getSide(_source.BASE)) {
      menu.append(new MenuItem({
        label: 'Resolve as Base',
        click: this.resolveAsSequence.bind(this, [_source.BASE])
      }));
    }

    menu.append(new MenuItem({
      label: 'Resolve as Theirs',
      click: this.resolveAsSequence.bind(this, [_source.THEIRS])
    }));
    menu.append(new MenuItem({
      type: 'separator'
    }));
    menu.append(new MenuItem({
      label: 'Resolve as Ours Then Theirs',
      click: this.resolveAsSequence.bind(this, [_source.OURS, _source.THEIRS])
    }));
    menu.append(new MenuItem({
      label: 'Resolve as Theirs Then Ours',
      click: this.resolveAsSequence.bind(this, [_source.THEIRS, _source.OURS])
    }));
    menu.append(new MenuItem({
      type: 'separator'
    }));
    menu.append(new MenuItem({
      label: 'Dismiss',
      click: this.props.dismiss
    }));
    menu.popup(remote.getCurrentWindow());
  }

  render() {
    if (!this.state.chosenSide) {
      const ours = this.props.conflict.getSide(_source.OURS);
      const base = this.props.conflict.getSide(_source.BASE);
      const theirs = this.props.conflict.getSide(_source.THEIRS);
      return _react.default.createElement("div", null, this.renderSide(ours), base && this.renderSide(base), _react.default.createElement(_decoration.default, {
        key: this.props.conflict.getSeparator().getMarker().id,
        editor: this.props.editor,
        decorable: this.props.conflict.getSeparator().getMarker(),
        type: "line",
        className: "github-ConflictSeparator"
      }), this.renderSide(theirs));
    } else if (!this.state.chosenSide.isEmpty()) {
      return _react.default.createElement(_decoration.default, {
        editor: this.props.editor,
        decorable: this.state.chosenSide.getMarker(),
        type: "line",
        className: "github-ResolvedLines"
      });
    } else {
      return null;
    }
  }

  renderSide(side) {
    const source = side.getSource();
    return _react.default.createElement("div", null, _react.default.createElement(_decoration.default, {
      key: side.banner.marker.id,
      editor: this.props.editor,
      decorable: side.getBannerMarker(),
      type: "line",
      className: side.getBannerCSSClass()
    }), side.isBannerModified() || _react.default.createElement(_decoration.default, {
      key: 'banner-modified-' + side.banner.marker.id,
      editor: this.props.editor,
      decorable: side.getBannerMarker(),
      type: "line",
      className: "github-ConflictUnmodifiedBanner"
    }), _react.default.createElement(_decoration.default, {
      key: side.marker.id,
      editor: this.props.editor,
      decorable: side.getMarker(),
      type: "line",
      className: side.getLineCSSClass()
    }), _react.default.createElement(_decoration.default, {
      key: 'block-' + side.marker.id,
      editor: this.props.editor,
      decorable: side.getBlockMarker(),
      type: "block",
      position: side.getBlockPosition()
    }, _react.default.createElement("div", {
      className: side.getBlockCSSClasses()
    }, _react.default.createElement("span", {
      className: "github-ResolutionControls"
    }, _react.default.createElement("button", {
      className: "btn btn-sm inline-block",
      onClick: () => this.resolveAsSequence([source])
    }, "Use me"), (side.isModified() || side.isBannerModified()) && _react.default.createElement("button", {
      className: "btn btn-sm inline-block",
      onClick: () => this.revert(side)
    }, "Revert"), _react.default.createElement(_octicon.default, {
      icon: "ellipses",
      className: "inline-block",
      onClick: this.showResolveMenu
    })), _react.default.createElement("span", {
      className: "github-SideDescription"
    }, source.toUIString()))));
  }

}

exports.default = ConflictController;

_defineProperty(ConflictController, "propTypes", {
  editor: _propTypes.default.object.isRequired,
  conflict: _propTypes.default.object.isRequired,
  resolveAsSequence: _propTypes.default.func,
  dismiss: _propTypes.default.func
});

_defineProperty(ConflictController, "defaultProps", {
  resolveAsSequence: sources => {},
  dismiss: () => {}
});