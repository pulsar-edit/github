"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _commitDetailView = _interopRequireDefault(require("../views/commit-detail-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommitDetailController extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleMessage", () => {
      return new Promise(resolve => {
        this.setState(prevState => ({
          messageOpen: !prevState.messageOpen
        }), resolve);
      });
    });

    this.state = {
      messageCollapsible: this.props.commit.isBodyLong(),
      messageOpen: !this.props.commit.isBodyLong()
    };
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_commitDetailView.default, _extends({
      messageCollapsible: this.state.messageCollapsible,
      messageOpen: this.state.messageOpen,
      toggleMessage: this.toggleMessage
    }, this.props));
  }

}

exports.default = CommitDetailController;

_defineProperty(CommitDetailController, "propTypes", _objectSpread({}, _commitDetailView.default.drilledPropTypes, {
  commit: _propTypes.default.object.isRequired
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21taXQtZGV0YWlsLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsQ29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJtZXNzYWdlT3BlbiIsInN0YXRlIiwibWVzc2FnZUNvbGxhcHNpYmxlIiwiY29tbWl0IiwiaXNCb2R5TG9uZyIsInJlbmRlciIsInRvZ2dsZU1lc3NhZ2UiLCJDb21taXREZXRhaWxWaWV3IiwiZHJpbGxlZFByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsc0JBQU4sU0FBcUNDLGVBQU1DLFNBQTNDLENBQXFEO0FBT2xFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQiwyQ0FvQkgsTUFBTTtBQUNwQixhQUFPLElBQUlDLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLGFBQUtDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQUNDLFVBQUFBLFdBQVcsRUFBRSxDQUFDRCxTQUFTLENBQUNDO0FBQXpCLFNBQUwsQ0FBdkIsRUFBb0VILE9BQXBFO0FBQ0QsT0FGTSxDQUFQO0FBR0QsS0F4QmtCOztBQUdqQixTQUFLSSxLQUFMLEdBQWE7QUFDWEMsTUFBQUEsa0JBQWtCLEVBQUUsS0FBS1AsS0FBTCxDQUFXUSxNQUFYLENBQWtCQyxVQUFsQixFQURUO0FBRVhKLE1BQUFBLFdBQVcsRUFBRSxDQUFDLEtBQUtMLEtBQUwsQ0FBV1EsTUFBWCxDQUFrQkMsVUFBbEI7QUFGSCxLQUFiO0FBSUQ7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFLDZCQUFDLHlCQUFEO0FBQ0UsTUFBQSxrQkFBa0IsRUFBRSxLQUFLSixLQUFMLENBQVdDLGtCQURqQztBQUVFLE1BQUEsV0FBVyxFQUFFLEtBQUtELEtBQUwsQ0FBV0QsV0FGMUI7QUFHRSxNQUFBLGFBQWEsRUFBRSxLQUFLTTtBQUh0QixPQUlNLEtBQUtYLEtBSlgsRUFERjtBQVFEOztBQXpCaUU7Ozs7Z0JBQS9DSixzQixpQ0FFZGdCLDBCQUFpQkMsZ0I7QUFFcEJMLEVBQUFBLE1BQU0sRUFBRU0sbUJBQVVDLE1BQVYsQ0FBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBDb21taXREZXRhaWxWaWV3IGZyb20gJy4uL3ZpZXdzL2NvbW1pdC1kZXRhaWwtdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdERldGFpbENvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC4uLkNvbW1pdERldGFpbFZpZXcuZHJpbGxlZFByb3BUeXBlcyxcblxuICAgIGNvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZUNvbGxhcHNpYmxlOiB0aGlzLnByb3BzLmNvbW1pdC5pc0JvZHlMb25nKCksXG4gICAgICBtZXNzYWdlT3BlbjogIXRoaXMucHJvcHMuY29tbWl0LmlzQm9keUxvbmcoKSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWl0RGV0YWlsVmlld1xuICAgICAgICBtZXNzYWdlQ29sbGFwc2libGU9e3RoaXMuc3RhdGUubWVzc2FnZUNvbGxhcHNpYmxlfVxuICAgICAgICBtZXNzYWdlT3Blbj17dGhpcy5zdGF0ZS5tZXNzYWdlT3Blbn1cbiAgICAgICAgdG9nZ2xlTWVzc2FnZT17dGhpcy50b2dnbGVNZXNzYWdlfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHRvZ2dsZU1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHttZXNzYWdlT3BlbjogIXByZXZTdGF0ZS5tZXNzYWdlT3Blbn0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19