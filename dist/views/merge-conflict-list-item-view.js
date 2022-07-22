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
    return /*#__PURE__*/_react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-MergeConflictListView-item is-${fileStatus} ${className}`
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-pathItem"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${fileStatus} status-${fileStatus}`
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, mergeConflict.filePath), /*#__PURE__*/_react.default.createElement("span", {
      className: 'github-FilePatchListView ours-theirs-info'
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${oursStatus}`
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${theirsStatus}`
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-resolutionItem"
    }, this.renderRemainingConflicts()));
  }

  renderRemainingConflicts() {
    if (this.props.remainingConflicts === 0) {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "icon icon-check github-RemainingConflicts text-success"
      }, "ready");
    } else if (this.props.remainingConflicts !== undefined) {
      const pluralConflicts = this.props.remainingConflicts === 1 ? '' : 's';
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "github-RemainingConflicts text-warning"
      }, this.props.remainingConflicts, " conflict", pluralConflicts, " remaining");
    } else {
      return /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9tZXJnZS1jb25mbGljdC1saXN0LWl0ZW0tdmlldy5qcyJdLCJuYW1lcyI6WyJNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmSXRlbSIsIlJlZkhvbGRlciIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib2JzZXJ2ZSIsIml0ZW0iLCJyZWdpc3Rlckl0ZW1FbGVtZW50IiwibWVyZ2VDb25mbGljdCIsInJlbmRlciIsInNlbGVjdGVkIiwib3RoZXJzIiwicmVtYWluaW5nQ29uZmxpY3RzIiwiZmlsZVN0YXR1cyIsImNsYXNzTmFtZUZvclN0YXR1cyIsInN0YXR1cyIsImZpbGUiLCJvdXJzU3RhdHVzIiwib3VycyIsInRoZWlyc1N0YXR1cyIsInRoZWlycyIsImNsYXNzTmFtZSIsInNldHRlciIsImZpbGVQYXRoIiwicmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzIiwidW5kZWZpbmVkIiwicGx1cmFsQ29uZmxpY3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJib29sIiwibnVtYmVyIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSx5QkFBTixTQUF3Q0MsZUFBTUMsU0FBOUMsQ0FBd0Q7QUFRckVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFFQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUMsa0JBQUosRUFBZjtBQUNBLFNBQUtDLElBQUwsR0FBWSxJQUFJQyw2QkFBSixDQUNWLEtBQUtILE9BQUwsQ0FBYUksT0FBYixDQUFxQkMsSUFBSSxJQUFJLEtBQUtOLEtBQUwsQ0FBV08sbUJBQVgsQ0FBK0IsS0FBS1AsS0FBTCxDQUFXUSxhQUExQyxFQUF5REYsSUFBekQsQ0FBN0IsQ0FEVSxDQUFaO0FBR0Q7O0FBRURHLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUE2QyxLQUFLVCxLQUFsRDtBQUFBLFVBQU07QUFBQ1EsTUFBQUEsYUFBRDtBQUFnQkUsTUFBQUE7QUFBaEIsS0FBTjtBQUFBLFVBQW1DQyxNQUFuQzs7QUFDQSxXQUFPQSxNQUFNLENBQUNDLGtCQUFkO0FBQ0EsV0FBT0QsTUFBTSxDQUFDSixtQkFBZDtBQUNBLFVBQU1NLFVBQVUsR0FBR0MsNEJBQW1CTixhQUFhLENBQUNPLE1BQWQsQ0FBcUJDLElBQXhDLENBQW5CO0FBQ0EsVUFBTUMsVUFBVSxHQUFHSCw0QkFBbUJOLGFBQWEsQ0FBQ08sTUFBZCxDQUFxQkcsSUFBeEMsQ0FBbkI7QUFDQSxVQUFNQyxZQUFZLEdBQUdMLDRCQUFtQk4sYUFBYSxDQUFDTyxNQUFkLENBQXFCSyxNQUF4QyxDQUFyQjtBQUNBLFVBQU1DLFNBQVMsR0FBR1gsUUFBUSxHQUFHLGFBQUgsR0FBbUIsRUFBN0M7QUFFQSx3QkFDRTtBQUNFLE1BQUEsR0FBRyxFQUFFLEtBQUtULE9BQUwsQ0FBYXFCO0FBRHBCLE9BRU1YLE1BRk47QUFHRSxNQUFBLFNBQVMsRUFBRyx3Q0FBdUNFLFVBQVcsSUFBR1EsU0FBVTtBQUg3RSxxQkFJRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBRyxnREFBK0NSLFVBQVcsV0FBVUEsVUFBVztBQUFqRyxNQURGLGVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUFpREwsYUFBYSxDQUFDZSxRQUEvRCxDQUZGLGVBR0U7QUFBTSxNQUFBLFNBQVMsRUFBRTtBQUFqQixvQkFDRTtBQUFNLE1BQUEsU0FBUyxFQUFHLGdEQUErQ04sVUFBVztBQUE1RSxNQURGLGVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBRyxnREFBK0NFLFlBQWE7QUFBOUUsTUFGRixDQUhGLENBSkYsZUFZRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLSyx3QkFBTCxFQURILENBWkYsQ0FERjtBQWtCRDs7QUFFREEsRUFBQUEsd0JBQXdCLEdBQUc7QUFDekIsUUFBSSxLQUFLeEIsS0FBTCxDQUFXWSxrQkFBWCxLQUFrQyxDQUF0QyxFQUF5QztBQUN2QywwQkFDRTtBQUFNLFFBQUEsU0FBUyxFQUFDO0FBQWhCLGlCQURGO0FBS0QsS0FORCxNQU1PLElBQUksS0FBS1osS0FBTCxDQUFXWSxrQkFBWCxLQUFrQ2EsU0FBdEMsRUFBaUQ7QUFDdEQsWUFBTUMsZUFBZSxHQUFHLEtBQUsxQixLQUFMLENBQVdZLGtCQUFYLEtBQWtDLENBQWxDLEdBQXNDLEVBQXRDLEdBQTJDLEdBQW5FO0FBRUEsMEJBQ0U7QUFBTSxRQUFBLFNBQVMsRUFBQztBQUFoQixTQUNHLEtBQUtaLEtBQUwsQ0FBV1ksa0JBRGQsZUFDMkNjLGVBRDNDLGVBREY7QUFLRCxLQVJNLE1BUUE7QUFDTCwwQkFDRTtBQUFNLFFBQUEsU0FBUyxFQUFDO0FBQWhCLHVCQURGO0FBR0Q7QUFDRjs7QUFFREMsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckIsU0FBS3hCLElBQUwsQ0FBVXlCLE9BQVY7QUFDRDs7QUF0RW9FOzs7O2dCQUFsRGhDLHlCLGVBQ0E7QUFDakJZLEVBQUFBLGFBQWEsRUFBRXFCLHNDQUEwQkMsVUFEeEI7QUFFakJwQixFQUFBQSxRQUFRLEVBQUVxQixtQkFBVUMsSUFBVixDQUFlRixVQUZSO0FBR2pCbEIsRUFBQUEsa0JBQWtCLEVBQUVtQixtQkFBVUUsTUFIYjtBQUlqQjFCLEVBQUFBLG1CQUFtQixFQUFFd0IsbUJBQVVHLElBQVYsQ0FBZUo7QUFKbkIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2NsYXNzTmFtZUZvclN0YXR1c30gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge01lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1lcmdlQ29uZmxpY3Q6IE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByZW1haW5pbmdDb25mbGljdHM6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgcmVnaXN0ZXJJdGVtRWxlbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmSXRlbSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucmVmSXRlbS5vYnNlcnZlKGl0ZW0gPT4gdGhpcy5wcm9wcy5yZWdpc3Rlckl0ZW1FbGVtZW50KHRoaXMucHJvcHMubWVyZ2VDb25mbGljdCwgaXRlbSkpLFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21lcmdlQ29uZmxpY3QsIHNlbGVjdGVkLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBkZWxldGUgb3RoZXJzLnJlbWFpbmluZ0NvbmZsaWN0cztcbiAgICBkZWxldGUgb3RoZXJzLnJlZ2lzdGVySXRlbUVsZW1lbnQ7XG4gICAgY29uc3QgZmlsZVN0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1ttZXJnZUNvbmZsaWN0LnN0YXR1cy5maWxlXTtcbiAgICBjb25zdCBvdXJzU3RhdHVzID0gY2xhc3NOYW1lRm9yU3RhdHVzW21lcmdlQ29uZmxpY3Quc3RhdHVzLm91cnNdO1xuICAgIGNvbnN0IHRoZWlyc1N0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1ttZXJnZUNvbmZsaWN0LnN0YXR1cy50aGVpcnNdO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNlbGVjdGVkID8gJ2lzLXNlbGVjdGVkJyA6ICcnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLnJlZkl0ZW0uc2V0dGVyfVxuICAgICAgICB7Li4ub3RoZXJzfVxuICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItTWVyZ2VDb25mbGljdExpc3RWaWV3LWl0ZW0gaXMtJHtmaWxlU3RhdHVzfSAke2NsYXNzTmFtZX1gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaXRlbSBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcGF0aEl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke2ZpbGVTdGF0dXN9IHN0YXR1cy0ke2ZpbGVTdGF0dXN9YH0gLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctcGF0aFwiPnttZXJnZUNvbmZsaWN0LmZpbGVQYXRofTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgb3Vycy10aGVpcnMtaW5mbyd9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWljb24gaWNvbiBpY29uLWRpZmYtJHtvdXJzU3RhdHVzfWB9IC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke3RoZWlyc1N0YXR1c31gfSAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWl0ZW0gZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LXJlc29sdXRpb25JdGVtXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmVtYWluaW5nQ29uZmxpY3RzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlbWFpbmluZ0NvbmZsaWN0cygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZW1haW5pbmdDb25mbGljdHMgPT09IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGVjayBnaXRodWItUmVtYWluaW5nQ29uZmxpY3RzIHRleHQtc3VjY2Vzc1wiPlxuICAgICAgICAgIHJlYWR5XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBwbHVyYWxDb25mbGljdHMgPSB0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0cyA9PT0gMSA/ICcnIDogJ3MnO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVtYWluaW5nQ29uZmxpY3RzIHRleHQtd2FybmluZ1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlbWFpbmluZ0NvbmZsaWN0c30gY29uZmxpY3R7cGx1cmFsQ29uZmxpY3RzfSByZW1haW5pbmdcbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJlbWFpbmluZ0NvbmZsaWN0cyB0ZXh0LXN1YnRsZVwiPmNhbGN1bGF0aW5nPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG59XG4iXX0=