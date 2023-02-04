"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _electron = require("electron");
var _helpers = require("../helpers");
var _source = require("../models/conflicts/source");
var _decoration = _interopRequireDefault(require("../atom/decoration"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const {
  Menu,
  MenuItem
} = _electron.remote;
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
    menu.popup(_electron.remote.getCurrentWindow());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZW51IiwiTWVudUl0ZW0iLCJyZW1vdGUiLCJDb25mbGljdENvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiYXV0b2JpbmQiLCJzdGF0ZSIsImNob3NlblNpZGUiLCJjb25mbGljdCIsImdldENob3NlblNpZGUiLCJyZXNvbHZlQXNTZXF1ZW5jZSIsInNvdXJjZXMiLCJzZXRTdGF0ZSIsInJldmVydCIsInNpZGUiLCJpc01vZGlmaWVkIiwiaXNCYW5uZXJNb2RpZmllZCIsInJldmVydEJhbm5lciIsInNob3dSZXNvbHZlTWVudSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJtZW51IiwiYXBwZW5kIiwibGFiZWwiLCJjbGljayIsImJpbmQiLCJPVVJTIiwiZ2V0U2lkZSIsIkJBU0UiLCJUSEVJUlMiLCJ0eXBlIiwiZGlzbWlzcyIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyIsInJlbmRlciIsIm91cnMiLCJiYXNlIiwidGhlaXJzIiwicmVuZGVyU2lkZSIsImdldFNlcGFyYXRvciIsImdldE1hcmtlciIsImlkIiwiZWRpdG9yIiwiaXNFbXB0eSIsInNvdXJjZSIsImdldFNvdXJjZSIsImJhbm5lciIsIm1hcmtlciIsImdldEJhbm5lck1hcmtlciIsImdldEJhbm5lckNTU0NsYXNzIiwiZ2V0TGluZUNTU0NsYXNzIiwiZ2V0QmxvY2tNYXJrZXIiLCJnZXRCbG9ja1Bvc2l0aW9uIiwiZ2V0QmxvY2tDU1NDbGFzc2VzIiwidG9VSVN0cmluZyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIl0sInNvdXJjZXMiOlsiY29uZmxpY3QtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCB7TWVudSwgTWVudUl0ZW19ID0gcmVtb3RlO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7T1VSUywgQkFTRSwgVEhFSVJTfSBmcm9tICcuLi9tb2RlbHMvY29uZmxpY3RzL3NvdXJjZSc7XG5pbXBvcnQgRGVjb3JhdGlvbiBmcm9tICcuLi9hdG9tL2RlY29yYXRpb24nO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmxpY3RDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlZGl0b3I6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25mbGljdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1NlcXVlbmNlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXNtaXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHJlc29sdmVBc1NlcXVlbmNlOiBzb3VyY2VzID0+IHt9LFxuICAgIGRpc21pc3M6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3Nob3dSZXNvbHZlTWVudScpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNob3NlblNpZGU6IHRoaXMucHJvcHMuY29uZmxpY3QuZ2V0Q2hvc2VuU2lkZSgpLFxuICAgIH07XG4gIH1cblxuICByZXNvbHZlQXNTZXF1ZW5jZShzb3VyY2VzKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNTZXF1ZW5jZShzb3VyY2VzKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY2hvc2VuU2lkZTogdGhpcy5wcm9wcy5jb25mbGljdC5nZXRDaG9zZW5TaWRlKCksXG4gICAgfSk7XG4gIH1cblxuICByZXZlcnQoc2lkZSkge1xuICAgIHNpZGUuaXNNb2RpZmllZCgpICYmIHNpZGUucmV2ZXJ0KCk7XG4gICAgc2lkZS5pc0Jhbm5lck1vZGlmaWVkKCkgJiYgc2lkZS5yZXZlcnRCYW5uZXIoKTtcbiAgfVxuXG4gIHNob3dSZXNvbHZlTWVudShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgYXMgT3VycycsXG4gICAgICBjbGljazogdGhpcy5yZXNvbHZlQXNTZXF1ZW5jZS5iaW5kKHRoaXMsIFtPVVJTXSksXG4gICAgfSkpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY29uZmxpY3QuZ2V0U2lkZShCQVNFKSkge1xuICAgICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdSZXNvbHZlIGFzIEJhc2UnLFxuICAgICAgICBjbGljazogdGhpcy5yZXNvbHZlQXNTZXF1ZW5jZS5iaW5kKHRoaXMsIFtCQVNFXSksXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBhcyBUaGVpcnMnLFxuICAgICAgY2xpY2s6IHRoaXMucmVzb2x2ZUFzU2VxdWVuY2UuYmluZCh0aGlzLCBbVEhFSVJTXSksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHt0eXBlOiAnc2VwYXJhdG9yJ30pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgYXMgT3VycyBUaGVuIFRoZWlycycsXG4gICAgICBjbGljazogdGhpcy5yZXNvbHZlQXNTZXF1ZW5jZS5iaW5kKHRoaXMsIFtPVVJTLCBUSEVJUlNdKSxcbiAgICB9KSk7XG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBhcyBUaGVpcnMgVGhlbiBPdXJzJyxcbiAgICAgIGNsaWNrOiB0aGlzLnJlc29sdmVBc1NlcXVlbmNlLmJpbmQodGhpcywgW1RIRUlSUywgT1VSU10pLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7dHlwZTogJ3NlcGFyYXRvcid9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNtaXNzJyxcbiAgICAgIGNsaWNrOiB0aGlzLnByb3BzLmRpc21pc3MsXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY2hvc2VuU2lkZSkge1xuICAgICAgY29uc3Qgb3VycyA9IHRoaXMucHJvcHMuY29uZmxpY3QuZ2V0U2lkZShPVVJTKTtcbiAgICAgIGNvbnN0IGJhc2UgPSB0aGlzLnByb3BzLmNvbmZsaWN0LmdldFNpZGUoQkFTRSk7XG4gICAgICBjb25zdCB0aGVpcnMgPSB0aGlzLnByb3BzLmNvbmZsaWN0LmdldFNpZGUoVEhFSVJTKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTaWRlKG91cnMpfVxuICAgICAgICAgIHtiYXNlICYmIHRoaXMucmVuZGVyU2lkZShiYXNlKX1cbiAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAga2V5PXt0aGlzLnByb3BzLmNvbmZsaWN0LmdldFNlcGFyYXRvcigpLmdldE1hcmtlcigpLmlkfVxuICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgIGRlY29yYWJsZT17dGhpcy5wcm9wcy5jb25mbGljdC5nZXRTZXBhcmF0b3IoKS5nZXRNYXJrZXIoKX1cbiAgICAgICAgICAgIHR5cGU9XCJsaW5lXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db25mbGljdFNlcGFyYXRvclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTaWRlKHRoZWlycyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmNob3NlblNpZGUuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIGVkaXRvcj17dGhpcy5wcm9wcy5lZGl0b3J9XG4gICAgICAgICAgZGVjb3JhYmxlPXt0aGlzLnN0YXRlLmNob3NlblNpZGUuZ2V0TWFya2VyKCl9XG4gICAgICAgICAgdHlwZT1cImxpbmVcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXNvbHZlZExpbmVzXCJcbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclNpZGUoc2lkZSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHNpZGUuZ2V0U291cmNlKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICBrZXk9e3NpZGUuYmFubmVyLm1hcmtlci5pZH1cbiAgICAgICAgICBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfVxuICAgICAgICAgIGRlY29yYWJsZT17c2lkZS5nZXRCYW5uZXJNYXJrZXIoKX1cbiAgICAgICAgICB0eXBlPVwibGluZVwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtzaWRlLmdldEJhbm5lckNTU0NsYXNzKCl9XG4gICAgICAgIC8+XG4gICAgICAgIHtzaWRlLmlzQmFubmVyTW9kaWZpZWQoKSB8fFxuICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICBrZXk9eydiYW5uZXItbW9kaWZpZWQtJyArIHNpZGUuYmFubmVyLm1hcmtlci5pZH1cbiAgICAgICAgICAgIGVkaXRvcj17dGhpcy5wcm9wcy5lZGl0b3J9XG4gICAgICAgICAgICBkZWNvcmFibGU9e3NpZGUuZ2V0QmFubmVyTWFya2VyKCl9XG4gICAgICAgICAgICB0eXBlPVwibGluZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29uZmxpY3RVbm1vZGlmaWVkQmFubmVyXCJcbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAga2V5PXtzaWRlLm1hcmtlci5pZH1cbiAgICAgICAgICBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfVxuICAgICAgICAgIGRlY29yYWJsZT17c2lkZS5nZXRNYXJrZXIoKX1cbiAgICAgICAgICB0eXBlPVwibGluZVwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtzaWRlLmdldExpbmVDU1NDbGFzcygpfVxuICAgICAgICAvPlxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIGtleT17J2Jsb2NrLScgKyBzaWRlLm1hcmtlci5pZH1cbiAgICAgICAgICBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfVxuICAgICAgICAgIGRlY29yYWJsZT17c2lkZS5nZXRCbG9ja01hcmtlcigpfVxuICAgICAgICAgIHR5cGU9XCJibG9ja1wiXG4gICAgICAgICAgcG9zaXRpb249e3NpZGUuZ2V0QmxvY2tQb3NpdGlvbigpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c2lkZS5nZXRCbG9ja0NTU0NsYXNzZXMoKX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVzb2x1dGlvbkNvbnRyb2xzXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBpbmxpbmUtYmxvY2tcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnJlc29sdmVBc1NlcXVlbmNlKFtzb3VyY2VdKX0+XG4gICAgICAgICAgICAgICAgVXNlIG1lXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICB7KHNpZGUuaXNNb2RpZmllZCgpIHx8IHNpZGUuaXNCYW5uZXJNb2RpZmllZCgpKSAmJlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBpbmxpbmUtYmxvY2tcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnJldmVydChzaWRlKX0+XG4gICAgICAgICAgICAgICAgICBSZXZlcnRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZWxsaXBzZXNcIiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2tcIiBvbkNsaWNrPXt0aGlzLnNob3dSZXNvbHZlTWVudX0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TaWRlRGVzY3JpcHRpb25cIj57c291cmNlLnRvVUlTdHJpbmcoKX08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBc0M7QUFBQTtBQUFBO0FBQUE7QUFMdEMsTUFBTTtFQUFDQSxJQUFJO0VBQUVDO0FBQVEsQ0FBQyxHQUFHQyxnQkFBTTtBQU9oQixNQUFNQyxrQkFBa0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFhOURDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFQyxPQUFPLEVBQUU7SUFDMUIsS0FBSyxDQUFDRCxLQUFLLEVBQUVDLE9BQU8sQ0FBQztJQUNyQixJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQztJQUVqQyxJQUFJLENBQUNDLEtBQUssR0FBRztNQUNYQyxVQUFV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