"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _repository = _interopRequireDefault(require("../models/repository"));
var _endpoint = require("../models/endpoint");
var _reviewsContainer = _interopRequireDefault(require("../containers/reviews-container"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReviewsItem extends _react.default.Component {
  static buildURI({
    host,
    owner,
    repo,
    number,
    workdir
  }) {
    return 'atom-github://reviews/' + encodeURIComponent(host) + '/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/' + encodeURIComponent(number) + '?workdir=' + encodeURIComponent(workdir || '');
  }
  constructor(props) {
    super(props);
    this.emitter = new _eventKit.Emitter();
    this.isDestroyed = false;
    this.state = {
      initThreadID: null
    };
  }
  render() {
    const endpoint = (0, _endpoint.getEndpoint)(this.props.host);
    const repository = this.props.workdir.length > 0 ? this.props.workdirContextPool.add(this.props.workdir).getRepository() : _repository.default.absent();
    return _react.default.createElement(_reviewsContainer.default, _extends({
      endpoint: endpoint,
      repository: repository,
      initThreadID: this.state.initThreadID
    }, this.props));
  }
  getTitle() {
    return `Reviews #${this.props.number}`;
  }
  getDefaultLocation() {
    return 'right';
  }
  getPreferredWidth() {
    return 400;
  }
  destroy() {
    /* istanbul ignore else */
    if (!this.isDestroyed) {
      this.emitter.emit('did-destroy');
      this.isDestroyed = true;
    }
  }
  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }
  serialize() {
    return {
      deserializer: 'ReviewsStub',
      uri: ReviewsItem.buildURI({
        host: this.props.host,
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.number,
        workdir: this.props.workdir
      })
    };
  }
  async jumpToThread(id) {
    if (this.state.initThreadID === id) {
      await new Promise(resolve => this.setState({
        initThreadID: null
      }, resolve));
    }
    return new Promise(resolve => this.setState({
      initThreadID: id
    }, resolve));
  }
}
exports.default = ReviewsItem;
_defineProperty(ReviewsItem, "propTypes", {
  // Parsed from URI
  host: _propTypes.default.string.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  // Package models
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});
_defineProperty(ReviewsItem, "uriPattern", 'atom-github://reviews/{host}/{owner}/{repo}/{number}?workdir={workdir}');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXZpZXdzSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwid29ya2RpciIsImVuY29kZVVSSUNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJlbWl0dGVyIiwiRW1pdHRlciIsImlzRGVzdHJveWVkIiwic3RhdGUiLCJpbml0VGhyZWFkSUQiLCJyZW5kZXIiLCJlbmRwb2ludCIsImdldEVuZHBvaW50IiwicmVwb3NpdG9yeSIsImxlbmd0aCIsIndvcmtkaXJDb250ZXh0UG9vbCIsImFkZCIsImdldFJlcG9zaXRvcnkiLCJSZXBvc2l0b3J5IiwiYWJzZW50IiwiZ2V0VGl0bGUiLCJnZXREZWZhdWx0TG9jYXRpb24iLCJnZXRQcmVmZXJyZWRXaWR0aCIsImRlc3Ryb3kiLCJlbWl0Iiwib25EaWREZXN0cm95IiwiY2FsbGJhY2siLCJvbiIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplciIsInVyaSIsImp1bXBUb1RocmVhZCIsImlkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRTdGF0ZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImxvZ2luTW9kZWwiLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJ3b3Jrc3BhY2UiLCJvYmplY3QiLCJjb25maWciLCJjb21tYW5kcyIsInRvb2x0aXBzIiwiY29uZmlybSIsImZ1bmMiLCJyZXBvcnRSZWxheUVycm9yIl0sInNvdXJjZXMiOlsicmV2aWV3cy1pdGVtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge0dpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZSwgV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlcG9zaXRvcnkgZnJvbSAnLi4vbW9kZWxzL3JlcG9zaXRvcnknO1xuaW1wb3J0IHtnZXRFbmRwb2ludH0gZnJvbSAnLi4vbW9kZWxzL2VuZHBvaW50JztcbmltcG9ydCBSZXZpZXdzQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvcmV2aWV3cy1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXZpZXdzSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUGFyc2VkIGZyb20gVVJJXG4gICAgaG9zdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIFBhY2thZ2UgbW9kZWxzXG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGxvZ2luTW9kZWw6IEdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9yZXZpZXdzL3tob3N0fS97b3duZXJ9L3tyZXBvfS97bnVtYmVyfT93b3JrZGlyPXt3b3JrZGlyfSdcblxuICBzdGF0aWMgYnVpbGRVUkkoe2hvc3QsIG93bmVyLCByZXBvLCBudW1iZXIsIHdvcmtkaXJ9KSB7XG4gICAgcmV0dXJuICdhdG9tLWdpdGh1YjovL3Jldmlld3MvJyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoaG9zdCkgKyAnLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KG93bmVyKSArICcvJyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQocmVwbykgKyAnLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KG51bWJlcikgK1xuICAgICAgJz93b3JrZGlyPScgKyBlbmNvZGVVUklDb21wb25lbnQod29ya2RpciB8fCAnJyk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGluaXRUaHJlYWRJRDogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gZ2V0RW5kcG9pbnQodGhpcy5wcm9wcy5ob3N0KTtcblxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLndvcmtkaXIubGVuZ3RoID4gMFxuICAgICAgPyB0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbC5hZGQodGhpcy5wcm9wcy53b3JrZGlyKS5nZXRSZXBvc2l0b3J5KClcbiAgICAgIDogUmVwb3NpdG9yeS5hYnNlbnQoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UmV2aWV3c0NvbnRhaW5lclxuICAgICAgICBlbmRwb2ludD17ZW5kcG9pbnR9XG4gICAgICAgIHJlcG9zaXRvcnk9e3JlcG9zaXRvcnl9XG4gICAgICAgIGluaXRUaHJlYWRJRD17dGhpcy5zdGF0ZS5pbml0VGhyZWFkSUR9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuIGBSZXZpZXdzICMke3RoaXMucHJvcHMubnVtYmVyfWA7XG4gIH1cblxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuICdyaWdodCc7XG4gIH1cblxuICBnZXRQcmVmZXJyZWRXaWR0aCgpIHtcbiAgICByZXR1cm4gNDAwO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95Jyk7XG4gICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnUmV2aWV3c1N0dWInLFxuICAgICAgdXJpOiBSZXZpZXdzSXRlbS5idWlsZFVSSSh7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuaG9zdCxcbiAgICAgICAgb3duZXI6IHRoaXMucHJvcHMub3duZXIsXG4gICAgICAgIHJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy53b3JrZGlyLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGp1bXBUb1RocmVhZChpZCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmluaXRUaHJlYWRJRCA9PT0gaWQpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7aW5pdFRocmVhZElEOiBudWxsfSwgcmVzb2x2ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2luaXRUaHJlYWRJRDogaWR9LCByZXNvbHZlKSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBK0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVoRCxNQUFNQSxXQUFXLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBMEJ2RCxPQUFPQyxRQUFRLENBQUM7SUFBQ0MsSUFBSTtJQUFFQyxLQUFLO0lBQUVDLElBQUk7SUFBRUMsTUFBTTtJQUFFQztFQUFPLENBQUMsRUFBRTtJQUNwRCxPQUFPLHdCQUF3QixHQUM3QkMsa0JBQWtCLENBQUNMLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FDOUJLLGtCQUFrQixDQUFDSixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQy9CSSxrQkFBa0IsQ0FBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUM5Qkcsa0JBQWtCLENBQUNGLE1BQU0sQ0FBQyxHQUMxQixXQUFXLEdBQUdFLGtCQUFrQixDQUFDRCxPQUFPLElBQUksRUFBRSxDQUFDO0VBQ25EO0VBRUFFLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBRVosSUFBSSxDQUFDQyxPQUFPLEdBQUcsSUFBSUMsaUJBQU8sRUFBRTtJQUM1QixJQUFJLENBQUNDLFdBQVcsR0FBRyxLQUFLO0lBRXhCLElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQ1hDLFlBQVksRUFBRTtJQUNo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