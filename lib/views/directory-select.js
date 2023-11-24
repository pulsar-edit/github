"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _tabbable = require("./tabbable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const remote = require('@electron/remote');

const {
  dialog
} = remote;

class DirectorySelect extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "chooseDirectory", async () => {
      const {
        filePaths
      } = await this.props.showOpenDialog(this.props.currentWindow, {
        defaultPath: this.props.buffer.getText(),
        properties: ['openDirectory', 'createDirectory', 'promptToCreate']
      });

      if (filePaths.length) {
        this.props.buffer.setText(filePaths[0]);
      }
    });
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-Dialog-row"
    }, _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "github-DirectorySelect-destinationPath",
      mini: true,
      readOnly: this.props.disabled,
      buffer: this.props.buffer
    }), _react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "btn icon icon-file-directory github-Dialog-rightBumper",
      disabled: this.props.disabled,
      onClick: this.chooseDirectory
    }));
  }

}

exports.default = DirectorySelect;

_defineProperty(DirectorySelect, "propTypes", {
  buffer: _propTypes.default.object.isRequired,
  disabled: _propTypes.default.bool,
  showOpenDialog: _propTypes.default.func,
  tabGroup: _propTypes.default.object.isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});

_defineProperty(DirectorySelect, "defaultProps", {
  disabled: false,
  showOpenDialog:
  /* istanbul ignore next */
  (...args) => dialog.showOpenDialog(...args)
});