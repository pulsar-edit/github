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
    return _react.default.createElement(_commitDetailView.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21taXQtZGV0YWlsLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsQ29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJtZXNzYWdlT3BlbiIsInN0YXRlIiwibWVzc2FnZUNvbGxhcHNpYmxlIiwiY29tbWl0IiwiaXNCb2R5TG9uZyIsInJlbmRlciIsInRvZ2dsZU1lc3NhZ2UiLCJDb21taXREZXRhaWxWaWV3IiwiZHJpbGxlZFByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsc0JBQU4sU0FBcUNDLGVBQU1DLFNBQTNDLENBQXFEO0FBT2xFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQiwyQ0FvQkgsTUFBTTtBQUNwQixhQUFPLElBQUlDLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLGFBQUtDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQUNDLFVBQUFBLFdBQVcsRUFBRSxDQUFDRCxTQUFTLENBQUNDO0FBQXpCLFNBQUwsQ0FBdkIsRUFBb0VILE9BQXBFO0FBQ0QsT0FGTSxDQUFQO0FBR0QsS0F4QmtCOztBQUdqQixTQUFLSSxLQUFMLEdBQWE7QUFDWEMsTUFBQUEsa0JBQWtCLEVBQUUsS0FBS1AsS0FBTCxDQUFXUSxNQUFYLENBQWtCQyxVQUFsQixFQURUO0FBRVhKLE1BQUFBLFdBQVcsRUFBRSxDQUFDLEtBQUtMLEtBQUwsQ0FBV1EsTUFBWCxDQUFrQkMsVUFBbEI7QUFGSCxLQUFiO0FBSUQ7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0UsNkJBQUMseUJBQUQ7QUFDRSxNQUFBLGtCQUFrQixFQUFFLEtBQUtKLEtBQUwsQ0FBV0Msa0JBRGpDO0FBRUUsTUFBQSxXQUFXLEVBQUUsS0FBS0QsS0FBTCxDQUFXRCxXQUYxQjtBQUdFLE1BQUEsYUFBYSxFQUFFLEtBQUtNO0FBSHRCLE9BSU0sS0FBS1gsS0FKWCxFQURGO0FBUUQ7O0FBekJpRTs7OztnQkFBL0NKLHNCLGlDQUVkZ0IsMEJBQWlCQyxnQjtBQUVwQkwsRUFBQUEsTUFBTSxFQUFFTSxtQkFBVUMsTUFBVixDQUFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IENvbW1pdERldGFpbFZpZXcgZnJvbSAnLi4vdmlld3MvY29tbWl0LWRldGFpbC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0RGV0YWlsQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uQ29tbWl0RGV0YWlsVmlldy5kcmlsbGVkUHJvcFR5cGVzLFxuXG4gICAgY29tbWl0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXNzYWdlQ29sbGFwc2libGU6IHRoaXMucHJvcHMuY29tbWl0LmlzQm9keUxvbmcoKSxcbiAgICAgIG1lc3NhZ2VPcGVuOiAhdGhpcy5wcm9wcy5jb21taXQuaXNCb2R5TG9uZygpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxWaWV3XG4gICAgICAgIG1lc3NhZ2VDb2xsYXBzaWJsZT17dGhpcy5zdGF0ZS5tZXNzYWdlQ29sbGFwc2libGV9XG4gICAgICAgIG1lc3NhZ2VPcGVuPXt0aGlzLnN0YXRlLm1lc3NhZ2VPcGVufVxuICAgICAgICB0b2dnbGVNZXNzYWdlPXt0aGlzLnRvZ2dsZU1lc3NhZ2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgdG9nZ2xlTWVzc2FnZSA9ICgpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe21lc3NhZ2VPcGVuOiAhcHJldlN0YXRlLm1lc3NhZ2VPcGVufSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=