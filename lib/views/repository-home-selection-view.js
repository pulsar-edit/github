"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareRepositoryHomeSelectionView = exports.PAGE_SIZE = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _tabbable = require("./tabbable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PAGE_DELAY = 500;
const PAGE_SIZE = 50;
exports.PAGE_SIZE = PAGE_SIZE;

class BareRepositoryHomeSelectionView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderOwner", owner => _react.default.createElement(_react.Fragment, null, _react.default.createElement("div", {
      className: "github-RepositoryHome-ownerOption"
    }, _react.default.createElement("img", {
      alt: "",
      src: owner.avatarURL,
      className: "github-RepositoryHome-ownerAvatar"
    }), _react.default.createElement("span", {
      className: "github-RepositoryHome-ownerName"
    }, owner.login)), owner.disabled && !owner.placeholder && _react.default.createElement("div", {
      className: "github-RepositoryHome-ownerUnwritable"
    }, "(insufficient permissions)")));

    _defineProperty(this, "didChangeOwner", owner => this.props.didChangeOwnerID(owner.id));

    _defineProperty(this, "loadNextPage", () => {
      /* istanbul ignore if */
      if (this.props.relay.isLoading()) {
        setTimeout(this.loadNextPage, PAGE_DELAY);
        return;
      }

      this.props.relay.loadMore(PAGE_SIZE);
    });
  }

  render() {
    const owners = this.getOwners();
    const currentOwner = owners.find(o => o.id === this.props.selectedOwnerID) || owners[0];
    return _react.default.createElement("div", {
      className: "github-RepositoryHome"
    }, _react.default.createElement(_tabbable.TabbableSelect, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      autofocus: this.props.autofocusOwner,
      className: "github-RepositoryHome-owner",
      clearable: false,
      disabled: this.props.isLoading,
      options: owners,
      optionRenderer: this.renderOwner,
      value: currentOwner,
      valueRenderer: this.renderOwner,
      onChange: this.didChangeOwner
    }), _react.default.createElement("span", {
      className: "github-RepositoryHome-separator"
    }, "/"), _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      autofocus: this.props.autofocusName,
      mini: true,
      buffer: this.props.nameBuffer
    }));
  }

  componentDidMount() {
    this.schedulePageLoad();
  }

  componentDidUpdate() {
    this.schedulePageLoad();
  }

  getOwners() {
    if (!this.props.user) {
      return [{
        id: 'loading',
        login: 'loading...',
        avatarURL: '',
        disabled: true,
        placeholder: true
      }];
    }

    const owners = [{
      id: this.props.user.id,
      login: this.props.user.login,
      avatarURL: this.props.user.avatarUrl,
      disabled: false
    }];
    /* istanbul ignore if */

    if (!this.props.user.organizations.edges) {
      return owners;
    }

    for (const {
      node
    } of this.props.user.organizations.edges) {
      /* istanbul ignore if */
      if (!node) {
        continue;
      }

      owners.push({
        id: node.id,
        login: node.login,
        avatarURL: node.avatarUrl,
        disabled: !node.viewerCanCreateRepositories
      });
    }

    if (this.props.relay && this.props.relay.hasMore()) {
      owners.push({
        id: 'loading',
        login: 'loading...',
        avatarURL: '',
        disabled: true,
        placeholder: true
      });
    }

    return owners;
  }

  schedulePageLoad() {
    if (!this.props.relay.hasMore()) {
      return;
    }

    setTimeout(this.loadNextPage, PAGE_DELAY);
  }

}

exports.BareRepositoryHomeSelectionView = BareRepositoryHomeSelectionView;

_defineProperty(BareRepositoryHomeSelectionView, "propTypes", {
  // Relay
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired
  }).isRequired,
  user: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    login: _propTypes.default.string.isRequired,
    avatarUrl: _propTypes.default.string.isRequired,
    organizations: _propTypes.default.shape({
      edges: _propTypes.default.arrayOf(_propTypes.default.shape({
        node: _propTypes.default.shape({
          id: _propTypes.default.string.isRequired,
          login: _propTypes.default.string.isRequired,
          avatarUrl: _propTypes.default.string.isRequired,
          viewerCanCreateRepositories: _propTypes.default.bool.isRequired
        })
      }))
    }).isRequired
  }),
  // Model
  nameBuffer: _propTypes.default.object.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  selectedOwnerID: _propTypes.default.string.isRequired,
  tabGroup: _propTypes.default.object.isRequired,
  autofocusOwner: _propTypes.default.bool,
  autofocusName: _propTypes.default.bool,
  // Selection callback
  didChangeOwnerID: _propTypes.default.func.isRequired,
  // Atom environment
  commands: _propTypes.default.object.isRequired
});

_defineProperty(BareRepositoryHomeSelectionView, "defaultProps", {
  autofocusOwner: false,
  autofocusName: false
});

var _default = (0, _reactRelay.createPaginationContainer)(BareRepositoryHomeSelectionView, {
  user: function () {
    const node = require("./__generated__/repositoryHomeSelectionView_user.graphql");

    if (node.hash && node.hash !== "11a1f1d0eac32bff0a3371217c0eede3") {
      console.error("The definition of 'repositoryHomeSelectionView_user' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/repositoryHomeSelectionView_user.graphql");
  }
}, {
  direction: 'forward',

  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.user && props.user.organizations;
  },

  /* istanbul ignore next */
  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      totalCount
    });
  },

  /* istanbul ignore next */
  getVariables(props, {
    count,
    cursor
  }) {
    return {
      id: props.user.id,
      organizationCount: count,
      organizationCursor: cursor
    };
  },

  query: function () {
    const node = require("./__generated__/repositoryHomeSelectionViewQuery.graphql");

    if (node.hash && node.hash !== "67e7843e3ff792e86e979cc948929ea3") {
      console.error("The definition of 'repositoryHomeSelectionViewQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/repositoryHomeSelectionViewQuery.graphql");
  }
});

exports.default = _default;