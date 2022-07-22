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

    const newBranchEditor = /*#__PURE__*/_react.default.createElement("div", {
      className: branchEditorClasses
    }, /*#__PURE__*/_react.default.createElement("atom-text-editor", {
      ref: e => {
        this.editorElement = e;
      },
      mini: true,
      readonly: disableControls ? true : undefined
    }));

    const selectBranchView =
    /*#__PURE__*/

    /* eslint-disable jsx-a11y/no-onchange */
    _react.default.createElement("select", {
      className: branchSelectListClasses,
      onChange: this.didSelectItem,
      disabled: disableControls,
      value: currentBranchName
    }, this.props.currentBranch.isDetached() && /*#__PURE__*/_react.default.createElement("option", {
      key: "detached",
      value: "detached",
      disabled: true
    }, this.props.currentBranch.getName()), branchNames.map(branchName => {
      return /*#__PURE__*/_react.default.createElement("option", {
        key: `branch-${branchName}`,
        value: branchName
      }, branchName);
    }));

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-BranchMenuView"
    }, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-BranchMenuView-editor atom-text-editor[mini]"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "tool-panel:unfocus",
      callback: this.cancelCreateNewBranch
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.cancelCreateNewBranch
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.createBranch
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-BranchMenuView-selector"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: iconClasses
    }), newBranchEditor, selectBranchView, /*#__PURE__*/_react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9icmFuY2gtbWVudS12aWV3LmpzIl0sIm5hbWVzIjpbIkJyYW5jaE1lbnVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjcmVhdGVOZXciLCJjaGVja2VkT3V0QnJhbmNoIiwiZXZlbnQiLCJicmFuY2hOYW1lIiwidGFyZ2V0IiwidmFsdWUiLCJjaGVja291dCIsInN0YXRlIiwiZWRpdG9yRWxlbWVudCIsImdldE1vZGVsIiwiZ2V0VGV4dCIsInRyaW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFN0YXRlIiwiZm9jdXMiLCJvcHRpb25zIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwicHJvcHMiLCJzZXRUZXh0IiwiZXJyb3IiLCJhZGQiLCJHaXRFcnJvciIsInJlbmRlciIsImJyYW5jaE5hbWVzIiwiYnJhbmNoZXMiLCJnZXROYW1lcyIsImZpbHRlciIsIkJvb2xlYW4iLCJjdXJyZW50QnJhbmNoTmFtZSIsImN1cnJlbnRCcmFuY2giLCJpc0RldGFjaGVkIiwiZ2V0TmFtZSIsImluZGV4T2YiLCJwdXNoIiwiZGlzYWJsZUNvbnRyb2xzIiwiYnJhbmNoRWRpdG9yQ2xhc3NlcyIsImhpZGRlbiIsImJyYW5jaFNlbGVjdExpc3RDbGFzc2VzIiwiaWNvbkNsYXNzZXMiLCJuZXdCcmFuY2hFZGl0b3IiLCJlIiwidW5kZWZpbmVkIiwic2VsZWN0QnJhbmNoVmlldyIsImRpZFNlbGVjdEl0ZW0iLCJtYXAiLCJjb21tYW5kcyIsImNhbmNlbENyZWF0ZU5ld0JyYW5jaCIsImNyZWF0ZUJyYW5jaCIsIndvcmtzcGFjZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJub3RpZmljYXRpb25NYW5hZ2VyIiwicmVwb3NpdG9yeSIsIkJyYW5jaFNldFByb3BUeXBlIiwiQnJhbmNoUHJvcFR5cGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFF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RUFHR0csZ0JBSEgsZUFJRTtBQUFRLE1BQUEsU0FBUyxFQUFDLDZEQUFsQjtBQUNFLE1BQUEsT0FBTyxFQUFFLEtBQUtLLFlBRGhCO0FBQzhCLE1BQUEsUUFBUSxFQUFFYjtBQUR4QyxzQkFKRixDQU5GLENBREY7QUFnQkQ7O0FBdEZ5RDs7OztnQkFBdkN2QyxjLGVBQ0E7QUFDakI7QUFDQXFELEVBQUFBLFNBQVMsRUFBRUMsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRlg7QUFHakJOLEVBQUFBLFFBQVEsRUFBRUksbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSFY7QUFJakJDLEVBQUFBLG1CQUFtQixFQUFFSCxtQkFBVUMsTUFBVixDQUFpQkMsVUFKckI7QUFNakI7QUFDQUUsRUFBQUEsVUFBVSxFQUFFSixtQkFBVUMsTUFQTDtBQVFqQjFCLEVBQUFBLFFBQVEsRUFBRThCLDhCQUFrQkgsVUFSWDtBQVNqQnRCLEVBQUFBLGFBQWEsRUFBRTBCLDJCQUFlSixVQVRiO0FBVWpCL0MsRUFBQUEsUUFBUSxFQUFFNkMsbUJBQVVPO0FBVkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCB7QnJhbmNoUHJvcFR5cGUsIEJyYW5jaFNldFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7R2l0RXJyb3J9IGZyb20gJy4uL2dpdC1zaGVsbC1vdXQtc3RyYXRlZ3knO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuY2hNZW51VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGJyYW5jaGVzOiBCcmFuY2hTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IEJyYW5jaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY2hlY2tvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgY3JlYXRlTmV3OiBmYWxzZSxcbiAgICBjaGVja2VkT3V0QnJhbmNoOiBudWxsLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGJyYW5jaE5hbWVzID0gdGhpcy5wcm9wcy5icmFuY2hlcy5nZXROYW1lcygpLmZpbHRlcihCb29sZWFuKTtcbiAgICBsZXQgY3VycmVudEJyYW5jaE5hbWUgPSB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpID8gJ2RldGFjaGVkJyA6IHRoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUuY2hlY2tlZE91dEJyYW5jaCkge1xuICAgICAgY3VycmVudEJyYW5jaE5hbWUgPSB0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2g7XG4gICAgICBpZiAoYnJhbmNoTmFtZXMuaW5kZXhPZih0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2gpID09PSAtMSkge1xuICAgICAgICBicmFuY2hOYW1lcy5wdXNoKHRoaXMuc3RhdGUuY2hlY2tlZE91dEJyYW5jaCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGlzYWJsZUNvbnRyb2xzID0gISF0aGlzLnN0YXRlLmNoZWNrZWRPdXRCcmFuY2g7XG5cbiAgICBjb25zdCBicmFuY2hFZGl0b3JDbGFzc2VzID0gY3goJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtJywgJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1lZGl0b3InLCB7XG4gICAgICBoaWRkZW46ICF0aGlzLnN0YXRlLmNyZWF0ZU5ldyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJyYW5jaFNlbGVjdExpc3RDbGFzc2VzID0gY3goJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1pdGVtJywgJ2dpdGh1Yi1CcmFuY2hNZW51Vmlldy1zZWxlY3QnLCAnaW5wdXQtc2VsZWN0Jywge1xuICAgICAgaGlkZGVuOiAhIXRoaXMuc3RhdGUuY3JlYXRlTmV3LFxuICAgIH0pO1xuXG4gICAgY29uc3QgaWNvbkNsYXNzZXMgPSBjeCgnZ2l0aHViLUJyYW5jaE1lbnVWaWV3LWl0ZW0nLCAnaWNvbicsIHtcbiAgICAgICdpY29uLWdpdC1icmFuY2gnOiAhZGlzYWJsZUNvbnRyb2xzLFxuICAgICAgJ2ljb24tc3luYyc6IGRpc2FibGVDb250cm9scyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5ld0JyYW5jaEVkaXRvciA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXticmFuY2hFZGl0b3JDbGFzc2VzfT5cbiAgICAgICAgPGF0b20tdGV4dC1lZGl0b3JcbiAgICAgICAgICByZWY9e2UgPT4geyB0aGlzLmVkaXRvckVsZW1lbnQgPSBlOyB9fVxuICAgICAgICAgIG1pbmk9e3RydWV9XG4gICAgICAgICAgcmVhZG9ubHk9e2Rpc2FibGVDb250cm9scyA/IHRydWUgOiB1bmRlZmluZWR9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgY29uc3Qgc2VsZWN0QnJhbmNoVmlldyA9IChcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGpzeC1hMTF5L25vLW9uY2hhbmdlICovXG4gICAgICA8c2VsZWN0XG4gICAgICAgIGNsYXNzTmFtZT17YnJhbmNoU2VsZWN0TGlzdENsYXNzZXN9XG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmRpZFNlbGVjdEl0ZW19XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlQ29udHJvbHN9XG4gICAgICAgIHZhbHVlPXtjdXJyZW50QnJhbmNoTmFtZX0+XG4gICAgICAgIHt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpICYmXG4gICAgICAgICAgPG9wdGlvbiBrZXk9XCJkZXRhY2hlZFwiIHZhbHVlPVwiZGV0YWNoZWRcIiBkaXNhYmxlZD57dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLmdldE5hbWUoKX08L29wdGlvbj5cbiAgICAgICAgfVxuICAgICAgICB7YnJhbmNoTmFtZXMubWFwKGJyYW5jaE5hbWUgPT4ge1xuICAgICAgICAgIHJldHVybiA8b3B0aW9uIGtleT17YGJyYW5jaC0ke2JyYW5jaE5hbWV9YH0gdmFsdWU9e2JyYW5jaE5hbWV9PnticmFuY2hOYW1lfTwvb3B0aW9uPjtcbiAgICAgICAgfSl9XG4gICAgICA8L3NlbGVjdD5cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUJyYW5jaE1lbnVWaWV3XCI+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1CcmFuY2hNZW51Vmlldy1lZGl0b3IgYXRvbS10ZXh0LWVkaXRvclttaW5pXVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJ0b29sLXBhbmVsOnVuZm9jdXNcIiBjYWxsYmFjaz17dGhpcy5jYW5jZWxDcmVhdGVOZXdCcmFuY2h9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y2FuY2VsXCIgY2FsbGJhY2s9e3RoaXMuY2FuY2VsQ3JlYXRlTmV3QnJhbmNofSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5jcmVhdGVCcmFuY2h9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUJyYW5jaE1lbnVWaWV3LXNlbGVjdG9yXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtpY29uQ2xhc3Nlc30gLz5cbiAgICAgICAgICB7bmV3QnJhbmNoRWRpdG9yfVxuICAgICAgICAgIHtzZWxlY3RCcmFuY2hWaWV3fVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUJyYW5jaE1lbnVWaWV3LWl0ZW0gZ2l0aHViLUJyYW5jaE1lbnVWaWV3LWJ1dHRvbiBidG5cIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jcmVhdGVCcmFuY2h9IGRpc2FibGVkPXtkaXNhYmxlQ29udHJvbHN9PiBOZXcgQnJhbmNoIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBkaWRTZWxlY3RJdGVtID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGJyYW5jaE5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgYXdhaXQgdGhpcy5jaGVja291dChicmFuY2hOYW1lKTtcbiAgfVxuXG4gIGNyZWF0ZUJyYW5jaCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jcmVhdGVOZXcpIHtcbiAgICAgIGNvbnN0IGJyYW5jaE5hbWUgPSB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5nZXRUZXh0KCkudHJpbSgpO1xuICAgICAgYXdhaXQgdGhpcy5jaGVja291dChicmFuY2hOYW1lLCB7Y3JlYXRlTmV3OiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtjcmVhdGVOZXc6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lZGl0b3JFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrb3V0ID0gYXN5bmMgKGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZm9jdXNlZCcpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hlY2tlZE91dEJyYW5jaDogYnJhbmNoTmFtZX0sIHJlc29sdmUpO1xuICAgIH0pO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmNoZWNrb3V0KGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWRPdXRCcmFuY2g6IG51bGwsIGNyZWF0ZU5ldzogZmFsc2V9LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lZGl0b3JFbGVtZW50LmdldE1vZGVsKCkuc2V0VGV4dCgnJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1mb2N1c2VkJyk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hlY2tlZE91dEJyYW5jaDogbnVsbH0sIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEdpdEVycm9yKSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5jZWxDcmVhdGVOZXdCcmFuY2ggPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y3JlYXRlTmV3OiBmYWxzZX0pO1xuICB9XG59XG4iXX0=