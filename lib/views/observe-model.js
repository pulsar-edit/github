"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _modelObserver = _interopRequireDefault(require("../models/model-observer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ObserveModel extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "fetchData", model => this.props.fetchData(model, ...this.props.fetchParams));

    _defineProperty(this, "didUpdate", () => {
      if (this.mounted) {
        const data = this.modelObserver.getActiveModelData();
        this.setState({
          data
        });
      }
    });

    this.state = {
      data: null
    };
    this.modelObserver = new _modelObserver.default({
      fetchData: this.fetchData,
      didUpdate: this.didUpdate
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.modelObserver.setActiveModel(this.props.model);
  }

  componentDidUpdate(prevProps) {
    this.modelObserver.setActiveModel(this.props.model);

    if (!this.modelObserver.hasPendingUpdate() && prevProps.fetchParams.length !== this.props.fetchParams.length || prevProps.fetchParams.some((prevParam, i) => prevParam !== this.props.fetchParams[i])) {
      this.modelObserver.refreshModelData();
    }
  }

  render() {
    return this.props.children(this.state.data);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.modelObserver.destroy();
  }

}

exports.default = ObserveModel;

_defineProperty(ObserveModel, "propTypes", {
  model: _propTypes.default.shape({
    onDidUpdate: _propTypes.default.func.isRequired
  }),
  fetchData: _propTypes.default.func.isRequired,
  fetchParams: _propTypes.default.arrayOf(_propTypes.default.any),
  children: _propTypes.default.func.isRequired
});

_defineProperty(ObserveModel, "defaultProps", {
  fetchParams: []
});