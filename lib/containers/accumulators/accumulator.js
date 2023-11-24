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