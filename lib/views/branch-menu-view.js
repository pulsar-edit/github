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