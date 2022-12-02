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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL3BhbmUtaXRlbS5qcyJdLCJuYW1lcyI6WyJQYW5lSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInVyaVBhdHRlcm4iLCJVUklQYXR0ZXJuIiwiY3VycmVudGx5T3BlbiIsIndvcmtzcGFjZSIsImdldFBhbmVJdGVtcyIsInJlZHVjZSIsImFyciIsIml0ZW0iLCJlbGVtZW50IiwiZ2V0RWxlbWVudCIsIm1hdGNoIiwiZ2V0VVJJIiwibWF0Y2hlcyIsIm5vblVSSU1hdGNoIiwic3R1YiIsInNldFJlYWxJdGVtIiwib2siLCJvcGVuSXRlbSIsIk9wZW5JdGVtIiwicHVzaCIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwic3RhdGUiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJuZXh0UHJvcHMiLCJwcmV2U3RhdGUiLCJnZXRPcmlnaW5hbCIsImNvbXBvbmVudERpZE1vdW50IiwiYWRkIiwib25EaWRBZGRQYW5lSXRlbSIsIl9nZXRTdHViIiwiZ2V0UmVhbEl0ZW0iLCJoeWRyYXRlU3R1YiIsImNvcHkiLCJjb3B5T3Blbkl0ZW0iLCJjbGFzc05hbWUiLCJhZGRDbGFzc05hbWUiLCJyZWdpc3RlckNsb3NlTGlzdGVuZXIiLCJzZXRTdGF0ZSIsInN0dWJJdGVtIiwiYWRkT3BlbmVyIiwib3BlbmVyIiwicmVuZGVyIiwibWFwIiwiZ2V0S2V5IiwicmVuZGVyUG9ydGFsIiwiY2hpbGRyZW4iLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJ1cmkiLCJtIiwidW5kZWZpbmVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwYW5lSXRlbSIsImNyZWF0ZSIsIlN0dWJJdGVtIiwiZ2V0U3R1YlByb3BzIiwiY29waWVkSXRlbSIsInN1YiIsIm9uRGlkRGVzdHJveVBhbmVJdGVtIiwicmVtb3ZlIiwiZmlsdGVyIiwiZWFjaCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJmdW5jIiwic3RyaW5nIiwiaWQiLCJuZXh0SUQiLCJkb21Ob2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidGFiSW5kZXgiLCJvbmZvY3VzIiwib25Gb2N1cyIsImJpbmQiLCJzdHViUHJvcHMiLCJpdGVtSG9sZGVyIiwiUmVmSG9sZGVyIiwiZXh0cmEiLCJoIiwiaXNFbXB0eSIsImNsYXNzTGlzdCIsIml0ZW1Qcm9wcyIsInRpdGxlIiwiZ2V0VGl0bGUiLCJpY29uTmFtZSIsImdldEljb25OYW1lIiwiZm9jdXMiLCJyZW5kZXJQcm9wIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJkZXNlcmlhbGl6ZWQiLCJwYXJhbXMiLCJnZXRQYXJhbXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxRQUFOLFNBQXVCQyxlQUFNQyxTQUE3QixDQUF1QztBQVFwREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUNBLDJCQUFTLElBQVQsRUFBZSxRQUFmO0FBRUEsVUFBTUMsVUFBVSxHQUFHLElBQUlDLG1CQUFKLENBQWUsS0FBS0YsS0FBTCxDQUFXQyxVQUExQixDQUFuQjtBQUNBLFVBQU1FLGFBQWEsR0FBRyxLQUFLSCxLQUFMLENBQVdJLFNBQVgsQ0FBcUJDLFlBQXJCLEdBQ25CQyxNQURtQixDQUNaLENBQUNDLEdBQUQsRUFBTUMsSUFBTixLQUFlO0FBQ3JCLFlBQU1DLE9BQU8sR0FBR0QsSUFBSSxDQUFDRSxVQUFMLEdBQWtCRixJQUFJLENBQUNFLFVBQUwsRUFBbEIsR0FBc0MsSUFBdEQ7QUFDQSxZQUFNQyxLQUFLLEdBQUdILElBQUksQ0FBQ0ks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TUFBWDtBQUpJLEtBQUQsQ0FETCxFQU9MLEtBQUs0RCxPQVBBLENBQVA7QUFTRDs7QUFsRVk7O2dCQUFUckQsUSxZQUNZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgVVJJUGF0dGVybiwge25vblVSSU1hdGNofSBmcm9tICcuL3VyaS1wYXR0ZXJuJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IFN0dWJJdGVtIGZyb20gJy4uL2l0ZW1zL3N0dWItaXRlbSc7XG5pbXBvcnQge2NyZWF0ZUl0ZW0sIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuLyoqXG4gKiBQYW5lSXRlbSByZWdpc3RlcnMgYW4gb3BlbmVyIHdpdGggdGhlIGN1cnJlbnQgQXRvbSB3b3Jrc3BhY2UgYXMgbG9uZyBhcyB0aGlzIGNvbXBvbmVudCBpcyBtb3VudGVkLiBUaGUgb3BlbmVyIHdpbGxcbiAqIHRyaWdnZXIgb24gVVJJcyB0aGF0IG1hdGNoIGEgc3BlY2lmaWVkIHBhdHRlcm4gYW5kIHJlbmRlciBhIHN1YnRyZWUgcmV0dXJuZWQgYnkgYSByZW5kZXIgcHJvcC5cbiAqXG4gKiBUaGUgcmVuZGVyIHByb3AgY2FuIHJlY2VpdmUgdGhyZWUgYXJndW1lbnRzOlxuICpcbiAqICogaXRlbUhvbGRlcjogQSBSZWZIb2xkZXIuIElmIHVzZWQgYXMgdGhlIHRhcmdldCBmb3IgYSByZWYsIHRoZSByZWZlcmVuY2VkIGNvbXBvbmVudCB3aWxsIGJlIHVzZWQgYXMgdGhlIFwiaXRlbVwiIG9mXG4gKiAgIHRoZSBwYW5lIGl0ZW0gLSBpdHMgYGdldFRpdGxlKClgLCBgZ2V0SWNvbk5hbWUoKWAsIGFuZCBvdGhlciBtZXRob2RzIHdpbGwgYmUgdXNlZCBieSB0aGUgcGFuZS5cbiAqICogcGFyYW1zOiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbmFtZWQgcGFyYW1ldGVycyBjYXB0dXJlZCBieSB0aGUgVVJJIHBhdHRlcm4uXG4gKiAqIHVyaTogVGhlIGV4YWN0LCBtYXRjaGVkIFVSSSB1c2VkIHRvIGxhdW5jaCB0aGlzIGl0ZW0uXG4gKlxuICogcmVuZGVyKCkge1xuICogICByZXR1cm4gKFxuICogICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPSdhdG9tLWdpdGh1YjovL2hvc3Qve2lkfSc+XG4gKiAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gKiAgICAgICAgIDxJdGVtQ29tcG9uZW50IHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9IGlkPXtwYXJhbXMuaWR9IC8+XG4gKiAgICAgICApfVxuICogICAgIDwvUGFuZUl0ZW0+XG4gKiAgICk7XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cmlQYXR0ZXJuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ29wZW5lcicpO1xuXG4gICAgY29uc3QgdXJpUGF0dGVybiA9IG5ldyBVUklQYXR0ZXJuKHRoaXMucHJvcHMudXJpUGF0dGVybik7XG4gICAgY29uc3QgY3VycmVudGx5T3BlbiA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG4gICAgICAucmVkdWNlKChhcnIsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGl0ZW0uZ2V0RWxlbWVudCA/IGl0ZW0uZ2V0RWxlbWVudCgpIDogbnVsbDtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBpdGVtLmdldFVSSSA/IHVyaVBhdHRlcm4ubWF0Y2hlcyhpdGVtLmdldFVSSSgpKSA6IG5vblVSSU1hdGNoO1xuICAgICAgICBjb25zdCBzdHViID0gaXRlbS5zZXRSZWFsSXRlbSA/IGl0ZW0gOiBudWxsO1xuXG4gICAgICAgIGlmIChlbGVtZW50ICYmIG1hdGNoLm9rKCkpIHtcbiAgICAgICAgICBjb25zdCBvcGVuSXRlbSA9IG5ldyBPcGVuSXRlbShtYXRjaCwgZWxlbWVudCwgc3R1Yik7XG4gICAgICAgICAgYXJyLnB1c2gob3Blbkl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgIH0sIFtdKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHt1cmlQYXR0ZXJuLCBjdXJyZW50bHlPcGVufTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMobmV4dFByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAocHJldlN0YXRlLnVyaVBhdHRlcm4uZ2V0T3JpZ2luYWwoKSA9PT0gbmV4dFByb3BzLnVyaVBhdHRlcm4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cmlQYXR0ZXJuOiBuZXcgVVJJUGF0dGVybihuZXh0UHJvcHMudXJpUGF0dGVybiksXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIExpc3RlbiBmb3IgYW5kIGFkb3B0IFN0dWJJdGVtcyB0aGF0IGFyZSBhZGRlZCBhZnRlciB0aGlzIGNvbXBvbmVudCBoYXNcbiAgICAvLyBhbHJlYWR5IGJlZW4gbW91bnRlZC5cbiAgICB0aGlzLnN1YnMuYWRkKHRoaXMucHJvcHMud29ya3NwYWNlLm9uRGlkQWRkUGFuZUl0ZW0oKHtpdGVtfSkgPT4ge1xuICAgICAgaWYgKCFpdGVtLl9nZXRTdHViKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0dWIgPSBpdGVtLl9nZXRTdHViKCk7XG5cbiAgICAgIGlmIChzdHViLmdldFJlYWxJdGVtKCkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaCA9IHRoaXMuc3RhdGUudXJpUGF0dGVybi5tYXRjaGVzKGl0ZW0uZ2V0VVJJKCkpO1xuICAgICAgaWYgKCFtYXRjaC5vaygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3Blbkl0ZW0gPSBuZXcgT3Blbkl0ZW0obWF0Y2gsIHN0dWIuZ2V0RWxlbWVudCgpLCBzdHViKTtcbiAgICAgIG9wZW5JdGVtLmh5ZHJhdGVTdHViKHtcbiAgICAgICAgY29weTogKCkgPT4gdGhpcy5jb3B5T3Blbkl0ZW0ob3Blbkl0ZW0pLFxuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgICAgb3Blbkl0ZW0uYWRkQ2xhc3NOYW1lKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVnaXN0ZXJDbG9zZUxpc3RlbmVyKGl0ZW0sIG9wZW5JdGVtKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgY3VycmVudGx5T3BlbjogWy4uLnByZXZTdGF0ZS5jdXJyZW50bHlPcGVuLCBvcGVuSXRlbV0sXG4gICAgICB9KSk7XG4gICAgfSkpO1xuXG4gICAgZm9yIChjb25zdCBvcGVuSXRlbSBvZiB0aGlzLnN0YXRlLmN1cnJlbnRseU9wZW4pIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJDbG9zZUxpc3RlbmVyKG9wZW5JdGVtLnN0dWJJdGVtLCBvcGVuSXRlbSk7XG5cbiAgICAgIG9wZW5JdGVtLmh5ZHJhdGVTdHViKHtcbiAgICAgICAgY29weTogKCkgPT4gdGhpcy5jb3B5T3Blbkl0ZW0ob3Blbkl0ZW0pLFxuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgICAgb3Blbkl0ZW0uYWRkQ2xhc3NOYW1lKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN1YnMuYWRkKHRoaXMucHJvcHMud29ya3NwYWNlLmFkZE9wZW5lcih0aGlzLm9wZW5lcikpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmN1cnJlbnRseU9wZW4ubWFwKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEZyYWdtZW50IGtleT17aXRlbS5nZXRLZXkoKX0+XG4gICAgICAgICAge2l0ZW0ucmVuZGVyUG9ydGFsKHRoaXMucHJvcHMuY2hpbGRyZW4pfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBvcGVuZXIodXJpKSB7XG4gICAgY29uc3QgbSA9IHRoaXMuc3RhdGUudXJpUGF0dGVybi5tYXRjaGVzKHVyaSk7XG4gICAgaWYgKCFtLm9rKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3Blbkl0ZW0gPSBuZXcgT3Blbkl0ZW0obSk7XG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBvcGVuSXRlbS5hZGRDbGFzc05hbWUodGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIGN1cnJlbnRseU9wZW46IFsuLi5wcmV2U3RhdGUuY3VycmVudGx5T3Blbiwgb3Blbkl0ZW1dLFxuICAgICAgfSksICgpID0+IHtcbiAgICAgICAgY29uc3QgcGFuZUl0ZW0gPSBvcGVuSXRlbS5jcmVhdGUoe1xuICAgICAgICAgIGNvcHk6ICgpID0+IHRoaXMuY29weU9wZW5JdGVtKG9wZW5JdGVtKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJDbG9zZUxpc3RlbmVyKHBhbmVJdGVtLCBvcGVuSXRlbSk7XG4gICAgICAgIHJlc29sdmUocGFuZUl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb3B5T3Blbkl0ZW0ob3Blbkl0ZW0pIHtcbiAgICBjb25zdCBtID0gdGhpcy5zdGF0ZS51cmlQYXR0ZXJuLm1hdGNoZXMob3Blbkl0ZW0uZ2V0VVJJKCkpO1xuICAgIGlmICghbS5vaygpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBzdHViID0gU3R1Ykl0ZW0uY3JlYXRlKCdnZW5lcmljJywgb3Blbkl0ZW0uZ2V0U3R1YlByb3BzKCksIG9wZW5JdGVtLmdldFVSSSgpKTtcblxuICAgIGNvbnN0IGNvcGllZEl0ZW0gPSBuZXcgT3Blbkl0ZW0obSwgc3R1Yi5nZXRFbGVtZW50KCksIHN0dWIpO1xuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICBjdXJyZW50bHlPcGVuOiBbLi4ucHJldlN0YXRlLmN1cnJlbnRseU9wZW4sIGNvcGllZEl0ZW1dLFxuICAgIH0pLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdGVyQ2xvc2VMaXN0ZW5lcihzdHViLCBjb3BpZWRJdGVtKTtcbiAgICAgIGNvcGllZEl0ZW0uaHlkcmF0ZVN0dWIoe1xuICAgICAgICBjb3B5OiAoKSA9PiB0aGlzLmNvcHlPcGVuSXRlbShjb3BpZWRJdGVtKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0dWI7XG4gIH1cblxuICByZWdpc3RlckNsb3NlTGlzdGVuZXIocGFuZUl0ZW0sIG9wZW5JdGVtKSB7XG4gICAgY29uc3Qgc3ViID0gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0oKHtpdGVtfSkgPT4ge1xuICAgICAgaWYgKGl0ZW0gPT09IHBhbmVJdGVtKSB7XG4gICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuc3Vicy5yZW1vdmUoc3ViKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBjdXJyZW50bHlPcGVuOiBwcmV2U3RhdGUuY3VycmVudGx5T3Blbi5maWx0ZXIoZWFjaCA9PiBlYWNoICE9PSBvcGVuSXRlbSksXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc3Vicy5hZGQoc3ViKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc3VidHJlZSByZW5kZXJlZCB0aHJvdWdoIGEgcG9ydGFsIG9udG8gYSBkZXRhY2hlZCBET00gbm9kZSBmb3IgdXNlIGFzIHRoZSByb290IGFzIGEgUGFuZUl0ZW0uXG4gKi9cbmNsYXNzIE9wZW5JdGVtIHtcbiAgc3RhdGljIG5leHRJRCA9IDBcblxuICBjb25zdHJ1Y3RvcihtYXRjaCwgZWxlbWVudCA9IG51bGwsIHN0dWIgPSBudWxsKSB7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uc3RydWN0b3IubmV4dElEO1xuICAgIHRoaXMuY29uc3RydWN0b3IubmV4dElEKys7XG5cbiAgICB0aGlzLmRvbU5vZGUgPSBlbGVtZW50IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZG9tTm9kZS50YWJJbmRleCA9ICctMSc7XG4gICAgdGhpcy5kb21Ob2RlLm9uZm9jdXMgPSB0aGlzLm9uRm9jdXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0dWJJdGVtID0gc3R1YjtcbiAgICB0aGlzLnN0dWJQcm9wcyA9IHN0dWIgPyBzdHViLnByb3BzIDoge307XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMuaXRlbUhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5nZXRVUkkoKTtcbiAgfVxuXG4gIGNyZWF0ZShleHRyYSA9IHt9KSB7XG4gICAgY29uc3QgaCA9IHRoaXMuaXRlbUhvbGRlci5pc0VtcHR5KCkgPyBudWxsIDogdGhpcy5pdGVtSG9sZGVyO1xuICAgIHJldHVybiBjcmVhdGVJdGVtKHRoaXMuZG9tTm9kZSwgaCwgdGhpcy5tYXRjaC5nZXRVUkkoKSwgZXh0cmEpO1xuICB9XG5cbiAgaHlkcmF0ZVN0dWIoZXh0cmEgPSB7fSkge1xuICAgIGlmICh0aGlzLnN0dWJJdGVtKSB7XG4gICAgICB0aGlzLnN0dWJJdGVtLnNldFJlYWxJdGVtKHRoaXMuY3JlYXRlKGV4dHJhKSk7XG4gICAgICB0aGlzLnN0dWJJdGVtID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGRDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIGdldEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxuXG4gIGdldFN0dWJQcm9wcygpIHtcbiAgICBjb25zdCBpdGVtUHJvcHMgPSB0aGlzLml0ZW1Ib2xkZXIubWFwKGl0ZW0gPT4gKHtcbiAgICAgIHRpdGxlOiBpdGVtLmdldFRpdGxlID8gaXRlbS5nZXRUaXRsZSgpIDogbnVsbCxcbiAgICAgIGljb25OYW1lOiBpdGVtLmdldEljb25OYW1lID8gaXRlbS5nZXRJY29uTmFtZSgpIDogbnVsbCxcbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5zdHViUHJvcHMsXG4gICAgICAuLi5pdGVtUHJvcHMsXG4gICAgfTtcbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbUhvbGRlci5tYXAoaXRlbSA9PiBpdGVtLmZvY3VzICYmIGl0ZW0uZm9jdXMoKSk7XG4gIH1cblxuICByZW5kZXJQb3J0YWwocmVuZGVyUHJvcCkge1xuICAgIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoXG4gICAgICByZW5kZXJQcm9wKHtcbiAgICAgICAgZGVzZXJpYWxpemVkOiB0aGlzLnN0dWJQcm9wcyxcbiAgICAgICAgaXRlbUhvbGRlcjogdGhpcy5pdGVtSG9sZGVyLFxuICAgICAgICBwYXJhbXM6IHRoaXMubWF0Y2guZ2V0UGFyYW1zKCksXG4gICAgICAgIHVyaTogdGhpcy5tYXRjaC5nZXRVUkkoKSxcbiAgICAgIH0pLFxuICAgICAgdGhpcy5kb21Ob2RlLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==