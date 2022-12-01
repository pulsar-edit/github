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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    const selectBranchView =
    /* eslint-disable jsx-a11y/no-onchange */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9icmFuY2gtbWVudS12aWV3LmpzIl0sIm5hbWVzIjpbIkJyYW5jaE1lbnVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVOZXciLCJjaGVja2VkT3V0QnJhbmNoIiwiZXZlbnQiLCJicmFuY2hOYW1lIiwidGFyZ2V0IiwidmFsdWUiLCJjaGVja291dCIsInN0YXRlIiwiZWRpdG9yRWxlbWVudCIsImdldE1vZGVsIiwiZ2V0VGV4dCIsInRyaW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFN0YXRlIiwiZm9jdXMiLCJvcHRpb25zIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwicHJvcHMiLCJzZXRUZXh0IiwiZXJyb3IiLCJhZGQiLCJHaXRFcnJvciIsInJlbmRlciIsImJyYW5jaE5hbWVzIiwiYnJhbmNoZXMiLCJnZXROYW1lcyIsImZpbHRlciIsIkJvb2xlYW4iLCJjdXJyZW50QnJhbmNoTmFtZSIsImN1cnJlbnRCcmFuY2giLCJpc0RldGFjaGVkIiwiZ2V0TmFtZSIsImluZGV4T2YiLCJwdXNoIiwiZGlzYWJsZUNvbnRyb2xzIiwiYnJhbmNoRWRpdG9yQ2xhc3NlcyIsImhpZGRlbiIsImJyYW5jaFNlbGVjdExpc3RDbGFzc2VzIiwiaWNvbkNsYXNzZXMiLCJuZXdCcmFuY2hFZGl0b3IiLCJlIiwidW5kZWZpbmVkIiwic2VsZWN0QnJhbmNoVmlldyIsImRpZFNlbGVjdEl0ZW0iLCJtYXAiLCJjb21tYW5kcyIsImNhbmNlbENyZWF0ZU5ld0JyYW5jaCIsImNyZWF0ZUJyYW5jaCIsIndvcmtzcGFjZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJub3RpZmljYXRpb25NYW5hZ2VyIiwicmVwb3NpdG9yeSIsIkJyYW5jaFNldFByb3BUeXBlIiwiQnJhbmNoUHJvcFR5cGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFF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SUU7QUFBUSxNQUFBLFNBQVMsRUFBQyw2REFBbEI7QUFDRSxNQUFBLE9BQU8sRUFBRSxLQUFLSyxZQURoQjtBQUM4QixNQUFBLFFBQVEsRUFBRWI7QUFEeEMsc0JBSkYsQ0FORixDQURGO0FBZ0JEOztBQXRGeUQ7Ozs7Z0JBQXZDdkMsYyxlQUNBO0FBQ2pCO0FBQ0FxRCxFQUFBQSxTQUFTLEVBQUVDLG1CQUFVQyxNQUFWLENBQWlCQyxVQUZYO0FBR2pCTixFQUFBQSxRQUFRLEVBQUVJLG1CQUFVQyxNQUFWLENBQWlCQyxVQUhWO0FBSWpCQyxFQUFBQSxtQkFBbUIsRUFBRUgsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSnJCO0FBTWpCO0FBQ0FFLEVBQUFBLFVBQVUsRUFBRUosbUJBQVVDLE1BUEw7QUFRakIxQixFQUFBQSxRQUFRLEVBQUU4Qiw4QkFBa0JILFVBUlg7QUFTakJ0QixFQUFBQSxhQUFhLEVBQUUwQiwyQkFBZUosVUFUYjtBQVVqQi9DLEVBQUFBLFFBQVEsRUFBRTZDLG1CQUFVTztBQVZILEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQge0JyYW5jaFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge0dpdEVycm9yfSBmcm9tICcuLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJhbmNoTWVudVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIE1vZGVsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBicmFuY2hlczogQnJhbmNoU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGNoZWNrb3V0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNyZWF0ZU5ldzogZmFsc2UsXG4gICAgY2hlY2tlZE91dEJyYW5jaDogbnVsbCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBicmFuY2hOYW1lcyA9IHRoaXMucHJvcHMuYnJhbmNoZXMuZ2V0TmFtZXMoKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgbGV0IGN1cnJlbnRCcmFuY2hOYW1lID0gdGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSA/ICdkZXRhY2hlZCcgOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2gpIHtcbiAgICAgIGN1cnJlbnRCcmFuY2hOYW1lID0gdGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoO1xuICAgICAgaWYgKGJyYW5jaE5hbWVzLmluZGV4T2YodGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoKSA9PT0gLTEpIHtcbiAgICAgICAgYnJhbmNoTmFtZXMucHVzaCh0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRpc2FibGVDb250cm9scyA9ICEhdGhpcy5zdGF0ZS5jaGVja2VkT3V0QnJhbmNoO1xuXG4gICAgY29uc3QgYnJhbmNoRWRpdG9yQ2xhc3NlcyA9IGN4KCdnaXRodWItQnJhbmNoTWVudVZpZXctaXRlbScsICdnaXRodWItQnJhbmNoTWVudVZpZXctZWRpdG9yJywge1xuICAgICAgaGlkZGVuOiAhdGhpcy5zdGF0ZS5jcmVhdGVOZXcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBicmFuY2hTZWxlY3RMaXN0Q2xhc3NlcyA9IGN4KCdnaXRodWItQnJhbmNoTWVudVZpZXctaXRlbScsICdnaXRodWItQnJhbmNoTWVudVZpZXctc2VsZWN0JywgJ2lucHV0LXNlbGVjdCcsIHtcbiAgICAgIGhpZGRlbjogISF0aGlzLnN0YXRlLmNyZWF0ZU5ldyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGljb25DbGFzc2VzID0gY3goJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtJywgJ2ljb24nLCB7XG4gICAgICAnaWNvbi1naXQtYnJhbmNoJzogIWRpc2FibGVDb250cm9scyxcbiAgICAgICdpY29uLXN5bmMnOiBkaXNhYmxlQ29udHJvbHMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBuZXdCcmFuY2hFZGl0b3IgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YnJhbmNoRWRpdG9yQ2xhc3Nlc30+XG4gICAgICAgIDxhdG9tLXRleHQtZWRpdG9yXG4gICAgICAgICAgcmVmPXtlID0+IHsgdGhpcy5lZGl0b3JFbGVtZW50ID0gZTsgfX1cbiAgICAgICAgICBtaW5pPXt0cnVlfVxuICAgICAgICAgIHJlYWRvbmx5PXtkaXNhYmxlQ29udHJvbHMgPyB0cnVlIDogdW5kZWZpbmVkfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdEJyYW5jaFZpZXcgPSAoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBqc3gtYTExeS9uby1vbmNoYW5nZSAqL1xuICAgICAgPHNlbGVjdFxuICAgICAgICBjbGFzc05hbWU9e2JyYW5jaFNlbGVjdExpc3RDbGFzc2VzfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5kaWRTZWxlY3RJdGVtfVxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZUNvbnRyb2xzfVxuICAgICAgICB2YWx1ZT17Y3VycmVudEJyYW5jaE5hbWV9PlxuICAgICAgICB7dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmlzRGV0YWNoZWQoKSAmJlxuICAgICAgICAgIDxvcHRpb24ga2V5PVwiZGV0YWNoZWRcIiB2YWx1ZT1cImRldGFjaGVkXCIgZGlzYWJsZWQ+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9vcHRpb24+XG4gICAgICAgIH1cbiAgICAgICAge2JyYW5jaE5hbWVzLm1hcChicmFuY2hOYW1lID0+IHtcbiAgICAgICAgICByZXR1cm4gPG9wdGlvbiBrZXk9e2BicmFuY2gtJHticmFuY2hOYW1lfWB9IHZhbHVlPXticmFuY2hOYW1lfT57YnJhbmNoTmFtZX08L29wdGlvbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlld1wiPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItQnJhbmNoTWVudVZpZXctZWRpdG9yIGF0b20tdGV4dC1lZGl0b3JbbWluaV1cIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwidG9vbC1wYW5lbDp1bmZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuY2FuY2VsQ3JlYXRlTmV3QnJhbmNofSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNhbmNlbFwiIGNhbGxiYWNrPXt0aGlzLmNhbmNlbENyZWF0ZU5ld0JyYW5jaH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMuY3JlYXRlQnJhbmNofSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlldy1zZWxlY3RvclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17aWNvbkNsYXNzZXN9IC8+XG4gICAgICAgICAge25ld0JyYW5jaEVkaXRvcn1cbiAgICAgICAgICB7c2VsZWN0QnJhbmNoVmlld31cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtIGdpdGh1Yi1CcmFuY2hNZW51Vmlldy1idXR0b24gYnRuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY3JlYXRlQnJhbmNofSBkaXNhYmxlZD17ZGlzYWJsZUNvbnRyb2xzfT4gTmV3IEJyYW5jaCA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZGlkU2VsZWN0SXRlbSA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBicmFuY2hOYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGF3YWl0IHRoaXMuY2hlY2tvdXQoYnJhbmNoTmFtZSk7XG4gIH1cblxuICBjcmVhdGVCcmFuY2ggPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY3JlYXRlTmV3KSB7XG4gICAgICBjb25zdCBicmFuY2hOYW1lID0gdGhpcy5lZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgIGF3YWl0IHRoaXMuY2hlY2tvdXQoYnJhbmNoTmFtZSwge2NyZWF0ZU5ldzogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y3JlYXRlTmV3OiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjaGVja291dCA9IGFzeW5jIChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgdGhpcy5lZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZvY3VzZWQnKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWRPdXRCcmFuY2g6IGJyYW5jaE5hbWV9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGVja2VkT3V0QnJhbmNoOiBudWxsLCBjcmVhdGVOZXc6IGZhbHNlfSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLnNldFRleHQoJycpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtZm9jdXNlZCcpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWRPdXRCcmFuY2g6IG51bGx9LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsQ3JlYXRlTmV3QnJhbmNoID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NyZWF0ZU5ldzogZmFsc2V9KTtcbiAgfVxufVxuIl19