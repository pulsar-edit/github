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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      return _react.default.createElement(_react.Fragment, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYW5lSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwidXJpUGF0dGVybiIsIlVSSVBhdHRlcm4iLCJjdXJyZW50bHlPcGVuIiwid29ya3NwYWNlIiwiZ2V0UGFuZUl0ZW1zIiwicmVkdWNlIiwiYXJyIiwiaXRlbSIsImVsZW1lbnQiLCJnZXRFbGVtZW50IiwibWF0Y2giLCJnZXRVUkkiLCJtYXRjaGVzIiwibm9uVVJJTWF0Y2giLCJzdHViIiwic2V0UmVhbEl0ZW0iLCJvayIsIm9wZW5JdGVtIiwiT3Blbkl0ZW0iLCJwdXNoIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJzdGF0ZSIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsIm5leHRQcm9wcyIsInByZXZTdGF0ZSIsImdldE9yaWdpbmFsIiwiY29tcG9uZW50RGlkTW91bnQiLCJhZGQiLCJvbkRpZEFkZFBhbmVJdGVtIiwiX2dldFN0dWIiLCJnZXRSZWFsSXRlbSIsImh5ZHJhdGVTdHViIiwiY29weSIsImNvcHlPcGVuSXRlbSIsImNsYXNzTmFtZSIsImFkZENsYXNzTmFtZSIsInJlZ2lzdGVyQ2xvc2VMaXN0ZW5lciIsInNldFN0YXRlIiwic3R1Ykl0ZW0iLCJhZGRPcGVuZXIiLCJvcGVuZXIiLCJyZW5kZXIiLCJtYXAiLCJnZXRLZXkiLCJyZW5kZXJQb3J0YWwiLCJjaGlsZHJlbiIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsInVyaSIsIm0iLCJ1bmRlZmluZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInBhbmVJdGVtIiwiY3JlYXRlIiwiU3R1Ykl0ZW0iLCJnZXRTdHViUHJvcHMiLCJjb3BpZWRJdGVtIiwic3ViIiwib25EaWREZXN0cm95UGFuZUl0ZW0iLCJyZW1vdmUiLCJmaWx0ZXIiLCJlYWNoIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJzdHJpbmciLCJpZCIsIm5leHRJRCIsImRvbU5vZGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0YWJJbmRleCIsIm9uZm9jdXMiLCJvbkZvY3VzIiwiYmluZCIsInN0dWJQcm9wcyIsIml0ZW1Ib2xkZXIiLCJSZWZIb2xkZXIiLCJleHRyYSIsImgiLCJpc0VtcHR5IiwiY3JlYXRlSXRlbSIsImNsYXNzTGlzdCIsIml0ZW1Qcm9wcyIsInRpdGxlIiwiZ2V0VGl0bGUiLCJpY29uTmFtZSIsImdldEljb25OYW1lIiwiZm9jdXMiLCJyZW5kZXJQcm9wIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJkZXNlcmlhbGl6ZWQiLCJwYXJhbXMiLCJnZXRQYXJhbXMiXSwic291cmNlcyI6WyJwYW5lLWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IFVSSVBhdHRlcm4sIHtub25VUklNYXRjaH0gZnJvbSAnLi91cmktcGF0dGVybic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBTdHViSXRlbSBmcm9tICcuLi9pdGVtcy9zdHViLWl0ZW0nO1xuaW1wb3J0IHtjcmVhdGVJdGVtLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbi8qKlxuICogUGFuZUl0ZW0gcmVnaXN0ZXJzIGFuIG9wZW5lciB3aXRoIHRoZSBjdXJyZW50IEF0b20gd29ya3NwYWNlIGFzIGxvbmcgYXMgdGhpcyBjb21wb25lbnQgaXMgbW91bnRlZC4gVGhlIG9wZW5lciB3aWxsXG4gKiB0cmlnZ2VyIG9uIFVSSXMgdGhhdCBtYXRjaCBhIHNwZWNpZmllZCBwYXR0ZXJuIGFuZCByZW5kZXIgYSBzdWJ0cmVlIHJldHVybmVkIGJ5IGEgcmVuZGVyIHByb3AuXG4gKlxuICogVGhlIHJlbmRlciBwcm9wIGNhbiByZWNlaXZlIHRocmVlIGFyZ3VtZW50czpcbiAqXG4gKiAqIGl0ZW1Ib2xkZXI6IEEgUmVmSG9sZGVyLiBJZiB1c2VkIGFzIHRoZSB0YXJnZXQgZm9yIGEgcmVmLCB0aGUgcmVmZXJlbmNlZCBjb21wb25lbnQgd2lsbCBiZSB1c2VkIGFzIHRoZSBcIml0ZW1cIiBvZlxuICogICB0aGUgcGFuZSBpdGVtIC0gaXRzIGBnZXRUaXRsZSgpYCwgYGdldEljb25OYW1lKClgLCBhbmQgb3RoZXIgbWV0aG9kcyB3aWxsIGJlIHVzZWQgYnkgdGhlIHBhbmUuXG4gKiAqIHBhcmFtczogQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5hbWVkIHBhcmFtZXRlcnMgY2FwdHVyZWQgYnkgdGhlIFVSSSBwYXR0ZXJuLlxuICogKiB1cmk6IFRoZSBleGFjdCwgbWF0Y2hlZCBVUkkgdXNlZCB0byBsYXVuY2ggdGhpcyBpdGVtLlxuICpcbiAqIHJlbmRlcigpIHtcbiAqICAgcmV0dXJuIChcbiAqICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj0nYXRvbS1naXRodWI6Ly9ob3N0L3tpZH0nPlxuICogICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICogICAgICAgICA8SXRlbUNvbXBvbmVudCByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfSBpZD17cGFyYW1zLmlkfSAvPlxuICogICAgICAgKX1cbiAqICAgICA8L1BhbmVJdGVtPlxuICogICApO1xuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXJpUGF0dGVybjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdvcGVuZXInKTtcblxuICAgIGNvbnN0IHVyaVBhdHRlcm4gPSBuZXcgVVJJUGF0dGVybih0aGlzLnByb3BzLnVyaVBhdHRlcm4pO1xuICAgIGNvbnN0IGN1cnJlbnRseU9wZW4gPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgICAgLnJlZHVjZSgoYXJyLCBpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBpdGVtLmdldEVsZW1lbnQgPyBpdGVtLmdldEVsZW1lbnQoKSA6IG51bGw7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gaXRlbS5nZXRVUkkgPyB1cmlQYXR0ZXJuLm1hdGNoZXMoaXRlbS5nZXRVUkkoKSkgOiBub25VUklNYXRjaDtcbiAgICAgICAgY29uc3Qgc3R1YiA9IGl0ZW0uc2V0UmVhbEl0ZW0gPyBpdGVtIDogbnVsbDtcblxuICAgICAgICBpZiAoZWxlbWVudCAmJiBtYXRjaC5vaygpKSB7XG4gICAgICAgICAgY29uc3Qgb3Blbkl0ZW0gPSBuZXcgT3Blbkl0ZW0obWF0Y2gsIGVsZW1lbnQsIHN0dWIpO1xuICAgICAgICAgIGFyci5wdXNoKG9wZW5JdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgICB9LCBbXSk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3RhdGUgPSB7dXJpUGF0dGVybiwgY3VycmVudGx5T3Blbn07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKG5leHRQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHByZXZTdGF0ZS51cmlQYXR0ZXJuLmdldE9yaWdpbmFsKCkgPT09IG5leHRQcm9wcy51cmlQYXR0ZXJuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJpUGF0dGVybjogbmV3IFVSSVBhdHRlcm4obmV4dFByb3BzLnVyaVBhdHRlcm4pLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBMaXN0ZW4gZm9yIGFuZCBhZG9wdCBTdHViSXRlbXMgdGhhdCBhcmUgYWRkZWQgYWZ0ZXIgdGhpcyBjb21wb25lbnQgaGFzXG4gICAgLy8gYWxyZWFkeSBiZWVuIG1vdW50ZWQuXG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnByb3BzLndvcmtzcGFjZS5vbkRpZEFkZFBhbmVJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgIGlmICghaXRlbS5fZ2V0U3R1Yikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzdHViID0gaXRlbS5fZ2V0U3R1YigpO1xuXG4gICAgICBpZiAoc3R1Yi5nZXRSZWFsSXRlbSgpICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnN0YXRlLnVyaVBhdHRlcm4ubWF0Y2hlcyhpdGVtLmdldFVSSSgpKTtcbiAgICAgIGlmICghbWF0Y2gub2soKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wZW5JdGVtID0gbmV3IE9wZW5JdGVtKG1hdGNoLCBzdHViLmdldEVsZW1lbnQoKSwgc3R1Yik7XG4gICAgICBvcGVuSXRlbS5oeWRyYXRlU3R1Yih7XG4gICAgICAgIGNvcHk6ICgpID0+IHRoaXMuY29weU9wZW5JdGVtKG9wZW5JdGVtKSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgIG9wZW5JdGVtLmFkZENsYXNzTmFtZSh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihpdGVtLCBvcGVuSXRlbSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIGN1cnJlbnRseU9wZW46IFsuLi5wcmV2U3RhdGUuY3VycmVudGx5T3Blbiwgb3Blbkl0ZW1dLFxuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIGZvciAoY29uc3Qgb3Blbkl0ZW0gb2YgdGhpcy5zdGF0ZS5jdXJyZW50bHlPcGVuKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihvcGVuSXRlbS5zdHViSXRlbSwgb3Blbkl0ZW0pO1xuXG4gICAgICBvcGVuSXRlbS5oeWRyYXRlU3R1Yih7XG4gICAgICAgIGNvcHk6ICgpID0+IHRoaXMuY29weU9wZW5JdGVtKG9wZW5JdGVtKSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgIG9wZW5JdGVtLmFkZENsYXNzTmFtZSh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnByb3BzLndvcmtzcGFjZS5hZGRPcGVuZXIodGhpcy5vcGVuZXIpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jdXJyZW50bHlPcGVuLm1hcChpdGVtID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudCBrZXk9e2l0ZW0uZ2V0S2V5KCl9PlxuICAgICAgICAgIHtpdGVtLnJlbmRlclBvcnRhbCh0aGlzLnByb3BzLmNoaWxkcmVuKX1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb3BlbmVyKHVyaSkge1xuICAgIGNvbnN0IG0gPSB0aGlzLnN0YXRlLnVyaVBhdHRlcm4ubWF0Y2hlcyh1cmkpO1xuICAgIGlmICghbS5vaygpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5JdGVtID0gbmV3IE9wZW5JdGVtKG0pO1xuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgb3Blbkl0ZW0uYWRkQ2xhc3NOYW1lKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBjdXJyZW50bHlPcGVuOiBbLi4ucHJldlN0YXRlLmN1cnJlbnRseU9wZW4sIG9wZW5JdGVtXSxcbiAgICAgIH0pLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhbmVJdGVtID0gb3Blbkl0ZW0uY3JlYXRlKHtcbiAgICAgICAgICBjb3B5OiAoKSA9PiB0aGlzLmNvcHlPcGVuSXRlbShvcGVuSXRlbSksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihwYW5lSXRlbSwgb3Blbkl0ZW0pO1xuICAgICAgICByZXNvbHZlKHBhbmVJdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29weU9wZW5JdGVtKG9wZW5JdGVtKSB7XG4gICAgY29uc3QgbSA9IHRoaXMuc3RhdGUudXJpUGF0dGVybi5tYXRjaGVzKG9wZW5JdGVtLmdldFVSSSgpKTtcbiAgICBpZiAoIW0ub2soKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R1YiA9IFN0dWJJdGVtLmNyZWF0ZSgnZ2VuZXJpYycsIG9wZW5JdGVtLmdldFN0dWJQcm9wcygpLCBvcGVuSXRlbS5nZXRVUkkoKSk7XG5cbiAgICBjb25zdCBjb3BpZWRJdGVtID0gbmV3IE9wZW5JdGVtKG0sIHN0dWIuZ2V0RWxlbWVudCgpLCBzdHViKTtcbiAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgY3VycmVudGx5T3BlbjogWy4uLnByZXZTdGF0ZS5jdXJyZW50bHlPcGVuLCBjb3BpZWRJdGVtXSxcbiAgICB9KSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckNsb3NlTGlzdGVuZXIoc3R1YiwgY29waWVkSXRlbSk7XG4gICAgICBjb3BpZWRJdGVtLmh5ZHJhdGVTdHViKHtcbiAgICAgICAgY29weTogKCkgPT4gdGhpcy5jb3B5T3Blbkl0ZW0oY29waWVkSXRlbSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzdHViO1xuICB9XG5cbiAgcmVnaXN0ZXJDbG9zZUxpc3RlbmVyKHBhbmVJdGVtLCBvcGVuSXRlbSkge1xuICAgIGNvbnN0IHN1YiA9IHRoaXMucHJvcHMud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgIGlmIChpdGVtID09PSBwYW5lSXRlbSkge1xuICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHN1Yik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgY3VycmVudGx5T3BlbjogcHJldlN0YXRlLmN1cnJlbnRseU9wZW4uZmlsdGVyKGVhY2ggPT4gZWFjaCAhPT0gb3Blbkl0ZW0pLFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKHN1Yik7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHN1YnRyZWUgcmVuZGVyZWQgdGhyb3VnaCBhIHBvcnRhbCBvbnRvIGEgZGV0YWNoZWQgRE9NIG5vZGUgZm9yIHVzZSBhcyB0aGUgcm9vdCBhcyBhIFBhbmVJdGVtLlxuICovXG5jbGFzcyBPcGVuSXRlbSB7XG4gIHN0YXRpYyBuZXh0SUQgPSAwXG5cbiAgY29uc3RydWN0b3IobWF0Y2gsIGVsZW1lbnQgPSBudWxsLCBzdHViID0gbnVsbCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbnN0cnVjdG9yLm5leHRJRDtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRJRCsrO1xuXG4gICAgdGhpcy5kb21Ob2RlID0gZWxlbWVudCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmRvbU5vZGUudGFiSW5kZXggPSAnLTEnO1xuICAgIHRoaXMuZG9tTm9kZS5vbmZvY3VzID0gdGhpcy5vbkZvY3VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdHViSXRlbSA9IHN0dWI7XG4gICAgdGhpcy5zdHViUHJvcHMgPSBzdHViID8gc3R1Yi5wcm9wcyA6IHt9O1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLml0ZW1Ib2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guZ2V0VVJJKCk7XG4gIH1cblxuICBjcmVhdGUoZXh0cmEgPSB7fSkge1xuICAgIGNvbnN0IGggPSB0aGlzLml0ZW1Ib2xkZXIuaXNFbXB0eSgpID8gbnVsbCA6IHRoaXMuaXRlbUhvbGRlcjtcbiAgICByZXR1cm4gY3JlYXRlSXRlbSh0aGlzLmRvbU5vZGUsIGgsIHRoaXMubWF0Y2guZ2V0VVJJKCksIGV4dHJhKTtcbiAgfVxuXG4gIGh5ZHJhdGVTdHViKGV4dHJhID0ge30pIHtcbiAgICBpZiAodGhpcy5zdHViSXRlbSkge1xuICAgICAgdGhpcy5zdHViSXRlbS5zZXRSZWFsSXRlbSh0aGlzLmNyZWF0ZShleHRyYSkpO1xuICAgICAgdGhpcy5zdHViSXRlbSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH1cblxuICBnZXRLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBnZXRTdHViUHJvcHMoKSB7XG4gICAgY29uc3QgaXRlbVByb3BzID0gdGhpcy5pdGVtSG9sZGVyLm1hcChpdGVtID0+ICh7XG4gICAgICB0aXRsZTogaXRlbS5nZXRUaXRsZSA/IGl0ZW0uZ2V0VGl0bGUoKSA6IG51bGwsXG4gICAgICBpY29uTmFtZTogaXRlbS5nZXRJY29uTmFtZSA/IGl0ZW0uZ2V0SWNvbk5hbWUoKSA6IG51bGwsXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMuc3R1YlByb3BzLFxuICAgICAgLi4uaXRlbVByb3BzLFxuICAgIH07XG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1Ib2xkZXIubWFwKGl0ZW0gPT4gaXRlbS5mb2N1cyAmJiBpdGVtLmZvY3VzKCkpO1xuICB9XG5cbiAgcmVuZGVyUG9ydGFsKHJlbmRlclByb3ApIHtcbiAgICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKFxuICAgICAgcmVuZGVyUHJvcCh7XG4gICAgICAgIGRlc2VyaWFsaXplZDogdGhpcy5zdHViUHJvcHMsXG4gICAgICAgIGl0ZW1Ib2xkZXI6IHRoaXMuaXRlbUhvbGRlcixcbiAgICAgICAgcGFyYW1zOiB0aGlzLm1hdGNoLmdldFBhcmFtcygpLFxuICAgICAgICB1cmk6IHRoaXMubWF0Y2guZ2V0VVJJKCksXG4gICAgICB9KSxcbiAgICAgIHRoaXMuZG9tTm9kZSxcbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBZ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxRQUFRLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBUXBEQyxXQUFXLENBQUNDLEtBQUssRUFB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