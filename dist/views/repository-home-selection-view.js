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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZXBvc2l0b3J5LWhvbWUtc2VsZWN0aW9uLXZpZXcuanMiXSwibmFtZXMiOlsiUEFHRV9ERUxBWSIsIlBBR0VfU0laRSIsIkJhcmVSZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsIm93bmVyIiwiYXZhdGFyVVJMIiwibG9naW4iLCJkaXNhYmxlZCIsInBsYWNlaG9sZGVyIiwicHJvcHMiLCJkaWRDaGFuZ2VPd25lcklEIiwiaWQiLCJyZWxheSIsImlzTG9hZGluZyIsInNldFRpbWVvdXQiLCJsb2FkTmV4dFBhZ2UiLCJsb2FkTW9yZSIsInJlbmRlciIsIm93bmVycyIsImdldE93bmVycyIsImN1cnJlbnRPd25lciIsImZpbmQiLCJvIiwic2VsZWN0ZWRPd25lcklEIiwidGFiR3JvdXAiLCJjb21tYW5kcyIsImF1dG9mb2N1c093bmVyIiwicmVuZGVyT3duZXIiLCJkaWRDaGFuZ2VPd25lciIsImF1dG9mb2N1c05hbWUiLCJuYW1lQnVmZmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJzY2hlZHVsZVBhZ2VMb2FkIiwiY29tcG9uZW50RGlkVXBkYXRlIiwidXNlciIsImF2YXRhclVybCIsIm9yZ2FuaXphdGlvbnMiLCJlZGdlcyIsIm5vZGUiLCJwdXNoIiwidmlld2VyQ2FuQ3JlYXRlUmVwb3NpdG9yaWVzIiwiaGFzTW9yZSIsIlByb3BUeXBlcyIsInNoYXBlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJhcnJheU9mIiwiYm9vbCIsIm9iamVjdCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwib3JnYW5pemF0aW9uQ291bnQiLCJvcmdhbml6YXRpb25DdXJzb3IiLCJxdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztB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QUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRG9FLENBQTNELEVBK0JaO0FBQ0RnQixFQUFBQSxTQUFTLEVBQUUsU0FEVjs7QUFFRDtBQUNBQyxFQUFBQSxzQkFBc0IsQ0FBQzFDLEtBQUQsRUFBUTtBQUM1QixXQUFPQSxLQUFLLENBQUN5QixJQUFOLElBQWN6QixLQUFLLENBQUN5QixJQUFOLENBQVdFLGFBQWhDO0FBQ0QsR0FMQTs7QUFNRDtBQUNBZ0IsRUFBQUEsb0JBQW9CLENBQUNDLFFBQUQsRUFBV0MsVUFBWCxFQUF1QjtBQUN6Qyw2QkFBV0QsUUFBWDtBQUFxQkMsTUFBQUE7QUFBckI7QUFDRCxHQVRBOztBQVVEO0FBQ0FDLEVBQUFBLFlBQVksQ0FBQzlDLEtBQUQsRUFBUTtBQUFDK0MsSUFBQUEsS0FBRDtBQUFRQyxJQUFBQTtBQUFSLEdBQVIsRUFBeUI7QUFDbkMsV0FBTztBQUNMOUMsTUFBQUEsRUFBRSxFQUFFRixLQUFLLENBQUN5QixJQUFOLENBQVd2QixFQURWO0FBRUwrQyxNQUFBQSxpQkFBaUIsRUFBRUYsS0FGZDtBQUdMRyxNQUFBQSxrQkFBa0IsRUFBRUY7QUFIZixLQUFQO0FBS0QsR0FqQkE7O0FBa0JERyxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFsQkosQ0EvQlksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7VGFiYmFibGVUZXh0RWRpdG9yLCBUYWJiYWJsZVNlbGVjdH0gZnJvbSAnLi90YWJiYWJsZSc7XG5cbmNvbnN0IFBBR0VfREVMQVkgPSA1MDA7XG5cbmV4cG9ydCBjb25zdCBQQUdFX1NJWkUgPSA1MDtcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5XG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICB1c2VyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG9yZ2FuaXphdGlvbnM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGVkZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgIG5vZGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgdmlld2VyQ2FuQ3JlYXRlUmVwb3NpdG9yaWVzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSksXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgIH0pLFxuXG4gICAgLy8gTW9kZWxcbiAgICBuYW1lQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkT3duZXJJRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRhYkdyb3VwOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgYXV0b2ZvY3VzT3duZXI6IFByb3BUeXBlcy5ib29sLFxuICAgIGF1dG9mb2N1c05hbWU6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgLy8gU2VsZWN0aW9uIGNhbGxiYWNrXG4gICAgZGlkQ2hhbmdlT3duZXJJRDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBhdXRvZm9jdXNPd25lcjogZmFsc2UsXG4gICAgYXV0b2ZvY3VzTmFtZTogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgb3duZXJzID0gdGhpcy5nZXRPd25lcnMoKTtcbiAgICBjb25zdCBjdXJyZW50T3duZXIgPSBvd25lcnMuZmluZChvID0+IG8uaWQgPT09IHRoaXMucHJvcHMuc2VsZWN0ZWRPd25lcklEKSB8fCBvd25lcnNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVwb3NpdG9yeUhvbWVcIj5cbiAgICAgICAgPFRhYmJhYmxlU2VsZWN0XG4gICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgYXV0b2ZvY3VzPXt0aGlzLnByb3BzLmF1dG9mb2N1c093bmVyfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXBvc2l0b3J5SG9tZS1vd25lclwiXG4gICAgICAgICAgY2xlYXJhYmxlPXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgb3B0aW9ucz17b3duZXJzfVxuICAgICAgICAgIG9wdGlvblJlbmRlcmVyPXt0aGlzLnJlbmRlck93bmVyfVxuICAgICAgICAgIHZhbHVlPXtjdXJyZW50T3duZXJ9XG4gICAgICAgICAgdmFsdWVSZW5kZXJlcj17dGhpcy5yZW5kZXJPd25lcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5kaWRDaGFuZ2VPd25lcn1cbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJlcG9zaXRvcnlIb21lLXNlcGFyYXRvclwiPi88L3NwYW4+XG4gICAgICAgIDxUYWJiYWJsZVRleHRFZGl0b3JcbiAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBhdXRvZm9jdXM9e3RoaXMucHJvcHMuYXV0b2ZvY3VzTmFtZX1cbiAgICAgICAgICBtaW5pPXt0cnVlfVxuICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5uYW1lQnVmZmVyfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck93bmVyID0gb3duZXIgPT4gKFxuICAgIDxGcmFnbWVudD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlcG9zaXRvcnlIb21lLW93bmVyT3B0aW9uXCI+XG4gICAgICAgIDxpbWcgYWx0PVwiXCIgc3JjPXtvd25lci5hdmF0YXJVUkx9IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXBvc2l0b3J5SG9tZS1vd25lckF2YXRhclwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXBvc2l0b3J5SG9tZS1vd25lck5hbWVcIj57b3duZXIubG9naW59PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICB7b3duZXIuZGlzYWJsZWQgJiYgIW93bmVyLnBsYWNlaG9sZGVyICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVwb3NpdG9yeUhvbWUtb3duZXJVbndyaXRhYmxlXCI+XG4gICAgICAgICAgKGluc3VmZmljaWVudCBwZXJtaXNzaW9ucylcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvRnJhZ21lbnQ+XG4gICk7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zY2hlZHVsZVBhZ2VMb2FkKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zY2hlZHVsZVBhZ2VMb2FkKCk7XG4gIH1cblxuICBnZXRPd25lcnMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnVzZXIpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBpZDogJ2xvYWRpbmcnLFxuICAgICAgICBsb2dpbjogJ2xvYWRpbmcuLi4nLFxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxuICAgICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgICAgcGxhY2Vob2xkZXI6IHRydWUsXG4gICAgICB9XTtcbiAgICB9XG5cbiAgICBjb25zdCBvd25lcnMgPSBbe1xuICAgICAgaWQ6IHRoaXMucHJvcHMudXNlci5pZCxcbiAgICAgIGxvZ2luOiB0aGlzLnByb3BzLnVzZXIubG9naW4sXG4gICAgICBhdmF0YXJVUkw6IHRoaXMucHJvcHMudXNlci5hdmF0YXJVcmwsXG4gICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgfV07XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXRoaXMucHJvcHMudXNlci5vcmdhbml6YXRpb25zLmVkZ2VzKSB7XG4gICAgICByZXR1cm4gb3duZXJzO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qge25vZGV9IG9mIHRoaXMucHJvcHMudXNlci5vcmdhbml6YXRpb25zLmVkZ2VzKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmICghbm9kZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgb3duZXJzLnB1c2goe1xuICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgbG9naW46IG5vZGUubG9naW4sXG4gICAgICAgIGF2YXRhclVSTDogbm9kZS5hdmF0YXJVcmwsXG4gICAgICAgIGRpc2FibGVkOiAhbm9kZS52aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZWxheSAmJiB0aGlzLnByb3BzLnJlbGF5Lmhhc01vcmUoKSkge1xuICAgICAgb3duZXJzLnB1c2goe1xuICAgICAgICBpZDogJ2xvYWRpbmcnLFxuICAgICAgICBsb2dpbjogJ2xvYWRpbmcuLi4nLFxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxuICAgICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgICAgcGxhY2Vob2xkZXI6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3duZXJzO1xuICB9XG5cbiAgZGlkQ2hhbmdlT3duZXIgPSBvd25lciA9PiB0aGlzLnByb3BzLmRpZENoYW5nZU93bmVySUQob3duZXIuaWQpO1xuXG4gIHNjaGVkdWxlUGFnZUxvYWQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlbGF5Lmhhc01vcmUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQodGhpcy5sb2FkTmV4dFBhZ2UsIFBBR0VfREVMQVkpO1xuICB9XG5cbiAgbG9hZE5leHRQYWdlID0gKCkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh0aGlzLnByb3BzLnJlbGF5LmlzTG9hZGluZygpKSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMubG9hZE5leHRQYWdlLCBQQUdFX0RFTEFZKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKFBBR0VfU0laRSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlUmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3LCB7XG4gIHVzZXI6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIgb24gVXNlclxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgb3JnYW5pemF0aW9uQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIG9yZ2FuaXphdGlvbkN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgbG9naW5cbiAgICAgIGF2YXRhclVybChzaXplOiAyNClcbiAgICAgIG9yZ2FuaXphdGlvbnMoXG4gICAgICAgIGZpcnN0OiAkb3JnYW5pemF0aW9uQ291bnRcbiAgICAgICAgYWZ0ZXI6ICRvcmdhbml6YXRpb25DdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIlJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld19vcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgcGFnZUluZm8ge1xuICAgICAgICAgIGhhc05leHRQYWdlXG4gICAgICAgICAgZW5kQ3Vyc29yXG4gICAgICAgIH1cblxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgICAgbG9naW5cbiAgICAgICAgICAgIGF2YXRhclVybChzaXplOiAyNClcbiAgICAgICAgICAgIHZpZXdlckNhbkNyZWF0ZVJlcG9zaXRvcmllc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMudXNlciAmJiBwcm9wcy51c2VyLm9yZ2FuaXphdGlvbnM7XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHsuLi5wcmV2VmFycywgdG90YWxDb3VudH07XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwcm9wcy51c2VyLmlkLFxuICAgICAgb3JnYW5pemF0aW9uQ291bnQ6IGNvdW50LFxuICAgICAgb3JnYW5pemF0aW9uQ3Vyc29yOiBjdXJzb3IsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3UXVlcnkoXG4gICAgICAkaWQ6IElEIVxuICAgICAgJG9yZ2FuaXphdGlvbkNvdW50OiBJbnQhXG4gICAgICAkb3JnYW5pemF0aW9uQ3Vyc29yOiBTdHJpbmdcbiAgICApIHtcbiAgICAgIG5vZGUoaWQ6ICRpZCkge1xuICAgICAgICAuLi4gb24gVXNlciB7XG4gICAgICAgICAgLi4ucmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbkNvdW50OiAkb3JnYW5pemF0aW9uQ291bnRcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbkN1cnNvcjogJG9yZ2FuaXphdGlvbkN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19