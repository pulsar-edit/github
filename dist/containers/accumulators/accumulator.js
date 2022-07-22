"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Accumulator extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "attemptToLoadMore", () => {
      this.loadMoreSub.dispose();
      this.nextUpdateID = null;
      /* istanbul ignore if */

      if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
        return;
      }

      this.loadMoreSub = this.props.relay.loadMore(this.props.pageSize, this.accumulate);
    });

    _defineProperty(this, "accumulate", error => {
      if (error) {
        this.setState({
          error
        });
      } else {
        if (this.props.waitTimeMs > 0 && this.nextUpdateID === null) {
          this.nextUpdateID = setTimeout(this.attemptToLoadMore, this.props.waitTimeMs);
          this.nextUpdateSub = new _eventKit.Disposable(() => {
            clearTimeout(this.nextUpdateID);
            this.nextUpdateID = null;
          });
        } else {
          this.attemptToLoadMore();
        }
      }
    });

    this.refetchSub = new _eventKit.Disposable();
    this.loadMoreSub = new _eventKit.Disposable();
    this.nextUpdateSub = new _eventKit.Disposable();
    this.nextUpdateID = null;
    this.state = {
      error: null
    };
  }

  componentDidMount() {
    this.refetchSub = this.props.onDidRefetch(this.attemptToLoadMore);
    this.attemptToLoadMore();
  }

  componentWillUnmount() {
    this.refetchSub.dispose();
    this.loadMoreSub.dispose();
    this.nextUpdateSub.dispose();
  }

  render() {
    return this.props.children(this.state.error, this.props.resultBatch, this.props.relay.hasMore());
  }

}

exports.default = Accumulator;

_defineProperty(Accumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  resultBatch: _propTypes.default.arrayOf(_propTypes.default.any).isRequired,
  // Control props
  pageSize: _propTypes.default.number.isRequired,
  waitTimeMs: _propTypes.default.number.isRequired,
  // Render prop. Called with (error, full result list, loading) each time more results arrive. Return value is
  // rendered as a child element.
  children: _propTypes.default.func,
  // Called right after refetch happens
  onDidRefetch: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9hY2N1bXVsYXRvci5qcyJdLCJuYW1lcyI6WyJBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImxvYWRNb3JlU3ViIiwiZGlzcG9zZSIsIm5leHRVcGRhdGVJRCIsInJlbGF5IiwiaGFzTW9yZSIsImlzTG9hZGluZyIsImxvYWRNb3JlIiwicGFnZVNpemUiLCJhY2N1bXVsYXRlIiwiZXJyb3IiLCJzZXRTdGF0ZSIsIndhaXRUaW1lTXMiLCJzZXRUaW1lb3V0IiwiYXR0ZW1wdFRvTG9hZE1vcmUiLCJuZXh0VXBkYXRlU3ViIiwiRGlzcG9zYWJsZSIsImNsZWFyVGltZW91dCIsInJlZmV0Y2hTdWIiLCJzdGF0ZSIsImNvbXBvbmVudERpZE1vdW50Iiwib25EaWRSZWZldGNoIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJjaGlsZHJlbiIsInJlc3VsdEJhdGNoIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJudW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsV0FBTixTQUEwQkMsZUFBTUMsU0FBaEMsQ0FBMEM7QUFzQnZEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQiwrQ0EwQkMsTUFBTTtBQUN4QixXQUFLQyxXQUFMLENBQWlCQyxPQUFqQjtBQUNBLFdBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFFQTs7QUFDQSxVQUFJLENBQUMsS0FBS0gsS0FBTCxDQUFXSSxLQUFYLENBQWlCQyxPQUFqQixFQUFELElBQStCLEtBQUtMLEtBQUwsQ0FBV0ksS0FBWCxDQUFpQkUsU0FBakIsRUFBbkMsRUFBaUU7QUFDL0Q7QUFDRDs7QUFFRCxXQUFLTCxXQUFMLEdBQW1CLEtBQUtELEtBQUwsQ0FBV0ksS0FBWCxDQUFpQkcsUUFBakIsQ0FBMEIsS0FBS1AsS0FBTCxDQUFXUSxRQUFyQyxFQUErQyxLQUFLQyxVQUFwRCxDQUFuQjtBQUNELEtBcENrQjs7QUFBQSx3Q0FzQ05DLEtBQUssSUFBSTtBQUNwQixVQUFJQSxLQUFKLEVBQVc7QUFDVCxhQUFLQyxRQUFMLENBQWM7QUFBQ0QsVUFBQUE7QUFBRCxTQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxLQUFLVixLQUFMLENBQVdZLFVBQVgsR0FBd0IsQ0FBeEIsSUFBNkIsS0FBS1QsWUFBTCxLQUFzQixJQUF2RCxFQUE2RDtBQUMzRCxlQUFLQSxZQUFMLEdBQW9CVSxVQUFVLENBQUMsS0FBS0MsaUJBQU4sRUFBeUIsS0FBS2QsS0FBTCxDQUFXWSxVQUFwQyxDQUE5QjtBQUNBLGVBQUtHLGFBQUwsR0FBcUIsSUFBSUMsb0JBQUosQ0FBZSxNQUFNO0FBQ3hDQyxZQUFBQSxZQUFZLENBQUMsS0FBS2QsWUFBTixDQUFaO0FBQ0EsaUJBQUtBLFlBQUwsR0FBb0IsSUFBcEI7QUFDRCxXQUhvQixDQUFyQjtBQUlELFNBTkQsTUFNTztBQUNMLGVBQUtXLGlCQUFMO0FBQ0Q7QUFDRjtBQUNGLEtBcERrQjs7QUFHakIsU0FBS0ksVUFBTCxHQUFrQixJQUFJRixvQkFBSixFQUFsQjtBQUNBLFNBQUtmLFdBQUwsR0FBbUIsSUFBSWUsb0JBQUosRUFBbkI7QUFDQSxTQUFLRCxhQUFMLEdBQXFCLElBQUlDLG9CQUFKLEVBQXJCO0FBRUEsU0FBS2IsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUtnQixLQUFMLEdBQWE7QUFBQ1QsTUFBQUEsS0FBSyxFQUFFO0FBQVIsS0FBYjtBQUNEOztBQUVEVSxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLRixVQUFMLEdBQWtCLEtBQUtsQixLQUFMLENBQVdxQixZQUFYLENBQXdCLEtBQUtQLGlCQUE3QixDQUFsQjtBQUNBLFNBQUtBLGlCQUFMO0FBQ0Q7O0FBRURRLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtKLFVBQUwsQ0FBZ0JoQixPQUFoQjtBQUNBLFNBQUtELFdBQUwsQ0FBaUJDLE9BQWpCO0FBQ0EsU0FBS2EsYUFBTCxDQUFtQmIsT0FBbkI7QUFDRDs7QUFFRHFCLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQU8sS0FBS3ZCLEtBQUwsQ0FBV3dCLFFBQVgsQ0FBb0IsS0FBS0wsS0FBTCxDQUFXVCxLQUEvQixFQUFzQyxLQUFLVixLQUFMLENBQVd5QixXQUFqRCxFQUE4RCxLQUFLekIsS0FBTCxDQUFXSSxLQUFYLENBQWlCQyxPQUFqQixFQUE5RCxDQUFQO0FBQ0Q7O0FBOUNzRDs7OztnQkFBcENULFcsZUFDQTtBQUNqQjtBQUNBUSxFQUFBQSxLQUFLLEVBQUVzQixtQkFBVUMsS0FBVixDQUFnQjtBQUNyQnRCLElBQUFBLE9BQU8sRUFBRXFCLG1CQUFVRSxJQUFWLENBQWVDLFVBREg7QUFFckJ0QixJQUFBQSxRQUFRLEVBQUVtQixtQkFBVUUsSUFBVixDQUFlQyxVQUZKO0FBR3JCdkIsSUFBQUEsU0FBUyxFQUFFb0IsbUJBQVVFLElBQVYsQ0FBZUM7QUFITCxHQUFoQixFQUlKQSxVQU5jO0FBT2pCSixFQUFBQSxXQUFXLEVBQUVDLG1CQUFVSSxPQUFWLENBQWtCSixtQkFBVUssR0FBNUIsRUFBaUNGLFVBUDdCO0FBU2pCO0FBQ0FyQixFQUFBQSxRQUFRLEVBQUVrQixtQkFBVU0sTUFBVixDQUFpQkgsVUFWVjtBQVdqQmpCLEVBQUFBLFVBQVUsRUFBRWMsbUJBQVVNLE1BQVYsQ0FBaUJILFVBWFo7QUFhakI7QUFDQTtBQUNBTCxFQUFBQSxRQUFRLEVBQUVFLG1CQUFVRSxJQWZIO0FBaUJqQjtBQUNBUCxFQUFBQSxZQUFZLEVBQUVLLG1CQUFVRSxJQUFWLENBQWVDO0FBbEJaLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHByb3BzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXN1bHRCYXRjaDogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIENvbnRyb2wgcHJvcHNcbiAgICBwYWdlU2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdhaXRUaW1lTXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoZXJyb3IsIGZ1bGwgcmVzdWx0IGxpc3QsIGxvYWRpbmcpIGVhY2ggdGltZSBtb3JlIHJlc3VsdHMgYXJyaXZlLiBSZXR1cm4gdmFsdWUgaXNcbiAgICAvLyByZW5kZXJlZCBhcyBhIGNoaWxkIGVsZW1lbnQuXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gQ2FsbGVkIHJpZ2h0IGFmdGVyIHJlZmV0Y2ggaGFwcGVuc1xuICAgIG9uRGlkUmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZldGNoU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmxvYWRNb3JlU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICB0aGlzLm5leHRVcGRhdGVTdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5uZXh0VXBkYXRlSUQgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSB7ZXJyb3I6IG51bGx9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZldGNoU3ViID0gdGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2godGhpcy5hdHRlbXB0VG9Mb2FkTW9yZSk7XG4gICAgdGhpcy5hdHRlbXB0VG9Mb2FkTW9yZSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZldGNoU3ViLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxvYWRNb3JlU3ViLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm5leHRVcGRhdGVTdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuZXJyb3IsIHRoaXMucHJvcHMucmVzdWx0QmF0Y2gsIHRoaXMucHJvcHMucmVsYXkuaGFzTW9yZSgpKTtcbiAgfVxuXG4gIGF0dGVtcHRUb0xvYWRNb3JlID0gKCkgPT4ge1xuICAgIHRoaXMubG9hZE1vcmVTdWIuZGlzcG9zZSgpO1xuICAgIHRoaXMubmV4dFVwZGF0ZUlEID0gbnVsbDtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkgfHwgdGhpcy5wcm9wcy5yZWxheS5pc0xvYWRpbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9hZE1vcmVTdWIgPSB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKHRoaXMucHJvcHMucGFnZVNpemUsIHRoaXMuYWNjdW11bGF0ZSk7XG4gIH1cblxuICBhY2N1bXVsYXRlID0gZXJyb3IgPT4ge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3J9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJvcHMud2FpdFRpbWVNcyA+IDAgJiYgdGhpcy5uZXh0VXBkYXRlSUQgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5uZXh0VXBkYXRlSUQgPSBzZXRUaW1lb3V0KHRoaXMuYXR0ZW1wdFRvTG9hZE1vcmUsIHRoaXMucHJvcHMud2FpdFRpbWVNcyk7XG4gICAgICAgIHRoaXMubmV4dFVwZGF0ZVN1YiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5uZXh0VXBkYXRlSUQpO1xuICAgICAgICAgIHRoaXMubmV4dFVwZGF0ZUlEID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmF0dGVtcHRUb0xvYWRNb3JlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=