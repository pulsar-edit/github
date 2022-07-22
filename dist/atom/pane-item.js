"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _uriPattern = _interopRequireWildcard(require("./uri-pattern"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _stubItem = _interopRequireDefault(require("../items/stub-item"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * PaneItem registers an opener with the current Atom workspace as long as this component is mounted. The opener will
 * trigger on URIs that match a specified pattern and render a subtree returned by a render prop.
 *
 * The render prop can receive three arguments:
 *
 * * itemHolder: A RefHolder. If used as the target for a ref, the referenced component will be used as the "item" of
 *   the pane item - its `getTitle()`, `getIconName()`, and other methods will be used by the pane.
 * * params: An object containing the named parameters captured by the URI pattern.
 * * uri: The exact, matched URI used to launch this item.
 *
 * render() {
 *   return (
 *     <PaneItem workspace={this.props.workspace} uriPattern='atom-github://host/{id}'>
 *       {({itemHolder, params}) => (
 *         <ItemComponent ref={itemHolder.setter} id={params.id} />
 *       )}
 *     </PaneItem>
 *   );
 * }
 */
class PaneItem extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'opener');
    const uriPattern = new _uriPattern.default(this.props.uriPattern);
    const currentlyOpen = this.props.workspace.getPaneItems().reduce((arr, item) => {
      const element = item.getElement ? item.getElement() : null;
      const match = item.getURI ? uriPattern.matches(item.getURI()) : _uriPattern.nonURIMatch;
      const stub = item.setRealItem ? item : null;

      if (element && match.ok()) {
        const openItem = new OpenItem(match, element, stub);
        arr.push(openItem);
      }

      return arr;
    }, []);
    this.subs = new _eventKit.CompositeDisposable();
    this.state = {
      uriPattern,
      currentlyOpen
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.uriPattern.getOriginal() === nextProps.uriPattern) {
      return null;
    }

    return {
      uriPattern: new _uriPattern.default(nextProps.uriPattern)
    };
  }

  componentDidMount() {
    // Listen for and adopt StubItems that are added after this component has
    // already been mounted.
    this.subs.add(this.props.workspace.onDidAddPaneItem(({
      item
    }) => {
      if (!item._getStub) {
        return;
      }

      const stub = item._getStub();

      if (stub.getRealItem() !== null) {
        return;
      }

      const match = this.state.uriPattern.matches(item.getURI());

      if (!match.ok()) {
        return;
      }

      const openItem = new OpenItem(match, stub.getElement(), stub);
      openItem.hydrateStub({
        copy: () => this.copyOpenItem(openItem)
      });

      if (this.props.className) {
        openItem.addClassName(this.props.className);
      }

      this.registerCloseListener(item, openItem);
      this.setState(prevState => ({
        currentlyOpen: [...prevState.currentlyOpen, openItem]
      }));
    }));

    for (const openItem of this.state.currentlyOpen) {
      this.registerCloseListener(openItem.stubItem, openItem);
      openItem.hydrateStub({
        copy: () => this.copyOpenItem(openItem)
      });

      if (this.props.className) {
        openItem.addClassName(this.props.className);
      }
    }

    this.subs.add(this.props.workspace.addOpener(this.opener));
  }

  render() {
    return this.state.currentlyOpen.map(item => {
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
        key: item.getKey()
      }, item.renderPortal(this.props.children));
    });
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  opener(uri) {
    const m = this.state.uriPattern.matches(uri);

    if (!m.ok()) {
      return undefined;
    }

    const openItem = new OpenItem(m);

    if (this.props.className) {
      openItem.addClassName(this.props.className);
    }

    return new Promise(resolve => {
      this.setState(prevState => ({
        currentlyOpen: [...prevState.currentlyOpen, openItem]
      }), () => {
        const paneItem = openItem.create({
          copy: () => this.copyOpenItem(openItem)
        });
        this.registerCloseListener(paneItem, openItem);
        resolve(paneItem);
      });
    });
  }

  copyOpenItem(openItem) {
    const m = this.state.uriPattern.matches(openItem.getURI());

    if (!m.ok()) {
      return null;
    }

    const stub = _stubItem.default.create('generic', openItem.getStubProps(), openItem.getURI());

    const copiedItem = new OpenItem(m, stub.getElement(), stub);
    this.setState(prevState => ({
      currentlyOpen: [...prevState.currentlyOpen, copiedItem]
    }), () => {
      this.registerCloseListener(stub, copiedItem);
      copiedItem.hydrateStub({
        copy: () => this.copyOpenItem(copiedItem)
      });
    });
    return stub;
  }

  registerCloseListener(paneItem, openItem) {
    const sub = this.props.workspace.onDidDestroyPaneItem(({
      item
    }) => {
      if (item === paneItem) {
        sub.dispose();
        this.subs.remove(sub);
        this.setState(prevState => ({
          currentlyOpen: prevState.currentlyOpen.filter(each => each !== openItem)
        }));
      }
    });
    this.subs.add(sub);
  }

}
/**
 * A subtree rendered through a portal onto a detached DOM node for use as the root as a PaneItem.
 */


exports.default = PaneItem;

_defineProperty(PaneItem, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  children: _propTypes.default.func.isRequired,
  uriPattern: _propTypes.default.string.isRequired,
  className: _propTypes.default.string
});

class OpenItem {
  constructor(match, element = null, stub = null) {
    this.id = this.constructor.nextID;
    this.constructor.nextID++;
    this.domNode = element || document.createElement('div');
    this.domNode.tabIndex = '-1';
    this.domNode.onfocus = this.onFocus.bind(this);
    this.stubItem = stub;
    this.stubProps = stub ? stub.props : {};
    this.match = match;
    this.itemHolder = new _refHolder.default();
  }

  getURI() {
    return this.match.getURI();
  }

  create(extra = {}) {
    const h = this.itemHolder.isEmpty() ? null : this.itemHolder;
    return (0, _helpers.createItem)(this.domNode, h, this.match.getURI(), extra);
  }

  hydrateStub(extra = {}) {
    if (this.stubItem) {
      this.stubItem.setRealItem(this.create(extra));
      this.stubItem = null;
    }
  }

  addClassName(className) {
    this.domNode.classList.add(className);
  }

  getKey() {
    return this.id;
  }

  getStubProps() {
    const itemProps = this.itemHolder.map(item => ({
      title: item.getTitle ? item.getTitle() : null,
      iconName: item.getIconName ? item.getIconName() : null
    }));
    return _objectSpread({}, this.stubProps, {}, itemProps);
  }

  onFocus() {
    return this.itemHolder.map(item => item.focus && item.focus());
  }

  renderPortal(renderProp) {
    return _reactDom.default.createPortal(renderProp({
      deserialized: this.stubProps,
      itemHolder: this.itemHolder,
      params: this.match.getParams(),
      uri: this.match.getURI()
    }), this.domNode);
  }

}

_defineProperty(OpenItem, "nextID", 0);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL3BhbmUtaXRlbS5qcyJdLCJuYW1lcyI6WyJQYW5lSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInVyaVBhdHRlcm4iLCJVUklQYXR0ZXJuIiwiY3VycmVudGx5T3BlbiIsIndvcmtzcGFjZSIsImdldFBhbmVJdGVtcyIsInJlZHVjZSIsImFyciIsIml0ZW0iLCJlbGVtZW50IiwiZ2V0RWxlbWVudCIsIm1hdGNoIiwiZ2V0VVJJIiwibWF0Y2hlcyIsIm5vblVSSU1hdGNoIiwic3R1YiIsInNldFJlYWxJdGVtIiwib2siLCJvcGVuSXRlbSIsIk9wZW5JdGVtIiwicHVzaCIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwic3RhdGUiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJuZXh0UHJvcHMiLCJwcmV2U3RhdGUiLCJnZXRPcmlnaW5hbCIsImNvbXBvbmVudERpZE1vdW50IiwiYWRkIiwib25EaWRBZGRQYW5lSXRlbSIsIl9nZXRTdHViIiwiZ2V0UmVhbEl0ZW0iLCJoeWRyYXRlU3R1YiIsImNvcHkiLCJjb3B5T3Blbkl0ZW0iLCJjbGFzc05hbWUiLCJhZGRDbGFzc05hbWUiLCJyZWdpc3RlckNsb3NlTGlzdGVuZXIiLCJzZXRTdGF0ZSIsInN0dWJJdGVtIiwiYWRkT3BlbmVyIiwib3BlbmVyIiwicmVuZGVyIiwibWFwIiwiZ2V0S2V5IiwicmVuZGVyUG9ydGFsIiwiY2hpbGRyZW4iLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJ1cmkiLCJtIiwidW5kZWZpbmVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwYW5lSXRlbSIsImNyZWF0ZSIsIlN0dWJJdGVtIiwiZ2V0U3R1YlByb3BzIiwiY29waWVkSXRlbSIsInN1YiIsIm9uRGlkRGVzdHJveVBhbmVJdGVtIiwicmVtb3ZlIiwiZmlsdGVyIiwiZWFjaCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwic3RyaW5nIiwiaWQiLCJuZXh0SUQiLCJkb21Ob2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidGFiSW5kZXgiLCJvbmZvY3VzIiwib25Gb2N1cyIsImJpbmQiLCJzdHViUHJvcHMiLCJpdGVtSG9sZGVyIiwiUmVmSG9sZGVyIiwiZXh0cmEiLCJoIiwiaXNFbXB0eSIsImNsYXNzTGlzdCIsIml0ZW1Qcm9wcyIsInRpdGxlIiwiZ2V0VGl0bGUiLCJpY29uTmFtZSIsImdldEljb25OYW1lIiwiZm9jdXMiLCJyZW5kZXJQcm9wIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJkZXNlcmlhbGl6ZWQiLCJwYXJhbXMiLCJnZXRQYXJhbXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxRQUFOLFNBQXVCQyxlQUFNQyxTQUE3QixDQUF1QztBQVFwREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUNBLDJCQUFTLElBQVQsRUFBZSxRQUFmO0FBRUEsVUFBTUMsVUFBVSxHQUFHLElBQUlDLG1CQUFKLENBQWUsS0FBS0YsS0FBTCxDQUFXQyxVQUExQixDQUFuQjtBQUNBLFVBQU1FLGFBQWEsR0FBRyxLQUFLSCxLQUFMLENBQVdJLFNBQVgsQ0FBcUJDLFlBQXJCLEdBQ25CQyxNQURtQixDQUNaLENBQUNDLEdBQUQsRUFBTUMsSUFBTixLQUFlO0FBQ3JCLFlBQU1DLE9BQU8sR0FBR0QsSUFBSSxDQUFDRSxVQUFMLEdBQWtCRixJQUFJLENBQUNFLFVBQUwsRUFBbEIsR0FBc0MsSUFBdEQ7QUFDQSxZQUFNQyxLQUFLLEdBQUdILElBQUksQ0FBQ0ks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LE1BQVg7QUFKSSxLQUFELENBREwsRUFPTCxLQUFLNEQsT0FQQSxDQUFQO0FBU0Q7O0FBbEVZOztnQkFBVHJELFEsWUFDWSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IFVSSVBhdHRlcm4sIHtub25VUklNYXRjaH0gZnJvbSAnLi91cmktcGF0dGVybic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBTdHViSXRlbSBmcm9tICcuLi9pdGVtcy9zdHViLWl0ZW0nO1xuaW1wb3J0IHtjcmVhdGVJdGVtLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbi8qKlxuICogUGFuZUl0ZW0gcmVnaXN0ZXJzIGFuIG9wZW5lciB3aXRoIHRoZSBjdXJyZW50IEF0b20gd29ya3NwYWNlIGFzIGxvbmcgYXMgdGhpcyBjb21wb25lbnQgaXMgbW91bnRlZC4gVGhlIG9wZW5lciB3aWxsXG4gKiB0cmlnZ2VyIG9uIFVSSXMgdGhhdCBtYXRjaCBhIHNwZWNpZmllZCBwYXR0ZXJuIGFuZCByZW5kZXIgYSBzdWJ0cmVlIHJldHVybmVkIGJ5IGEgcmVuZGVyIHByb3AuXG4gKlxuICogVGhlIHJlbmRlciBwcm9wIGNhbiByZWNlaXZlIHRocmVlIGFyZ3VtZW50czpcbiAqXG4gKiAqIGl0ZW1Ib2xkZXI6IEEgUmVmSG9sZGVyLiBJZiB1c2VkIGFzIHRoZSB0YXJnZXQgZm9yIGEgcmVmLCB0aGUgcmVmZXJlbmNlZCBjb21wb25lbnQgd2lsbCBiZSB1c2VkIGFzIHRoZSBcIml0ZW1cIiBvZlxuICogICB0aGUgcGFuZSBpdGVtIC0gaXRzIGBnZXRUaXRsZSgpYCwgYGdldEljb25OYW1lKClgLCBhbmQgb3RoZXIgbWV0aG9kcyB3aWxsIGJlIHVzZWQgYnkgdGhlIHBhbmUuXG4gKiAqIHBhcmFtczogQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5hbWVkIHBhcmFtZXRlcnMgY2FwdHVyZWQgYnkgdGhlIFVSSSBwYXR0ZXJuLlxuICogKiB1cmk6IFRoZSBleGFjdCwgbWF0Y2hlZCBVUkkgdXNlZCB0byBsYXVuY2ggdGhpcyBpdGVtLlxuICpcbiAqIHJlbmRlcigpIHtcbiAqICAgcmV0dXJuIChcbiAqICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj0nYXRvbS1naXRodWI6Ly9ob3N0L3tpZH0nPlxuICogICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICogICAgICAgICA8SXRlbUNvbXBvbmVudCByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfSBpZD17cGFyYW1zLmlkfSAvPlxuICogICAgICAgKX1cbiAqICAgICA8L1BhbmVJdGVtPlxuICogICApO1xuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXJpUGF0dGVybjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdvcGVuZXInKTtcblxuICAgIGNvbnN0IHVyaVBhdHRlcm4gPSBuZXcgVVJJUGF0dGVybih0aGlzLnByb3BzLnVyaVBhdHRlcm4pO1xuICAgIGNvbnN0IGN1cnJlbnRseU9wZW4gPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgICAgLnJlZHVjZSgoYXJyLCBpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBpdGVtLmdldEVsZW1lbnQgPyBpdGVtLmdldEVsZW1lbnQoKSA6IG51bGw7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gaXRlbS5nZXRVUkkgPyB1cmlQYXR0ZXJuLm1hdGNoZXMoaXRlbS5nZXRVUkkoKSkgOiBub25VUklNYXRjaDtcbiAgICAgICAgY29uc3Qgc3R1YiA9IGl0ZW0uc2V0UmVhbEl0ZW0gPyBpdGVtIDogbnVsbDtcblxuICAgICAgICBpZiAoZWxlbWVudCAmJiBtYXRjaC5vaygpKSB7XG4gICAgICAgICAgY29uc3Qgb3Blbkl0ZW0gPSBuZXcgT3Blbkl0ZW0obWF0Y2gsIGVsZW1lbnQsIHN0dWIpO1xuICAgICAgICAgIGFyci5wdXNoKG9wZW5JdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgICB9LCBbXSk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3RhdGUgPSB7dXJpUGF0dGVybiwgY3VycmVudGx5T3Blbn07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKG5leHRQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHByZXZTdGF0ZS51cmlQYXR0ZXJuLmdldE9yaWdpbmFsKCkgPT09IG5leHRQcm9wcy51cmlQYXR0ZXJuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJpUGF0dGVybjogbmV3IFVSSVBhdHRlcm4obmV4dFByb3BzLnVyaVBhdHRlcm4pLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBMaXN0ZW4gZm9yIGFuZCBhZG9wdCBTdHViSXRlbXMgdGhhdCBhcmUgYWRkZWQgYWZ0ZXIgdGhpcyBjb21wb25lbnQgaGFzXG4gICAgLy8gYWxyZWFkeSBiZWVuIG1vdW50ZWQuXG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnByb3BzLndvcmtzcGFjZS5vbkRpZEFkZFBhbmVJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgIGlmICghaXRlbS5fZ2V0U3R1Yikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzdHViID0gaXRlbS5fZ2V0U3R1YigpO1xuXG4gICAgICBpZiAoc3R1Yi5nZXRSZWFsSXRlbSgpICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnN0YXRlLnVyaVBhdHRlcm4ubWF0Y2hlcyhpdGVtLmdldFVSSSgpKTtcbiAgICAgIGlmICghbWF0Y2gub2soKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wZW5JdGVtID0gbmV3IE9wZW5JdGVtKG1hdGNoLCBzdHViLmdldEVsZW1lbnQoKSwgc3R1Yik7XG4gICAgICBvcGVuSXRlbS5oeWRyYXRlU3R1Yih7XG4gICAgICAgIGNvcHk6ICgpID0+IHRoaXMuY29weU9wZW5JdGVtKG9wZW5JdGVtKSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgIG9wZW5JdGVtLmFkZENsYXNzTmFtZSh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihpdGVtLCBvcGVuSXRlbSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIGN1cnJlbnRseU9wZW46IFsuLi5wcmV2U3RhdGUuY3VycmVudGx5T3Blbiwgb3Blbkl0ZW1dLFxuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIGZvciAoY29uc3Qgb3Blbkl0ZW0gb2YgdGhpcy5zdGF0ZS5jdXJyZW50bHlPcGVuKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihvcGVuSXRlbS5zdHViSXRlbSwgb3Blbkl0ZW0pO1xuXG4gICAgICBvcGVuSXRlbS5oeWRyYXRlU3R1Yih7XG4gICAgICAgIGNvcHk6ICgpID0+IHRoaXMuY29weU9wZW5JdGVtKG9wZW5JdGVtKSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgIG9wZW5JdGVtLmFkZENsYXNzTmFtZSh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnByb3BzLndvcmtzcGFjZS5hZGRPcGVuZXIodGhpcy5vcGVuZXIpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jdXJyZW50bHlPcGVuLm1hcChpdGVtID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudCBrZXk9e2l0ZW0uZ2V0S2V5KCl9PlxuICAgICAgICAgIHtpdGVtLnJlbmRlclBvcnRhbCh0aGlzLnByb3BzLmNoaWxkcmVuKX1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb3BlbmVyKHVyaSkge1xuICAgIGNvbnN0IG0gPSB0aGlzLnN0YXRlLnVyaVBhdHRlcm4ubWF0Y2hlcyh1cmkpO1xuICAgIGlmICghbS5vaygpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5JdGVtID0gbmV3IE9wZW5JdGVtKG0pO1xuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgb3Blbkl0ZW0uYWRkQ2xhc3NOYW1lKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBjdXJyZW50bHlPcGVuOiBbLi4ucHJldlN0YXRlLmN1cnJlbnRseU9wZW4sIG9wZW5JdGVtXSxcbiAgICAgIH0pLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhbmVJdGVtID0gb3Blbkl0ZW0uY3JlYXRlKHtcbiAgICAgICAgICBjb3B5OiAoKSA9PiB0aGlzLmNvcHlPcGVuSXRlbShvcGVuSXRlbSksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihwYW5lSXRlbSwgb3Blbkl0ZW0pO1xuICAgICAgICByZXNvbHZlKHBhbmVJdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29weU9wZW5JdGVtKG9wZW5JdGVtKSB7XG4gICAgY29uc3QgbSA9IHRoaXMuc3RhdGUudXJpUGF0dGVybi5tYXRjaGVzKG9wZW5JdGVtLmdldFVSSSgpKTtcbiAgICBpZiAoIW0ub2soKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R1YiA9IFN0dWJJdGVtLmNyZWF0ZSgnZ2VuZXJpYycsIG9wZW5JdGVtLmdldFN0dWJQcm9wcygpLCBvcGVuSXRlbS5nZXRVUkkoKSk7XG5cbiAgICBjb25zdCBjb3BpZWRJdGVtID0gbmV3IE9wZW5JdGVtKG0sIHN0dWIuZ2V0RWxlbWVudCgpLCBzdHViKTtcbiAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgY3VycmVudGx5T3BlbjogWy4uLnByZXZTdGF0ZS5jdXJyZW50bHlPcGVuLCBjb3BpZWRJdGVtXSxcbiAgICB9KSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckNsb3NlTGlzdGVuZXIoc3R1YiwgY29waWVkSXRlbSk7XG4gICAgICBjb3BpZWRJdGVtLmh5ZHJhdGVTdHViKHtcbiAgICAgICAgY29weTogKCkgPT4gdGhpcy5jb3B5T3Blbkl0ZW0oY29waWVkSXRlbSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzdHViO1xuICB9XG5cbiAgcmVnaXN0ZXJDbG9zZUxpc3RlbmVyKHBhbmVJdGVtLCBvcGVuSXRlbSkge1xuICAgIGNvbnN0IHN1YiA9IHRoaXMucHJvcHMud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgIGlmIChpdGVtID09PSBwYW5lSXRlbSkge1xuICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHN1Yik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgY3VycmVudGx5T3BlbjogcHJldlN0YXRlLmN1cnJlbnRseU9wZW4uZmlsdGVyKGVhY2ggPT4gZWFjaCAhPT0gb3Blbkl0ZW0pLFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKHN1Yik7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHN1YnRyZWUgcmVuZGVyZWQgdGhyb3VnaCBhIHBvcnRhbCBvbnRvIGEgZGV0YWNoZWQgRE9NIG5vZGUgZm9yIHVzZSBhcyB0aGUgcm9vdCBhcyBhIFBhbmVJdGVtLlxuICovXG5jbGFzcyBPcGVuSXRlbSB7XG4gIHN0YXRpYyBuZXh0SUQgPSAwXG5cbiAgY29uc3RydWN0b3IobWF0Y2gsIGVsZW1lbnQgPSBudWxsLCBzdHViID0gbnVsbCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLm5leHRJRDtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRJRCsrO1xuXG4gICAgdGhpcy5kb21Ob2RlID0gZWxlbWVudCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmRvbU5vZGUudGFiSW5kZXggPSAnLTEnO1xuICAgIHRoaXMuZG9tTm9kZS5vbmZvY3VzID0gdGhpcy5vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdHViSXRlbSA9IHN0dWI7XG4gICAgdGhpcy5zdHViUHJvcHMgPSBzdHViID8gc3R1Yi5wcm9wcyA6IHt9O1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLml0ZW1Ib2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guZ2V0VVJJKCk7XG4gIH1cblxuICBjcmVhdGUoZXh0cmEgPSB7fSkge1xuICAgIGNvbnN0IGggPSB0aGlzLml0ZW1Ib2xkZXIuaXNFbXB0eSgpID8gbnVsbCA6IHRoaXMuaXRlbUhvbGRlcjtcbiAgICByZXR1cm4gY3JlYXRlSXRlbSh0aGlzLmRvbU5vZGUsIGgsIHRoaXMubWF0Y2guZ2V0VVJJKCksIGV4dHJhKTtcbiAgfVxuXG4gIGh5ZHJhdGVTdHViKGV4dHJhID0ge30pIHtcbiAgICBpZiAodGhpcy5zdHViSXRlbSkge1xuICAgICAgdGhpcy5zdHViSXRlbS5zZXRSZWFsSXRlbSh0aGlzLmNyZWF0ZShleHRyYSkpO1xuICAgICAgdGhpcy5zdHViSXRlbSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH1cblxuICBnZXRLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBnZXRTdHViUHJvcHMoKSB7XG4gICAgY29uc3QgaXRlbVByb3BzID0gdGhpcy5pdGVtSG9sZGVyLm1hcChpdGVtID0+ICh7XG4gICAgICB0aXRsZTogaXRlbS5nZXRUaXRsZSA/IGl0ZW0uZ2V0VGl0bGUoKSA6IG51bGwsXG4gICAgICBpY29uTmFtZTogaXRlbS5nZXRJY29uTmFtZSA/IGl0ZW0uZ2V0SWNvbk5hbWUoKSA6IG51bGwsXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuc3R1YlByb3BzLFxuICAgICAgLi4uaXRlbVByb3BzLFxuICAgIH07XG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1Ib2xkZXIubWFwKGl0ZW0gPT4gaXRlbS5mb2N1cyAmJiBpdGVtLmZvY3VzKCkpO1xuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHJlbmRlclByb3ApIHtcbiAgICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKFxuICAgICAgcmVuZGVyUHJvcCh7XG4gICAgICAgIGRlc2VyaWFsaXplZDogdGhpcy5zdHViUHJvcHMsXG4gICAgICAgIGl0ZW1Ib2xkZXI6IHRoaXMuaXRlbUhvbGRlcixcbiAgICAgICAgcGFyYW1zOiB0aGlzLm1hdGNoLmdldFBhcmFtcygpLFxuICAgICAgICB1cmk6IHRoaXMubWF0Y2guZ2V0VVJJKCksXG4gICAgICB9KSxcbiAgICAgIHRoaXMuZG9tTm9kZSxcbiAgICApO1xuICB9XG59XG4iXX0=