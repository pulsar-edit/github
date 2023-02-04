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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQQUdFX0RFTEFZIiwiUEFHRV9TSVpFIiwiQmFyZVJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwib3duZXIiLCJhdmF0YXJVUkwiLCJsb2dpbiIsImRpc2FibGVkIiwicGxhY2Vob2xkZXIiLCJwcm9wcyIsImRpZENoYW5nZU93bmVySUQiLCJpZCIsInJlbGF5IiwiaXNMb2FkaW5nIiwic2V0VGltZW91dCIsImxvYWROZXh0UGFnZSIsImxvYWRNb3JlIiwicmVuZGVyIiwib3duZXJzIiwiZ2V0T3duZXJzIiwiY3VycmVudE93bmVyIiwiZmluZCIsIm8iLCJzZWxlY3RlZE93bmVySUQiLCJ0YWJHcm91cCIsImNvbW1hbmRzIiwiYXV0b2ZvY3VzT3duZXIiLCJyZW5kZXJPd25lciIsImRpZENoYW5nZU93bmVyIiwiYXV0b2ZvY3VzTmFtZSIsIm5hbWVCdWZmZXIiLCJjb21wb25lbnREaWRNb3VudCIsInNjaGVkdWxlUGFnZUxvYWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJ1c2VyIiwiYXZhdGFyVXJsIiwib3JnYW5pemF0aW9ucyIsImVkZ2VzIiwibm9kZSIsInB1c2giLCJ2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXMiLCJoYXNNb3JlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImFycmF5T2YiLCJib29sIiwib2JqZWN0IiwiY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lciIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwib3JnYW5pemF0aW9uQ291bnQiLCJvcmdhbml6YXRpb25DdXJzb3IiLCJxdWVyeSJdLCJzb3VyY2VzIjpbInJlcG9zaXRvcnktaG9tZS1zZWxlY3Rpb24tdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1RhYmJhYmxlVGV4dEVkaXRvciwgVGFiYmFibGVTZWxlY3R9IGZyb20gJy4vdGFiYmFibGUnO1xuXG5jb25zdCBQQUdFX0RFTEFZID0gNTAwO1xuXG5leHBvcnQgY29uc3QgUEFHRV9TSVpFID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheVxuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgdXNlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvcmdhbml6YXRpb25zOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBlZGdlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBub2RlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIHZpZXdlckNhbkNyZWF0ZVJlcG9zaXRvcmllczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSkpLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICB9KSxcblxuICAgIC8vIE1vZGVsXG4gICAgbmFtZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZE93bmVySUQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB0YWJHcm91cDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGF1dG9mb2N1c093bmVyOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBhdXRvZm9jdXNOYW1lOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIC8vIFNlbGVjdGlvbiBjYWxsYmFja1xuICAgIGRpZENoYW5nZU93bmVySUQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYXV0b2ZvY3VzT3duZXI6IGZhbHNlLFxuICAgIGF1dG9mb2N1c05hbWU6IGZhbHNlLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG93bmVycyA9IHRoaXMuZ2V0T3duZXJzKCk7XG4gICAgY29uc3QgY3VycmVudE93bmVyID0gb3duZXJzLmZpbmQobyA9PiBvLmlkID09PSB0aGlzLnByb3BzLnNlbGVjdGVkT3duZXJJRCkgfHwgb3duZXJzWzBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlcG9zaXRvcnlIb21lXCI+XG4gICAgICAgIDxUYWJiYWJsZVNlbGVjdFxuICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGF1dG9mb2N1cz17dGhpcy5wcm9wcy5hdXRvZm9jdXNPd25lcn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmVwb3NpdG9yeUhvbWUtb3duZXJcIlxuICAgICAgICAgIGNsZWFyYWJsZT17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIG9wdGlvbnM9e293bmVyc31cbiAgICAgICAgICBvcHRpb25SZW5kZXJlcj17dGhpcy5yZW5kZXJPd25lcn1cbiAgICAgICAgICB2YWx1ZT17Y3VycmVudE93bmVyfVxuICAgICAgICAgIHZhbHVlUmVuZGVyZXI9e3RoaXMucmVuZGVyT3duZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuZGlkQ2hhbmdlT3duZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXBvc2l0b3J5SG9tZS1zZXBhcmF0b3JcIj4vPC9zcGFuPlxuICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgYXV0b2ZvY3VzPXt0aGlzLnByb3BzLmF1dG9mb2N1c05hbWV9XG4gICAgICAgICAgbWluaT17dHJ1ZX1cbiAgICAgICAgICBidWZmZXI9e3RoaXMucHJvcHMubmFtZUJ1ZmZlcn1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJPd25lciA9IG93bmVyID0+IChcbiAgICA8RnJhZ21lbnQ+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXBvc2l0b3J5SG9tZS1vd25lck9wdGlvblwiPlxuICAgICAgICA8aW1nIGFsdD1cIlwiIHNyYz17b3duZXIuYXZhdGFyVVJMfSBjbGFzc05hbWU9XCJnaXRodWItUmVwb3NpdG9yeUhvbWUtb3duZXJBdmF0YXJcIiAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVwb3NpdG9yeUhvbWUtb3duZXJOYW1lXCI+e293bmVyLmxvZ2lufTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge293bmVyLmRpc2FibGVkICYmICFvd25lci5wbGFjZWhvbGRlciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlcG9zaXRvcnlIb21lLW93bmVyVW53cml0YWJsZVwiPlxuICAgICAgICAgIChpbnN1ZmZpY2llbnQgcGVybWlzc2lvbnMpXG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L0ZyYWdtZW50PlxuICApO1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc2NoZWR1bGVQYWdlTG9hZCgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc2NoZWR1bGVQYWdlTG9hZCgpO1xuICB9XG5cbiAgZ2V0T3duZXJzKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy51c2VyKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgaWQ6ICdsb2FkaW5nJyxcbiAgICAgICAgbG9naW46ICdsb2FkaW5nLi4uJyxcbiAgICAgICAgYXZhdGFyVVJMOiAnJyxcbiAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgIHBsYWNlaG9sZGVyOiB0cnVlLFxuICAgICAgfV07XG4gICAgfVxuXG4gICAgY29uc3Qgb3duZXJzID0gW3tcbiAgICAgIGlkOiB0aGlzLnByb3BzLnVzZXIuaWQsXG4gICAgICBsb2dpbjogdGhpcy5wcm9wcy51c2VyLmxvZ2luLFxuICAgICAgYXZhdGFyVVJMOiB0aGlzLnByb3BzLnVzZXIuYXZhdGFyVXJsLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgIH1dO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aGlzLnByb3BzLnVzZXIub3JnYW5pemF0aW9ucy5lZGdlcykge1xuICAgICAgcmV0dXJuIG93bmVycztcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHtub2RlfSBvZiB0aGlzLnByb3BzLnVzZXIub3JnYW5pemF0aW9ucy5lZGdlcykge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG93bmVycy5wdXNoKHtcbiAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgIGxvZ2luOiBub2RlLmxvZ2luLFxuICAgICAgICBhdmF0YXJVUkw6IG5vZGUuYXZhdGFyVXJsLFxuICAgICAgICBkaXNhYmxlZDogIW5vZGUudmlld2VyQ2FuQ3JlYXRlUmVwb3NpdG9yaWVzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMucmVsYXkgJiYgdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkpIHtcbiAgICAgIG93bmVycy5wdXNoKHtcbiAgICAgICAgaWQ6ICdsb2FkaW5nJyxcbiAgICAgICAgbG9naW46ICdsb2FkaW5nLi4uJyxcbiAgICAgICAgYXZhdGFyVVJMOiAnJyxcbiAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgIHBsYWNlaG9sZGVyOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG93bmVycztcbiAgfVxuXG4gIGRpZENoYW5nZU93bmVyID0gb3duZXIgPT4gdGhpcy5wcm9wcy5kaWRDaGFuZ2VPd25lcklEKG93bmVyLmlkKTtcblxuICBzY2hlZHVsZVBhZ2VMb2FkKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMubG9hZE5leHRQYWdlLCBQQUdFX0RFTEFZKTtcbiAgfVxuXG4gIGxvYWROZXh0UGFnZSA9ICgpID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAodGhpcy5wcm9wcy5yZWxheS5pc0xvYWRpbmcoKSkge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmxvYWROZXh0UGFnZSwgUEFHRV9ERUxBWSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5yZWxheS5sb2FkTW9yZShQQUdFX1NJWkUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoQmFyZVJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlldywge1xuICB1c2VyOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyIG9uIFVzZXJcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIG9yZ2FuaXphdGlvbkNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBvcmdhbml6YXRpb25DdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgaWRcbiAgICAgIGxvZ2luXG4gICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXG4gICAgICBvcmdhbml6YXRpb25zKFxuICAgICAgICBmaXJzdDogJG9yZ2FuaXphdGlvbkNvdW50XG4gICAgICAgIGFmdGVyOiAkb3JnYW5pemF0aW9uQ3Vyc29yXG4gICAgICApIEBjb25uZWN0aW9uKGtleTogXCJSZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfb3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHtcbiAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgIGVuZEN1cnNvclxuICAgICAgICB9XG5cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXG4gICAgICAgICAgICB2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnVzZXIgJiYgcHJvcHMudXNlci5vcmdhbml6YXRpb25zO1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRGcmFnbWVudFZhcmlhYmxlcyhwcmV2VmFycywgdG90YWxDb3VudCkge1xuICAgIHJldHVybiB7Li4ucHJldlZhcnMsIHRvdGFsQ291bnR9O1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogcHJvcHMudXNlci5pZCxcbiAgICAgIG9yZ2FuaXphdGlvbkNvdW50OiBjb3VudCxcbiAgICAgIG9yZ2FuaXphdGlvbkN1cnNvcjogY3Vyc29yLFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5KFxuICAgICAgJGlkOiBJRCFcbiAgICAgICRvcmdhbml6YXRpb25Db3VudDogSW50IVxuICAgICAgJG9yZ2FuaXphdGlvbkN1cnNvcjogU3RyaW5nXG4gICAgKSB7XG4gICAgICBub2RlKGlkOiAkaWQpIHtcbiAgICAgICAgLi4uIG9uIFVzZXIge1xuICAgICAgICAgIC4uLnJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyIEBhcmd1bWVudHMoXG4gICAgICAgICAgICBvcmdhbml6YXRpb25Db3VudDogJG9yZ2FuaXphdGlvbkNvdW50XG4gICAgICAgICAgICBvcmdhbml6YXRpb25DdXJzb3I6ICRvcmdhbml6YXRpb25DdXJzb3JcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBOEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUU5RCxNQUFNQSxVQUFVLEdBQUcsR0FBRztBQUVmLE1BQU1DLFNBQVMsR0FBRyxFQUFFO0FBQUM7QUFFckIsTUFBTUMsK0JBQStCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBQUE7SUFBQTtJQUFBLHFDQTJFckRDLEtBQUssSUFDakIsNkJBQUMsZUFBUSxRQUNQO01BQUssU0FBUyxFQUFDO0lBQW1DLEdBQ2hEO01BQUssR0FBRyxFQUFDLEVBQUU7TUFBQyxHQUFHLEVBQUVBLEtBQUssQ0FBQ0MsU0FBVTtNQUFDLFNBQVMsRUFBQztJQUFtQyxFQUFHLEVBQ2xGO01BQU0sU0FBUyxFQUFDO0lBQWlDLEdBQUVELEtBQUssQ0FBQ0UsS0FBSyxDQUFRLENBQ2xFLEVBQ0xGLEtBQUssQ0FBQ0csUUFBUSxJQUFJLENBQUNILEtBQUssQ0FBQ0ksV0FBVyxJQUNuQztNQUFLLFNBQVMsRUFBQztJQUF1QyxnQ0FHdkQsQ0FFSjtJQUFBLHdDQTREZ0JKLEtBQUssSUFBSSxJQUFJLENBQUNLLEtBQUssQ0FBQ0MsZ0JBQWdCLENBQUNOLEtBQUssQ0FBQ08sRUFBRSxDQUFDO0lBQUEsc0NBVWhELE1BQU07TUFDbkI7TUFDQSxJQUFJLElBQUksQ0FBQ0YsS0FBSyxDQUFDRyxLQUFLLENBQUNDLFNBQVMsRUFBRSxFQUFFO1FBQ2hDQyxVQUFVLENBQUMsSUFBSSxDQUFDQyxZQUFZLEVBQUVoQixVQUFVLENBQUM7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