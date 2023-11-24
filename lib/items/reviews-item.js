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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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