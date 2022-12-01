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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9tZXJnZS1jb25mbGljdC1saXN0LWl0ZW0tdmlldy5qcyJdLCJuYW1lcyI6WyJNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmSXRlbSIsIlJlZkhvbGRlciIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib2JzZXJ2ZSIsIml0ZW0iLCJyZWdpc3Rlckl0ZW1FbGVtZW50IiwibWVyZ2VDb25mbGljdCIsInJlbmRlciIsInNlbGVjdGVkIiwib3RoZXJzIiwicmVtYWluaW5nQ29uZmxpY3RzIiwiZmlsZVN0YXR1cyIsImNsYXNzTmFtZUZvclN0YXR1cyIsInN0YXR1cyIsImZpbGUiLCJvdXJzU3RhdHVzIiwib3VycyIsInRoZWlyc1N0YXR1cyIsInRoZWlycyIsImNsYXNzTmFtZSIsInNldHRlciIsImZpbGVQYXRoIiwicmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzIiwidW5kZWZpbmVkIiwicGx1cmFsQ29uZmxpY3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJib29sIiwibnVtYmVyIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSx5QkFBTixTQUF3Q0MsZUFBTUMsU0FBOUMsQ0FBd0Q7QUFRckVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFFQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUMsa0JBQUosRUFBZjtBQUNBLFNBQUtDLElBQUwsR0FBWSxJQUFJQyw2QkFBSixDQUNWLEtBQUtILE9BQUwsQ0FBYUksT0FBYixDQUFxQkMsSUFBSSxJQUFJLEtBQUtOLEtBQUwsQ0FBV08sbUJBQVgsQ0FBK0IsS0FBS1AsS0FBTCxDQUFXUSxhQUExQyxFQUF5REYsSUFBekQsQ0FBN0IsQ0FEVSxDQUFaO0FBR0Q7O0FBRURHLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUE2QyxLQUFLVCxLQUFsRDtBQUFBLFVBQU07QUFBQ1EsTUFBQUEsYUFBRDtBQUFnQkUsTUFBQUE7QUFBaEIsS0FBTjtBQUFBLFVBQW1DQyxNQUFuQzs7QUFDQSxXQUFPQSxNQUFNLENBQUNDLGtCQUFkO0FBQ0EsV0FBT0QsTUFBTSxDQUFDSixtQkFBZDtBQUNBLFVBQU1NLFVBQVUsR0FBR0MsNEJBQW1CTixhQUFhLENBQUNPLE1BQWQsQ0FBcUJDLElBQXhDLENBQW5CO0FBQ0EsVUFBTUMsVUFBVSxHQUFHSCw0QkFBbUJOLGFBQWEsQ0FBQ08sTUFBZCxDQUFxQkcsSUFBeEMsQ0FBbkI7QUFDQSxVQUFNQyxZQUFZLEdBQUdMLDRCQUFtQk4sYUFBYSxDQUFDTyxNQUFkLENBQXFCSyxNQUF4QyxDQUFyQjtBQUNBLFVBQU1DLFNBQVMsR0FBR1gsUUFBUSxHQUFHLGFBQUgsR0FBbUIsRUFBN0M7QUFFQSxXQUNFO0FBQ0UsTUFBQSxHQUFHLEVBQUUsS0FBS1QsT0FBTCxDQUFhcUI7QUFEcEIsT0FFTVgsTUFGTjtBQUdFLE1BQUEsU0FBUyxFQUFHLHdDQUF1Q0UsVUFBVyxJQUFHUSxTQUFVO0FBSDdFLFFBSUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBTSxNQUFBLFNBQVMsRUFBRyxnREFBK0NSLFVBQVcsV0FBVUEsVUFBVztBQUFqRyxNQURGLEVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUFpREwsYUFBYSxDQUFDZSxRQUEvRCxDQUZGLEVBR0U7QUFBTSxNQUFBLFNBQVMsRUFBRTtBQUFqQixPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUcsZ0RBQStDTixVQUFXO0FBQTVFLE1BREYsRUFFRTtBQUFNLE1BQUEsU0FBUyxFQUFHLGdEQUErQ0UsWUFBYTtBQUE5RSxNQUZGLENBSEYsQ0FKRixFQVlFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHLEtBQUtLLHdCQUFMLEVBREgsQ0FaRixDQURGO0FBa0JEOztBQUVEQSxFQUFBQSx3QkFBd0IsR0FBRztBQUN6QixRQUFJLEtBQUt4QixLQUFMLENBQVdZLGtCQUFYLEtBQWtDLENBQXRDLEVBQXlDO0FBQ3ZDLGFBQ0U7QUFBTSxRQUFBLFNBQVMsRUFBQztBQUFoQixpQkFERjtBQUtELEtBTkQsTUFNTyxJQUFJLEtBQUtaLEtBQUwsQ0FBV1ksa0JBQVgsS0FBa0NhLFNBQXRDLEVBQWlEO0FBQ3RELFlBQU1DLGVBQWUsR0FBRyxLQUFLMUIsS0FBTCxDQUFXWSxrQkFBWCxLQUFrQyxDQUFsQyxHQUFzQyxFQUF0QyxHQUEyQyxHQUFuRTtBQUVBLGFBQ0U7QUFBTSxRQUFBLFNBQVMsRUFBQztBQUFoQixTQUNHLEtBQUtaLEtBQUwsQ0FBV1ksa0JBRGQsZUFDMkNjLGVBRDNDLGVBREY7QUFLRCxLQVJNLE1BUUE7QUFDTCxhQUNFO0FBQU0sUUFBQSxTQUFTLEVBQUM7QUFBaEIsdUJBREY7QUFHRDtBQUNGOztBQUVEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLeEIsSUFBTCxDQUFVeUIsT0FBVjtBQUNEOztBQXRFb0U7Ozs7Z0JBQWxEaEMseUIsZUFDQTtBQUNqQlksRUFBQUEsYUFBYSxFQUFFcUIsc0NBQTBCQyxVQUR4QjtBQUVqQnBCLEVBQUFBLFFBQVEsRUFBRXFCLG1CQUFVQyxJQUFWLENBQWVGLFVBRlI7QUFHakJsQixFQUFBQSxrQkFBa0IsRUFBRW1CLG1CQUFVRSxNQUhiO0FBSWpCMUIsRUFBQUEsbUJBQW1CLEVBQUV3QixtQkFBVUcsSUFBVixDQUFlSjtBQUpuQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7Y2xhc3NOYW1lRm9yU3RhdHVzfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7TWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVyZ2VDb25mbGljdExpc3RJdGVtVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWVyZ2VDb25mbGljdDogTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHJlbWFpbmluZ0NvbmZsaWN0czogUHJvcFR5cGVzLm51bWJlcixcbiAgICByZWdpc3Rlckl0ZW1FbGVtZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZJdGVtID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5yZWZJdGVtLm9ic2VydmUoaXRlbSA9PiB0aGlzLnByb3BzLnJlZ2lzdGVySXRlbUVsZW1lbnQodGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0LCBpdGVtKSksXG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWVyZ2VDb25mbGljdCwgc2VsZWN0ZWQsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzO1xuICAgIGRlbGV0ZSBvdGhlcnMucmVtYWluaW5nQ29uZmxpY3RzO1xuICAgIGRlbGV0ZSBvdGhlcnMucmVnaXN0ZXJJdGVtRWxlbWVudDtcbiAgICBjb25zdCBmaWxlU3RhdHVzID0gY2xhc3NOYW1lRm9yU3RhdHVzW21lcmdlQ29uZmxpY3Quc3RhdHVzLmZpbGVdO1xuICAgIGNvbnN0IG91cnNTdGF0dXMgPSBjbGFzc05hbWVGb3JTdGF0dXNbbWVyZ2VDb25mbGljdC5zdGF0dXMub3Vyc107XG4gICAgY29uc3QgdGhlaXJzU3RhdHVzID0gY2xhc3NOYW1lRm9yU3RhdHVzW21lcmdlQ29uZmxpY3Quc3RhdHVzLnRoZWlyc107XG4gICAgY29uc3QgY2xhc3NOYW1lID0gc2VsZWN0ZWQgPyAnaXMtc2VsZWN0ZWQnIDogJyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9e3RoaXMucmVmSXRlbS5zZXR0ZXJ9XG4gICAgICAgIHsuLi5vdGhlcnN9XG4gICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1NZXJnZUNvbmZsaWN0TGlzdFZpZXctaXRlbSBpcy0ke2ZpbGVTdGF0dXN9ICR7Y2xhc3NOYW1lfWB9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pdGVtIGdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1wYXRoSXRlbVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pY29uIGljb24gaWNvbi1kaWZmLSR7ZmlsZVN0YXR1c30gc3RhdHVzLSR7ZmlsZVN0YXR1c31gfSAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1wYXRoXCI+e21lcmdlQ29uZmxpY3QuZmlsZVBhdGh9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17J2dpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBvdXJzLXRoZWlycy1pbmZvJ30+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke291cnNTdGF0dXN9YH0gLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pY29uIGljb24gaWNvbi1kaWZmLSR7dGhlaXJzU3RhdHVzfWB9IC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaXRlbSBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcmVzb2x1dGlvbkl0ZW1cIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZW1haW5pbmdDb25mbGljdHMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0cyA9PT0gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZWNrIGdpdGh1Yi1SZW1haW5pbmdDb25mbGljdHMgdGV4dC1zdWNjZXNzXCI+XG4gICAgICAgICAgcmVhZHlcbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVtYWluaW5nQ29uZmxpY3RzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHBsdXJhbENvbmZsaWN0cyA9IHRoaXMucHJvcHMucmVtYWluaW5nQ29uZmxpY3RzID09PSAxID8gJycgOiAncyc7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZW1haW5pbmdDb25mbGljdHMgdGV4dC13YXJuaW5nXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVtYWluaW5nQ29uZmxpY3RzfSBjb25mbGljdHtwbHVyYWxDb25mbGljdHN9IHJlbWFpbmluZ1xuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVtYWluaW5nQ29uZmxpY3RzIHRleHQtc3VidGxlXCI+Y2FsY3VsYXRpbmc8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==