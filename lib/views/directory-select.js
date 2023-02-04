"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _electron = require("electron");
var _tabbable = require("./tabbable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const {
  dialog
} = _electron.remote;
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
  showOpenDialog: /* istanbul ignore next */(...args) => dialog.showOpenDialog(...args)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJkaWFsb2ciLCJyZW1vdGUiLCJEaXJlY3RvcnlTZWxlY3QiLCJSZWFjdCIsIkNvbXBvbmVudCIsImZpbGVQYXRocyIsInByb3BzIiwic2hvd09wZW5EaWFsb2ciLCJjdXJyZW50V2luZG93IiwiZGVmYXVsdFBhdGgiLCJidWZmZXIiLCJnZXRUZXh0IiwicHJvcGVydGllcyIsImxlbmd0aCIsInNldFRleHQiLCJyZW5kZXIiLCJ0YWJHcm91cCIsImNvbW1hbmRzIiwiZGlzYWJsZWQiLCJjaG9vc2VEaXJlY3RvcnkiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImZ1bmMiLCJhcmdzIl0sInNvdXJjZXMiOlsiZGlyZWN0b3J5LXNlbGVjdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCB7VGFiYmFibGVUZXh0RWRpdG9yLCBUYWJiYWJsZUJ1dHRvbn0gZnJvbSAnLi90YWJiYWJsZSc7XG5cbmNvbnN0IHtkaWFsb2d9ID0gcmVtb3RlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXJlY3RvcnlTZWxlY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzaG93T3BlbkRpYWxvZzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdGFiR3JvdXA6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjdXJyZW50V2luZG93OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgIHNob3dPcGVuRGlhbG9nOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoLi4uYXJncykgPT4gZGlhbG9nLnNob3dPcGVuRGlhbG9nKC4uLmFyZ3MpLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2ctcm93XCI+XG4gICAgICAgIDxUYWJiYWJsZVRleHRFZGl0b3JcbiAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRGlyZWN0b3J5U2VsZWN0LWRlc3RpbmF0aW9uUGF0aFwiXG4gICAgICAgICAgbWluaT17dHJ1ZX1cbiAgICAgICAgICByZWFkT25seT17dGhpcy5wcm9wcy5kaXNhYmxlZH1cbiAgICAgICAgICBidWZmZXI9e3RoaXMucHJvcHMuYnVmZmVyfVxuICAgICAgICAvPlxuICAgICAgICA8VGFiYmFibGVCdXR0b25cbiAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gaWNvbiBpY29uLWZpbGUtZGlyZWN0b3J5IGdpdGh1Yi1EaWFsb2ctcmlnaHRCdW1wZXJcIlxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hvb3NlRGlyZWN0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGNob29zZURpcmVjdG9yeSA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7ZmlsZVBhdGhzfSA9IGF3YWl0IHRoaXMucHJvcHMuc2hvd09wZW5EaWFsb2codGhpcy5wcm9wcy5jdXJyZW50V2luZG93LCB7XG4gICAgICBkZWZhdWx0UGF0aDogdGhpcy5wcm9wcy5idWZmZXIuZ2V0VGV4dCgpLFxuICAgICAgcHJvcGVydGllczogWydvcGVuRGlyZWN0b3J5JywgJ2NyZWF0ZURpcmVjdG9yeScsICdwcm9tcHRUb0NyZWF0ZSddLFxuICAgIH0pO1xuICAgIGlmIChmaWxlUGF0aHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnByb3BzLmJ1ZmZlci5zZXRUZXh0KGZpbGVQYXRoc1swXSk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQThEO0FBQUE7QUFBQTtBQUFBO0FBRTlELE1BQU07RUFBQ0E7QUFBTSxDQUFDLEdBQUdDLGdCQUFNO0FBRVIsTUFBTUMsZUFBZSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQUFBO0lBQUE7SUFBQSx5Q0F1Q3pDLFlBQVk7TUFDNUIsTUFBTTtRQUFDQztNQUFTLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxjQUFjLENBQUMsSUFBSSxDQUFDRCxLQUFLLENBQUNFLGFBQWEsRUFBRTtRQUM1RUMsV0FBVyxFQUFFLElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxNQUFNLENBQUNDLE9BQU8sRUFBRTtRQUN4Q0MsVUFBVSxFQUFFLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQjtNQUNuRSxDQUFDLENBQUM7TUFDRixJQUFJUCxTQUFTLENBQUNRLE1BQU0sRUFBRTtRQUNwQixJQUFJLENBQUNQLEtBQUssQ0FBQ0ksTUFBTSxDQUFDSSxPQUFPLENBQUNULFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN6QztJQUNGLENBQUM7RUFBQTtFQTlCRFUsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUFtQixHQUNoQyw2QkFBQyw0QkFBa0I7TUFDakIsUUFBUSxFQUFFLElBQUksQ0FBQ1QsS0FBSyxDQUFDVSxRQUFTO01BQzlCLFFBQVEsRUFBRSxJQUFJLENBQUNWLEtBQUssQ0FBQ1csUUFBUztNQUM5QixTQUFTLEVBQUMsd0NBQXdDO01BQ2xELElBQUksRUFBRSxJQUFLO01BQ1gsUUFBUSxFQUFFLElBQUksQ0FBQ1gsS0FBSyxDQUFDWSxRQUFTO01BQzlCLE1BQU0sRUFBRSxJQUFJLENBQUNaLEtBQUssQ0FBQ0k7SUFBTyxFQUMxQixFQUNGLDZCQUFDLHdCQUFjO01BQ2IsUUFBUSxFQUFFLElBQUksQ0FBQ0osS0FBSyxDQUFDVSxRQUFTO01BQzlCLFFBQVEsRUFBRSxJQUFJLENBQUNWLEtBQUssQ0FBQ1csUUFBUztNQUM5QixTQUFTLEVBQUMsd0RBQXdEO01BQ2xFLFFBQVEsRUFBRSxJQUFJLENBQUNYLEtBQUssQ0FBQ1ksUUFBUztNQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDQztJQUFnQixFQUM5QixDQUNFO0VBRVY7QUFXRjtBQUFDO0FBQUEsZ0JBaERvQmpCLGVBQWUsZUFDZjtFQUNqQlEsTUFBTSxFQUFFVSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDbkNKLFFBQVEsRUFBRUUsa0JBQVMsQ0FBQ0csSUFBSTtFQUN4QmhCLGNBQWMsRUFBRWEsa0JBQVMsQ0FBQ0ksSUFBSTtFQUM5QlIsUUFBUSxFQUFFSSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFFckM7RUFDQWQsYUFBYSxFQUFFWSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDMUNMLFFBQVEsRUFBRUcsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQztBQUM3QixDQUFDO0FBQUEsZ0JBVmtCcEIsZUFBZSxrQkFZWjtFQUNwQmdCLFFBQVEsRUFBRSxLQUFLO0VBQ2ZYLGNBQWMsRUFBRSwwQkFBMkIsQ0FBQyxHQUFHa0IsSUFBSSxLQUFLekIsTUFBTSxDQUFDTyxjQUFjLENBQUMsR0FBR2tCLElBQUk7QUFDdkYsQ0FBQyJ9