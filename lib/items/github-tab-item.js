"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _propTypes2 = require("../prop-types");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _githubTabContainer = _interopRequireDefault(require("../containers/github-tab-container"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GitHubTabItem extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }
  constructor(props) {
    super(props);
    this.rootHolder = new _refHolder.default();
  }
  getTitle() {
    return 'GitHub';
  }
  getIconName() {
    return 'octoface';
  }
  getDefaultLocation() {
    return 'right';
  }
  getPreferredWidth() {
    return 400;
  }
  getWorkingDirectory() {
    return this.props.repository.getWorkingDirectoryPath();
  }
  serialize() {
    return {
      deserializer: 'GithubDockItem',
      uri: this.getURI()
    };
  }
  render() {
    return _react.default.createElement(_githubTabContainer.default, _extends({}, this.props, {
      rootHolder: this.rootHolder
    }));
  }
  hasFocus() {
    return this.rootHolder.map(root => root.contains(this.props.documentActiveElement())).getOr(false);
  }
  restoreFocus() {
    // No-op
  }
}
exports.default = GitHubTabItem;
_defineProperty(GitHubTabItem, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  documentActiveElement: _propTypes.default.func,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});
_defineProperty(GitHubTabItem, "defaultProps", {
  documentActiveElement: /* istanbul ignore next */() => document.activeElement
});
_defineProperty(GitHubTabItem, "uriPattern", 'atom-github://dock-item/github');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRIdWJUYWJJdGVtIiwiUmVhY3QiLCJDb21wb25lbnQiLCJidWlsZFVSSSIsInVyaVBhdHRlcm4iLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicm9vdEhvbGRlciIsIlJlZkhvbGRlciIsImdldFRpdGxlIiwiZ2V0SWNvbk5hbWUiLCJnZXREZWZhdWx0TG9jYXRpb24iLCJnZXRQcmVmZXJyZWRXaWR0aCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJyZXBvc2l0b3J5IiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJnZXRVUkkiLCJyZW5kZXIiLCJoYXNGb2N1cyIsIm1hcCIsInJvb3QiLCJjb250YWlucyIsImRvY3VtZW50QWN0aXZlRWxlbWVudCIsImdldE9yIiwicmVzdG9yZUZvY3VzIiwid29ya3NwYWNlIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImxvZ2luTW9kZWwiLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJmdW5jIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJvcGVuQ3JlYXRlRGlhbG9nIiwib3BlblB1Ymxpc2hEaWFsb2ciLCJvcGVuQ2xvbmVEaWFsb2ciLCJvcGVuR2l0VGFiIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50Il0sInNvdXJjZXMiOlsiZ2l0aHViLXRhYi1pdGVtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge0dpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBHaXRIdWJUYWJDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9naXRodWItdGFiLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdEh1YlRhYkl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICBkb2N1bWVudEFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ3JlYXRlRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5QdWJsaXNoRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5DbG9uZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuR2l0VGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkb2N1bWVudEFjdGl2ZUVsZW1lbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICgpID0+IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG4gIH1cblxuICBzdGF0aWMgdXJpUGF0dGVybiA9ICdhdG9tLWdpdGh1YjovL2RvY2staXRlbS9naXRodWInO1xuXG4gIHN0YXRpYyBidWlsZFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmlQYXR0ZXJuO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJvb3RIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdEh1Yic7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHtcbiAgICByZXR1cm4gJ29jdG9mYWNlJztcbiAgfVxuXG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gJ3JpZ2h0JztcbiAgfVxuXG4gIGdldFByZWZlcnJlZFdpZHRoKCkge1xuICAgIHJldHVybiA0MDA7XG4gIH1cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnR2l0aHViRG9ja0l0ZW0nLFxuICAgICAgdXJpOiB0aGlzLmdldFVSSSgpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRIdWJUYWJDb250YWluZXIgey4uLnRoaXMucHJvcHN9IHJvb3RIb2xkZXI9e3RoaXMucm9vdEhvbGRlcn0gLz5cbiAgICApO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdEhvbGRlci5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKHRoaXMucHJvcHMuZG9jdW1lbnRBY3RpdmVFbGVtZW50KCkpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICByZXN0b3JlRm9jdXMoKSB7XG4gICAgLy8gTm8tb3BcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQW9FO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFckQsTUFBTUEsYUFBYSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXVCekQsT0FBT0MsUUFBUSxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxDQUFDQyxVQUFVO0VBQ3hCO0VBRUFDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBRVosSUFBSSxDQUFDQyxVQUFVLEdBQUcsSUFBSUMsa0JBQVMsRUFBRTtFQUNuQztFQUVBQyxRQUFRLEdBQUc7SUFDVCxPQUFPLFFBQVE7RUFDakI7RUFFQUMsV0FBVyxHQUFHO0lBQ1osT0FBTyxVQUFVO0VBQ25CO0VBRUFDLGtCQUFrQixHQUFHO0lBQ25CLE9BQU8sT0FBTztFQUNoQjtFQUVBQyxpQkFBaUIsR0FBRztJQUNsQixPQUFPLEdBQUc7RUFDWjtFQUVBQyxtQkFBbUIsR0FBRztJQUNwQixPQUFPLElBQUksQ0FBQ1AsS0FBSyxDQUFDUSxVQUFVLENBQUNDLHVCQUF1QixFQUFFO0VBQ3hEO0VBRUFDLFNBQVMsR0FBRztJQUNWLE9BQU87TUFDTEMsWUFBWSxFQUFFLGdCQUFnQjtNQUM5QkMsR0FBRyxFQUFFLElBQUksQ0FBQ0MsTUFBTTtJQUNsQixDQUFDO0VBQ0g7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRSw2QkFBQywyQkFBa0IsZUFBSyxJQUFJLENBQUNkLEtBQUs7TUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDQztJQUFXLEdBQUc7RUFFdkU7RUFFQWMsUUFBUSxHQUFHO0lBQ1QsT0FBTyxJQUFJLENBQUNkLFVBQVUsQ0FBQ2UsR0FBRyxDQUFDQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsUUFBUSxDQUFDLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ21CLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUMsS0FBSyxDQUFDO0VBQ3BHO0VBRUFDLFlBQVksR0FBRztJQUNiO0VBQUE7QUFFSjtBQUFDO0FBQUEsZ0JBekVvQjNCLGFBQWEsZUFDYjtFQUNqQjRCLFNBQVMsRUFBRUMsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3RDakIsVUFBVSxFQUFFZSxrQkFBUyxDQUFDQyxNQUFNO0VBQzVCRSxVQUFVLEVBQUVDLG9DQUF3QixDQUFDRixVQUFVO0VBRS9DTixxQkFBcUIsRUFBRUksa0JBQVMsQ0FBQ0ssSUFBSTtFQUVyQ0Msc0JBQXNCLEVBQUVOLGtCQUFTLENBQUNLLElBQUksQ0FBQ0gsVUFBVTtFQUNqREssbUJBQW1CLEVBQUVQLGtCQUFTLENBQUNLLElBQUksQ0FBQ0gsVUFBVTtFQUM5Q00sa0JBQWtCLEVBQUVSLGtCQUFTLENBQUNLLElBQUksQ0FBQ0gsVUFBVTtFQUM3Q08sZ0JBQWdCLEVBQUVULGtCQUFTLENBQUNLLElBQUksQ0FBQ0gsVUFBVTtFQUMzQ1EsaUJBQWlCLEVBQUVWLGtCQUFTLENBQUNLLElBQUksQ0FBQ0gsVUFBVTtFQUM1Q1MsZUFBZSxFQUFFWCxrQkFBUyxDQUFDSyxJQUFJLENBQUNILFVBQVU7RUFDMUNVLFVBQVUsRUFBRVosa0JBQVMsQ0FBQ0ssSUFBSSxDQUFDSDtBQUM3QixDQUFDO0FBQUEsZ0JBZmtCL0IsYUFBYSxrQkFpQlY7RUFDcEJ5QixxQkFBcUIsRUFBRSwwQkFBMkIsTUFBTWlCLFFBQVEsQ0FBQ0M7QUFDbkUsQ0FBQztBQUFBLGdCQW5Ca0IzQyxhQUFhLGdCQXFCWixnQ0FBZ0MifQ==