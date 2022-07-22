"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _tabbable = require("./tabbable");

var _dialogView = _interopRequireDefault(require("./dialog-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InitDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const destPath = this.destinationPath.getText();

      if (destPath.length === 0) {
        return Promise.resolve();
      }

      return this.props.request.accept(destPath);
    });

    _defineProperty(this, "setAcceptEnablement", () => {
      const enablement = !this.destinationPath.isEmpty();

      if (enablement !== this.state.acceptEnabled) {
        this.setState({
          acceptEnabled: enablement
        });
      }
    });

    this.tabGroup = new _tabGroup.default();
    this.destinationPath = new _atom.TextBuffer({
      text: this.props.request.getParams().dirPath
    });
    this.sub = this.destinationPath.onDidChange(this.setAcceptEnablement);
    this.state = {
      acceptEnabled: !this.destinationPath.isEmpty()
    };
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_dialogView.default, {
      progressMessage: "Initializing...",
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-repo-create",
      acceptText: "Init",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Initialize git repository in directory", /*#__PURE__*/_react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      preselect: true,
      readOnly: this.props.inProgress,
      buffer: this.destinationPath
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

}

exports.default = InitDialog;

_defineProperty(InitDialog, "propTypes", {
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  inProgress: _propTypes.default.bool,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pbml0LWRpYWxvZy5qcyJdLCJuYW1lcyI6WyJJbml0RGlhbG9nIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZGVzdFBhdGgiLCJkZXN0aW5hdGlvblBhdGgiLCJnZXRUZXh0IiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXF1ZXN0IiwiYWNjZXB0IiwiZW5hYmxlbWVudCIsImlzRW1wdHkiLCJzdGF0ZSIsImFjY2VwdEVuYWJsZWQiLCJzZXRTdGF0ZSIsInRhYkdyb3VwIiwiVGFiR3JvdXAiLCJUZXh0QnVmZmVyIiwidGV4dCIsImdldFBhcmFtcyIsImRpclBhdGgiLCJzdWIiLCJvbkRpZENoYW5nZSIsInNldEFjY2VwdEVuYWJsZW1lbnQiLCJyZW5kZXIiLCJjYW5jZWwiLCJpblByb2dyZXNzIiwiZXJyb3IiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImNvbXBvbmVudERpZE1vdW50IiwiYXV0b2ZvY3VzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUFnQnREQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQixvQ0F3RFYsTUFBTTtBQUNiLFlBQU1DLFFBQVEsR0FBRyxLQUFLQyxlQUFMLENBQXFCQyxPQUFyQixFQUFqQjs7QUFDQSxVQUFJRixRQUFRLENBQUNHLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsZUFBT0MsT0FBTyxDQUFDQyxPQUFSLEVBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUtO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RU0sbUJBQVVPLE1BQVYsQ0FBaUJKLFVBWFg7QUFZakJSLEVBQUFBLFFBQVEsRUFBRUssbUJBQVVPLE1BQVYsQ0FBaUJKO0FBWlYsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IFRhYkdyb3VwIGZyb20gJy4uL3RhYi1ncm91cCc7XG5pbXBvcnQge1RhYmJhYmxlVGV4dEVkaXRvcn0gZnJvbSAnLi90YWJiYWJsZSc7XG5pbXBvcnQgRGlhbG9nVmlldyBmcm9tICcuL2RpYWxvZy12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5pdERpYWxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICByZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZ2V0UGFyYW1zOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgYWNjZXB0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgY2FuY2VsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgaW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wsXG4gICAgZXJyb3I6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEVycm9yKSxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnRhYkdyb3VwID0gbmV3IFRhYkdyb3VwKCk7XG5cbiAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aCA9IG5ldyBUZXh0QnVmZmVyKHtcbiAgICAgIHRleHQ6IHRoaXMucHJvcHMucmVxdWVzdC5nZXRQYXJhbXMoKS5kaXJQYXRoLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zdWIgPSB0aGlzLmRlc3RpbmF0aW9uUGF0aC5vbkRpZENoYW5nZSh0aGlzLnNldEFjY2VwdEVuYWJsZW1lbnQpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjY2VwdEVuYWJsZWQ6ICF0aGlzLmRlc3RpbmF0aW9uUGF0aC5pc0VtcHR5KCksXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERpYWxvZ1ZpZXdcbiAgICAgICAgcHJvZ3Jlc3NNZXNzYWdlPVwiSW5pdGlhbGl6aW5nLi4uXCJcbiAgICAgICAgYWNjZXB0RW5hYmxlZD17dGhpcy5zdGF0ZS5hY2NlcHRFbmFibGVkfVxuICAgICAgICBhY2NlcHRDbGFzc05hbWU9XCJpY29uIGljb24tcmVwby1jcmVhdGVcIlxuICAgICAgICBhY2NlcHRUZXh0PVwiSW5pdFwiXG4gICAgICAgIGFjY2VwdD17dGhpcy5hY2NlcHR9XG4gICAgICAgIGNhbmNlbD17dGhpcy5wcm9wcy5yZXF1ZXN0LmNhbmNlbH1cbiAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgIGluUHJvZ3Jlc3M9e3RoaXMucHJvcHMuaW5Qcm9ncmVzc31cbiAgICAgICAgZXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfT5cblxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsXCI+XG4gICAgICAgICAgSW5pdGlhbGl6ZSBnaXQgcmVwb3NpdG9yeSBpbiBkaXJlY3RvcnlcbiAgICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgICB0YWJHcm91cD17dGhpcy50YWJHcm91cH1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgYXV0b2ZvY3VzXG4gICAgICAgICAgICBtaW5pXG4gICAgICAgICAgICBwcmVzZWxlY3RcbiAgICAgICAgICAgIHJlYWRPbmx5PXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgICAgICBidWZmZXI9e3RoaXMuZGVzdGluYXRpb25QYXRofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgIDwvRGlhbG9nVmlldz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50YWJHcm91cC5hdXRvZm9jdXMoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFjY2VwdCA9ICgpID0+IHtcbiAgICBjb25zdCBkZXN0UGF0aCA9IHRoaXMuZGVzdGluYXRpb25QYXRoLmdldFRleHQoKTtcbiAgICBpZiAoZGVzdFBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVxdWVzdC5hY2NlcHQoZGVzdFBhdGgpO1xuICB9XG5cbiAgc2V0QWNjZXB0RW5hYmxlbWVudCA9ICgpID0+IHtcbiAgICBjb25zdCBlbmFibGVtZW50ID0gIXRoaXMuZGVzdGluYXRpb25QYXRoLmlzRW1wdHkoKTtcbiAgICBpZiAoZW5hYmxlbWVudCAhPT0gdGhpcy5zdGF0ZS5hY2NlcHRFbmFibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHthY2NlcHRFbmFibGVkOiBlbmFibGVtZW50fSk7XG4gICAgfVxuICB9XG59XG4iXX0=