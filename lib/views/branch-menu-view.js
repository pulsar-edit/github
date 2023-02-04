"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _propTypes2 = require("../prop-types");
var _gitShellOutStrategy = require("../git-shell-out-strategy");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BranchMenuView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      createNew: false,
      checkedOutBranch: null
    });
    _defineProperty(this, "didSelectItem", async event => {
      const branchName = event.target.value;
      await this.checkout(branchName);
    });
    _defineProperty(this, "createBranch", async () => {
      if (this.state.createNew) {
        const branchName = this.editorElement.getModel().getText().trim();
        await this.checkout(branchName, {
          createNew: true
        });
      } else {
        await new Promise(resolve => {
          this.setState({
            createNew: true
          }, () => {
            this.editorElement.focus();
            resolve();
          });
        });
      }
    });
    _defineProperty(this, "checkout", async (branchName, options) => {
      this.editorElement.classList.remove('is-focused');
      await new Promise(resolve => {
        this.setState({
          checkedOutBranch: branchName
        }, resolve);
      });
      try {
        await this.props.checkout(branchName, options);
        await new Promise(resolve => {
          this.setState({
            checkedOutBranch: null,
            createNew: false
          }, resolve);
        });
        this.editorElement.getModel().setText('');
      } catch (error) {
        this.editorElement.classList.add('is-focused');
        await new Promise(resolve => {
          this.setState({
            checkedOutBranch: null
          }, resolve);
        });
        if (!(error instanceof _gitShellOutStrategy.GitError)) {
          throw error;
        }
      }
    });
    _defineProperty(this, "cancelCreateNewBranch", () => {
      this.setState({
        createNew: false
      });
    });
  }
  render() {
    const branchNames = this.props.branches.getNames().filter(Boolean);
    let currentBranchName = this.props.currentBranch.isDetached() ? 'detached' : this.props.currentBranch.getName();
    if (this.state.checkedOutBranch) {
      currentBranchName = this.state.checkedOutBranch;
      if (branchNames.indexOf(this.state.checkedOutBranch) === -1) {
        branchNames.push(this.state.checkedOutBranch);
      }
    }
    const disableControls = !!this.state.checkedOutBranch;
    const branchEditorClasses = (0, _classnames.default)('github-BranchMenuView-item', 'github-BranchMenuView-editor', {
      hidden: !this.state.createNew
    });
    const branchSelectListClasses = (0, _classnames.default)('github-BranchMenuView-item', 'github-BranchMenuView-select', 'input-select', {
      hidden: !!this.state.createNew
    });
    const iconClasses = (0, _classnames.default)('github-BranchMenuView-item', 'icon', {
      'icon-git-branch': !disableControls,
      'icon-sync': disableControls
    });
    const newBranchEditor = _react.default.createElement("div", {
      className: branchEditorClasses
    }, _react.default.createElement("atom-text-editor", {
      ref: e => {
        this.editorElement = e;
      },
      mini: true,
      readonly: disableControls ? true : undefined
    }));
    const selectBranchView = /* eslint-disable jsx-a11y/no-onchange */
    _react.default.createElement("select", {
      className: branchSelectListClasses,
      onChange: this.didSelectItem,
      disabled: disableControls,
      value: currentBranchName
    }, this.props.currentBranch.isDetached() && _react.default.createElement("option", {
      key: "detached",
      value: "detached",
      disabled: true
    }, this.props.currentBranch.getName()), branchNames.map(branchName => {
      return _react.default.createElement("option", {
        key: `branch-${branchName}`,
        value: branchName
      }, branchName);
    }));
    return _react.default.createElement("div", {
      className: "github-BranchMenuView"
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-BranchMenuView-editor atom-text-editor[mini]"
    }, _react.default.createElement(_commands.Command, {
      command: "tool-panel:unfocus",
      callback: this.cancelCreateNewBranch
    }), _react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.cancelCreateNewBranch
    }), _react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.createBranch
    })), _react.default.createElement("div", {
      className: "github-BranchMenuView-selector"
    }, _react.default.createElement("span", {
      className: iconClasses
    }), newBranchEditor, selectBranchView, _react.default.createElement("button", {
      className: "github-BranchMenuView-item github-BranchMenuView-button btn",
      onClick: this.createBranch,
      disabled: disableControls
    }, " New Branch ")));
  }
}
exports.default = BranchMenuView;
_defineProperty(BranchMenuView, "propTypes", {
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  // Model
  repository: _propTypes.default.object,
  branches: _propTypes2.BranchSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  checkout: _propTypes.default.func
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCcmFuY2hNZW51VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY3JlYXRlTmV3IiwiY2hlY2tlZE91dEJyYW5jaCIsImV2ZW50IiwiYnJhbmNoTmFtZSIsInRhcmdldCIsInZhbHVlIiwiY2hlY2tvdXQiLCJzdGF0ZSIsImVkaXRvckVsZW1lbnQiLCJnZXRNb2RlbCIsImdldFRleHQiLCJ0cmltIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRTdGF0ZSIsImZvY3VzIiwib3B0aW9ucyIsImNsYXNzTGlzdCIsInJlbW92ZSIsInByb3BzIiwic2V0VGV4dCIsImVycm9yIiwiYWRkIiwiR2l0RXJyb3IiLCJyZW5kZXIiLCJicmFuY2hOYW1lcyIsImJyYW5jaGVzIiwiZ2V0TmFtZXMiLCJmaWx0ZXIiLCJCb29sZWFuIiwiY3VycmVudEJyYW5jaE5hbWUiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsImdldE5hbWUiLCJpbmRleE9mIiwicHVzaCIsImRpc2FibGVDb250cm9scyIsImJyYW5jaEVkaXRvckNsYXNzZXMiLCJjeCIsImhpZGRlbiIsImJyYW5jaFNlbGVjdExpc3RDbGFzc2VzIiwiaWNvbkNsYXNzZXMiLCJuZXdCcmFuY2hFZGl0b3IiLCJlIiwidW5kZWZpbmVkIiwic2VsZWN0QnJhbmNoVmlldyIsImRpZFNlbGVjdEl0ZW0iLCJtYXAiLCJjb21tYW5kcyIsImNhbmNlbENyZWF0ZU5ld0JyYW5jaCIsImNyZWF0ZUJyYW5jaCIsIndvcmtzcGFjZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJub3RpZmljYXRpb25NYW5hZ2VyIiwicmVwb3NpdG9yeSIsIkJyYW5jaFNldFByb3BUeXBlIiwiQnJhbmNoUHJvcFR5cGUiLCJmdW5jIl0sInNvdXJjZXMiOlsiYnJhbmNoLW1lbnUtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQge0JyYW5jaFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge0dpdEVycm9yfSBmcm9tICcuLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJhbmNoTWVudVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIE1vZGVsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBicmFuY2hlczogQnJhbmNoU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGNoZWNrb3V0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNyZWF0ZU5ldzogZmFsc2UsXG4gICAgY2hlY2tlZE91dEJyYW5jaDogbnVsbCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBicmFuY2hOYW1lcyA9IHRoaXMucHJvcHMuYnJhbmNoZXMuZ2V0TmFtZXMoKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgbGV0IGN1cnJlbnRCcmFuY2hOYW1lID0gdGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSA/ICdkZXRhY2hlZCcgOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2gpIHtcbiAgICAgIGN1cnJlbnRCcmFuY2hOYW1lID0gdGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoO1xuICAgICAgaWYgKGJyYW5jaE5hbWVzLmluZGV4T2YodGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoKSA9PT0gLTEpIHtcbiAgICAgICAgYnJhbmNoTmFtZXMucHVzaCh0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRpc2FibGVDb250cm9scyA9ICEhdGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoO1xuXG4gICAgY29uc3QgYnJhbmNoRWRpdG9yQ2xhc3NlcyA9IGN4KCdnaXRodWItQnJhbmNoTWVudVZpZXctaXRlbScsICdnaXRodWItQnJhbmNoTWVudVZpZXctZWRpdG9yJywge1xuICAgICAgaGlkZGVuOiAhdGhpcy5zdGF0ZS5jcmVhdGVOZXcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBicmFuY2hTZWxlY3RMaXN0Q2xhc3NlcyA9IGN4KCdnaXRodWItQnJhbmNoTWVudVZpZXctaXRlbScsICdnaXRodWItQnJhbmNoTWVudVZpZXctc2VsZWN0JywgJ2lucHV0LXNlbGVjdCcsIHtcbiAgICAgIGhpZGRlbjogISF0aGlzLnN0YXRlLmNyZWF0ZU5ldyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGljb25DbGFzc2VzID0gY3goJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtJywgJ2ljb24nLCB7XG4gICAgICAnaWNvbi1naXQtYnJhbmNoJzogIWRpc2FibGVDb250cm9scyxcbiAgICAgICdpY29uLXN5bmMnOiBkaXNhYmxlQ29udHJvbHMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBuZXdCcmFuY2hFZGl0b3IgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YnJhbmNoRWRpdG9yQ2xhc3Nlc30+XG4gICAgICAgIDxhdG9tLXRleHQtZWRpdG9yXG4gICAgICAgICAgcmVmPXtlID0+IHsgdGhpcy5lZGl0b3JFbGVtZW50ID0gZTsgfX1cbiAgICAgICAgICBtaW5pPXt0cnVlfVxuICAgICAgICAgIHJlYWRvbmx5PXtkaXNhYmxlQ29udHJvbHMgPyB0cnVlIDogdW5kZWZpbmVkfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdEJyYW5jaFZpZXcgPSAoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBqc3gtYTExeS9uby1vbmNoYW5nZSAqL1xuICAgICAgPHNlbGVjdFxuICAgICAgICBjbGFzc05hbWU9e2JyYW5jaFNlbGVjdExpc3RDbGFzc2VzfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5kaWRTZWxlY3RJdGVtfVxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZUNvbnRyb2xzfVxuICAgICAgICB2YWx1ZT17Y3VycmVudEJyYW5jaE5hbWV9PlxuICAgICAgICB7dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSAmJlxuICAgICAgICAgIDxvcHRpb24ga2V5PVwiZGV0YWNoZWRcIiB2YWx1ZT1cImRldGFjaGVkXCIgZGlzYWJsZWQ+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9vcHRpb24+XG4gICAgICAgIH1cbiAgICAgICAge2JyYW5jaE5hbWVzLm1hcChicmFuY2hOYW1lID0+IHtcbiAgICAgICAgICByZXR1cm4gPG9wdGlvbiBrZXk9e2BicmFuY2gtJHticmFuY2hOYW1lfWB9IHZhbHVlPXticmFuY2hOYW1lfT57YnJhbmNoTmFtZX08L29wdGlvbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlld1wiPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItQnJhbmNoTWVudVZpZXctZWRpdG9yIGF0b20tdGV4dC1lZGl0b3JbbWluaV1cIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwidG9vbC1wYW5lbDp1bmZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuY2FuY2VsQ3JlYXRlTmV3QnJhbmNofSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNhbmNlbFwiIGNhbGxiYWNrPXt0aGlzLmNhbmNlbENyZWF0ZU5ld0JyYW5jaH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMuY3JlYXRlQnJhbmNofSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlldy1zZWxlY3RvclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17aWNvbkNsYXNzZXN9IC8+XG4gICAgICAgICAge25ld0JyYW5jaEVkaXRvcn1cbiAgICAgICAgICB7c2VsZWN0QnJhbmNoVmlld31cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtIGdpdGh1Yi1CcmFuY2hNZW51Vmlldy1idXR0b24gYnRuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY3JlYXRlQnJhbmNofSBkaXNhYmxlZD17ZGlzYWJsZUNvbnRyb2xzfT4gTmV3IEJyYW5jaCA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZGlkU2VsZWN0SXRlbSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBicmFuY2hOYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGF3YWl0IHRoaXMuY2hlY2tvdXQoYnJhbmNoTmFtZSk7XG4gIH1cblxuICBjcmVhdGVCcmFuY2ggPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY3JlYXRlTmV3KSB7XG4gICAgICBjb25zdCBicmFuY2hOYW1lID0gdGhpcy5lZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIGF3YWl0IHRoaXMuY2hlY2tvdXQoYnJhbmNoTmFtZSwge2NyZWF0ZU5ldzogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y3JlYXRlTmV3OiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjaGVja291dCA9IGFzeW5jIChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgdGhpcy5lZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZvY3VzZWQnKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWRPdXRCcmFuY2g6IGJyYW5jaE5hbWV9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGVja2VkT3V0QnJhbmNoOiBudWxsLCBjcmVhdGVOZXc6IGZhbHNlfSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLnNldFRleHQoJycpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtZm9jdXNlZCcpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWRPdXRCcmFuY2g6IG51bGx9LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsQ3JlYXRlTmV3QnJhbmNoID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NyZWF0ZU5ldzogZmFsc2V9KTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBbUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXBDLE1BQU1BLGNBQWMsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsK0JBY2xEO01BQ05DLFNBQVMsRUFBRSxLQUFLO01BQ2hCQyxnQkFBZ0IsRUFBRTtJQUNwQixDQUFDO0lBQUEsdUNBdUVlLE1BQU1DLEtBQUssSUFBSTtNQUM3QixNQUFNQyxVQUFVLEdBQUdELEtBQUssQ0FBQ0UsTUFBTSxDQUFDQyxLQUFLO01BQ3JDLE1BQU0sSUFBSSxDQUFDQyxRQUFRLENBQUNILFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBQUEsc0NBRWMsWUFBWTtNQUN6QixJQUFJLElBQUksQ0FBQ0ksS0FBSyxDQUFDUCxTQUFTLEVBQUU7UUFDeEIsTUFBTUcsVUFBVSxHQUFHLElBQUksQ0FBQ0ssYUFBYSxDQUFDQyxRQUFRLEVBQUUsQ0FBQ0MsT0FBTyxFQUFFLENBQUNDLElBQUksRUFBRTtRQUNqRSxNQUFNLElBQUksQ0FBQ0wsUUFBUSxDQUFDSCxVQUFVLEVBQUU7VUFBQ0gsU0FBUyxFQUFFO1FBQUksQ0FBQyxDQUFDO01BQ3BELENBQUMsTUFBTTtRQUNMLE1BQU0sSUFBSVksT0FBTyxDQUFDQyxPQUFPLElBQUk7VUFDM0IsSUFBSSxDQUFDQyxRQUFRLENBQUM7WUFBQ2QsU0FBUyxF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