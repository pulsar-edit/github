"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class MergeConflictListItemView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refItem = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable(this.refItem.observe(item => this.props.registerItemElement(this.props.mergeConflict, item)));
  }
  render() {
    const _this$props = this.props,
      {
        mergeConflict,
        selected
      } = _this$props,
      others = _objectWithoutProperties(_this$props, ["mergeConflict", "selected"]);
    delete others.remainingConflicts;
    delete others.registerItemElement;
    const fileStatus = _helpers.classNameForStatus[mergeConflict.status.file];
    const oursStatus = _helpers.classNameForStatus[mergeConflict.status.ours];
    const theirsStatus = _helpers.classNameForStatus[mergeConflict.status.theirs];
    const className = selected ? 'is-selected' : '';
    return _react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-MergeConflictListView-item is-${fileStatus} ${className}`
    }), _react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-pathItem"
    }, _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${fileStatus} status-${fileStatus}`
    }), _react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, mergeConflict.filePath), _react.default.createElement("span", {
      className: 'github-FilePatchListView ours-theirs-info'
    }, _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${oursStatus}`
    }), _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${theirsStatus}`
    }))), _react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-resolutionItem"
    }, this.renderRemainingConflicts()));
  }
  renderRemainingConflicts() {
    if (this.props.remainingConflicts === 0) {
      return _react.default.createElement("span", {
        className: "icon icon-check github-RemainingConflicts text-success"
      }, "ready");
    } else if (this.props.remainingConflicts !== undefined) {
      const pluralConflicts = this.props.remainingConflicts === 1 ? '' : 's';
      return _react.default.createElement("span", {
        className: "github-RemainingConflicts text-warning"
      }, this.props.remainingConflicts, " conflict", pluralConflicts, " remaining");
    } else {
      return _react.default.createElement("span", {
        className: "github-RemainingConflicts text-subtle"
      }, "calculating");
    }
  }
  componentWillUnmount() {
    this.subs.dispose();
  }
}
exports.default = MergeConflictListItemView;
_defineProperty(MergeConflictListItemView, "propTypes", {
  mergeConflict: _propTypes2.MergeConflictItemPropType.isRequired,
  selected: _propTypes.default.bool.isRequired,
  remainingConflicts: _propTypes.default.number,
  registerItemElement: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmSXRlbSIsIlJlZkhvbGRlciIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib2JzZXJ2ZSIsIml0ZW0iLCJyZWdpc3Rlckl0ZW1FbGVtZW50IiwibWVyZ2VDb25mbGljdCIsInJlbmRlciIsInNlbGVjdGVkIiwib3RoZXJzIiwicmVtYWluaW5nQ29uZmxpY3RzIiwiZmlsZVN0YXR1cyIsImNsYXNzTmFtZUZvclN0YXR1cyIsInN0YXR1cyIsImZpbGUiLCJvdXJzU3RhdHVzIiwib3VycyIsInRoZWlyc1N0YXR1cyIsInRoZWlycyIsImNsYXNzTmFtZSIsInNldHRlciIsImZpbGVQYXRoIiwicmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzIiwidW5kZWZpbmVkIiwicGx1cmFsQ29uZmxpY3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJib29sIiwibnVtYmVyIiwiZnVuYyJdLCJzb3VyY2VzIjpbIm1lcmdlLWNvbmZsaWN0LWxpc3QtaXRlbS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2NsYXNzTmFtZUZvclN0YXR1c30gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge01lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1lcmdlQ29uZmxpY3Q6IE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByZW1haW5pbmdDb25mbGljdHM6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgcmVnaXN0ZXJJdGVtRWxlbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmSXRlbSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucmVmSXRlbS5vYnNlcnZlKGl0ZW0gPT4gdGhpcy5wcm9wcy5yZWdpc3Rlckl0ZW1FbGVtZW50KHRoaXMucHJvcHMubWVyZ2VDb25mbGljdCwgaXRlbSkpLFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21lcmdlQ29uZmxpY3QsIHNlbGVjdGVkLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBkZWxldGUgb3RoZXJzLnJlbWFpbmluZ0NvbmZsaWN0cztcbiAgICBkZWxldGUgb3RoZXJzLnJlZ2lzdGVySXRlbUVsZW1lbnQ7XG4gICAgY29uc3QgZmlsZVN0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1ttZXJnZUNvbmZsaWN0LnN0YXR1cy5maWxlXTtcbiAgICBjb25zdCBvdXJzU3RhdHVzID0gY2xhc3NOYW1lRm9yU3RhdHVzW21lcmdlQ29uZmxpY3Quc3RhdHVzLm91cnNdO1xuICAgIGNvbnN0IHRoZWlyc1N0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1ttZXJnZUNvbmZsaWN0LnN0YXR1cy50aGVpcnNdO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNlbGVjdGVkID8gJ2lzLXNlbGVjdGVkJyA6ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLnJlZkl0ZW0uc2V0dGVyfVxuICAgICAgICB7Li4ub3RoZXJzfVxuICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItTWVyZ2VDb25mbGljdExpc3RWaWV3LWl0ZW0gaXMtJHtmaWxlU3RhdHVzfSAke2NsYXNzTmFtZX1gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaXRlbSBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcGF0aEl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke2ZpbGVTdGF0dXN9IHN0YXR1cy0ke2ZpbGVTdGF0dXN9YH0gLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcGF0aFwiPnttZXJnZUNvbmZsaWN0LmZpbGVQYXRofTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgb3Vycy10aGVpcnMtaW5mbyd9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWljb24gaWNvbiBpY29uLWRpZmYtJHtvdXJzU3RhdHVzfWB9IC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke3RoZWlyc1N0YXR1c31gfSAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWl0ZW0gZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LXJlc29sdXRpb25JdGVtXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlbWFpbmluZ0NvbmZsaWN0cygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW1haW5pbmdDb25mbGljdHMgPT09IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGVjayBnaXRodWItUmVtYWluaW5nQ29uZmxpY3RzIHRleHQtc3VjY2Vzc1wiPlxuICAgICAgICAgIHJlYWR5XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBwbHVyYWxDb25mbGljdHMgPSB0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0cyA9PT0gMSA/ICcnIDogJ3MnO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVtYWluaW5nQ29uZmxpY3RzIHRleHQtd2FybmluZ1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0c30gY29uZmxpY3R7cGx1cmFsQ29uZmxpY3RzfSByZW1haW5pbmdcbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJlbWFpbmluZ0NvbmZsaWN0cyB0ZXh0LXN1YnRsZVwiPmNhbGN1bGF0aW5nPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7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