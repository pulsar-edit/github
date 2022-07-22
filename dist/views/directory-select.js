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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Dialog-row"
    }, /*#__PURE__*/_react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "github-DirectorySelect-destinationPath",
      mini: true,
      readOnly: this.props.disabled,
      buffer: this.props.buffer
    }), /*#__PURE__*/_react.default.createElement(_tabbable.TabbableButton, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kaXJlY3Rvcnktc2VsZWN0LmpzIl0sIm5hbWVzIjpbImRpYWxvZyIsInJlbW90ZSIsIkRpcmVjdG9yeVNlbGVjdCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZmlsZVBhdGhzIiwicHJvcHMiLCJzaG93T3BlbkRpYWxvZyIsImN1cnJlbnRXaW5kb3ciLCJkZWZhdWx0UGF0aCIsImJ1ZmZlciIsImdldFRleHQiLCJwcm9wZXJ0aWVzIiwibGVuZ3RoIiwic2V0VGV4dCIsInJlbmRlciIsInRhYkdyb3VwIiwiY29tbWFuZHMiLCJkaXNhYmxlZCIsImNob29zZURpcmVjdG9yeSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsTUFBTTtBQUFDQSxFQUFBQTtBQUFELElBQVdDLGdCQUFqQjs7QUFFZSxNQUFNQyxlQUFOLFNBQThCQyxlQUFNQyxTQUFwQyxDQUE4QztBQUFBO0FBQUE7O0FBQUEsNkNBdUN6QyxZQUFZO0FBQzVCLFlBQU07QUFBQ0MsUUFBQUE7QUFBRCxVQUFjLE1BQU0sS0FBS0MsS0FBTCxDQUFXQyxjQUFYLENBQTBCLEtBQUtELEtBQUwsQ0FBV0UsYUFBckMsRUFBb0Q7QUFDNUVDLFFBQUFBLFdBQVcsRUFBRSxLQUFLSCxLQUFMLENBQVdJLE1BQVgsQ0FBa0JDLE9BQWxCLEVBRCtEO0FBRTVFQyxRQUFBQSxVQUFVLEVBQUUsQ0FBQyxlQUFELEVBQWtCLGlCQUFsQixFQUFxQyxnQkFBckM7QUFGZ0UsT0FBcEQsQ0FBMUI7O0FBSUEsVUFBSVAsU0FBUyxDQUFDUSxNQUFkLEVBQXNCO0FBQ3BCLGFBQUtQLEtBQUwsQ0FBV0ksTUFBWCxDQUFrQkksT0FBbEIsQ0FBMEJULFNBQVMsQ0FBQyxDQUFELENBQW5DO0FBQ0Q7QUFDRixLQS9DMEQ7QUFBQTs7QUFpQjNEVSxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsNkJBQUMsNEJBQUQ7QUFDRSxNQUFBLFFBQVEsRUFBRSxLQUFLVCxLQUFMLENBQVdVLFFBRHZCO0FBRUUsTUFBQSxRQUFRLEVBQUUsS0FBS1YsS0FBTCxDQUFXVyxRQUZ2QjtBQUdFLE1BQUEsU0FBUyxFQUFDLHdDQUhaO0FBSUUsTUFBQSxJQUFJLEVBQUUsSUFKUjtBQUtFLE1BQUEsUUFBUSxFQUFFLEtBQUtYLEtBQUwsQ0FBV1ksUUFMdkI7QUFNRSxNQUFBLE1BQU0sRUFBRSxLQUFLWixLQUFMLENBQVdJO0FBTnJCLE1BREYsZUFTRSw2QkFBQyx3QkFBRDtBQUNFLE1BQUEsUUFBUSxFQUFFLEtBQUtKLEtBQUwsQ0FBV1UsUUFEdkI7QUFFRSxNQUFBLFFBQVEsRUFBRSxLQUFLVixLQUFMLENBQVdXLFFBRnZCO0FBR0UsTUFBQSxTQUFTLEVBQUMsd0RBSFo7QUFJRSxNQUFBLFFBQVEsRUFBRSxLQUFLWCxLQUFMLENBQVdZLFFBSnZCO0FBS0UsTUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFMaEIsTUFURixDQURGO0FBbUJEOztBQXJDMEQ7Ozs7Z0JBQXhDakIsZSxlQUNBO0FBQ2pCUSxFQUFBQSxNQUFNLEVBQUVVLG1CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWpCSixFQUFBQSxRQUFRLEVBQUVFLG1CQUFVRyxJQUZIO0FBR2pCaEIsRUFBQUEsY0FBYyxFQUFFYSxtQkFBVUksSUFIVDtBQUlqQlIsRUFBQUEsUUFBUSxFQUFFSSxtQkFBVUMsTUFBVixDQUFpQkMsVUFKVjtBQU1qQjtBQUNBZCxFQUFBQSxhQUFhLEVBQUVZLG1CQUFVQyxNQUFWLENBQWlCQyxVQVBmO0FBUWpCTCxFQUFBQSxRQUFRLEVBQUVHLG1CQUFVQyxNQUFWLENBQWlCQztBQVJWLEM7O2dCQURBcEIsZSxrQkFZRztBQUNwQmdCLEVBQUFBLFFBQVEsRUFBRSxLQURVO0FBRXBCWCxFQUFBQSxjQUFjO0FBQUU7QUFBMkIsR0FBQyxHQUFHa0IsSUFBSixLQUFhekIsTUFBTSxDQUFDTyxjQUFQLENBQXNCLEdBQUdrQixJQUF6QjtBQUZwQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQge1RhYmJhYmxlVGV4dEVkaXRvciwgVGFiYmFibGVCdXR0b259IGZyb20gJy4vdGFiYmFibGUnO1xuXG5jb25zdCB7ZGlhbG9nfSA9IHJlbW90ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlyZWN0b3J5U2VsZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBidWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgc2hvd09wZW5EaWFsb2c6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRhYkdyb3VwOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgY3VycmVudFdpbmRvdzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICBzaG93T3BlbkRpYWxvZzogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gKC4uLmFyZ3MpID0+IGRpYWxvZy5zaG93T3BlbkRpYWxvZyguLi5hcmdzKSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nLXJvd1wiPlxuICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLURpcmVjdG9yeVNlbGVjdC1kZXN0aW5hdGlvblBhdGhcIlxuICAgICAgICAgIG1pbmk9e3RydWV9XG4gICAgICAgICAgcmVhZE9ubHk9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgYnVmZmVyPXt0aGlzLnByb3BzLmJ1ZmZlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPFRhYmJhYmxlQnV0dG9uXG4gICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1maWxlLWRpcmVjdG9yeSBnaXRodWItRGlhbG9nLXJpZ2h0QnVtcGVyXCJcbiAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNob29zZURpcmVjdG9yeX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjaG9vc2VEaXJlY3RvcnkgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qge2ZpbGVQYXRoc30gPSBhd2FpdCB0aGlzLnByb3BzLnNob3dPcGVuRGlhbG9nKHRoaXMucHJvcHMuY3VycmVudFdpbmRvdywge1xuICAgICAgZGVmYXVsdFBhdGg6IHRoaXMucHJvcHMuYnVmZmVyLmdldFRleHQoKSxcbiAgICAgIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeScsICdjcmVhdGVEaXJlY3RvcnknLCAncHJvbXB0VG9DcmVhdGUnXSxcbiAgICB9KTtcbiAgICBpZiAoZmlsZVBhdGhzLmxlbmd0aCkge1xuICAgICAgdGhpcy5wcm9wcy5idWZmZXIuc2V0VGV4dChmaWxlUGF0aHNbMF0pO1xuICAgIH1cbiAgfVxufVxuIl19