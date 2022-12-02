"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _reporterProxy = require("../reporter-proxy");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChangedFilesCountView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleClick');
  }

  handleClick() {
    (0, _reporterProxy.addEvent)('click', {
      package: 'github',
      component: 'ChangedFileCountView'
    });
    this.props.didClick();
  }

  render() {
    return _react.default.createElement("button", {
      ref: "changedFiles",
      className: "github-ChangedFilesCount inline-block",
      onClick: this.handleClick
    }, _react.default.createElement(_octicon.default, {
      icon: "git-commit"
    }), `Git (${this.props.changedFilesCount})`, this.props.mergeConflictsPresent && _react.default.createElement(_octicon.default, {
      icon: "alert"
    }));
  }

}

exports.default = ChangedFilesCountView;

_defineProperty(ChangedFilesCountView, "propTypes", {
  changedFilesCount: _propTypes.default.number.isRequired,
  didClick: _propTypes.default.func.isRequired,
  mergeConflictsPresent: _propTypes.default.bool
});

_defineProperty(ChangedFilesCountView, "defaultProps", {
  changedFilesCount: 0,
  mergeConflictsPresent: false,
  didClick: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jaGFuZ2VkLWZpbGVzLWNvdW50LXZpZXcuanMiXSwibmFtZXMiOlsiQ2hhbmdlZEZpbGVzQ291bnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaGFuZGxlQ2xpY2siLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZGlkQ2xpY2siLCJyZW5kZXIiLCJjaGFuZ2VkRmlsZXNDb3VudCIsIm1lcmdlQ29uZmxpY3RzUHJlc2VudCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIiwiYm9vbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxxQkFBTixTQUFvQ0MsZUFBTUMsU0FBMUMsQ0FBb0Q7QUFhakVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSwyQkFBUyxJQUFULEVBQWUsYUFBZjtBQUNEOztBQUVEQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixpQ0FBUyxPQUFULEVBQWtCO0FBQUNDLE1BQUFBLE9BQU8sRUFBRSxRQUFWO0FBQW9CQyxNQUFBQSxTQUFTLEVBQUU7QUFBL0IsS0FBbEI7QUFDQSxTQUFLSCxLQUFMLENBQVdJLFFBQVg7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRTtBQUNFLE1BQUEsR0FBRyxFQUFDLGNBRE47QUFFRSxNQUFBLFNBQVMsRUFBQyx1Q0FGWjtBQUdFLE1BQUEsT0FBTyxFQUFFLEtBQUtKO0FBSGhCLE9BSUUsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BSkYsRUFLSSxRQUFPLEtBQUtELEtBQUwsQ0FBV00saUJBQWtCLEdBTHhDLEVBTUcsS0FBS04sS0FBTCxDQUFXTyxxQkFBWCxJQUFvQyw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFDO0FBQWQsTUFOdkMsQ0FERjtBQVVEOztBQWxDZ0U7Ozs7Z0JBQTlDWCxxQixlQUNBO0FBQ2pCVSxFQUFBQSxpQkFBaUIsRUFBRUUsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRG5CO0FBRWpCTixFQUFBQSxRQUFRLEVBQUVJLG1CQUFVRyxJQUFWLENBQWVELFVBRlI7QUFHakJILEVBQUFBLHFCQUFxQixFQUFFQyxtQkFBVUk7QUFIaEIsQzs7Z0JBREFoQixxQixrQkFPRztBQUNwQlUsRUFBQUEsaUJBQWlCLEVBQUUsQ0FEQztBQUVwQkMsRUFBQUEscUJBQXFCLEVBQUUsS0FGSDtBQUdwQkgsRUFBQUEsUUFBUSxFQUFFLE1BQU0sQ0FBRTtBQUhFLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlZEZpbGVzQ291bnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFuZ2VkRmlsZXNDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGRpZENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzUHJlc2VudDogUHJvcFR5cGVzLmJvb2wsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNoYW5nZWRGaWxlc0NvdW50OiAwLFxuICAgIG1lcmdlQ29uZmxpY3RzUHJlc2VudDogZmFsc2UsXG4gICAgZGlkQ2xpY2s6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUNsaWNrJyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogJ0NoYW5nZWRGaWxlQ291bnRWaWV3J30pO1xuICAgIHRoaXMucHJvcHMuZGlkQ2xpY2soKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICByZWY9XCJjaGFuZ2VkRmlsZXNcIlxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ2hhbmdlZEZpbGVzQ291bnQgaW5saW5lLWJsb2NrXCJcbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtY29tbWl0XCIgLz5cbiAgICAgICAge2BHaXQgKCR7dGhpcy5wcm9wcy5jaGFuZ2VkRmlsZXNDb3VudH0pYH1cbiAgICAgICAge3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHNQcmVzZW50ICYmIDxPY3RpY29uIGljb249XCJhbGVydFwiIC8+fVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIl19