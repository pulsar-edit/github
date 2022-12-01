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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kaXJlY3Rvcnktc2VsZWN0LmpzIl0sIm5hbWVzIjpbImRpYWxvZyIsInJlbW90ZSIsIkRpcmVjdG9yeVNlbGVjdCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZmlsZVBhdGhzIiwicHJvcHMiLCJzaG93T3BlbkRpYWxvZyIsImN1cnJlbnRXaW5kb3ciLCJkZWZhdWx0UGF0aCIsImJ1ZmZlciIsImdldFRleHQiLCJwcm9wZXJ0aWVzIiwibGVuZ3RoIiwic2V0VGV4dCIsInJlbmRlciIsInRhYkdyb3VwIiwiY29tbWFuZHMiLCJkaXNhYmxlZCIsImNob29zZURpcmVjdG9yeSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsTUFBTTtBQUFDQSxFQUFBQTtBQUFELElBQVdDLGdCQUFqQjs7QUFFZSxNQUFNQyxlQUFOLFNBQThCQyxlQUFNQyxTQUFwQyxDQUE4QztBQUFBO0FBQUE7O0FBQUEsNkNBdUN6QyxZQUFZO0FBQzVCLFlBQU07QUFBQ0MsUUFBQUE7QUFBRCxVQUFjLE1BQU0sS0FBS0MsS0FBTCxDQUFXQyxjQUFYLENBQTBCLEtBQUtELEtBQUwsQ0FBV0UsYUFBckMsRUFBb0Q7QUFDNUVDLFFBQUFBLFdBQVcsRUFBRSxLQUFLSCxLQUFMLENBQVdJLE1BQVgsQ0FBa0JDLE9BQWxCLEVBRCtEO0FBRTVFQyxRQUFBQSxVQUFVLEVBQUUsQ0FBQyxlQUFELEVBQWtCLGlCQUFsQixFQUFxQyxnQkFBckM7QUFGZ0UsT0FBcEQsQ0FBMUI7O0FBSUEsVUFBSVAsU0FBUyxDQUFDUSxNQUFkLEVBQXNCO0FBQ3BCLGFBQUtQLEtBQUwsQ0FBV0ksTUFBWCxDQUFrQkksT0FBbEIsQ0FBMEJULFNBQVMsQ0FBQyxDQUFELENBQW5DO0FBQ0Q7QUFDRixLQS9DMEQ7QUFBQTs7QUFpQjNEVSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFLDZCQUFDLDRCQUFEO0FBQ0UsTUFBQSxRQUFRLEVBQUUsS0FBS1QsS0FBTCxDQUFXVSxRQUR2QjtBQUVFLE1BQUEsUUFBUSxFQUFFLEtBQUtWLEtBQUwsQ0FBV1csUUFGdkI7QUFHRSxNQUFBLFNBQVMsRUFBQyx3Q0FIWjtBQUlFLE1BQUEsSUFBSSxFQUFFLElBSlI7QUFLRSxNQUFBLFFBQVEsRUFBRSxLQUFLWCxLQUFMLENBQVdZLFFBTHZCO0FBTUUsTUFBQSxNQUFNLEVBQUUsS0FBS1osS0FBTCxDQUFXSTtBQU5yQixNQURGLEVBU0UsNkJBQUMsd0JBQUQ7QUFDRSxNQUFBLFFBQVEsRUFBRSxLQUFLSixLQUFMLENBQVdVLFFBRHZCO0FBRUUsTUFBQSxRQUFRLEVBQUUsS0FBS1YsS0FBTCxDQUFXVyxRQUZ2QjtBQUdFLE1BQUEsU0FBUyxFQUFDLHdEQUhaO0FBSUUsTUFBQSxRQUFRLEVBQUUsS0FBS1gsS0FBTCxDQUFXWSxRQUp2QjtBQUtFLE1BQUEsT0FBTyxFQUFFLEtBQUtDO0FBTGhCLE1BVEYsQ0FERjtBQW1CRDs7QUFyQzBEOzs7O2dCQUF4Q2pCLGUsZUFDQTtBQUNqQlEsRUFBQUEsTUFBTSxFQUFFVSxtQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVqQkosRUFBQUEsUUFBUSxFQUFFRSxtQkFBVUcsSUFGSDtBQUdqQmhCLEVBQUFBLGNBQWMsRUFBRWEsbUJBQVVJLElBSFQ7QUFJakJSLEVBQUFBLFFBQVEsRUFBRUksbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSlY7QUFNakI7QUFDQWQsRUFBQUEsYUFBYSxFQUFFWSxtQkFBVUMsTUFBVixDQUFpQkMsVUFQZjtBQVFqQkwsRUFBQUEsUUFBUSxFQUFFRyxtQkFBVUMsTUFBVixDQUFpQkM7QUFSVixDOztnQkFEQXBCLGUsa0JBWUc7QUFDcEJnQixFQUFBQSxRQUFRLEVBQUUsS0FEVTtBQUVwQlgsRUFBQUEsY0FBYztBQUFFO0FBQTJCLEdBQUMsR0FBR2tCLElBQUosS0FBYXpCLE1BQU0sQ0FBQ08sY0FBUCxDQUFzQixHQUFHa0IsSUFBekI7QUFGcEMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHtUYWJiYWJsZVRleHRFZGl0b3IsIFRhYmJhYmxlQnV0dG9ufSBmcm9tICcuL3RhYmJhYmxlJztcblxuY29uc3Qge2RpYWxvZ30gPSByZW1vdGU7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpcmVjdG9yeVNlbGVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIHNob3dPcGVuRGlhbG9nOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0YWJHcm91cDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgc2hvd09wZW5EaWFsb2c6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICguLi5hcmdzKSA9PiBkaWFsb2cuc2hvd09wZW5EaWFsb2coLi4uYXJncyksXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZy1yb3dcIj5cbiAgICAgICAgPFRhYmJhYmxlVGV4dEVkaXRvclxuICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1EaXJlY3RvcnlTZWxlY3QtZGVzdGluYXRpb25QYXRoXCJcbiAgICAgICAgICBtaW5pPXt0cnVlfVxuICAgICAgICAgIHJlYWRPbmx5PXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5idWZmZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxUYWJiYWJsZUJ1dHRvblxuICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24tZmlsZS1kaXJlY3RvcnkgZ2l0aHViLURpYWxvZy1yaWdodEJ1bXBlclwiXG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5jaG9vc2VEaXJlY3Rvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY2hvb3NlRGlyZWN0b3J5ID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHtmaWxlUGF0aHN9ID0gYXdhaXQgdGhpcy5wcm9wcy5zaG93T3BlbkRpYWxvZyh0aGlzLnByb3BzLmN1cnJlbnRXaW5kb3csIHtcbiAgICAgIGRlZmF1bHRQYXRoOiB0aGlzLnByb3BzLmJ1ZmZlci5nZXRUZXh0KCksXG4gICAgICBwcm9wZXJ0aWVzOiBbJ29wZW5EaXJlY3RvcnknLCAnY3JlYXRlRGlyZWN0b3J5JywgJ3Byb21wdFRvQ3JlYXRlJ10sXG4gICAgfSk7XG4gICAgaWYgKGZpbGVQYXRocy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucHJvcHMuYnVmZmVyLnNldFRleHQoZmlsZVBhdGhzWzBdKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==