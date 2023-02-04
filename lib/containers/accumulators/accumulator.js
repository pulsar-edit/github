"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImxvYWRNb3JlU3ViIiwiZGlzcG9zZSIsIm5leHRVcGRhdGVJRCIsInJlbGF5IiwiaGFzTW9yZSIsImlzTG9hZGluZyIsImxvYWRNb3JlIiwicGFnZVNpemUiLCJhY2N1bXVsYXRlIiwiZXJyb3IiLCJzZXRTdGF0ZSIsIndhaXRUaW1lTXMiLCJzZXRUaW1lb3V0IiwiYXR0ZW1wdFRvTG9hZE1vcmUiLCJuZXh0VXBkYXRlU3ViIiwiRGlzcG9zYWJsZSIsImNsZWFyVGltZW91dCIsInJlZmV0Y2hTdWIiLCJzdGF0ZSIsImNvbXBvbmVudERpZE1vdW50Iiwib25EaWRSZWZldGNoIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJjaGlsZHJlbiIsInJlc3VsdEJhdGNoIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJudW1iZXIiXSwic291cmNlcyI6WyJhY2N1bXVsYXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHByb3BzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXN1bHRCYXRjaDogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIENvbnRyb2wgcHJvcHNcbiAgICBwYWdlU2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdhaXRUaW1lTXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoZXJyb3IsIGZ1bGwgcmVzdWx0IGxpc3QsIGxvYWRpbmcpIGVhY2ggdGltZSBtb3JlIHJlc3VsdHMgYXJyaXZlLiBSZXR1cm4gdmFsdWUgaXNcbiAgICAvLyByZW5kZXJlZCBhcyBhIGNoaWxkIGVsZW1lbnQuXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gQ2FsbGVkIHJpZ2h0IGFmdGVyIHJlZmV0Y2ggaGFwcGVuc1xuICAgIG9uRGlkUmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZldGNoU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmxvYWRNb3JlU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICB0aGlzLm5leHRVcGRhdGVTdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5uZXh0VXBkYXRlSUQgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSB7ZXJyb3I6IG51bGx9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZldGNoU3ViID0gdGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2godGhpcy5hdHRlbXB0VG9Mb2FkTW9yZSk7XG4gICAgdGhpcy5hdHRlbXB0VG9Mb2FkTW9yZSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZldGNoU3ViLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxvYWRNb3JlU3ViLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm5leHRVcGRhdGVTdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuZXJyb3IsIHRoaXMucHJvcHMucmVzdWx0QmF0Y2gsIHRoaXMucHJvcHMucmVsYXkuaGFzTW9yZSgpKTtcbiAgfVxuXG4gIGF0dGVtcHRUb0xvYWRNb3JlID0gKCkgPT4ge1xuICAgIHRoaXMubG9hZE1vcmVTdWIuZGlzcG9zZSgpO1xuICAgIHRoaXMubmV4dFVwZGF0ZUlEID0gbnVsbDtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkgfHwgdGhpcy5wcm9wcy5yZWxheS5pc0xvYWRpbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9hZE1vcmVTdWIgPSB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKHRoaXMucHJvcHMucGFnZVNpemUsIHRoaXMuYWNjdW11bGF0ZSk7XG4gIH1cblxuICBhY2N1bXVsYXRlID0gZXJyb3IgPT4ge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3J9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJvcHMud2FpdFRpbWVNcyA+IDAgJiYgdGhpcy5uZXh0VXBkYXRlSUQgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5uZXh0VXBkYXRlSUQgPSBzZXRUaW1lb3V0KHRoaXMuYXR0ZW1wdFRvTG9hZE1vcmUsIHRoaXMucHJvcHMud2FpdFRpbWVNcyk7XG4gICAgICAgIHRoaXMubmV4dFVwZGF0ZVN1YiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5uZXh0VXBkYXRlSUQpO1xuICAgICAgICAgIHRoaXMubmV4dFVwZGF0ZUlEID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmF0dGVtcHRUb0xvYWRNb3JlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUFxQztBQUFBO0FBQUE7QUFBQTtBQUV0QixNQUFNQSxXQUFXLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBc0J2REMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQywyQ0F5QkssTUFBTTtNQUN4QixJQUFJLENBQUNDLFdBQVcsQ0FBQ0MsT0FBTyxFQUFFO01BQzFCLElBQUksQ0FBQ0MsWUFBWSxHQUFHLElBQUk7O01BRXhCO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxLQUFLLENBQUNDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQ0wsS0FBSyxDQUFDSSxLQUFLLENBQUNFLFNBQVMsRUFBRSxFQUFFO1FBQy9EO01BQ0Y7TUFFQSxJQUFJLENBQUNMLFdBQVcsR0FBRyxJQUFJLENBQUNELEtBQUssQ0FBQ0ksS0FBSyxDQUFDRyxRQUFRLENBQUMsSUFBSSxDQUFDUCxLQUFLLENBQUNRLFFBQVEsRUFBRSxJQUFJLENBQUNDLFVBQVUsQ0FBQztJQUNwRixDQUFDO0lBQUEsb0NBRVlDLEtBQUssSUFBSTtNQUNwQixJQUFJQSxLQUFLLEVBQUU7UUFDVCxJQUFJLENBQUNDLFFBQVEsQ0FBQztVQUFDRDtRQUFLLENBQUMsQ0FBQztNQUN4QixDQUFDLE1BQU07UUFDTCxJQUFJLElBQUksQ0FBQ1YsS0FBSyxDQUFDWSxVQUFVLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQ1QsWUFBWSxLQUFLLElBQUksRUFBRTtVQUMzRCxJQUFJLENBQUNBLFlBQVksR0FBR1UsVUFBVSxDQUFDLElBQUksQ0FBQ0MsaUJBQWlCLEVBQUUsSUFBSSxDQUFDZCxLQUFLLENBQUNZLFVBQVUsQ0FBQztVQUM3RSxJQUFJLENBQUNHLGFBQWEsR0FBRyxJQUFJQyxvQkFBVSxDQUFDLE1BQU07WUFDeENDLFlBQVksQ0FBQyxJQUFJLENBQUNkLFlBQVksQ0FBQztZQUMvQixJQUFJLENBQUNBLFlBQVksR0FBRyxJQUFJO1VBQzFCLENBQUMsQ0FBQztRQUNKLENBQUMsTUFBTTtVQUNMLElBQUksQ0FBQ1csaUJBQWlCLEVBQUU7UUFDMUI7TUFDRjtJQUNGLENBQUM7SUFqREMsSUFBSSxDQUFDSSxVQUFVLEdBQUcsSUFBSUYsb0JBQVUsRUFBRTtJQUNsQyxJQUFJLENBQUNmLFdBQVcsR0FBRyxJQUFJZSxvQkFBVSxFQUFFO0lBQ25DLElBQUksQ0FBQ0QsYUFBYSxHQUFHLElBQUlDLG9CQUFVLEVBQUU7SUFFckMsSUFBSSxDQUFDYixZQUFZLEdBQUcsSUFBSTtJQUN4QixJQUFJLENBQUNnQixLQUFLLEdBQUc7TUFBQ1QsS0FBSyxFQUFFO0lBQUksQ0FBQztFQUM1QjtFQUVBVSxpQkFBaUIsR0FBRztJQUNsQixJQUFJLENBQUNGLFVBQVUsR0FBRyxJQUFJLENBQUNsQixLQUFLLENBQUNxQixZQUFZLENBQUMsSUFBSSxDQUFDUCxpQkFBaUIsQ0FBQztJQUNqRSxJQUFJLENBQUNBLGlCQUFpQixFQUFFO0VBQzFCO0VBRUFRLG9CQUFvQixHQUFHO0lBQ3JCLElBQUksQ0FBQ0osVUFBVSxDQUFDaEIsT0FBTyxFQUFFO0lBQ3pCLElBQUksQ0FBQ0QsV0FBVyxDQUFDQyxPQUFPLEVBQUU7SUFDMUIsSUFBSSxDQUFDYSxhQUFhLENBQUNiLE9BQU8sRUFBRTtFQUM5QjtFQUVBcUIsTUFBTSxHQUFHO0lBQ1AsT0FBTyxJQUFJLENBQUN2QixLQUFLLENBQUN3QixRQUFRLENBQUMsSUFBSSxDQUFDTCxLQUFLLENBQUNULEtBQUssRUFBRSxJQUFJLENBQUNWLEtBQUssQ0FBQ3lCLFdBQVcsRUFBRSxJQUFJLENBQUN6QixLQUFLLENBQUNJLEtBQUssQ0FBQ0MsT0FBTyxFQUFFLENBQUM7RUFDbEc7QUE2QkY7QUFBQztBQUFBLGdCQTNFb0JULFdBQVcsZUFDWDtFQUNqQjtFQUNBUSxLQUFLLEVBQUVzQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJ0QixPQUFPLEVBQUVxQixrQkFBUyxDQUFDRSxJQUFJLENBQUNDLFVBQVU7SUFDbEN0QixRQUFRLEVBQUVtQixrQkFBUyxDQUFDRSxJQUFJLENBQUNDLFVBQVU7SUFDbkN2QixTQUFTLEVBQUVvQixrQkFBUyxDQUFDRSxJQUFJLENBQUNDO0VBQzVCLENBQUMsQ0FBQyxDQUFDQSxVQUFVO0VBQ2JKLFdBQVcsRUFBRUMsa0JBQVMsQ0FBQ0ksT0FBTyxDQUFDSixrQkFBUyxDQUFDSyxHQUFHLENBQUMsQ0FBQ0YsVUFBVTtFQUV4RDtFQUNBckIsUUFBUSxFQUFFa0Isa0JBQVMsQ0FBQ00sTUFBTSxDQUFDSCxVQUFVO0VBQ3JDakIsVUFBVSxFQUFFYyxrQkFBUyxDQUFDTSxNQUFNLENBQUNILFVBQVU7RUFFdkM7RUFDQTtFQUNBTCxRQUFRLEVBQUVFLGtCQUFTLENBQUNFLElBQUk7RUFFeEI7RUFDQVAsWUFBWSxFQUFFSyxrQkFBUyxDQUFDRSxJQUFJLENBQUNDO0FBQy9CLENBQUMifQ==